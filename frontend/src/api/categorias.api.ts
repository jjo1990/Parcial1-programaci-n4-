import { GenericApi } from "./generic.api";
import { Categoria, CategoriaCreate } from "../types";

class CategoriasApi extends GenericApi<Categoria, CategoriaCreate> {
  constructor() {
    super("/categorias");
  }
}

export const categoriasAPI = new CategoriasApi();
