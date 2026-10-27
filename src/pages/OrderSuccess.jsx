import { useState } from "react";
import { Button, Card, Col, Container, ListGroup, ProgressBar, Row } from "react-bootstrap";
import { FaCheck } from "react-icons/fa6";
import { FiTruck } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
  const [ currentStep ] = useState(1);
  const isDark = useSelector((state) => state.theme.isDark);
  const { items, totalAmount } = useSelector((state) => state.cart);

  return (
    <Container>
      <div className="d-flex justify-content-center mt-5">
        <div
          className="d-flex justify-content-center align-items-center rounded-circle"
          style={{ width: "50px", height: "50px", backgroundColor: "#6CF8BB" }}
        >
          <div
            className="d-flex justify-content-center align-items-center rounded-circle"
            style={{
              width: "35px",
              height: "35px",
              backgroundColor: "#00714D",
            }}
          >
            <FaCheck />
          </div>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="fw-bold fs-1 mt-2">Order Confirmed</h1>
        <p className="text-muted w-50 text-center">
          Woohoo! Your order has been placed successfully. We've sent a
          confirmation email to alex.design@example.com.
        </p>
      </div>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0">Estimated Delivery</h4>
                <span>
                  {" "}
                  <FiTruck size={20} />
                </span>
              </div>
              <small className="text-success fw-bold">
                Tuesday, October 24th, 2026
              </small>
              <div className="d-flex justify-content-between text-center mt-4">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className="d-flex flex-column align-items-center"
                  >
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= step ? "bg-success text-white" : "bg-secondary text-white"}`}
                      style={{ width: "45px", height: "45px" }}
                    >
                      {step}
                    </div>
                    <span className="mt-2">{["Confirmed", "Processing", "Shipped"][step - 1]}</span>
                  </div>
                ))}
              </div>
                <ProgressBar now={(currentStep - 1) * 50} variant="success" className="mt-3" style={{height: "6px"}} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="p-2"
            bg={isDark ? "dark" : "light"}
            data-bs-theme={isDark ? "dark" : "light"}
          >
            <Card.Body>
              <h4 className="fw-bold mb-3">Order Summary</h4>
              {items.map((item) => (
                <Row className="align-items-center">
                  <Col md={3}>
                    <img
                      src={item.thumbnail}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                      }}
                      alt=""
                    />
                  </Col>
                  <Col md={9}>
                    <p className="fw-bold mb-0">{item.title}</p>
                    <small className="text-muted mt-0">
                      Amount: {item.quantity}
                    </small>
                    <p className="fw-bold text-primary">
                      ${item.price * item.quantity}
                    </p>
                  </Col>
                </Row>
              ))}
              <hr />
              <ListGroup>
                <ListGroup.Item>
                  Subtotal{" "}
                  <span className="float-end">${totalAmount.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  Shipping{" "}
                  <span className="float-end text-success fw-bold">Free</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  Estimated Tax <span className="float-end">$15.88</span>
                </ListGroup.Item>
              </ListGroup>
              <hr />
              <h3 className="mt-4 fw-bold">
                Total{" "}
                <span className="float-end text-primary">
                  ${(totalAmount + 15.88).toFixed(2)}
                </span>
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="d-flex justify-content-center">
        <Button
          variant="primary"
          className="text-center w-25"
          as={Link}
          to="/products"
        >
          Continue Shopping
        </Button>
      </div>
    </Container>
  );
}
