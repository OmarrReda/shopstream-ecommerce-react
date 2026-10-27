import { useRef, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { login } from "../components/store/slices/userSlices";

export default function Register() {
  const [staySignedIn, setStaySignedIn] = useState(false);

  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);

  const nameRef = useRef();
  const userRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const confirmPassRef = useRef();

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    const fullName = nameRef.current.value.trim();
    const userName = userRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passRef.current.value.trim();
    const confirmPassword = confirmPassRef.current.value.trim();

    //validate fields

    if (!fullName || !userName || !email || !password || !confirmPassRef) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password != confirmPassword) {
      toast.error("passwords do not match");
      return;
    }
    const registeredUser = {
      fullName: fullName,
      userName: userName,
      email: email,
      password: password,
    };

    try {
      localStorage.setItem("registeredUser", JSON.stringify(registeredUser));

      const userData = {
        id: Date.now(),
        username: registeredUser.userName,
        email: registeredUser.email,
        fullName: registeredUser.fullName
      };

      const mockToken = `mock-token-${Date.now()}`;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", mockToken);
      localStorage.setItem("staySignedIn", JSON.stringify(staySignedIn));
      localStorage.setItem("loginTime", Date.now().toString());

      dispatch(login({ user: userData, accessToken: mockToken }));
      toast.success("logged in successfully");
      navigate("/");
      return;
    } catch (err) {
      console.log(err);
      toast.error("Could not create account");
    }

    try {
      const URL = "https://dummyjson.com/users/add";
      const response = await axios.post(URL, registeredUser);
      console.log(response.data);

      localStorage.setItem("registeredUser", JSON.stringify(registeredUser));

      toast.success("Account Created Successfully");
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error("Could not create account");
    }
  }

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: "450px" }}>
        <Card.Body>
          <h1 className="text-center">Create Account</h1>
          <p className="text-center text-muted">
            Join Shopstream for a personalized shopping experience.
          </p>
          <Form className="p-2" onSubmit={handleRegister}>
            <Form.Group>
              <Form.Label>Full name</Form.Label>
              <Form.Control
                bg={isDark ? "dark" : "light"}
                data-bs-theme={isDark ? "dark" : "light"}
                type="text"
                placeholder="John doe"
                ref={nameRef}
              />
            </Form.Group>
            <div className="d-flex justify-content-center align-items-center gap-3 mt-2 mb-2">
              <Form.Group className="d-flex flex-column">
                <Form.Label className="mb-0">Username</Form.Label>
                <Form.Control
                  bg={isDark ? "dark" : "light"}
                  data-bs-theme={isDark ? "dark" : "light"}
                  type="text"
                  placeholder="Johndoe"
                  ref={userRef}
                />
              </Form.Group>
              <Form.Group className="d-flex flex-column">
                <Form.Label className="mb-0">Email</Form.Label>
                <Form.Control
                  bg={isDark ? "dark" : "light"}
                  data-bs-theme={isDark ? "dark" : "light"}
                  type="email"
                  placeholder="john@example.com"
                  ref={emailRef}
                />
              </Form.Group>
            </div>
            <Form.Group>
              <Form.Label className="mb-1">Password</Form.Label>
              <Form.Control
                className="mb-3"
                bg={isDark ? "dark" : "light"}
                data-bs-theme={isDark ? "dark" : "light"}
                type="password"
                placeholder="*********"
                ref={passRef}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="mb-1">Confirm Password</Form.Label>
              <Form.Control
                className="mb-3"
                bg={isDark ? "dark" : "light"}
                data-bs-theme={isDark ? "dark" : "light"}
                type="password"
                placeholder="*********"
                ref={confirmPassRef}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Stay signed in for 30 days"
              className="text-muted mt-2"
              onChange={(e) => setStaySignedIn(e.target.checked)}
            />
            <Button type="submit" className="w-100 bg-primary mt-3">
              Sign in <FaArrowRightLong />
            </Button>
          </Form>
          <p className="text-center text-muted mt-2">
            Already have an account?{" "}
            <span>
              <Link to="/login" style={{ textDecoration: "none" }}>
                Sign in
              </Link>
            </span>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
