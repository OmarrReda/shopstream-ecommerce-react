import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Pagination, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../components/store/slices/cartSlices";

export default function Products() {
  //all products
  const [products, setProducts] = useState([]);
  //product search
  const [searchProducts, setSearchProducts] = useState("");
  //Max price
  const [maxPrice, setMaxPrice] = useState(10000);
  //filter category
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  //return error
  const [error, setError] = useState(null);
  //loading state
  const [loading, setLoading] = useState(true);
  //limit
  const limit = 20;
  //current page
  const [currentPage, setCurrentPage] = useState(1);
  //brand
  const [selectedBrand, setSelectedBrand] = useState([]);

  const dispatch = useDispatch();

  // gets products from local storage to reflect admin changes. if no products stored use dummyJson 
  useEffect(() => {
    async function fetchProducts() {
      const URL = `https://dummyjson.com/products?limit=0`;
      try {
        const savedProducts = localStorage.getItem("products");

        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
          return;
        }
        const response = await axios.get(URL);
        const products = response.data.products;
        console.log(response.data.products);
        setProducts(products);
      } catch (err) {
        setError("failed to load products...");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);


  
  
  //sets the current page and calcs how many products to skip
  const skip = (currentPage - 1)* limit;

  function updatePagination(page) {
    setCurrentPage(page);
  }

  //filters products based on selected brand category and price
  function filterProducts(products) {
    return products.filter((product) => {
      const matchesBrand =
        selectedBrand.length === 0 || selectedBrand.includes(product.brand);

      const matchesCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes(product.category);

      const matchesPrice = product.price <= maxPrice;

      return matchesBrand && matchesCategory && matchesPrice;
    });
  }

  //updates selected categories when user checks or unchecks a category checkbox
  function handleCategoryChange(event) {
    const category = event.target.value;

    if (event.target.checked) {
      setSelectedCategory((prev) => [...prev, category]);
    } else {
      setSelectedCategory((prev) => prev.filter((item) => item !== category));
    }
    setCurrentPage(1);
  }

  //makes an array of all the brands.
  // Set stores unique values so no duplicates are stored
  // ... takes the values from the Set and puts them into an array 
  // /sort() sorts the brands alphabetically 
  const brands = [
    ...new Set(products.map((product) => product.brand).filter(Boolean)),
  ].sort();

  //secondary filter that filteres Products by title category and brand
  const filteredProducts = filterProducts(products).filter((product) =>
    `${product.title} ${product.category} ${product.brand || ""}`
      .toLowerCase()
      .includes(searchProducts.toLowerCase()),
  );

  let paginatedProducts = filteredProducts.slice(skip, skip + limit);
  let filteredTotal = filteredProducts.length;
  let filteredTotalPages = Math.ceil(filteredTotal / limit);

  const categories = [
    {
      slug: "beauty",
      name: "Beauty",
    },
    {
      slug: "fragrances",
      name: "Fragrances",
    },
    {
      slug: "furniture",
      name: "Furniture",
    },
    {
      slug: "groceries",
      name: "Groceries",
    },
    {
      slug: "home-decoration",
      name: "Home Decoration",
    },
    {
      slug: "kitchen-accessories",
      name: "Kitchen Accessories",
    },
    {
      slug: "laptops",
      name: "Laptops",
    },
    {
      slug: "mens-shirts",
      name: "Mens Shirts",
    },
    {
      slug: "mens-shoes",
      name: "Mens Shoes",
    },
    {
      slug: "mens-watches",
      name: "Mens Watches",
    },
    {
      slug: "mobile-accessories",
      name: "Mobile Accessories",
    },
    {
      slug: "motorcycle",
      name: "Motorcycle",
    },
    {
      slug: "skin-care",
      name: "Skin Care",
    },
    {
      slug: "smartphones",
      name: "Smartphones",
    },
    {
      slug: "sports-accessories",
      name: "Sports Accessories",
    },
    {
      slug: "sunglasses",
      name: "Sunglasses",
    },
    {
      slug: "tablets",
      name: "Tablets",
    },
    {
      slug: "tops",
      name: "Tops",
    },
    {
      slug: "vehicle",
      name: "Vehicle",
    },
    {
      slug: "womens-bags",
      name: "Womens Bags",
    },
    {
      slug: "womens-dresses",
      name: "Womens Dresses",
    },
    {
      slug: "womens-jewellery",
      name: "Womens Jewellery",
    },
    {
      slug: "womens-shoes",
      name: "Womens Shoes",
    },
    {
      slug: "womens-watches",
      name: "Womens Watches",
    },
  ];

  return (
    <Container>
      <Row className="mt-5">
        <Col lg={2}>
          <Card className="border-0">
            <Card.Body>
              <Form>
                {(showAllCategories ? categories : categories.slice(0, 5)).map(
                  (category) => (
                    <Form.Check
                      key={category.slug}
                      type="checkbox"
                      label={category.name}
                      value={category.slug}
                      checked={selectedCategory.includes(category.slug)}
                      onChange={handleCategoryChange}
                    />
                  ),
                )}
                <Button
                  variant="link"
                  className="p-0 mt-2 text-decoration-none"
                  onClick={() => setShowAllCategories((prev) => !prev)}
                >
                  {showAllCategories ? "Show less ▲" : "Show more ▼"}
                </Button>
                <h4 className="text-muted fw-light">Price Range</h4>
                <Form.Range
                  min={0}
                  max={10000}
                  step={10}
                  value={maxPrice}
                  onChange={(event) => {
                    setMaxPrice(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                />
                <div className="d-flex justify-content-between text-muted mt-0">
                  <Form.Label>$0</Form.Label>
                  <Form.Label>${maxPrice}</Form.Label>
                </div>
                <h4 className="text-muted fw-light">Brand</h4>

                <Form.Select
                  value={selectedBrand[0] || ""}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value ? [e.target.value] : []);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Brands</option>

                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Form.Select>

                <Button
                  variant="outline-secondary"
                  className="w-100 mt-3"
                  onClick={() => {
                    setSelectedCategory([]);
                    setSelectedBrand([]);
                    setMaxPrice(2000);
                    setSearchProducts("");
                    setCurrentPage(1);
                  }}
                >
                  Clear All Filters
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={10}>
          <div className="my-3 rounded p-4">
            <h1 className="text-center">Products</h1>
            <Form.Group>
              <Form.Control
                type="search"
                placeholder="search for a product..."
                value={searchProducts}
                onChange={(event) => {
                  setSearchProducts(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
          </div>

          {error && <div className="error-message">{error}</div>}

          <Row className="g-3 mt-4">
            <p className="fw-bold mb-0">All products</p>
            <p className="text-muted mt-0">
              Showing {filteredTotal === 0 ? 0 : skip + 1}-
              {Math.min(skip + limit, filteredTotal)} of {filteredTotal}
            </p>
            {loading ? (
              <Col className="fs-3">
                <h1>Loading...</h1>
              </Col>
            ) : filteredTotal === 0 ? (
              <Col>
                <h1 className="text-center">Product not found</h1>
              </Col>
            ) : (
              paginatedProducts.map((product) => (
                <Col key={product.id} md={2} lg={3} xl={4}>
                  <Link
                    to={`/product-details/${product.id}`}
                    className="text-decoration-none"
                  >
                    <Card
                      className="position-relative p-1"
                      style={{ cursor: "pointer" }}
                    >
                      <Card.Img
                        src={product.thumbnail}
                        variant="top"
                        alt={product.title}
                      />
                      <Card.Footer className="justify-content-end gap-3 align-items-center p-1">
                        <Card.Title>{product.title}</Card.Title>
                        <Card.Text className="text-muted">
                          {product.description}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Card.Text className="fw-bold text-success">
                            ${product.price}
                          </Card.Text>
                          <div className="d-flex gap-2">
                            <Button
                              variant="dark"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                dispatch(addToCart(product));
                              }}
                            >
                              Add to card
                            </Button>
                          </div>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Link>
                </Col>
              ))
            )}
          </Row>

          {filteredTotal != 0 && (
            <Pagination className="d-flex flex-wrap justify-content-center my-3">
              {currentPage != 1 && (
                <Pagination.First onClick={() => updatePagination(1)} />
              )}
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => updatePagination(currentPage - 1)}
              />

              {Array.from({ length: filteredTotalPages }).map((item, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => updatePagination(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === filteredTotalPages}
                onClick={() => updatePagination(currentPage + 1)}
              />
              {currentPage != filteredTotalPages && (
                <Pagination.Last
                  onClick={() => updatePagination(filteredTotalPages)}
                />
              )}
            </Pagination>
          )}
        </Col>
      </Row>
    </Container>
  );
}
