import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay ,Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import image1 from "../assets/home.png";
import axios from "axios";

export default function Home() {
  const isDark = useSelector((state) => state.theme.isDark);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const savedProducts = localStorage.getItem("products");
        if(savedProducts){
          setProducts(JSON.parse(savedProducts));
          return;
        }
        const URL = "https://dummyjson.com/products?limit=0";
        const response = await axios.get(URL);
        setProducts(response.data.products);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <Container fluid>
      <div
        className="p-5 w-100 rounded-4"
        style={{ background: isDark ? "#212529" : "#EFF4FF" }}
      >
        <Row className="align-items-center">
          <Col md={6}>
            <div>
              <h1 className="fw-bold fs-1">
                Experience the Future of <br />{" "}
                <span className="text-primary">Innovation</span>
              </h1>
              <p className="w-75">
                Explore our curated selection of premium electronics designed to
                elevate your daily stream of life. Precision engineering meets
                minimalist design.
              </p>
              <div className="d-flex gap-3">
                <Button variant="primary" as={Link} to="/products">
                  Shop Products
                </Button>
                <Button variant="outline-primary">View collection</Button>
              </div>
            </div>
          </Col>
          <Col md={6} className="d-flex justify-content-end">
            <img
              src={image1}
              style={{ maxWidth: "500px", maxHeight: "400px" }}
              className="rounded-2  shadow-sm"
              alt=""
            />
          </Col>
        </Row>
      </div>
      <div className="my-3">
        <h3 className="fw-bold mb-0">Featured Products</h3>
        <p className="text-muted">The latest and greatest products</p>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={product.thumbnail}
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <div className="d-flex justify-content-between">
                    <Card.Text className="text-success">
                      ${product.price}
                    </Card.Text>
                    <Button
                      variant="primary"
                      as={Link}
                      to={`/product-details/${product.id}`}
                    >
                      View Product
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        className="rounded-4 w-100 p-4 d-flex flex-column gap-3"
        style={{ backgroundColor: "#3525CD" }}
      >
        <h1 className="fw-bold text-light">Stay Ahead of the Stream</h1>
        <p className="w-50 text-light">
          Join our inner circle for exclusive early access to product launches,
          seasonal deals, and curated tech trends. No spam, just high-quality
          updates.
        </p>
        <Form className="d-flex gap-3">
          <Form.Control
            type="email"
            placeholder="Enter your Email"
            className=" bg-transparent w-25 text-white"
          />
          <Button variant="success" className="px-4 py-2">
            Join Now
          </Button>
        </Form>
      </div>
    </Container>
  );
}
