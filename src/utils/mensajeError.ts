import axios from "axios";

// Convierte cualquier error de axios en un mensaje legible para el usuario
export const obtenerMensajeError = (error: unknown, porDefecto: string): string => {
  if (axios.isAxiosError<{ mensaje?: string }>(error)) {
    if (!error.response) return "No se pudo conectar con el servidor";
    if (error.response.data?.mensaje) return error.response.data.mensaje;
  }
  return porDefecto;
};