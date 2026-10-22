import type { Categoria } from "./Categoria";

export type EstadoProducto = "DISPONIBLE" | "POCO_STOCK" | "AGOTADO";

export type Producto = {
  _id: string;
  nombre: string;
  descripcion?: string;
  codigo: string;
  precio: number;
  stock: number;
  estado: EstadoProducto;
  categoria: Categoria | null;
};

export type ProductoFormulario = {
  nombre: string;
  descripcion: string;
  codigo: string;
  precio: number;
  stock: number;
  categoria: string; // _id de la categoría
};