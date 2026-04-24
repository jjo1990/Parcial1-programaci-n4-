from typing import Annotated, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from db.database import get_session
from models.models import Ingrediente
from schemas.schemas import IngredienteCreate, IngredienteRead, IngredienteUpdate

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=List[IngredienteRead])
def listar_ingredientes(
    session: SessionDep,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(le=100)] = 10,
    nombre: Annotated[str | None, Query()] = None,
):
    query = select(Ingrediente)
    if nombre:
        query = query.where(Ingrediente.nombre.ilike(f"%{nombre}%"))
    return session.exec(query.offset(offset).limit(limit)).all()


@router.get("/{ingrediente_id}", response_model=IngredienteRead)
def obtener_ingrediente(ingrediente_id: int, session: SessionDep):
    ing = session.get(Ingrediente, ingrediente_id)
    if not ing:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return ing


@router.post("/", response_model=IngredienteRead, status_code=201)
def crear_ingrediente(data: IngredienteCreate, session: SessionDep):
    nuevo = Ingrediente.model_validate(data)
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo


@router.patch("/{ingrediente_id}", response_model=IngredienteRead)
def actualizar_ingrediente(
    ingrediente_id: int, cambios: IngredienteUpdate, session: SessionDep
):
    ing = session.get(Ingrediente, ingrediente_id)
    if not ing:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")

    datos = cambios.model_dump(exclude_unset=True)
    for campo, valor in datos.items():
        setattr(ing, campo, valor)

    ing.updated_at = datetime.utcnow()
    session.add(ing)
    session.commit()
    session.refresh(ing)
    return ing


@router.delete("/{ingrediente_id}", status_code=204)
def eliminar_ingrediente(ingrediente_id: int, session: SessionDep):
    ing = session.get(Ingrediente, ingrediente_id)
    if not ing:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    session.delete(ing)
    session.commit()

