import { useEffect, useState } from "react";
import { Table, Button, Modal, Badge, Alert } from "react-bootstrap";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  venderProducto,
  reponerProducto,
} from "../../services/ProductoServices";
import type {
  EstadoProducto,
  Producto,
  ProductoFormulario,
} from "../../types/Producto";
import FormularioProducto from "../FormularioProducto/FormularioProducto";
import ModalStock from "../ModalStock/ModalStock";

const estilosEstado: Record<EstadoProducto, { texto: string; bg: string }> = {
  DISPONIBLE: { texto: "Disponible", bg: "success" },
  POCO_STOCK: { texto: "Poco stock", bg: "warning" },
  AGOTADO: { texto: "Agotado", bg: "danger" },
};

type Movimiento = { producto: Producto; accion: "vender" | "reponer" };

const ListaProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditado, setProductoEditado] = useState<Producto | null>(null);

  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const [movimiento, setMovimiento] = useState<Movimiento | null>(null);

  const cargarProductos = async () => {
    setCargando(true);
    setError(null);
    try {
      setProductos(await obtenerProductos());
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar los productos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const abrirAgregar = () => {
    setProductoEditado(null);
    setMostrarFormulario(true);
  };

  const abrirEditar = (producto: Producto) => {
    setProductoEditado(producto);
    setMostrarFormulario(true);
  };

  // Si falla, lanza el error: el formulario lo muestra y queda abierto
  const guardarProducto = async (datos: ProductoFormulario) => {
    if (productoEditado) {
      const actualizado = await actualizarProducto(productoEditado._id, datos);
      setProductos((anteriores) =>
        anteriores.map((p) => (p._id === actualizado._id ? actualizado : p)),
      );
    } else {
      const nuevo = await crearProducto(datos);
      setProductos((anteriores) => [...anteriores, nuevo]);
    }
    setMostrarFormulario(false);
  };

  const cerrarEliminar = () => {
    setProductoAEliminar(null);
    setErrorEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!productoAEliminar) return;
    try {
      await eliminarProducto(productoAEliminar._id);
      setProductos((anteriores) =>
        anteriores.filter((p) => p._id !== productoAEliminar._id),
      );
      cerrarEliminar();
    } catch (e) {
      setErrorEliminar(e instanceof Error ? e.message : "No se pudo eliminar el producto");
    }
  };

  const confirmarMovimiento = async (cantidad: number) => {
    if (!movimiento) return;
    const { producto, accion } = movimiento;
    const actualizado =
      accion === "vender"
        ? await venderProducto(producto._id, cantidad)
        : await reponerProducto(producto._id, cantidad);
    setProductos((anteriores) =>
      anteriores.map((p) => (p._id === actualizado._id ? actualizado : p)),
    );
    setMovimiento(null);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Stock</h2>
        <Button variant="success" onClick={abrirAgregar}>
          + Nuevo Producto
        </Button>
      </div>

      {/* Estado: cargando */}
      {cargando && <p>Cargando...</p>}

      {/* Estado: error */}
      {error && (
        <Alert variant="danger" className="d-flex justify-content-between align-items-center">
          {error}
          <Button variant="outline-danger" size="sm" onClick={cargarProductos}>
            Reintentar
          </Button>
        </Alert>
      )}

      {/* Estado: datos */}
      {!cargando && !error && (
        <Table striped bordered hover responsive className="shadow-sm align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Código</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  No hay productos cargados
                </td>
              </tr>
            ) : (
              productos.map((prod) => {
                const estilo = estilosEstado[prod.estado];
                return (
                  <tr key={prod._id}>
                    <td className="fw-bold">{prod.nombre}</td>
                    <td>{prod.codigo}</td>
                    <td>{prod.categoria?.nombre ?? "—"}</td>
                    <td>${prod.precio.toLocaleString("es-AR")}</td>
                    <td>{prod.stock}</td>
                    <td>
                      <Badge
                        bg={estilo.bg}
                        text={prod.estado === "POCO_STOCK" ? "dark" : undefined}
                      >
                        {estilo.texto}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-success"
                          size="sm"
                          disabled={prod.stock === 0}
                          onClick={() => setMovimiento({ producto: prod, accion: "vender" })}
                        >
                          Vender
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setMovimiento({ producto: prod, accion: "reponer" })}
                        >
                          Reponer
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => abrirEditar(prod)}
                        >
                          Modificar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => setProductoAEliminar(prod)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}

      <FormularioProducto
        mostrar={mostrarFormulario}
        producto={productoEditado}
        onCerrar={() => setMostrarFormulario(false)}
        onGuardar={guardarProducto}
      />

      {movimiento && (
        <ModalStock
          producto={movimiento.producto}
          accion={movimiento.accion}
          onCerrar={() => setMovimiento(null)}
          onConfirmar={confirmarMovimiento}
        />
      )}

      {/* Modal de confirmación de borrado */}
      <Modal show={!!productoAEliminar} onHide={cerrarEliminar} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que querés eliminar "{productoAEliminar?.nombre}"?
          {errorEliminar && <p className="text-danger mt-3 mb-0">{errorEliminar}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarEliminar}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ListaProductos;