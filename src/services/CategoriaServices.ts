import axios from "axios";
import type { Categoria } from "../types/Categoria";
import { obtenerMensajeError } from "../utils/mensajeError";

const BASE_URL = "http://localhost:3000/categorias";

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  try {
    const respuesta = await axios.get<Categoria[]>(BASE_URL);
    return respuesta.data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error, "No se pudieron cargar las categorías"));
  }
};