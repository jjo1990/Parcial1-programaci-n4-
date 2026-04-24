from typing import Annotated, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from db.database import get_session
from models.models import Categoria
from schemas.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate

router = APIRouter(prefix="/categorias", tags=["Categorías"])

# Tipo reutilizable para la sesión de DB (así no repetimos el Depends en cada endpoint)
#coneccion a base de datos 
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=List[CategoriaRead])
def listar_categorias(
    session: SessionDep,
    # Annotated + Query define parámetros opcionales en la URL (?offset=0&limit=10)
    offset: Annotated[int, Query(ge=0, description="Cuántos registros saltear")] = 0,
    limit: Annotated[int, Query(le=100, description="Máximo de resultados")] = 10,
    nombre: Annotated[str | None, Query(description="Filtrar por nombre")] = None,
):
    """
    Lista categorías con paginación y filtro opcional por nombre.
    """
    query = select(Categoria).where(Categoria.deleted_at == None)
    if nombre:
        # ilike → búsqueda sin importar mayúsculas/minúsculas
        query = query.where(Categoria.nombre.ilike(f"%{nombre}%"))
    query = query.offset(offset).limit(limit)
    return session.exec(query).all()


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int, session: SessionDep):
    """Obtiene una categoría por ID. Retorna 404 si no existe."""
    categoria = session.get(Categoria, categoria_id)
    if not categoria or categoria.deleted_at:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria


@router.post("/", response_model=CategoriaRead, status_code=201)
def crear_categoria(categoria_data: CategoriaCreate, session: SessionDep):
    """
    Crea una nueva categoría.
    """
    nueva = Categoria.model_validate(categoria_data)
    session.add(nueva)
    session.commit()
    session.refresh(nueva)
    return nueva


@router.patch("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(
    categoria_id: int, cambios: CategoriaUpdate, session: SessionDep
):
    """
    Actualiza solo los campos enviados.
    """
    categoria = session.get(Categoria, categoria_id)
    if not categoria or categoria.deleted_at:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    datos = cambios.model_dump(exclude_unset=True)
    for campo, valor in datos.items():
        setattr(categoria, campo, valor)

    categoria.updated_at = datetime.utcnow()
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


@router.delete("/{categoria_id}", status_code=204)
def eliminar_categoria(categoria_id: int, session: SessionDep):
    """
    Soft delete para categorías.
    """
    categoria = session.get(Categoria, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    categoria.deleted_at = datetime.utcnow()
    session.add(categoria)
    session.commit()

