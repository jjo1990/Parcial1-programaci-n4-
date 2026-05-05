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
