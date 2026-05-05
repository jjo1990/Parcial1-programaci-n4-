import { Categoria } from "./categoria.type";
import { Ingrediente } from "./ingrediente.type";

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
