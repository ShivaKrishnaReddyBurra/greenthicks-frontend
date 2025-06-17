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

import { getProducts, deleteProduct } from "@/lib/api"

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
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(10)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
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
    setCurrentPage(1)
  }

  const handleFilterCategory = (e) => {
    setFilterCategory(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value)
    setCurrentPage(1)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(currentProducts.map((product) => product.globalId))
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

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        await Promise.all(selectedProducts.map((id) => deleteProduct(id)))
        setProducts(products.filter((product) => !selectedProducts.includes(product.globalId)))
        setSelectedProducts([])
        setSelectAll(false)
      } catch (error) {
        console.error("Error deleting products:", error)
        alert("Failed to delete some products. Please try again.")
      }
    }
  }

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteProduct(id)
        setProducts(products.filter((product) => product.globalId !== id))
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Failed to delete product. Please try again.")
      }
    }
  }

  const handleExport = () => {
    const headers = ["ID,Name,Category,Price,Stock,Status"]
    const rows = filteredProducts.map((product) => {
      const status = product.stock === 0 ? "Out of Stock" : product.stock <= 10 ? "Low Stock" : "In Stock"
      return `${product.globalId},${product.name},${product.category},${product.price},${product.stock},${status}`
    })
    const csvContent = [...headers, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "products_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target.result
      const rows = text.split("\n").slice(1)
      const importedProducts = rows
        .filter((row) => row.trim())
        .map((row) => {
          const [id, name, category, price, stock] = row.split(",")
          return {
            globalId: parseInt(id),
            name,
            category,
            price: parseFloat(price),
            stock: parseInt(stock),
          }
        })
      console.log("Imported products:", importedProducts)
      alert("Import functionality requires a backend endpoint. Check console for imported data.")
    }
    reader.readAsText(file)
  }

  const productsWithStatus = products.map((product) => ({
    ...product,
    status: product.stock === 0 ? "Out of Stock" : product.stock <= 10 ? "Low Stock" : "In Stock",
  }))

  const filteredProducts = productsWithStatus
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

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

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
    <div className="p-4 sm:p-6 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Products</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products/add"
            className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Link>
          <button
            className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedProducts.length === 0}
            onClick={handleDeleteSelected}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
          <button
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
          <label className="flex items-center px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors cursor-pointer">
            <Upload className="h-4 w-4 mr-1" />
            Import
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 text-sm"
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 text-sm"
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
            {filteredProducts.length} products
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">
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
                <th className="px-4 py-3 text-left">
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
                <th className="px-4 py-3 text-left">
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
                <th className="px-4 py-3 text-left">
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
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </span>
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentProducts.map((product) => (
                <tr key={product.globalId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.globalId)}
                      onChange={() => handleSelectProduct(product.globalId)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={(product.images && product.images[0]) || "/placeholder.svg?height=300&width=300"}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {product.globalId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{product.category}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{formatCurrency(product.price)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{product.stock}</div>
                  </td>
                  <td className="px-4 py-4">
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
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/products/${product.globalId}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/products/edit/${product.globalId}`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.globalId, product.name)}
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

        <div className="lg:hidden space-y-4 p-4">
          {currentProducts.map((product) => (
            <div
              key={product.globalId}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.globalId)}
                    onChange={() => handleSelectProduct(product.globalId)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <img
                    className="h-12 w-12 rounded-md object-cover"
                    src={(product.images && product.images[0]) || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: {product.globalId}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/products/${product.globalId}`}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Eye size={16} />
                  </Link>
                  <Link
                    href={`/admin/products/edit/${product.globalId}`}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product.globalId, product.name)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Category:</span>{" "}
                  <span className="text-gray-900 dark:text-white">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Price:</span>{" "}
                  <span className="text-gray-900 dark:text-white">{formatCurrency(product.price)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Stock:</span>{" "}
                  <span className="text-gray-900 dark:text-white">{product.stock}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>{" "}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 mt-4 rounded-lg shadow">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> of{" "}
              <span className="font-medium">{filteredProducts.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <ChevronDown className="h-5 w-5 rotate-90" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
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