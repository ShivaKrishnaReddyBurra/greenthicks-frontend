"use client"

import { useState, useEffect } from "react"
import { BarChart3, ShoppingBag, Users, ArrowUp, ArrowDown, DollarSign, Package } from "lucide-react"
import Link from "next/link"

export default function AdminAltDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setStats({
        totalSales: 24580,
        totalOrders: 156,
        totalCustomers: 89,
        totalProducts: 45,
      });
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', date: '2023-05-01', status: 'Delivered', total: 125.99 },
    { id: 'ORD-002', customer: 'Jane Smith', date: '2023-05-02', status: 'Processing', total: 89.50 },
    { id: 'ORD-003', customer: 'Robert Johnson', date: '2023-05-03', status: 'Shipped', total: 210.75 },
    { id: 'ORD-004', customer: 'Emily Davis', date: '2023-05-04', status: 'Pending', total: 45.25 },
    { id: 'ORD-005', customer: 'Michael Brown', date: '2023-05-05', status: 'Delivered', total: 178.30 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Today:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-300" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Sales</dt>
                    <dd>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-semibold text-gray-900 dark:text-white">${stats.totalSales.toLocaleString()}</span>
                        <span className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                          <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500 dark:text-green-400" aria-hidden="true" />
                          <span className="sr-only">Increased by</span>
                          12%
                        </span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                  <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Orders</dt>
                    <dd>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalOrders}</span>
                        <span className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                          <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500 dark:text-green-400" aria-hidden="true" />
                          <span className="sr-only">Increased by</span>
                          8%
                        </span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Customers</dt>
                    <dd>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalCustomers}</span>
                        <span className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                          <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500 dark:text-green-400" aria-hidden="true" />
                          <span className="sr-only">Increased by</span>
                          5%
                        </span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-md p-3">
                  <Package className="h-6 w-6 text-yellow-600 dark:text-yellow-300" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Products</dt>
                    <dd>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalProducts}</span>
                        <span className="ml-2 flex items-baseline text-sm font-semibold text-red-600 dark:text-red-400">
                          <ArrowDown className="self-center flex-shrink-0 h-4 w-4 text-red-500 dark:text-red-400" aria-hidden="true" />
                          <span className="sr-only">Decreased by</span>
                          2%
                        </span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Orders</h3>
            <Link href="/admin-alt/orders" className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500">
              View all
            </Link>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          <Link href={`/admin-alt/orders/${order.id}`} className="hover:text-green-600 dark:hover:text-green-400">
                            {order.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          ${order.total.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sales Overview */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Sales Overview</h3>
          </div>
          <div className="p-6 flex flex-col items-center justify-center h-64 border-t border-gray-200 dark:border-gray-700">
            <BarChart3 className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Sales analytics visualization will appear here.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">$4,320</p>
                <div className="mt-1 flex items-center justify-center text-sm font-medium text-green-600 dark:text-green-400">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>8%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">$18,650</p>
                <div className="mt-1 flex items-center justify-center text-sm font-medium text-green-600 dark:text-green-400">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>12%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Year</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">$142,580</p>
                <div className="mt-1 flex items-center justify-center text-sm font-medium text-green-600 dark:text-green-400">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>24%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Top Products</h3>
            <Link href="/admin-alt/products" className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500">
              View all
            </Link>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <li key={i} className="py-3 flex animate-pulse">
                    <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="ml-3 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </li>
                ))
              ) : (
                <>
                  <li className="py-3 flex">
                    <div className="h-10 w-10 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-300 font-medium">1</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Organic Spinach</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">$4.99 • 120 sold</p>
                    </div>

                  </li>
                  <li className="py-3 flex">
                    <div className="h-10 w-10 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-300 font-medium">2</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Avocado</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">$1.50 • 200 sold</p>
                    </div>
                  </li>
                  <li className="py-3 flex">
                    <div className="h-10 w-10 rounded bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-300 font-medium">3</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Blueberries</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">$3.99 • 150 sold</p>
                    </div>
                  </li>
                </>
              )}              
            </ul>
          </div>
        </div>        
      </div>
    </div>
  )
}

