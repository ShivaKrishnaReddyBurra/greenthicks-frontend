"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Plus,
  Trash2,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Edit,
} from "lucide-react"
import Spinach from "@/public/images/Spinach.jpg"

import Mint from "@/public/images/Mint1.jpg"

import Tomato from "@/public/images/Tomato.jpg"

import Brinjal from "@/public/images/Brinjal.jpg"

import Green_Chili from "@/public/images/GreenChili.jpg"

import Carrot from "@/public/images/carrot.jpg"

import Potato from "@/public/images/potato.jpg"

import Onion from "@/public/images/Onion.jpg"

import Garlic from "@/public/images/Garilic.jpg"

import Cabbage from "@/public/images/Cabbage.jpg"

import Cauliflower from "@/public/images/Cauliflower.jpg"

import Drumstick from "@/public/images/Drumstick.jpg"

import Cucumber from "@/public/images/Cucumber.jpg"

import Spring_Onion_Greens from "@/public/images/Spring Onion Greens.jpg"

import Mango from "@/public/images/Mango.jpg"

import Jamun from "@/public/images/Jamun.jpg"

import Watermelon from "@/public/images/Watermelon.jpg"

// Mock product data
const mockProducts = [
  {
      id: 1,
      name: "Organic Spinach",
      description: "Fresh, nutrient-rich organic spinach leaves. Perfect for salads, smoothies, or cooking.",
      price: 3.99,
      category: "leafy",
      unit: "250g bunch",
      stock: 15,
      status: "In Stock",
      discount: 0,
      image: Spinach,
    },
    {
      id: 2,
      name: "Organic Mint",
      description: "Refreshing organic mint. Perfect for teas, cocktails, or garnishing.",
      price: 2.49,
      category: "leafy",
      unit: "500g pack",
      stock: 30,
      status: "In Stock",
      discount: 0,
      image: Mint,
    },
    {
      id: 3,
      name: "Organic Tomatoes",
      description: "Juicy, vine-ripened organic tomatoes. Perfect for salads, sandwiches, or cooking.",
      price: 4.99,
      originalPrice: 5.99,
      category: "fruit",
      unit: "500g pack",
      stock: 25,
      status: "In Stock",
      discount: 15,
      image: Tomato,
    },
    {
      id: 4,
      name: "Organic Brinjal",
      description: "Healthy, nutrient-rich organic brinjal. Perfect for salads, smoothies, or cooking.",
      price: 1.99,
      category: "fruit",
      unit: "1 Kg pack",
      stock: 40,
      status: "Out of Stock",
      discount: 0,
      image: Brinjal,
    },
    {
      id: 5,
      name: "Organic Green Chili",
      description: "Juicy, nutrient-rich organic green chili. Perfect for salads, sandwiches, or cooking.",
      price: 3.49,
      category: "fruit",
      unit: "200g bunch",
      stock: 20,
      status: "In Stock",
      discount: 0,
      image: Green_Chili,
    },
    {
      id: 6,
      name: "Organic Carrot",
      description: "Healthy, nutrient-rich organic carrots. Perfect for salads, smoothies, or cooking.",
      price: 4.99,
      category: "root",
      unit: "3 pack (red, yellow, green)",
      stock: 25,
      status: "Low Stock",
      discount: 0,
      image: Carrot,
    },
    {
      id: 7,
      name: "Organic Potatoes",
      description: "Versatile organic potatoes. Perfect for roasting, mashing, or frying.",
      price: 3.99,
      category: "root",
      unit: "1kg bag",
      stock: 50,
      status: "In Stock",
      discount: 0,
      image: Potato,
    },
    {
      id: 8,
      name: " Organic Onion",
      description: "Juicy, nutrient-rich organic onions. Perfect for salads, sandwiches, or cooking.",
      price: 2.99,
      category: "root",
      unit: "Head",
      stock: 35,
      status: "In Stock",
      discount: 0,
      image: Onion,
    },
    {
      id: 9,
      name: " Organic Garlic",
      description: "Juicy, nutrient-rich organic garlic. Perfect for salads, sandwiches, or cooking.",
      price: 2.49,
      category: "root",
      unit: "Head",
      stock: 30,
      status: "In Stock",
      discount: 0,
      image: Garlic,
    },
    {
      id: 10,
      name: " Organic Cabbage",
      description: "Healthy, nutrient-rich organic cabbage. Perfect for salads, smoothies, or cooking.",
      price: 1.99,
      category: "herbs",
      unit: "500g bag",
      stock: 45,
      status: "In Stock",
      discount: 0,
      image: Cabbage,
    },
  {
       id: 11,
       name: " Organic CauliFlower",
       description: "Healthy, nutrient-rich organic cauliflower. Perfect for salads, smoothies, or cooking.",
       price: 2.29,
       category: "herbs",
       unit: "3 bulb pack",
       stock: 40,
       status: "In Stock",
       image: Cauliflower,
     },
     {
         id: 12,
         name: " Organic Drumstick",
         description: "Fragrant organic drumstick leaves. Ideal for soups, salads, and curries.",
         price: 1.79,
         category: "herbs",
         unit: "Bunch",
         stock: 25,
         status: "out of Stock",
         discount: 0,
         image: Drumstick,
      },
       {
         id: 13,
         name: " Organic Cucumber",
         description: "Juicy, nutrient-rich organic cucumber. Perfect for salads, sandwiches, or cooking.",
         price: 2.49,
         category: "herbs",
         unit: "Each",
         stock: 30,
         status: "In Stock",
         discount: 0,
         image: Cucumber,
       },
       {
         id: 14,
         name: "Spring Onion Greens",
         description: "Fresh, nutrient-rich spring onion greens. Perfect for salads, smoothies, or cooking.",
         price: 3.49,
         originalPrice: 3.99,
         category: "herbs",
         unit: "500g pack",
         stock: 20,
         status: "Low Stock",
         discount: 10,
         new: true,
         image: Spring_Onion_Greens,
       },
       {
         id: 15,
         name: "Organic Mango",
         description: "Sweet, juicy organic mango. Perfect for smoothies, desserts, or snacking.",
         price: 1.99,
         category: "fruit",
         unit: "Bunch",
         stock: 15,
         status: "In Stock",
         discount: 0,
         image: Mango,
       },
       {
         id: 16,
         name: "Fresh Jamun",
         description: "Juicy, nutrient-rich fresh jamun. Perfect for salads, sandwiches, or cooking.",
         price: 3.99,
         category: "fruit",
         unit: "Head",
         stock: 25,
         status: "In Stock",
         discount: 0,
         image: Jamun,
       },
       {
         id: 17,
         name: "Organic Watermelon",
         description: "Juicy, nutrient-rich organic watermelon. Perfect for salads, sandwiches, or cooking.",
         price: 4.99,
         category: "fruit",
         unit: "500g pack",
         stock: 20,
         status: "In Stock",
         discount: 0,
         image: Watermelon,
       },
]

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterCategory = (e) => {
    setFilterCategory(e.target.value)
  }

  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((product) => product.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      setProducts(products.filter((product) => !selectedProducts.includes(product.id)))
      setSelectedProducts([])
      setSelectAll(false)
    }
  }

  // Apply filters and sorting
  const filteredProducts = products
    .filter(
      (product) =>
        (filterCategory === "All" || product.category === filterCategory) &&
        (filterStatus === "All" || product.status === filterStatus) &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortField === "price" || sortField === "stock") {
        return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
      } else {
        return sortDirection === "asc"
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField])
      }
    })

  // Get unique categories for filter
  const categories = ["All", ...new Set(products.map((product) => product.category))]
  const statuses = ["All", "In Stock", "Low Stock", "Out of Stock"]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Products</h1>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Link
            href="/admin/products/add"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
          <button
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedProducts.length === 0}
            onClick={handleDeleteSelected}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3"
              value={filterCategory}
              onChange={handleFilterCategory}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3"
              value={filterStatus}
              onChange={handleFilterStatus}
            >
              {statuses.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="text-right text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
            {filteredProducts.length} products found
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </span>
                    <button onClick={() => handleSort("name")} className="ml-1 focus:outline-none">
                      {sortField === "name" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </span>
                    <button onClick={() => handleSort("category")} className="ml-1 focus:outline-none">
                      {sortField === "category" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </span>
                    <button onClick={() => handleSort("price")} className="ml-1 focus:outline-none">
                      {sortField === "price" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stock
                    </span>
                    <button onClick={() => handleSort("stock")} className="ml-1 focus:outline-none">
                      {sortField === "stock" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </span>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={product.image?.src || "/placeholder.svg"}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatCurrency(product.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : product.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/products/editor/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                            setProducts(products.filter((p) => p.id !== product.id))
                          }
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 mt-4 rounded-lg shadow">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredProducts.length}</span> of{" "}
              <span className="font-medium">{filteredProducts.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="sr-only">Previous</span>
                <ChevronDown className="h-5 w-5 rotate-90" />
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="sr-only">Next</span>
                <ChevronDown className="h-5 w-5 -rotate-90" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
