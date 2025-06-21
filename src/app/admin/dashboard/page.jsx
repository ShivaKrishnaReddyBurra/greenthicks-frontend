"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart,
  Users,
  TrendingUp,
  IndianRupeeIcon,
  Truck,
  AlertTriangle,
  Download,
  Package,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Store,
} from "lucide-react"
import { getAdminStats, getRecentOrders, getTopProducts, getSalesTrend } from "@/lib/api" // Updated import

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    monthOrders: 0,
    yearOrders: 0,
    todayIncome: 0,
    monthIncome: 0,
    yearIncome: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    totalUsers: 0,
    totalSellers: 0,
    totalDeliveryPartners: 0,
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [salesTrend, setSalesTrend] = useState({
    todayChange: 0,
    monthChange: 0,
    yearChange: 0,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Fetch all dashboard data using the new API functions
        const [statsData, ordersData, productsData, trendData] = await Promise.all([
          getAdminStats(),
          getRecentOrders(),
          getTopProducts(),
          getSalesTrend(),
        ])

        setStats(statsData)
        setRecentOrders(ordersData)
        setTopProducts(productsData)
        setSalesTrend(trendData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // You might want to show an error message to the user here
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle size={12} className="mr-1" />
            {status}
          </span>
        )
      case "Processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock size={12} className="mr-1" />
            {status}
          </span>
        )
      case "Shipped":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            <Truck size={12} className="mr-1" />
            {status}
          </span>
        )
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock size={12} className="mr-1" />
            {status}
          </span>
        )
      case "Cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle size={12} className="mr-1" />
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </span>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, Admin</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            Today
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Revenue</p>
              <div className="flex items-center mt-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.todayIncome)}
                </h2>
                <span
                  className={`ml-2 text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center ${
                    salesTrend.todayChange >= 0
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {salesTrend.todayChange >= 0 ? (
                    <ArrowUp size={12} className="mr-0.5" />
                  ) : (
                    <ArrowDown size={12} className="mr-0.5" />
                  )}
                  {Math.abs(salesTrend.todayChange)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full">
              <IndianRupeeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stats.todayOrders} orders today</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Revenue</p>
              <div className="flex items-center mt-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.monthIncome)}
                </h2>
                <span
                  className={`ml-2 text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center ${
                    salesTrend.monthChange >= 0
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {salesTrend.monthChange >= 0 ? (
                    <ArrowUp size={12} className="mr-0.5" />
                  ) : (
                    <ArrowDown size={12} className="mr-0.5" />
                  )}
                  {Math.abs(salesTrend.monthChange)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stats.monthOrders} orders this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Yearly Revenue</p>
              <div className="flex items-center mt-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.yearIncome)}</h2>
                <span
                  className={`ml-2 text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center ${
                    salesTrend.yearChange >= 0
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {salesTrend.yearChange >= 0 ? (
                    <ArrowUp size={12} className="mr-0.5" />
                  ) : (
                    <ArrowDown size={12} className="mr-0.5" />
                  )}
                  {Math.abs(salesTrend.yearChange)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full">
              <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stats.yearOrders} orders this year</p>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-l-4 border-yellow-500 dark:border-yellow-600">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-full mr-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Pending Orders</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{stats.pendingOrders} orders need attention</p>
              <Link
                href="/admin/delivery"
                className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline mt-2 inline-flex items-center"
              >
                View Orders
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-l-4 border-red-500 dark:border-red-600">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full mr-4">
              <Package className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Low Stock Alert</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{stats.lowStockItems} products running low</p>
              <Link
                href="/admin/products"
                className="text-sm text-red-600 dark:text-red-400 hover:underline mt-2 inline-flex items-center"
              >
                Check Inventory
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-l-4 border-green-500 dark:border-green-600">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">User Statistics</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{stats.totalUsers} registered users</p>
              <Link
                href="/admin/users"
                className="text-sm text-green-600 dark:text-green-400 hover:underline mt-2 inline-flex items-center"
              >
                View Users
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center"
            >
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/orders/${order.id.replace("ORD-", "")}`}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/invoices/${order.id.replace("ORD-", "")}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Invoice
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Top Selling Products</h2>
            <Link
              href="/admin/products"
              className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center"
            >
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {topProducts.map((product, index) => (
              <li key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center">
                  <img
                    src={product.image?.src || "/placeholder.svg"}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
            <Link
              href="/admin/analytics"
              className="text-sm text-center block w-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              View Sales Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-3 mr-4">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="rounded-full bg-green-50 dark:bg-green-900/20 p-3 mr-4">
            <Store className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Sellers</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalSellers}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="rounded-full bg-purple-50 dark:bg-purple-900/20 p-3 mr-4">
            <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Partners</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalDeliveryPartners}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
