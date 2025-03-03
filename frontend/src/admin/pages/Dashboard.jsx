"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import { FaIndianRupeeSign } from "react-icons/fa6";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch products count
        const productsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        );
        const products = productsRes.data || [];

        // Fetch categories count
        const categoriesRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/categories`
        );
        const categories = categoriesRes.data || [];

        // In a real app, you would fetch orders and calculate revenue
        // For demo, we'll use mock data
        const mockOrders = [
          {
            id: 1,
            customer: "John Doe",
            total: 129.99,
            status: "Completed",
            date: "2023-05-15",
          },
          {
            id: 2,
            customer: "Jane Smith",
            total: 89.95,
            status: "Processing",
            date: "2023-05-14",
          },
          {
            id: 3,
            customer: "Bob Johnson",
            total: 199.99,
            status: "Completed",
            date: "2023-05-13",
          },
          {
            id: 4,
            customer: "Alice Brown",
            total: 149.5,
            status: "Shipped",
            date: "2023-05-12",
          },
          {
            id: 5,
            customer: "Charlie Wilson",
            total: 299.99,
            status: "Processing",
            date: "2023-05-11",
          },
        ];

        const totalRevenue = mockOrders.reduce(
          (sum, order) => sum + order.total,
          0
        );

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: mockOrders.length,
          totalRevenue: totalRevenue,
        });

        setRecentOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your store's performance"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white h-32 rounded-lg shadow-sm animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-gray-700"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            }
            change="12%"
            changeType="increase"
          />
          <StatsCard
            title="Total Categories"
            value={stats.totalCategories}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-gray-700"
              >
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                <path d="M7 7h.01" />
              </svg>
            }
            change="5%"
            changeType="increase"
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-gray-700"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            }
            change="8%"
            changeType="increase"
          />
         

<StatsCard
  title="Total Revenue"
  value={`₹${stats.totalRevenue.toFixed(2)}`}
  icon={<FaIndianRupeeSign className="w-6 h-6 text-gray-700" />}
  change="15%"
  changeType="increase"
/>


        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
            <Link
              to="/admin/orders"
              className="text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              View all orders
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 ml-1 inline-block"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-1 gap-6">
            <Link
              to="/admin/products"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-gray-700"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-gray-900">
                  View Product
                </h4>
                <p className="text-sm text-gray-500">
                  Create a new product listing
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 ml-auto text-gray-400"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-gray-700"
                >
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                  <path d="M7 7h.01" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-gray-900">
                  View Category
                </h4>
                <p className="text-sm text-gray-500">
                  Create a new product category
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 ml-auto text-gray-400"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to="/admin/banners"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-gray-700"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-gray-900">
                  View Banner
                </h4>
                <p className="text-sm text-gray-500">
                  Create a new promotional banner
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 ml-auto text-gray-400"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
