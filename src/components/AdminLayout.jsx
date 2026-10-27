import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
  
      <Container fluid className="p-0">
        <Row className="p-2 g-0 min-vh-100">
          <Col md={3} lg={2} className="border-end p-3">
            <div className="d-flex flex-column h-100">
              <h3 className="fw-bold text-primary mb-0">ShopStream</h3>
              <p className="text-muted mt-0 mb-4">Admin Panel</p>
              <div className="d-flex flex-column gap-4 w-100">
                <Button variant="outline-primary" as={Link} to="/admin/inventory">Inventory</Button>
                <Button variant="outline-primary" as={Link} to="/admin/orders" >Orders</Button>
                <Button variant="outline-primary" as={Link} to="/admin/customers">Customers</Button>
              </div>
            </div>
          </Col>
          <Col md={9} lg={10}>
            <Outlet />
          </Col>
        </Row>
      </Container>

  );
}
