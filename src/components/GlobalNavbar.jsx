import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggle } from "./store/slices/themeSlice";
import { BsCart4 } from "react-icons/bs";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { logout } from "./store/slices/userSlices";
import { IoLogOutOutline } from "react-icons/io5";

export default function GlobalNavbar() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user)

  function handleLogout() {
    //remove auth data + session persistence
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("staySignedIn");
    localStorage.removeItem("loginTime");

    //clear redux states
    dispatch(logout());

    //refresh back to home
    window.location.href = "/";
  }

  return (
    <Navbar
      expand="lg"
      bg={isDark ? "dark" : "light"}
      data-bs-theme={isDark ? "dark" : "light"}
      className="border-bottom border-3 fixed-top"
    >
      <Container>
        <Navbar.Brand as={Link} to={"/"} className="text-primary fw-bold">
          ShopStream
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to={"/"}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to={"/products"}>
              Products
            </Nav.Link>
            {user?.role === "admin" && (
              <Nav.Link as={Link} to={"/admin"}>
                Dashboard
              </Nav.Link>
            )}
          </Nav>
          <div className="d-flex align-items-center ms-auto gap-2">
            <Nav.Link as={Link} to={"/cart"} className="me-3">
            <div className="position-relative">
              <BsCart4 size={22}/>
              
              {cartItems.length > 0 && (
                <span className="position-absolute top-0 translate-middle bg-success rounded-circle text-center text-white" style={{width:"10px", fontSize:"10px"}}>
                  {cartItems.length}
                </span>
              )}

            </div>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to={isAuthenticated ? "/userProfile" : "/login"}
            >
              <span>
                <FaRegUserCircle />
              </span>
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link onClick={handleLogout}>
                <IoLogOutOutline />
              </Nav.Link>
            )}
            <Button
              onClick={() => dispatch(toggle())}
              variant={isDark ? "dark" : "light"}
            >
              {isDark ? (
                <MdOutlineDarkMode />
              ) : (
                <MdOutlineLightMode color="orange" />
              )}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
