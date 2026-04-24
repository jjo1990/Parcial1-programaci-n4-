from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from sqlmodel import SQLModel, Field, Relationship, Column, DateTime, String
from sqlalchemy.dialects.postgresql import ARRAY


# ─────────────────────────────────────────────
# TABLAS INTERMEDIAS (relación N a N)
# ─────────────────────────────────────────────

class ProductoIngrediente(SQLModel, table=True):
    """Conecta Producto con Ingrediente."""
    producto_id: Optional[int] = Field(
        default=None, foreign_key="producto.id", primary_key=True
    )
    ingrediente_id: Optional[int] = Field(
        default=None, foreign_key="ingrediente.id", primary_key=True
    )
    es_removible: bool = Field(default=False)


class ProductoCategoria(SQLModel, table=True):
    """Conecta Producto con Categoria (M:M según UML)."""
    producto_id: Optional[int] = Field(
        default=None, foreign_key="producto.id", primary_key=True
    )
    categoria_id: Optional[int] = Field(
        default=None, foreign_key="categoria.id", primary_key=True
    )
    es_principal: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )


# ─────────────────────────────────────────────
# CATEGORÍA
# ─────────────────────────────────────────────
class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    parent_id: Optional[int] = Field(default=None, foreign_key="categoria.id")
    nombre: str = Field(unique=True, index=True, max_length=100)
    descripcion: Optional[str] = Field(default=None)
    imagen_url: Optional[str] = Field(default=None)
    
    # Audit
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = Field(default=None)

    # Relationships
    productos: List["Producto"] = Relationship(
        back_populates="categorias", link_model=ProductoCategoria
    )
    # Self-reference for hierarchy
    subcategorias: List["Categoria"] = Relationship(
        back_populates="parent_categoria",
        sa_relationship_kwargs={"remote_side": "Categoria.id"}
    )
    parent_categoria: Optional["Categoria"] = Relationship(
        back_populates="subcategorias"
    )


# ─────────────────────────────────────────────
# INGREDIENTE
# ─────────────────────────────────────────────
class Ingrediente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, max_length=100)
    descripcion: Optional[str] = Field(default=None)
    es_alergeno: bool = Field(default=False)
    
    # Audit
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    productos: List["Producto"] = Relationship(
        back_populates="ingredientes", link_model=ProductoIngrediente
    )


# ─────────────────────────────────────────────
# PRODUCTO
# ─────────────────────────────────────────────
class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=150)
    descripcion: Optional[str] = Field(default=None)
    precio_base: Decimal = Field(default=0, decimal_places=2)
    # Usamos ARRAY de PostgreSQL para las URLs de imágenes
    imagenes_url: List[str] = Field(default=[], sa_column=Column(ARRAY(String)))
    stock_cantidad: int = Field(default=0, ge=0)
    disponible: bool = Field(default=True)
    
    # Audit
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = Field(default=None)

    # Relationships
    categorias: List["Categoria"] = Relationship(
        back_populates="productos", link_model=ProductoCategoria
    )
    ingredientes: List["Ingrediente"] = Relationship(
        back_populates="productos", link_model=ProductoIngrediente
    )

