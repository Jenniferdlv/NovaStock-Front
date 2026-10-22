import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Producto, ProductoFormulario } from "../../types/Producto";
import type { Categoria } from "../../types/Categoria";
import { obtenerCategorias } from "../../services/CategoriaServices";

type Props = {
  mostrar: boolean;
  producto?: Producto | null;
  onCerrar: () => void;
  onGuardar: (datos: ProductoFormulario) => Promise<void>;
};

const esquema = Yup.object({
  nombre: Yup.string().trim().required("El nombre es obligatorio"),
  descripcion: Yup.string().trim().required("La descripción es obligatoria"),
  codigo: Yup.string().trim().required("El código es obligatorio"),
  precio: Yup.number()
    .typeError("El precio debe ser un número")
    .positive("El precio debe ser mayor a 0")
    .required("El precio es obligatorio"),
  stock: Yup.number()
    .typeError("El stock debe ser un número")
    .integer("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
    .required("El stock es obligatorio"),
  categoria: Yup.string().required("La categoría es obligatoria"),
});

const valoresIniciales: ProductoFormulario = {
  nombre: "",
  descripcion: "",
  codigo: "",
  precio: 0,
  stock: 0,
  categoria: "",
};

type CampoSimple = "nombre" | "descripcion" | "codigo" | "precio" | "stock";

const FormularioProducto = ({ mostrar, producto, onCerrar, onGuardar }: Props) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [errorCategorias, setErrorCategorias] = useState<string | null>(null);

  // Carga las categorías cada vez que se abre el modal
  useEffect(() => {
    if (!mostrar) return;
    setErrorCategorias(null);
    obtenerCategorias()
      .then(setCategorias)
      .catch((e: Error) => setErrorCategorias(e.message));
  }, [mostrar]);

  const formik = useFormik<ProductoFormulario>({
    initialValues: producto
      ? {
          nombre: producto.nombre,
          descripcion: producto.descripcion ?? "",
          codigo: producto.codigo,
          precio: producto.precio,
          stock: producto.stock,
          categoria: producto.categoria?._id ?? "",
        }
      : valoresIniciales,
    enableReinitialize: true,
    validationSchema: esquema,
    onSubmit: async (valores, { resetForm, setStatus }) => {
      try {
        await onGuardar(valores);
        resetForm();
      } catch (e) {
        setStatus(e instanceof Error ? e.message : "No se pudo guardar el producto");
      }
    },
  });

  const cerrar = () => {
    formik.resetForm();
    onCerrar();
  };

  const campo = (nombre: CampoSimple, etiqueta: string, tipo = "text") => (
    <Form.Group className="mb-3" controlId={nombre}>
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control
        type={tipo}
        name={nombre}
        value={formik.values[nombre]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isInvalid={Boolean(formik.touched[nombre] && formik.errors[nombre])}
      />
      <Form.Control.Feedback type="invalid">{formik.errors[nombre]}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <Modal show={mostrar} onHide={cerrar} centered>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{producto ? "Modificar Producto" : "Nuevo Producto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {campo("nombre", "Nombre")}
          {campo("descripcion", "Descripción")}
          {campo("codigo", "Código")}
          {campo("precio", "Precio ($)", "number")}
          {campo("stock", "Stock", "number")}

          <Form.Group className="mb-3" controlId="categoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={formik.values.categoria}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.touched.categoria && formik.errors.categoria)}
            >
              <option value="">Seleccione una categoría...</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nombre}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.categoria}
            </Form.Control.Feedback>
            {errorCategorias && (
              <p className="text-danger small mt-2 mb-0">{errorCategorias}</p>
            )}
          </Form.Group>

          {formik.status && <p className="text-danger mt-3 mb-0">{formik.status}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrar}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FormularioProducto;