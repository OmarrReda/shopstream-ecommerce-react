import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Badge,
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
import {
  FaUsers,
  FaUserShield,
  FaUserSlash,
  FaUserPlus,
  FaSearch,
  FaPencilAlt,
  FaTrash,
} from "react-icons/fa";

const STORAGE_KEY = "adminUsers";

const emptyUser = {
  firstName: "",
  lastName: "",
  email: "",
  role: "Customer",
  status: "Active",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [formUser, setFormUser] = useState(emptyUser);
  const [formError, setFormError] = useState("");

  const usersPerPage = 10;

  // Load users from local storage or DummyJSON.
  useEffect(() => {
    async function fetchUsers() {
      try {
        const savedUsers = localStorage.getItem(STORAGE_KEY);

        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
          return;
        }

        const response = await axios.get("https://dummyjson.com/users?limit=0");

        const apiUsers = response.data.users.map((user) => ({
          ...user,
          role: user.role === "admin" ? "Admin" : "Customer",
          status: "Active",
        }));

        // Include locally registered/current users if available.
        const localUsers = [
          localStorage.getItem("registeredUser"),
          localStorage.getItem("user"),
        ]
          .filter(Boolean)
          .map((value) => {
            try {
              return JSON.parse(value);
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        const mergedUsers = [...apiUsers];

        localUsers.forEach((user) => {
          const alreadyExists = mergedUsers.some(
            (existing) =>
              existing.email?.toLowerCase() === user.email?.toLowerCase(),
          );

          if (user.email && !alreadyExists) {
            mergedUsers.push({
              ...user,
              id: user.id ?? `local-${user.email}`,
              role: user.role === "admin" ? "Admin" : "Customer",
              status: "Active",
            });
          }
        });

        setUsers(mergedUsers);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedUsers));
      } catch (error) {
        console.error("Failed to load users:", error);
        setFormError("Could not load users. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  function saveUsers(updatedUsers) {
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  }

  function openAddModal() {
    setFormUser({ ...emptyUser });
    setFormError("");
    setShowAdd(true);
  }

  function openEditModal(user) {
    setSelectedUser(user);
    setFormUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "Customer",
      status: user.status || "Active",
    });
    setFormError("");
    setShowEdit(true);
  }

  function validateUser() {
    if (
      !formUser.firstName.trim() ||
      !formUser.lastName.trim() ||
      !formUser.email.trim()
    ) {
      setFormError("Please fill in the name and email fields.");
      return false;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formUser.email.trim());

    if (!validEmail) {
      setFormError("Please enter a valid email address.");
      return false;
    }

    const duplicateEmail = users.some(
      (user) =>
        user.email?.toLowerCase() === formUser.email.trim().toLowerCase() &&
        user.id !== selectedUser?.id,
    );

    if (duplicateEmail) {
      setFormError("A user with this email already exists.");
      return false;
    }

    return true;
  }

  function handleAddUser() {
    setFormError("");

    if (!validateUser()) return;

    const newUser = {
      ...formUser,
      id: `local-${Date.now()}`,
      email: formUser.email.trim(),
      firstName: formUser.firstName.trim(),
      lastName: formUser.lastName.trim(),
      image: "",
      createdAt: new Date().toISOString(),
    };

    saveUsers([newUser, ...users]);
    setCurrentPage(1);
    setSearchTerm("");
    setRoleFilter("All");
    setStatusFilter("All");
    setShowAdd(false);
    setFormUser({ ...emptyUser });
  }

  function handleSaveEdit() {
    setFormError("");

    if (!validateUser()) return;

    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id
        ? {
            ...user,
            ...formUser,
            firstName: formUser.firstName.trim(),
            lastName: formUser.lastName.trim(),
            email: formUser.email.trim(),
          }
        : user,
    );

    saveUsers(updatedUsers);
    setShowEdit(false);
    setSelectedUser(null);
  }

  function handleDeleteUser() {
    if (!selectedUser) return;

    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);

    saveUsers(updatedUsers);

    const filteredCount = updatedUsers.filter(matchesFilters).length;
    const lastPage = Math.max(1, Math.ceil(filteredCount / usersPerPage));

    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
    }

    setShowDelete(false);
    setSelectedUser(null);
  }

  function matchesFilters(user) {
    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();

    const matchesSearch = `${fullName} ${user.email || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  }

  const filteredUsers = useMemo(
    () => users.filter(matchesFilters),
    [users, searchTerm, roleFilter, statusFilter],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage),
  );

  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  const adminCount = users.filter((user) => user.role === "Admin").length;
  const inactiveCount = users.filter(
    (user) => user.status === "Inactive",
  ).length;

  const newUsersCount = users.filter((user) => {
    if (!user.createdAt) return false;

    const createdAt = new Date(user.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return createdAt >= sevenDaysAgo;
  }).length;

  const stats = [
    {
      title: "TOTAL USERS",
      value: users.length.toLocaleString(),
      icon: <FaUsers />,
      color: "#5546ed",
    },
    {
      title: "ADMINS",
      value: adminCount.toLocaleString(),
      icon: <FaUserShield />,
      color: "#15966a",
    },
    {
      title: "INACTIVE",
      value: inactiveCount.toLocaleString(),
      icon: <FaUserSlash />,
      color: "#e15b5b",
    },
    {
      title: "NEW SIGNUPS",
      value: `+${newUsersCount}`,
      icon: <FaUserPlus />,
      color: "#5546ed",
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
          <h3 className="fw-bold mb-1">User Directory</h3>
          <p className="text-muted small mb-0">Home › Admin › Customers</p>
        </Col>

        <Col xs={12} lg="auto">
          <div className="d-flex gap-2">
            <div className="position-relative flex-grow-1">
              <FaSearch
                className="position-absolute text-secondary"
                style={{ left: 12, top: 11, zIndex: 1 }}
                size={12}
              />
              <Form.Control
                size="sm"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: 32, minWidth: 150 }}
              />
            </div>

            <Button size="sm" variant="primary" onClick={openAddModal}>
              <FaUserPlus className="me-1" />
              Add New User
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistics */}
      <Row className="g-3 mb-4">
        {stats.map((stat) => (
          <Col key={stat.title} xs={6} xl={3}>
            <Card className="border shadow-sm h-100">
              <Card.Body className="d-flex align-items-center gap-3 p-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 40,
                    height: 40,
                    color: stat.color,
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </div>

                <div>
                  <div
                    className="text-muted fw-semibold"
                    style={{ fontSize: 10 }}
                  >
                    {stat.title}
                  </div>
                  <h5 className="fw-bold mb-0">{stat.value}</h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Search filters */}
      <Card className="border shadow-sm mb-3">
        <Card.Body className="d-flex gap-3 flex-wrap align-items-center py-2">
          <Form.Select
            size="sm"
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              setCurrentPage(1);
            }}
            style={{ width: 160 }}
          >
            <option value="All">All roles</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </Form.Select>

          <Form.Select
            size="sm"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            style={{ width: 160 }}
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Form.Select>

          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("All");
              setStatusFilter("All");
              setCurrentPage(1);
            }}
          >
            Clear filters
          </Button>
        </Card.Body>
      </Card>

      {/* User table */}
      <Card className="border shadow-sm mb-4">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead>
              <tr>
                {["USER", "EMAIL ADDRESS", "ROLE", "STATUS", "ACTIONS"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="text-muted px-3 py-3 text-nowrap"
                      style={{ fontSize: 10 }}
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    Loading users...
                  </td>
                </tr>
              ) : visibleUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-5">
                    No users found.
                  </td>
                </tr>
              ) : (
                visibleUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3 py-3">
                      <div className="d-flex align-items-center gap-2">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt=""
                            className="rounded-circle"
                            style={{
                              width: 34,
                              height: 34,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: 34,
                              height: 34,
                              color: "#5546ed",
                              fontSize: 11,
                            }}
                          >
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </div>
                        )}

                        <div>
                          <div className="fw-semibold small">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-muted" style={{ fontSize: 10 }}>
                            {user.createdAt
                              ? `Joined ${new Date(user.createdAt).toLocaleDateString()}`
                              : "ShopStream user"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 small text-nowrap">{user.email}</td>

                    <td className="px-3">
                      <Badge
                        pill
                        bg={user.role === "Admin" ? "primary" : "secondary"}
                        className="bg-opacity-10"
                        style={{
                          color: user.role === "Admin" ? "#5546ed" : "#65718a",
                        }}
                      >
                        {user.role}
                      </Badge>
                    </td>

                    <td className="px-3">
                      <span
                        className="small text-nowrap"
                        style={{
                          color:
                            user.status === "Active" ? "#15966a" : "#7b8190",
                        }}
                      >
                        ● {user.status}
                      </span>
                    </td>

                    <td className="px-3">
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="transparent"
                          title="Edit user"
                          onClick={() => openEditModal(user)}
                        >
                          <FaPencilAlt size={12} />
                        </Button>

                        <Button
                          size="sm"
                          className="text-danger"
                          variant="transparent"
                          title="Delete user"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDelete(true);
                          }}
                        >
                          <FaTrash size={12} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>

        <Card.Footer className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <small className="text-muted">
            Showing{" "}
            {filteredUsers.length === 0
              ? 0
              : (currentPage - 1) * usersPerPage + 1}{" "}
            to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            />
          </Pagination>
        </Card.Footer>
      </Card>

      {/* Add user modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <UserForm
            formUser={formUser}
            setFormUser={setFormUser}
            error={formError}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit user modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <UserForm
            formUser={formUser}
            setFormUser={setFormUser}
            error={formError}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowEdit(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        centered
        dialogClassName="modal-dialog-centered"
      >
        <Modal.Body className="text-center p-4">
          <div
            className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: 48,
              height: 48,
              color: "#d93030",
            }}
          >
            <FaTrash size={20} />
          </div>

          <h5 className="fw-bold">Delete User Account?</h5>
          <p className="text-muted small">
            This action cannot be undone. The user will be removed from this
            local admin directory.
          </p>

          {selectedUser && (
            <div className="rounded border p-3 text-start mb-3">
              <strong>
                {selectedUser.firstName} {selectedUser.lastName}
              </strong>
              <div className="small text-muted">{selectedUser.email}</div>
              <Badge bg="secondary" className="mt-2">
                {selectedUser.role}
              </Badge>
            </div>
          )}

          <div className="d-flex gap-2">
            <Button
              className="flex-grow-1"
              variant="outline-secondary"
              onClick={() => setShowDelete(false)}
            >
              Go Back
            </Button>
            <Button
              className="flex-grow-1"
              variant="danger"
              onClick={handleDeleteUser}
            >
              <FaTrash className="me-2" />
              Delete User
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

function UserForm({ formUser, setFormUser, error }) {
  function updateField(field, value) {
    setFormUser((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  return (
    <Form>
      <Row className="g-3">
        <Col sm={6}>
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              value={formUser.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              placeholder="First name"
            />
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              value={formUser.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              placeholder="Last name"
            />
          </Form.Group>
        </Col>

        <Col xs={12}>
          <Form.Group>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={formUser.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="user@example.com"
            />
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group>
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={formUser.role}
              onChange={(event) => updateField("role", event.target.value)}
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formUser.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {error && <div className="text-danger small mt-3">{error}</div>}
    </Form>
  );
}
