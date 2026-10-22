# NovaStock – Front end

Sistema de control y gestión de stock. Aplicación hecha con React + TypeScript (Vite) que consume la API **NovaStock-Back** (Node + Express + MongoDB Atlas).

## API que consume

Repositorio del back: https://github.com/Jenniferdlv/NOVASTOCK

| Método | Ruta                   | Descripción                  |
|--------|------------------------|------------------------------|
| GET    | /productos             | Listar productos             |
| POST   | /productos             | Crear producto               |
| PUT    | /productos/:id         | Modificar producto           |
| DELETE | /productos/:id         | Eliminar producto            |
| PUT    | /productos/:id/vender  | Descontar stock (`cantidad`) |
| PUT    | /productos/:id/reponer | Sumar stock (`cantidad`)     |
| GET    | /categorias            | Listar categorías            |
| POST   | /categorias            | Crear categoría              |

## Funcionalidades

- Listado de productos con estados de carga, error y datos.
- Alta y modificación con formulario (Formik + Yup).
- Baja con modal de confirmación.
- Acciones de negocio: **Vender** y **Reponer** stock.
- Navegación entre páginas con React Router.

## Cómo correrlo en local

### 1. Back end

1. Clonar el repo del back y correr `npm install`.

2. Crear un archivo `.env` en la raíz del back con:

   MONGODB_URI= tu cadena de conexión de MongoDB Atlas
   PORT=3000

3. Correr `npm run dev` (queda en http://localhost:3000).
4. Crear al menos una categoría con `POST /categorias` y el body `{ "nombre": "Bebidas" }`.

### 2. Front end

1. Clonar este repo y correr `npm install`.
2. Correr `npm run dev` y abrir http://localhost:5173.

> El back tiene que estar corriendo para que el front pueda cargar los datos.

## Tecnologías

React, TypeScript, Vite, React Router, React-Bootstrap, Axios, Formik y Yup.