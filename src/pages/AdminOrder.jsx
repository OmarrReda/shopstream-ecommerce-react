import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import {
  FaSearch,
  FaFilter,
  FaShoppingCart,
  FaMoneyBillWave,
  FaStopwatch,
  FaChartLine,
  FaDownload,
  FaEllipsisV,
  FaBell,
  FaTimes,
} from "react-icons/fa";

const cartData = [
  {
    id: "#CRT-88210",
    initials: "JD",
    user: "Jane Doe",
    email: "jane.doe@example.com",
    items: 4,
    price: 249.99,
    status: "Completed",
  },
  {
    id: "#CRT-88209",
    initials: "AS",
    user: "Alex Smith",
    email: "a.smith@techcorp.io",
    items: 12,
    price: 1120,
    status: "Pending",
  },
  {
    id: "#CRT-88208",
    initials: "MR",
    user: "Maria Rodriguez",
    email: "m.rod@email.com",
    items: 2,
    price: 59.5,
    status: "Completed",
  },
  {
    id: "#CRT-88207",
    initials: "BL",
    user: "Ben Lee",
    email: "benny.lee@design.co",
    items: 1,
    price: 3400,
    status: "Abandoned",
  },
];

const stats = [
  {
    title: "ACTIVE CARTS",
    value: "1,284",
    change: "+12.5%",
    icon: <FaShoppingCart />,
    color: "#5546ed",
    positive: true,
  },
  {
    title: "POTENTIAL REV.",
    value: "$42,910",
    change: "+8.2%",
    icon: <FaMoneyBillWave />,
    color: "#15966a",
    positive: true,
  },
  {
    title: "AVG. SESSION",
    value: "14m 32s",
    change: "-2.1%",
    icon: <FaStopwatch />,
    color: "#7164ed",
    positive: false,
  },
  {
    title: "ABANDON RATE",
    value: "34.2%",
    change: "+4.5%",
    icon: <FaChartLine />,
    color: "#df514f",
    positive: false,
  },
];

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const filteredCarts = cartData.filter((cart) => {
    const matchesSearch = `${cart.id} ${cart.user} ${cart.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || cart.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filteredCarts.length / pageSize));
  const visibleCarts = filteredCarts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const alerts = [
    {
      id: 1,
      title: "Payment gateway response time is optimal (142ms).",
      color: "#15966a",
    },
    {
      id: 2,
      title: "Unusually large cart [#CRT-88209] flagged for verification.",
      color: "#df514f",
    },
  ];

  return (
    <Container
      fluid
      className="p-3 p-lg-4"
      style={{ minHeight: "100vh" }}
    >
      {/* Header */}
      <Row className="align-items-center g-3 mb-4">
        <Col>
          <h3 className="fw-bold mb-1">Cart Management</h3>
          <p className="text-muted small mb-0">
            Oversee and monitor all customer shopping activity.
          </p>
        </Col>

        <Col xs={12} lg="auto">
          <div className="d-flex gap-2">
            <div className="position-relative flex-grow-1">
              <FaSearch
                className="position-absolute text-secondary"
                style={{ top: "12px", left: "12px", zIndex: 1 }}
                size={12}
              />
              <Form.Control
                size="sm"
                placeholder="Search carts, users, or IDs..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: "32px", minWidth: "150px" }}
              />
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="me-1" /> Filter
            </Button>
          </div>
        </Col>
      </Row>

      {showFilters && (
        <Card className="border-0 shadow-sm mb-3">
          <Card.Body className="d-flex align-items-center gap-3 flex-wrap">
            <Form.Label className="mb-0">Cart status:</Form.Label>
            <Form.Select
              size="sm"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: "200px" }}
            >
              <option>All</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Abandoned</option>
            </Form.Select>

            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => {
                setStatusFilter("All");
                setSearchTerm("");
                setCurrentPage(1);
              }}
            >
              Clear filters
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Stats */}
      <Row className="g-3 mb-4">
        {stats.map((stat) => (
          <Col key={stat.title} xs={12} sm={6} xl={3}>
            <Card
              className="h-100 border shadow-sm"
            >
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div
                    className="rounded p-2"
                    style={{ color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <small
                    className="fw-semibold"
                    style={{ color: stat.positive ? "#15966a" : "#df514f" }}
                  >
                    {stat.change}
                  </small>
                </div>

                <div
                  className="text-muted fw-semibold"
                  style={{ fontSize: "10px" }}
                >
                  {stat.title}
                </div>
                <h3 className="fw-bold mb-0 mt-1">{stat.value}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Cart activity */}
      <Card
        className="border shadow-sm mb-4"
      >
        <Card.Header className="py-3 d-flex justify-content-between align-items-center">
          <span className="fw-semibold small">Recent Cart Activity</span>
          <div className="d-flex gap-3 text-secondary">
            <FaDownload role="button" title="Export cart activity" />
            <FaEllipsisV role="button" title="More options" />
          </div>
        </Card.Header>

        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              {[
                "CART ID",
                "USER",
                "TOTAL ITEMS",
                "TOTAL PRICE",
                "STATUS",
                "ACTIONS",
              ].map((heading) => (
                <th
                  key={heading}
                  className="text-muted fw-semibold text-nowrap px-3 py-3"
                  style={{ fontSize: "10px" }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleCarts.map((cart) => (
              <tr key={cart.id}>
                <td className="px-3 py-3">
                  <span
                    className="fw-semibold"
                    style={{ color: "#5546ed", fontSize: "12px" }}
                  >
                    {cart.id}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: "30px",
                        height: "30px",
                        fontSize: "10px",
                        color: "#5546ed",
                        flexShrink: 0,
                      }}
                    >
                      {cart.initials}
                    </div>
                    <div>
                      <div
                        className="fw-semibold text-nowrap"
                        style={{ fontSize: "12px" }}
                      >
                        {cart.user}
                      </div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>
                        {cart.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3 small text-nowrap">
                  {cart.items} {cart.items === 1 ? "item" : "items"}
                </td>

                <td className="px-3 py-3 fw-bold text-nowrap">
                  $
                  {cart.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td className="px-3 py-3">
                  <Badge
                    pill
                    bg={
                      cart.status === "Completed"
                        ? "success"
                        : cart.status === "Pending"
                          ? "primary"
                          : "danger"
                    }
                    className="bg-opacity-10"
                    style={{
                      color:
                        cart.status === "Completed"
                          ? "#15966a"
                          : cart.status === "Pending"
                            ? "#5069ad"
                            : "#c84444",
                    }}
                  >
                    ● {cart.status}
                  </Badge>
                </td>

                <td className="px-3 py-3">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="py-1"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}

            {visibleCarts.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-5">
                  No carts match your search.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Card.Footer className="d-flex flex-wrap gap-2 justify-content-between align-items-center py-3">
          <small className="text-muted">
            Showing{" "}
            {filteredCarts.length ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
            {Math.min(currentPage * pageSize, filteredCarts.length)} of 1,284
            results
          </small>

          <Pagination size="sm" className="mb-0">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            />

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Pagination.Item>
              ),
            )}

            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            />
          </Pagination>
        </Card.Footer>
      </Card>

      {/* Bottom panels */}
      <Row className="g-3">
        <Col xs={12} xl={7}>
          <Card
            className="h-100 border shadow-sm"
            style={{ borderColor: "#e4e5f1" }}
          >
            <Card.Body className="p-3 p-lg-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    color: "#5546ed",
                    minWidth: "40px",
                    height: "40px",
                  }}
                >
                  <FaChartLine size={20} />
                </div>
                <div>
                  <Badge bg="primary" className="mb-1">
                    INSIGHTS
                  </Badge>
                  <h6 className="fw-bold mb-0">Abandoned Cart Recovery</h6>
                </div>
              </div>

              <Row className="g-3 align-items-center">
                <Col xs={12} sm={4}>
                  <div
                    className="rounded d-flex align-items-center justify-content-center text-white"
                    style={{
                      minHeight: "120px",
                      background: "linear-gradient(135deg, #202f43, #476a8c)",
                    }}
                  >
                    <FaChartLine size={38} />
                  </div>
                </Col>
                <Col xs={12} sm={8}>
                  <p className="text-muted small mb-3">
                    Our AI detected a 14% increase in abandoned high-value carts
                    this week. Consider launching an automated “Complete Your
                    Purchase” email campaign with a 5% discount incentive.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    onClick={() =>
                      alert("Campaign settings will be available soon.")
                    }
                  >
                    View Campaign Settings →
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} xl={5}>
          <Card
            className="h-100 text-white border-0 shadow"
            style={{ background: "#252d3b" }}
          >
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <FaBell />
                <span
                  className="rounded-circle"
                  style={{ width: "7px", height: "7px", background: "#27d6a0" }}
                />
              </div>

              <h6 className="fw-bold mb-3">System Alerts</h6>

              {alerts
                .filter((alert) => !dismissedAlerts.includes(alert.id))
                .map((alert) => (
                  <div
                    key={alert.id}
                    className="d-flex gap-2 mb-3 ps-2"
                    style={{ borderLeft: `2px solid ${alert.color}` }}
                  >
                    <small className="text-white-50 flex-grow-1">
                      {alert.title}
                    </small>
                    <FaTimes
                      role="button"
                      size={11}
                      className="text-white-50 mt-1"
                      onClick={() =>
                        setDismissedAlerts((previous) => [
                          ...previous,
                          alert.id,
                        ])
                      }
                    />
                  </div>
                ))}

              <Button
                variant="secondary"
                className="w-100 mt-2"
                onClick={() =>
                  setDismissedAlerts(alerts.map((alert) => alert.id))
                }
              >
                Dismiss All
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
