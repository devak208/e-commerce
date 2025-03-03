import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { AdminProvider } from "./context/AdminContext";

// Layout Components
import Header from "./user/components/Header";
import Footer from "./user/components/Footer";

// User Pages
import Home from "./user/pages/Home";
import ProductList from "./user/pages/ProductList";
import ProductDetail from "./user/pages/ProductDetail";

// Admin Pages
import Dashboard from "./admin/pages/Dashboard";
import ProductManager from "./admin/pages/ProductManager";
import CategoryManager from "./admin/pages/CategoryManager";
import BannerManager from "./admin/pages/BannerManager";
import ProductFormPage from "./admin/pages/ProductFormPage";

// Protected Route Component - Only for user routes now
const ProtectedRoute = ({ children }) => {
  // For user routes, check UserContext
  const token = localStorage.getItem("userToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <UserProvider>
        <AdminProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="admin">
              <Route path="" element={<Dashboard />} />
              <Route path="products" element={<ProductManager />} />
              {/* Define product-form route here */}
              <Route path="product-form" element={<ProductFormPage />} />

              <Route path="categories" element={<CategoryManager />} />
              <Route path="banners" element={<BannerManager />} />
              {/* Additional admin routes as needed */}
            </Route>

            {/* User Routes */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Home />
                  <Footer />
                </>
              }
            />
            <Route
              path="/products"
              element={
                <>
                  <Header />
                  <ProductList />
                  <Footer />
                </>
              }
            />
            <Route
              path="/product/:id"
              element={
                <>
                  <Header />
                  <ProductDetail />
                  <Footer />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <>
                  <Header />
                  {/* <Cart /> */}
                  <Footer />
                </>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Header />
                  {/* <Checkout /> */}
                  <Footer />
                </ProtectedRoute>
              }
            />

            {/* Error Routes */}
            <Route
              path="/404"
              element={
                <>
                  <Header />
                  <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold mb-4">404</h1>
                      <p className="text-gray-500 mb-4">Page not found</p>
                      <a href="/" className="btn btn-primary">
                        Go Home
                      </a>
                    </div>
                  </div>
                  <Footer />
                </>
              }
            />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AdminProvider>
      </UserProvider>
    </Router>
  );
}
