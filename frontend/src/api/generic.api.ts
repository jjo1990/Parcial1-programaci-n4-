const API_BASE = "http://localhost:8000";

export class GenericApi<T, TCreate> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = `${API_BASE}${endpoint}`;
  }

  async listar(): Promise<T[]> {
    const res = await fetch(`${this.endpoint}/`);
    return res.json();
  }

  async obtener(id: number): Promise<T> {
    const res = await fetch(`${this.endpoint}/${id}`);
    return res.json();
  }

  async crear(data: TCreate): Promise<T> {
    const res = await fetch(`${this.endpoint}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async actualizar(id: number, data: Partial<TCreate>): Promise<T> {
    const res = await fetch(`${this.endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async eliminar(id: number): Promise<void> {
    await fetch(`${this.endpoint}/${id}`, { method: "DELETE" });
  }
}
