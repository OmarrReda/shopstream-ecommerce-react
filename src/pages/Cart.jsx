import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import cartImg from "../assets/cart.jpg";
import { BsBagCheck, BsBagHeart } from "react-icons/bs";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../components/store/slices/cartSlices";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";
import { CiDeliveryTruck } from "react-icons/ci";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((store) => store.cart);

  function handleCheckout(){
    const isLoggedIn = localStorage.getItem("accessToken");

    navigate(isLoggedIn ? "/checkout" : "/login")
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <div
            className="position-relative d-flex justify-content-center align-items-center"
            style={{ width: "240px", height: "240px" }}
          >
            <div
              className="rounded-circle d-flex justify-content-center align-items-center overflow-hidden"
              style={{ width: "220px", height: "220px", background: "#DEE9FC" }}
            >
              <img
                style={{ width: "170px", height: "170px", maxWidth: "290px" }}
                src={cartImg}
                alt=""
              />
            </div>
            <div
              className="rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "25px",
                height: "25px",
                position: "absolute",
                top: "10px",
                left: "15px",
                background: "#6CF8BB",
              }}
            >
              <BsBagCheck />
            </div>
            <div
              className="rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "25px",
                height: "25px",
                position: "absolute",
                top: "10px",
                left: "15px",
                background: "#6CF8BB",
              }}
            >
              <BsBagCheck />
            </div>
            <div
              className="rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "25px",
                height: "25px",
                position: "absolute",
                top: "10px",
                left: "15px",
                background: "#6CF8BB",
              }}
            >
              <BsBagCheck />
            </div>
            <div
              className="rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "25px",
                height: "25px",
                position: "absolute",
                bottom: "10px",
                right: "15px",
                background: "#4F46E5",
              }}
            >
              <BsBagHeart color="white" />
            </div>
          </div>
          <h1 className="fw-bold">Your Cart is Feeling Light</h1>
          <p className="mb-0">
            It looks like you haven't added anything to your cart yet.
          </p>
          <p>Lets find something special for you</p>
          <Button className="px-4" as={Link} to="/products">
            Start shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="p-3 my-3">
      <h1 className="mb-3">Your shopping cart</h1>
      <Row>
        <Col lg={8}>
          {items.map((item) => (
            <Card key={item.id} className="mb-3 position-relative">
              <Row className="g-3 p-2">
                <Col lg={2}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    width={200}
                    height={200}
                    className="img-thumbnail"
                  />
                </Col>
                <Col lg={7}>
                  <h3 className="mb-0">{item.title}</h3>
                  <p className="text-muted">{item.brand}</p>
                  <p className="text-truncate text-muted">{item.description}</p>
                  <ButtonToolbar>
                    <ButtonGroup>
                      <Button
                        variant="secondary"
                        onClick={() => dispatch(decreaseQuantity(item))}
                        style={{ backgroundColor: "grey" }}
                      >
                        -
                      </Button>
                      <Button variant="secondary" disabled>
                        {item.quantity}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => dispatch(increaseQuantity(item))}
                      >
                        +
                      </Button>
                    </ButtonGroup>
                  </ButtonToolbar>
                </Col>
                <Col lg={3} className="d-flex flex-column text-end">
                  <h4 className="text-primary p-2">${item.price}</h4>
                  <Button
                    className=" position-absolute bottom-0 end-0 p-2"
                    variant="transparent text-end"
                    onClick={() => dispatch(removeFromCart(item))}
                  >
                    <RiDeleteBin6Line color="red" />
                    <span className="text-danger">Remove</span>
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>
        <Col lg={4}>
          <Card className="p-4 sticky-top">
            <Card.Title>Order Summary</Card.Title>
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
            <h3 className="mt-4 fw-bold">
              Total{" "}
              <span className="float-end text-primary">
                ${(totalAmount+15.88).toFixed(2)}
              </span>
            </h3>
            <Button className="w-100 mt-3" size="lg" onClick={handleCheckout}>
              proceed to checkout{" "}
              <span>
                <FaArrowRightLong color="white" />
              </span>
            </Button>
            <p className="text-muted text-center">
              By proceeding to checkout, you agree to ShopStream's terms and
              privacy policy.
            </p>
            <hr />
            <div className="d-flex gap-2 align-items-center border-1 rounded-2 p-3">
                <CiDeliveryTruck className="fs-2 fw-bold" color="blue"/>
                <div className="d-flex flex-column align-item-center">
                    <p className="fw-bold mb-0">Free Express Delivery</p>
                    <p className="text-muted mt-0">Arrives by Oct 24 - 26</p>
                </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
