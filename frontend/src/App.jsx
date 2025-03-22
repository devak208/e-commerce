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
import Login from "./user/pages/auth/login";
import Register from "./user/pages/auth/register";
import Profile from "./user/pages/Profile";
import Orders from "./user/pages/Orders";
import OrderDetail from "./user/pages/OrderDetail";
import Cart from "./user/pages/Cart";
import Checkout from "./user/pages/Checkout";
import OrderSuccess from "./user/pages/order-success";

// Admin Pages
import Dashboard from "./admin/pages/Dashboard";
import ProductManager from "./admin/pages/ProductManager";
import AdminOrders from "./admin/pages/Orders";
import Users from "./admin/pages/Users";
import ProductFormPage from "./admin/pages/ProductFormPage";
import CategoryManager from "./admin/pages/CategoryManager";
import BannerManager from "./admin/pages/BannerManager";
import AdminOrderDetail from "./admin/pages/Orders/OrderDetail";
import UserDetails from "./admin/pages/Users/UserDetails";

// Auth Components
import ProtectedRoute from "./user/components/auth/ProtectedRoute";
import PublicRoute from "./user/components/auth/PublicRoute";

export default function App() {
  return (
    <Router>
      <UserProvider>
        <AdminProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Header />
                  <Login />
                  <Footer />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Header />
                  <Register />
                  <Footer />
                </PublicRoute>
              }
            />

            {/* Protected User Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Header />
                  <Profile />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Header />
                  <Orders />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <Header />
                  <OrderDetail />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Header />
                  <Cart />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Header />
                  <Checkout />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <ProtectedRoute>
                  <Header />
                  <OrderSuccess />
                  <Footer />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin">
              <Route
                path=""
                element={
                  
                    <Dashboard />
                
                }
              />
              <Route
                path="dashboard"
                element={
                  
                    <Dashboard />
            
                }
              />
              <Route
                path="products"
                element={
                  
                    <ProductManager />
         
                }
              />
              <Route
                path="orders"
                element={
                
                    <AdminOrders />
           
                }
              />
              <Route
                path="orders/:id"
                element={
                  <AdminOrderDetail />
                }
              />
              <Route
                path="users"
                element={
                
                    <Users />
          
                }
              />
              <Route
                path="users/:id"
                element={
                  <UserDetails />
                }
              />
              <Route
                path="product-form"
                element={
                
                    <ProductFormPage />
              
                }
              />
              <Route
                path="categories"
                element={
                  
                    <CategoryManager />
                 
                }
              />
              <Route
                path="banners"
                element={
                 
                    <BannerManager />
                }
              />
            </Route>

            {/* Public User Routes */}
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

            {/* 404 */}
            <Route path="/404" element={<Navigate to="/404" replace />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AdminProvider>
      </UserProvider>
    </Router>
  );
}
