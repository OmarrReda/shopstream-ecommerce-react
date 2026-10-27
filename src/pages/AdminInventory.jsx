import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    brand: "",
    thumbnail: "",
  });

  const productsPerPage = 4;

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
        setProducts(products);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      const URL = `https://dummyjson.com/products/category-list`;
      try {
        const response = await axios.get(URL);
        setCategories(response.data);
      } catch (err) {
        console.log("Couldn't fetch categories", err);
      }
    }
    fetchCategories();
  }, []);

  async function handleAddProduct() {
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      };

      const response = await axios.post(
        "https://dummyjson.com/products/add",
        productData,
      );

      const createdProduct = response.data;

      // Add the new product to the existing list
      const updatedProducts = [...products, createdProduct];

      setProducts(updatedProducts);

      // Persist the product locally
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      // Navigate to the last page to see the new product
      setCurrentPage(Math.ceil(updatedProducts.length / productsPerPage));

      // Close the modal and reset the form
      setShowAdd(false);

      setNewProduct({
        title: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        brand: "",
        thumbnail: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }

  function handleEdit(product) {
    setSelectedProduct({ ...product });
    setShowEdit(true);
  }

  function handleSave() {
    const updatedProduct = {
      ...selectedProduct,
      price: Number(selectedProduct.price),
      stock: Number(selectedProduct.stock),
    };

    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product,
    );

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setShowEdit(false);
    setSelectedProduct(null);
  }

  function saveDelete() {
    const updatedProducts = products.filter(
      (product) => product.id !== selectedProduct.id,
    );

    setProducts(updatedProducts);

    localStorage.setItem("products", JSON.stringify(updatedProducts));

    const updatedTotalPages = Math.max(
      1,
      Math.ceil(updatedProducts.length / productsPerPage),
    );

    if (currentPage > updatedTotalPages) {
      setCurrentPage(updatedTotalPages);
    }

    setShowDelete(false);
    setSelectedProduct(null);
  }

  const filteredProducts = products.filter((product) =>
    `${product.title} ${product.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  return (
    <Container className="m-3   ">
      <div className="d-flex justify-content-between  align-items-center">
        <div>
          <h2 className="mb-0">Product Inventory</h2>
          <p className="text-muted mt-0">
            Manage your catalog, stock levels, and pricing.{" "}
          </p>
        </div>
        <div>
          <Button
            variant="success"
            className="px-3"
            onClick={() => setShowAdd(true)}
          >
            + Add New Product
          </Button>
        </div>
      </div>

      <Form.Control
        type="text"
        placeholder="search products..."
        value={searchTerm}
        className="mb-3"
        style={{ maxWidth: "280px" }}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      <Card className="border shadow-sm mb-4">
        <Card.Body className="p-0">
          <Table
            striped
            bordered
            hover
            responsive
            className="mb-0 align-middle"
          >
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Row className="align-items-center">
                      <Col md={3}>
                        <img
                          src={product.thumbnail}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "contain",
                          }}
                          alt=""
                        />
                      </Col>
                      <Col md={9}>
                        <p className="fw-bold mb-0">{product.title}</p>
                      </Col>
                    </Row>
                  </td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td className="text-center">
                    <Button
                      variant="transparent"
                      onClick={() => handleEdit(product)}
                    >
                      {" "}
                      <FaPencilAlt color="" />{" "}
                    </Button>
                    <Button
                      variant="transparent"
                      onClick={() => {
                        (setShowDelete(true), setSelectedProduct(product));
                      }}
                    >
                      {" "}
                      <FaTrash color="red" />{" "}
                    </Button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <h3>No products found</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <small className="text-muted">
            Showing{" "}
            {filteredProducts.length === 0
              ? 0
              : (currentPage - 1) * productsPerPage + 1}{" "}
            to{" "}
            {Math.min(currentPage * productsPerPage, filteredProducts.length)}{" "}
            of {filteredProducts.length} products
          </small>

          <Pagination size="sm" className="mb-0">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            />

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1,
              )
              .map((page) => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Pagination.Item>
              ))}

            <Pagination.Next
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((page) => page + 1)}
            />
          </Pagination>
        </Card.Footer>
      </Card>

      {/* add a product */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Title</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.title}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    title: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    category: e.target.value,
                  })
                }
                required
              >
                <option value="">Select a category</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="1"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.brand}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    brand: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thumbnail URL</Form.Label>
              <Form.Control
                type="url"
                value={newProduct.thumbnail}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    thumbnail: e.target.value,
                  })
                }
              />
            </Form.Group>

            {newProduct.thumbnail && (
              <img
                src={newProduct.thumbnail}
                alt="Product preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                }}
              />
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleAddProduct}
            disabled={
              !newProduct.title.trim() ||
              !newProduct.category ||
              newProduct.price === "" ||
              Number(newProduct.price) <= 0 ||
              newProduct.stock === "" ||
              !Number.isInteger(Number(newProduct.stock)) ||
              Number(newProduct.stock) < 0
            }
          >
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* edit product */}
      <Modal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        centered
        size="lg"
      >
        <Modal.Header className="bg-light d-flex flex-column">
          <Modal.Title>Edit Product</Modal.Title>
          <p className="text-muted">
            update details for {selectedProduct?.title}
          </p>
        </Modal.Header>

        {selectedProduct && (
          <>
            <Modal.Body>
              <Row>
                <Col
                  md={6}
                  className="d-flex flex-column justify-content-center align-items-center "
                >
                  <h3 className="text-muted fw-light">Product Images</h3>
                  <img
                    src={selectedProduct.thumbnail}
                    style={{
                      width: "250px",
                      height: "250px",
                      objectFit: "contain",
                    }}
                    alt=""
                  />
                </Col>
                <Col md={6}>
                  <Form>
                    <Form.Group>
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        value={selectedProduct.title}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            title: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={selectedProduct.category}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            category: e.target.value,
                          })
                        }
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        value={selectedProduct.price}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            price: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="text"
                        min="0"
                        value={selectedProduct.stock}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            stock: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={selectedProduct.description}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            description: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between align-items-center">
              <Button variant="secondary" onClick={() => setShowEdit(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* delete product */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Body className="text-center">
          <Modal.Title>Delete Product?</Modal.Title>
          <Modal.Dialog>
            This action is permanent and cannot be undone. All data associated
            with this product will be removed from the store's inventory.
          </Modal.Dialog>
          <div>
            {selectedProduct && (
              <Row className="align-items-center">
                <Col md={3}>
                  <img
                    src={selectedProduct.thumbnail}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                    alt=""
                  />
                </Col>
                <Col md={9}>
                  <p className="fw-bold mb-0">{selectedProduct.title}</p>
                </Col>
              </Row>
            )}
          </div>
          <div className="d-flex align-items-center justify-content-center mt-3 gap-4">
            <Button
              onClick={() => setShowDelete(false)}
              variant="outline-primary"
            >
              Cancel
            </Button>
            <Button onClick={saveDelete} variant="danger">
              delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
