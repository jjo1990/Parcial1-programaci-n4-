import { GenericApi } from "./generic.api";
import { Ingrediente, IngredienteCreate } from "../types";

class IngredientesApi extends GenericApi<Ingrediente, IngredienteCreate> {
  constructor() {
    super("/ingredientes");
  }
}

export const ingredientesAPI = new IngredientesApi();
