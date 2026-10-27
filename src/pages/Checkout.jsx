import { Button, Card, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { CiCreditCard1 } from "react-icons/ci";
import { FaArrowRightLong, FaCcPaypal, FaMoneyBills } from "react-icons/fa6";
import { FiTruck } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Checkout() {
  const isDark = useSelector((state) => state.theme.isDark);

  const { items, totalAmount } = useSelector((state) => state.cart);

  return (
    <Container className="my-5">
      <Row>
        <Col md={8}>
          <div>
            <h1 className="fw-bold">Secure Checkout</h1>
            <p className="text-muted">
              Complete your order with ShopStream's verified protection.
            </p>
          </div>
          <Card>
            <Card.Body>
              <div className="d-flex gap-3 align-items-center">
                <span>
                  <FiTruck size={20} color="blue" />
                </span>
                <h5 className="fw-bold mb-0">Shipping Information</h5>
              </div>
              <Form className="my-3">
                <div className="d-flex align-items-center gap-3 mt-2 mb-2">
                  <Form.Group className="w-50">
                    <Form.Label className="mb-0">First Name</Form.Label>
                    <Form.Control
                      bg={isDark ? "dark" : "light"}
                      data-bs-theme={isDark ? "dark" : "light"}
                      type="text"
                      placeholder="john"
                    />
                  </Form.Group>
                  <Form.Group className="w-50">
                    <Form.Label className="mb-0">Last Name</Form.Label>
                    <Form.Control
                      bg={isDark ? "dark" : "light"}
                      data-bs-theme={isDark ? "dark" : "light"}
                      type="text"
                      placeholder="doe"
                    />
                  </Form.Group>
                </div>
                <Form.Group className="w-100">
                  <Form.Label className="mb-0">address</Form.Label>
                  <Form.Control
                    bg={isDark ? "dark" : "light"}
                    data-bs-theme={isDark ? "dark" : "light"}
                    type="text"
                    placeholder="123 commerce way"
                  />
                </Form.Group>
                <div className="d-flex align-items-center gap-3 mt-2 mb-2">
                  <Form.Group className="w-50">
                    <Form.Label className="mb-0">City</Form.Label>
                    <Form.Control
                      bg={isDark ? "dark" : "light"}
                      data-bs-theme={isDark ? "dark" : "light"}
                      type="text"
                      placeholder="New York"
                    />
                  </Form.Group>
                  <Form.Group className="w-50">
                    <Form.Label className="mb-0">Zip Code</Form.Label>
                    <Form.Control
                      bg={isDark ? "dark" : "light"}
                      data-bs-theme={isDark ? "dark" : "light"}
                      type="number"
                      placeholder="10001"
                    />
                  </Form.Group>
                  <Form.Group className="w-50">
                    <Form.Label className="mb-0">Phone Number</Form.Label>
                    <Form.Control
                      bg={isDark ? "dark" : "light"}
                      data-bs-theme={isDark ? "dark" : "light"}
                      type="text"
                      placeholder="+1 (555) 000-00000"
                    />
                  </Form.Group>
                </div>
              </Form>
            </Card.Body>
          </Card>
          <Card className="my-3">
            <Card.Body>
              <div className="d-flex gap-3 align-items-center">
                <span>
                  <FaMoneyBills size={20} color="blue" />
                </span>
                <h5 className="fw-bold mb-0">Payment Method</h5>
              </div>
              <Form className="my-3">
                <Form.Group>
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      id="card"
                      label="Credit or Debit Card"
                      className="fw-bold"
                    />
                    <span>
                      <CiCreditCard1 size={25} />
                    </span>
                  </div>

                  <Form.Label className="mb-0 fw-bold mt-3">
                    Card Number
                  </Form.Label>
                  <Form.Control
                    type="number"
                    bg={isDark ? "dark" : "light"}
                    data-bs-theme={isDark ? "dark" : "light"}
                    placeholder="0000 0000 0000 0000"
                  />
                </Form.Group>
                <div className="d-flex align-items-center gap-3 mt-2 mb-2">
                  <Form.Group className="w-50">
                    <Form.Label className="mb-0">Expiry Date</Form.Label>
                    <Form.Control
                      bg={isDark ? "dark" : "light"}
                      data-bs-theme={isDark ? "dark" : "light"}
                      type="text"
                      placeholder="MM/YY"
                    />
                  </Form.Group>
                  <Form.Group className="w-50">
                    <Form.Label className="mb-0">CVC</Form.Label>
                    <Form.Control
                      bg={isDark ? "dark" : "light"}
                      data-bs-theme={isDark ? "dark" : "light"}
                      type="number"
                      placeholder="number"
                    />
                  </Form.Group>
                </div>
                <Form.Group className="mt-4">
                  <div className="d-flex justify-content-between align-items-center border border-2 rounded-3 p-2">
                    <Form.Check
                      type="radio"
                      id="Paypal"
                      label="Paypal"
                      value="Paypal"
                      name="paymentMethod"
                      className="fw-bold"
                    />
                    <span>
                      <FaCcPaypal size={25} />
                    </span>
                  </div>
                </Form.Group>
              </Form>
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
              <ListGroup >
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
              <Form.Group className="d-flex justify-content-between gap-3 mt-3">
                <Form.Control type="text" placeholder="Promo Code"  data-bs-theme={isDark ? "dark" : "light"} />
                <Button variant="primary">Apply</Button>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="d-flex justify-content-center align-items-center">
              <Button variant="primary" className="w-25" as={Link} to="/success">Place Order <FaArrowRightLong /></Button>
      </div>
    </Container>
  );
}
