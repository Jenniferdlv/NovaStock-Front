import { Container } from "react-bootstrap";
import ListaProductos from "../components/ListaProductos/ListaProductos";

const PaginaProductos = () => {
  return (
    <main>
      <Container className="py-4">
        <ListaProductos />
      </Container>
    </main>
  );
};

export default PaginaProductos;