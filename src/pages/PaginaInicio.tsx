import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const PaginaInicio = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center py-5">
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg p-5 border-0 rounded-4 bg-white">
            <h1 className="fw-bold text-info mb-3">NovaStock</h1>
            <p className="text-muted fs-5 mb-4">
              Sistema de control y gestión de stock
            </p>
            <div>
              <Link to="/productos" className="btn btn-primary">
                Ver productos
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaginaInicio;