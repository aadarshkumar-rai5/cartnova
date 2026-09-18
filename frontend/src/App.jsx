import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import AdminOrders from './admin/AdminOrders';
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AddProduct />} />
                <Route path="products/:id/edit" element={<EditProduct />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>
            </Route>
          </Route>
          <Route
            path="*"
            element={
              <div className="empty">
                <h1>A little off the beaten path.</h1>
                <p>This page doesn't exist.</p>
                <Link className="button" to="/">
                  Back home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
