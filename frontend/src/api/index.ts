// Funciones que conectan el frontend con la API del backend.
// Cada función hace un fetch al endpoint correspondiente.

const API = "http://localhost:8000";

// ── Categorías ────────────────────────────────────────────────────────────────

import type { Categoria, CategoriaCreate, Ingrediente, IngredienteCreate, Producto, ProductoCreate } from "../types";

export const categoriasAPI = {
  listar: async (): Promise<Categoria[]> => {
    const res = await fetch(`${API}/categorias/`);
    return res.json();
  },
  obtener: async (id: number): Promise<Categoria> => {
    const res = await fetch(`${API}/categorias/${id}`);
    return res.json();
  },
  crear: async (data: CategoriaCreate): Promise<Categoria> => {
    const res = await fetch(`${API}/categorias/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  actualizar: async (id: number, data: Partial<CategoriaCreate>): Promise<Categoria> => {
    const res = await fetch(`${API}/categorias/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  eliminar: async (id: number): Promise<void> => {
    await fetch(`${API}/categorias/${id}`, { method: "DELETE" });
  },
};

// ── Ingredientes ──────────────────────────────────────────────────────────────

export const ingredientesAPI = {
  listar: async (): Promise<Ingrediente[]> => {
    const res = await fetch(`${API}/ingredientes/`);
    return res.json();
  },
  obtener: async (id: number): Promise<Ingrediente> => {
    const res = await fetch(`${API}/ingredientes/${id}`);
    return res.json();
  },
  crear: async (data: IngredienteCreate): Promise<Ingrediente> => {
    const res = await fetch(`${API}/ingredientes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  actualizar: async (id: number, data: Partial<IngredienteCreate>): Promise<Ingrediente> => {
    const res = await fetch(`${API}/ingredientes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  eliminar: async (id: number): Promise<void> => {
    await fetch(`${API}/ingredientes/${id}`, { method: "DELETE" });
  },
};

// ── Productos ─────────────────────────────────────────────────────────────────

export const productosAPI = {
  listar: async (): Promise<Producto[]> => {
    const res = await fetch(`${API}/productos/`);
    return res.json();
  },
  obtener: async (id: number): Promise<Producto> => {
    const res = await fetch(`${API}/productos/${id}`);
    return res.json();
  },
  crear: async (data: ProductoCreate): Promise<Producto> => {
    const res = await fetch(`${API}/productos/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  actualizar: async (id: number, data: Partial<ProductoCreate>): Promise<Producto> => {
    const res = await fetch(`${API}/productos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  eliminar: async (id: number): Promise<void> => {
    await fetch(`${API}/productos/${id}`, { method: "DELETE" });
  },
};
