import { GenericApi } from "./generic.api";
import { Producto, ProductoCreate } from "../types";

class ProductosApi extends GenericApi<Producto, ProductoCreate> {
  constructor() {
    super("/productos");
  }
}

export const productosAPI = new ProductosApi();
