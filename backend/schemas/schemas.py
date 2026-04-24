from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from sqlmodel import SQLModel


# ══════════════════════════════════════
# SCHEMAS DE CATEGORÍA
# ══════════════════════════════════════

class CategoriaBase(SQLModel):
    nombre: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    parent_id: Optional[int] = None


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaRead(CategoriaBase):
    id: int
    created_at: datetime
    updated_at: datetime


class CategoriaUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    parent_id: Optional[int] = None


# ══════════════════════════════════════
# SCHEMAS DE INGREDIENTE
# ══════════════════════════════════════

class IngredienteBase(SQLModel):
    nombre: str
    descripcion: Optional[str] = None
    es_alergeno: bool = False


class IngredienteCreate(IngredienteBase):
    pass


class IngredienteRead(IngredienteBase):
    id: int
    created_at: datetime
    updated_at: datetime


class IngredienteUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    es_alergeno: Optional[bool] = None


# ══════════════════════════════════════
# SCHEMAS DE PRODUCTO
# ══════════════════════════════════════

class ProductoBase(SQLModel):
    nombre: str
    descripcion: Optional[str] = None
    precio_base: Decimal
    imagenes_url: List[str] = []
    stock_cantidad: int = 0
    disponible: bool = True


class ProductoCreate(ProductoBase):
    categoria_ids: List[int] = []     # Lista de IDs de categorías
    ingrediente_ids: List[int] = []   # Lista de IDs de ingredientes


class ProductoRead(ProductoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    categorias: List[CategoriaRead] = []
    ingredientes: List[IngredienteRead] = []


class ProductoUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[Decimal] = None
    imagenes_url: Optional[List[str]] = None
    stock_cantidad: Optional[int] = None
    disponible: Optional[bool] = None
    categoria_ids: Optional[List[int]] = None
    ingrediente_ids: Optional[List[int]] = None

