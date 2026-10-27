import { Button, Card, Container, Form } from "react-bootstrap";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { login } from "../components/store/slices/userSlices";

export default function Login() {
  const isDark = useSelector((state) => state.theme.isDark);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [staySignedIn, setStaySignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const userRef = useRef();
  const passRef = useRef();

  async function handleLogin(e) {
    e.preventDefault();

    const identifier = userRef.current.value.trim();
    const password = passRef.current.value.trim();

    const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!identifier || !password) {
      toast.error("Please enter username/email And passowrd");
      return;
    }

    if (identifier === "admin" && password === "admin"){
      const adminUser = {
        id: 0,
        username: "admin",
        email: "admin@shopstream.com",
        fullName: "Admin",
        role: "admin"
      };

      const adminToken = "admin-token";

      localStorage.setItem("accessToken", adminToken);
        localStorage.setItem("user", JSON.stringify(adminUser));
        localStorage.setItem("staySignedIn", JSON.stringify(staySignedIn));
        localStorage.setItem("loginTime", Date.now().toString());

        dispatch(login({ user: adminUser, accessToken: adminToken }));

        toast.success("admin logged in successfully");

        navigate("/admin");
        return;

    }

    if(registeredUser){
      const isMatchingUsername = identifier === registeredUser.userName;
      const isMatchingEmail = identifier === registeredUser.email;
      const isMatchingPassword = password === registeredUser.password;

      if((isMatchingUsername || isMatchingEmail) && isMatchingPassword){
        console.log("mock registered user login");

        const userData = {
          id: Date.now(),
          username: registeredUser.userName,
          email: registeredUser.email,
          fullName: registeredUser.fullName,
          role: "user"
        };

        const mockToken = `mock-token-${Date.now()}`;

        localStorage.setItem("accessToken", mockToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("staySignedIn", JSON.stringify(staySignedIn));
        localStorage.setItem("loginTime", Date.now().toString());

        dispatch(login({ user: userData, accessToken: mockToken }));

        toast.success("logged in successfully");

        navigate("/");
        return;

      };

    };

    try {
      setLoading(true);

      let username = identifier;

      //if user entered an email
      if (identifier.includes("@")) {
        const response = await axios.get(
          `https://dummyjson.com/users/filter?key=email&value=${encodeURIComponent(identifier)}`,
        );

        const users = response.data.users;

        if (users.length === 0) {
          toast.error("No account found with this email");
          return;
        }

        username = users[0].username;
      }

      const loginData = {
        username: username,
        password: password,
      };

      const URL = "https://dummyjson.com/user/login";
      const logInResponse = await axios.post(URL, loginData);
      console.log(logInResponse.data);
      const userData = {
        ...logInResponse.data,
        role: "user"
      }

      //store token
      localStorage.setItem("accessToken", userData.accessToken);

      //store user information
      localStorage.setItem("user", JSON.stringify(userData));

      //Store if user selected "stay signed in"
      localStorage.setItem("staySignedIn", JSON.stringify(staySignedIn));

      //store time of login
      localStorage.setItem("loginTime", Date.now().toString());

      dispatch(login({ user: userData, accessToken: userData.accessToken }));

      toast.success("logged in successfully");

      navigate("/");
    } catch (err) {
      console.log(err);

      if (err.response) {
        toast.error(
          err.response.data?.message || "Invalid username Or Password",
        );
      } else {
        toast.error("Something went wrong please try again");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: "450px" }}>
        <Card.Body>
          <h1 className="text-center">Welcome Back</h1>
          <p className="text-center text-muted">
            Please enter your details to sign in.
          </p>
          <Form className="p-2" onSubmit={handleLogin}>
            <Form.Group>
              <Form.Label>Username/email</Form.Label>
              <Form.Control
                bg={isDark ? "dark" : "light"}
                data-bs-theme={isDark ? "dark" : "light"}
                type="text"
                placeholder="johndoe"
                ref={userRef}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                bg={isDark ? "dark" : "light"}
                data-bs-theme={isDark ? "dark" : "light"}
                type="password"
                placeholder="password..."
                ref={passRef}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Stay signed in for 30 days"
              className="text-muted mt-2"
              onChange={(e) => setStaySignedIn(e.target.checked)}
            />
            <Button
              type="submit"
              className="w-100 bg-primary mt-3"
              disabled={loading}
            >
              {loading ? "signing in" : "Sign in "}
              {!loading && <FaArrowRightLong />}
            </Button>
          </Form>
          <p className="text-center text-muted mt-2">
            Dont't have an account?{" "}
            <span>
              <Link to="/register" style={{ textDecoration: "none" }}>
                Register
              </Link>
            </span>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
