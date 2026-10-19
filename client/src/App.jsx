import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { Protected, AdminOnly } from './components/Routes';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Dish from './pages/Dish';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminPromos from './pages/admin/AdminPromos';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname, search]);

  return null;
}

export default function App() {
  const location = useLocation();
  return (
    <div className="grain relative flex min-h-screen flex-col">
      <ScrollToTop />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: '#1C3B2E', color: '#FBF9F3', border: '1px solid rgba(217,224,168,0.35)' },
          iconTheme: { primary: '#D9E0A8', secondary: '#1C3B2E' },
        }}
      />
      <Navbar />
      <CartDrawer />
      <div className="relative z-[2] flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/dish/:id" element={<Dish />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/my-orders" element={<Orders />} />
            <Route path="/order/:id" element={<Protected><OrderDetail /></Protected>} />
            <Route path="/admin" element={<AdminOnly><AdminLayout /></AdminOnly>}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="promos" element={<AdminPromos />} />
            </Route>
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
