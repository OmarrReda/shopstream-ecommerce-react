import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import Cart from "./pages/Cart";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthInitializer from "./components/AuthInitializer";
import UserProfile from "./pages/UserProfile";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/AdminLayout";
import AdminInventory from "./pages/AdminInventory";
import AdminOrders from "./pages/AdminOrder";
import AdminUsers from "./pages/AdminUsers";
// import { store } from "./components/store/store";

export default function App() {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <Container
      fluid
      data-bs-theme={isDark ? "dark" : "light"}
      className={
        isDark
          ? "bg-dark text-white min-vh-100"
          : "bg-light text-dark min-vh-100"
      }
    >
      <AuthInitializer />
      <Toaster />

      <Routes>
        <Route Component={MainLayout}>
          <Route path="/" Component={Home}>
            Home
          </Route>
          <Route path="/products" Component={Products}>
            Products
          </Route>
          <Route path="/product-details/:id" Component={ProductDetails}>
            Home
          </Route>
          <Route path="/checkout" Component={Checkout}></Route>
          <Route path="/success" Component={OrderSuccess}></Route>
          <Route path="/cart" Component={Cart}></Route>
          <Route path="/login" Component={Login}></Route>
          <Route path="/register" Component={Register}></Route>
          <Route path="/userProfile" Component={UserProfile}></Route>
        </Route>
        <Route Component={AdminLayout}>
          <Route path="/admin" element={<AdminRoute> <AdminDashboard /> </AdminRoute>}></Route>
          <Route path="/admin/inventory" element={<AdminRoute> <AdminInventory/> </AdminRoute>}></Route>
          <Route path="/admin/orders" element={<AdminRoute> <AdminOrders/> </AdminRoute>}></Route>
          <Route path="/admin/customers" element={<AdminRoute> <AdminUsers/> </AdminRoute>}></Route>
        </Route>

        <Route
          path="/*"
          element={<h1 className="text-center">Not found</h1>}
        ></Route>
      </Routes>
    </Container>
  );
}
