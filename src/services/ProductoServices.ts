import axios from "axios";
import type { Producto, ProductoFormulario } from "../types/Producto";
import { obtenerMensajeError } from "../utils/mensajeError";

const BASE_URL = "http://localhost:3000/productos";

export const obtenerProductos = async (): Promise<Producto[]> => {
  try {
    const respuesta = await axios.get<Producto[]>(BASE_URL);
    return respuesta.data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error, "No se pudieron cargar los productos"));
  }
};

export const crearProducto = async (datos: ProductoFormulario): Promise<Producto> => {
  try {
    const respuesta = await axios.post<Producto>(BASE_URL, datos);
    return respuesta.data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error, "No se pudo crear el producto"));
  }
};

export const actualizarProducto = async (
  id: string,
  datos: ProductoFormulario,
): Promise<Producto> => {
  try {
    const respuesta = await axios.put<Producto>(`${BASE_URL}/${id}`, datos);
    return respuesta.data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error, "No se pudo actualizar el producto"));
  }
};

export const eliminarProducto = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    throw new Error(obtenerMensajeError(error, "No se pudo eliminar el producto"));
  }
};

// ---- Endpoints de negocio ----

export const venderProducto = async (id: string, cantidad: number): Promise<Producto> => {
  try {
    const respuesta = await axios.put<Producto>(`${BASE_URL}/${id}/vender`, { cantidad });
    return respuesta.data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error, "No se pudo registrar la venta"));
  }
};

export const reponerProducto = async (id: string, cantidad: number): Promise<Producto> => {
  try {
    const respuesta = await axios.put<Producto>(`${BASE_URL}/${id}/reponer`, { cantidad });
    return respuesta.data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error, "No se pudo reponer el stock"));
  }
};