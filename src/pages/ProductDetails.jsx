import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { addToCart } from "../components/store/slices/cartSlices";
import { useDispatch } from "react-redux";
import axios from "axios";
import Rating from "../components/Rating";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainimage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProductDetails() {
      const URL = `https://dummyjson.com/products/${id}`;
      try {
        const response = await axios.get(URL);
        console.log(response);
        const product = response.data;
        setProduct(product);
        setMainImage(product.images[0]);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProductDetails();
  }, [id]);

  function handleCheckout() {
    const isLoggedIn = localStorage.getItem("accessToken");

    navigate(isLoggedIn ? "/checkout" : "/login");
  }

  if (!product) return <h1>Product not found</h1>;

  const {
    images,
    title,
    rating,
    description,
    price,
    discountPercentage,
    reviews,
    stock,
  } = product || {};

  return (
    <Container className="my-3">
      <Card className="p-3">
        <Row>
          <Col md={6}>
            {/* main image */}
            <Card.Img
              src={mainimage}
              variant="top"
              alt={title}
              style={{ height: "400px", objectFit: "contain" }}
            />
            {/* array of images */}
            <div className="d-flex gap-2 flex-wrap mt-3">
              {images.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  width={80}
                  height={80}
                  onClick={() => setMainImage(item)}
                  className="rounded-1"
                  style={{
                    cursor: "pointer",
                    objectFit: "cover",
                    border:
                      mainimage === item ? "2px solid green" : "1px solid grey",
                    margin: "5px",
                  }}
                />
              ))}
            </div>
          </Col>
          <Col md={6}>
            <Card.Body>
              <Card.Title>{title}</Card.Title>
              <Rating rating={rating} reviews={reviews.length} />
              <div className="d-flex gap-2 align-items-baseline">
                <Card.Text className="fs-1 fw-bold mt-4 mb-0">
                  ${price}
                </Card.Text>
                <Card.Text className="text-muted text-decoration-line-through">
                  ${(price / 1 - discountPercentage / 100).toFixed(2)}{" "}
                </Card.Text>
                <Card.Text className="text-success fw-bolder">
                  ({discountPercentage.toFixed(0)}% OFF)
                </Card.Text>
              </div>
              <Card.Text className="text-muted">
                Shipping is Calculated at checkout
              </Card.Text>
              <hr />
              <Card.Text>{description}</Card.Text>
              <br />
              <div className="d-flex justify-content-between align-items-center">
                <ButtonToolbar>
                  <ButtonGroup>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      disabled={quantity === 1}
                    >
                      -
                    </Button>
                    <Button variant="secondary" disabled>
                      {quantity}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setQuantity((prev) => Math.min(stock, prev + 1))
                      }
                      disabled={stock <= quantity}
                    >
                      +
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>

                <Button
                  className="w-75"
                  onClick={() => dispatch(addToCart({ ...product, quantity }))}
                >
                  Add to Cart
                </Button>
              </div>
              <Button
                variant="success"
                className="w-100 mt-3"
                onClick={() => {
                  dispatch(addToCart({ ...product, quantity })),
                    handleCheckout();
                }}
              >
                Buy Now
              </Button>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
