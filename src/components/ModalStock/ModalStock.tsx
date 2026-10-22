import { useState, type FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Producto } from "../../types/Producto";

type Props = {
  producto: Producto;
  accion: "vender" | "reponer";
  onCerrar: () => void;
  onConfirmar: (cantidad: number) => Promise<void>;
};

const ModalStock = ({ producto, accion, onCerrar, onConfirmar }: Props) => {
  const [cantidad, setCantidad] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const vender = accion === "vender";

  const confirmar = async (evento: FormEvent) => {
    evento.preventDefault();
    const numero = Number(cantidad);
    if (!Number.isInteger(numero) || numero <= 0) {
      setError("Ingresá una cantidad entera mayor a 0");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      await onConfirmar(numero);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo completar la operación");
      setEnviando(false);
    }
  };

  return (
    <Modal show onHide={onCerrar} centered>
      <Form onSubmit={confirmar} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{vender ? "Registrar venta" : "Reponer stock"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            <strong>{producto.nombre}</strong> — stock actual: {producto.stock}
          </p>
          <Form.Group controlId="cantidad">
            <Form.Label>Cantidad a {vender ? "vender" : "reponer"}</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={cantidad}
              onChange={(evento) => setCantidad(evento.target.value)}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" variant={vender ? "success" : "primary"} disabled={enviando}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalStock;