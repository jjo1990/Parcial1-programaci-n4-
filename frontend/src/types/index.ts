// Estas interfaces son el "contrato" entre el frontend y el backend.
// Le dicen a TypeScript exactamente qué forma tienen los datos.

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  parent_id?: number;
}

export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string;
  es_alergeno: boolean;
  created_at: string;
  updated_at: string;
}

export interface IngredienteCreate {
  nombre: string;
  descripcion?: string;
  es_alergeno: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  precio_base: number;
  descripcion?: string;
  disponible: boolean;
  stock_cantidad: number;
  imagenes_url: string[];
  categorias: Categoria[];    // M:M según UML
  ingredientes: Ingrediente[];
  created_at: string;
  updated_at: string;
}

export interface ProductoCreate {
  nombre: string;
  precio_base: number;
  descripcion?: string;
  stock_cantidad: number;
  disponible?: boolean;
  imagenes_url?: string[];
  categoria_ids: number[];
  ingrediente_ids: number[];
}

