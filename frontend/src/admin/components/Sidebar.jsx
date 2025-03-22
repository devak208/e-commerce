import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

const Sidebar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
  const location = useLocation();
  const { logout } = useAdmin();

  const navigation = [
    { name: "Dashboard", path: "/admin", icon: "dashboard" },
    { name: "Orders", path: "/admin/orders", icon: "shopping-cart" },
    { name: "Products", path: "/admin/products", icon: "shopping-bag" },
    { name: "Categories", path: "/admin/categories", icon: "tag" },
    { name: "Banners", path: "/admin/banners", icon: "image" },
    { name: "Customers", path: "/admin/customers", icon: "users" },
    { name: "Settings", path: "/admin/settings", icon: "settings" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const renderIcon = (icon) => {
    // ...switch statement for icon rendering (same as before)
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-50 bg-transparent-59 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0 " : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-light text-gray-900">
                LUXE<span className="font-semibold">ADMIN</span>
              </span>
            </Link>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md group ${
                  isActive(item.path)
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="mr-3">{renderIcon(item.icon)}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 mr-3"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
