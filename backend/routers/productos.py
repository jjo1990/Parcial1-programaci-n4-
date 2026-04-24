from typing import Annotated, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from db.database import get_session
from models.models import Producto, Ingrediente, ProductoIngrediente, Categoria, ProductoCategoria
from schemas.schemas import ProductoCreate, ProductoRead, ProductoUpdate

router = APIRouter(prefix="/productos", tags=["Productos"])

SessionDep = Annotated[Session, Depends(get_session)]


def _get_or_404(session: Session, producto_id: int) -> Producto:
    """Helper interno: busca el producto o lanza 404."""
    p = session.get(Producto, producto_id)
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return p


@router.get("/", response_model=List[ProductoRead])
def listar_productos(
    session: SessionDep,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(le=100)] = 20,
    nombre: Annotated[str | None, Query()] = None,
    categoria_id: Annotated[int | None, Query()] = None,
    disponible: Annotated[bool | None, Query()] = None,
):
    """
    Lista productos con filtros.
    """
    query = select(Producto)
    if nombre:
        query = query.where(Producto.nombre.ilike(f"%{nombre}%"))
    if categoria_id:
        # En relación M:M, filtramos si alguna de sus categorías coincide
        query = query.join(ProductoCategoria).where(ProductoCategoria.categoria_id == categoria_id)
    if disponible is not None:
        query = query.where(Producto.disponible == disponible)
    
    # Excluimos los que tienen deleted_at (Soft Delete)
    query = query.where(Producto.deleted_at == None)
    
    return session.exec(query.offset(offset).limit(limit)).all()


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(producto_id: int, session: SessionDep):
    producto = _get_or_404(session, producto_id)
    if producto.deleted_at:
        raise HTTPException(status_code=404, detail="Producto eliminado")
    return producto


@router.post("/", response_model=ProductoRead, status_code=201)
def crear_producto(data: ProductoCreate, session: SessionDep):
    """
    Crea un producto y vincula categorías e ingredientes.
    """
    categoria_ids = data.categoria_ids
    ingrediente_ids = data.ingrediente_ids
    
    producto_data = data.model_dump(exclude={"categoria_ids", "ingrediente_ids"})

    nuevo = Producto(**producto_data)
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)

    # Vincular categorías
    for cat_id in categoria_ids:
        cat = session.get(Categoria, cat_id)
        if not cat:
            raise HTTPException(status_code=404, detail=f"Categoría {cat_id} no encontrada")
        vinculo = ProductoCategoria(producto_id=nuevo.id, categoria_id=cat_id)
        session.add(vinculo)

    # Vincular ingredientes
    for ing_id in ingrediente_ids:
        ing = session.get(Ingrediente, ing_id)
        if not ing:
            raise HTTPException(status_code=404, detail=f"Ingrediente {ing_id} no encontrado")
        vinculo = ProductoIngrediente(producto_id=nuevo.id, ingrediente_id=ing_id)
        session.add(vinculo)

    session.commit()
    session.refresh(nuevo)
    return nuevo


@router.patch("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(
    producto_id: int, cambios: ProductoUpdate, session: SessionDep
):
    producto = _get_or_404(session, producto_id)

    # Actualizar Categorías
    if cambios.categoria_ids is not None:
        viejos = session.exec(select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)).all()
        for v in viejos:
            session.delete(v)
        for cat_id in cambios.categoria_ids:
            if not session.get(Categoria, cat_id):
                raise HTTPException(status_code=404, detail=f"Categoría {cat_id} no encontrada")
            session.add(ProductoCategoria(producto_id=producto_id, categoria_id=cat_id))

    # Actualizar Ingredientes
    if cambios.ingrediente_ids is not None:
        viejos = session.exec(select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)).all()
        for v in viejos:
            session.delete(v)
        for ing_id in cambios.ingrediente_ids:
            if not session.get(Ingrediente, ing_id):
                raise HTTPException(status_code=404, detail=f"Ingrediente {ing_id} no encontrado")
            session.add(ProductoIngrediente(producto_id=producto_id, ingrediente_id=ing_id))

    # Actualizar campos simples
    datos = cambios.model_dump(exclude_unset=True, exclude={"categoria_ids", "ingrediente_ids"})
    for campo, valor in datos.items():
        setattr(producto, campo, valor)
    
    producto.updated_at = datetime.utcnow()

    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


@router.delete("/{producto_id}", status_code=204)
def eliminar_producto(producto_id: int, session: SessionDep):
    """Soft delete por defecto si existe el campo deleted_at."""
    producto = _get_or_404(session, producto_id)
    producto.deleted_at = datetime.utcnow()
    session.add(producto)
    session.commit()

