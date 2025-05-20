"use client";

import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SellerManagement() {
  const [sellers, setSellers] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sellers");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Simulate fetching sellers and pending products
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const sellersData = [
          {
            id: "SEL-001",
            name: "Organic Farms Ltd",
            owner: "Rahul Sharma",
            email: "rahul@organicfarms.com",
            phone: "+91 9876543210",
            location: "Hyderabad",
            productsListed: 24,
            totalSales: 156000,
            status: "active",
            joinedDate: "2023-01-15",
          },
          {
            id: "SEL-002",
            name: "Fresh Harvest Co.",
            owner: "Priya Patel",
            email: "priya@freshharvest.com",
            phone: "+91 9876543211",
            location: "Warangal",
            productsListed: 18,
            totalSales: 98000,
            status: "active",
            joinedDate: "2023-02-10",
          },
          {
            id: "SEL-003",
            name: "Nature's Basket",
            owner: "Vikram Reddy",
            email: "vikram@naturesbasket.com",
            phone: "+91 9876543212",
            location: "Hyderabad",
            productsListed: 32,
            totalSales: 215000,
            status: "active",
            joinedDate: "2023-01-05",
          },
          {
            id: "SEL-004",
            name: "Green Valley Produce",
            owner: "Anita Singh",
            email: "anita@greenvalley.com",
            phone: "+91 9876543213",
            location: "Warangal",
            productsListed: 15,
            totalSales: 78000,
            status: "pending",
            joinedDate: "2023-04-20",
          },
          {
            id: "SEL-005",
            name: "Farm Fresh Organics",
            owner: "Suresh Kumar",
            email: "suresh@farmfresh.com",
            phone: "+91 9876543214",
            location: "Hyderabad",
            productsListed: 0,
            totalSales: 0,
            status: "pending",
            joinedDate: "2023-05-01",
          },
        ];

        const pendingProductsData = [
          {
            id: "PROD-101",
            name: "Organic Tomatoes",
            sellerId: "SEL-001",
            sellerName: "Organic Farms Ltd",
            price: 60,
            suggestedPrice: 65,
            stock: 100,
            category: "Vegetables",
            submittedDate: "2023-05-01",
          },
          {
            id: "PROD-102",
            name: "Fresh Spinach Bundle",
            sellerId: "SEL-002",
            sellerName: "Fresh Harvest Co.",
            price: 40,
            suggestedPrice: 45,
            stock: 50,
            category: "Vegetables",
            submittedDate: "2023-05-01",
          },
          {
            id: "PROD-103",
            name: "Organic Apples",
            sellerId: "SEL-003",
            sellerName: "Nature's Basket",
            price: 120,
            suggestedPrice: 130,
            stock: 75,
            category: "Fruits",
            submittedDate: "2023-05-01",
          },
          {
            id: "PROD-104",
            name: "Farm Fresh Eggs",
            sellerId: "SEL-001",
            sellerName: "Organic Farms Ltd",
            price: 80,
            suggestedPrice: 85,
            stock: 200,
            category: "Dairy",
            submittedDate: "2023-05-01",
          },
          {
            id: "PROD-105",
            name: "Organic Honey",
            sellerId: "SEL-002",
            sellerName: "Fresh Harvest Co.",
            price: 250,
            suggestedPrice: 275,
            stock: 30,
            category: "Organic",
            submittedDate: "2023-05-01",
          },
        ];

        setSellers(sellersData);
        setPendingProducts(pendingProductsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const approveProduct = (productId) => {
    setPendingProducts(pendingProducts.filter((product) => product.id !== productId));
  };

  const rejectProduct = (productId) => {
    setPendingProducts(pendingProducts.filter((product) => product.id !== productId));
  };

  const approveSeller = (sellerId) => {
    setSellers(sellers.map((seller) => (seller.id === sellerId ? { ...seller, status: "active" } : seller)));
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && seller.status === "active";
    if (filter === "pending") return matchesSearch && seller.status === "pending";

    return matchesSearch;
  });

  const filteredProducts = pendingProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">Seller Management</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <Button
          variant="ghost"
          className={`px-3 py-1 text-xs sm:text-sm font-medium ${
            activeTab === "sellers"
              ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("sellers")}
        >
          Sellers
        </Button>
        <Button
          variant="ghost"
          className={`px-3 py-1 text-xs sm:text-sm font-medium ${
            activeTab === "pending-products"
              ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("pending-products")}
        >
          Pending Products
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "sellers" ? "Search sellers..." : "Search products..."}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === "sellers" && (
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 text-xs sm:text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Sellers</option>
                <option value="active">Active Sellers</option>
                <option value="pending">Pending Approval</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Sellers Tab */}
      {activeTab === "sellers" && (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Sales
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-3 sm:px-4 py-3 text-xs font-medium text-gray-900 dark:text-white">
                        {seller.id}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {seller.name}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {seller.owner}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {seller.location}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {seller.productsListed}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        ₹{seller.totalSales.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            seller.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {seller.status === "active" ? "Active" : "Pending Approval"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-medium">
                        {seller.status === "pending" ? (
                          <Button
                            variant="link"
                            onClick={() => approveSeller(seller.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-0"
                          >
                            Approve
                          </Button>
                        ) : (
                          <a
                            href={`/admin/sellers/${seller.id}`}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            View Details
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 mb-4">
            {filteredSellers.map((seller) => (
              <div key={seller.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{seller.name}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        seller.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {seller.status === "active" ? "Active" : "Pending Approval"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">ID: {seller.id}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Owner: {seller.owner}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Location: {seller.location}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Products: {seller.productsListed}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Total Sales: ₹{seller.totalSales.toLocaleString()}</div>
                  <div className="flex justify-end">
                    {seller.status === "pending" ? (
                      <Button
                        variant="link"
                        onClick={() => approveSeller(seller.id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-0 text-xs"
                      >
                        Approve
                      </Button>
                    ) : (
                      <a
                        href={`/admin/sellers/${seller.id}`}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs"
                      >
                        View Details
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pending Products Tab */}
      {activeTab === "pending-products" && (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price (₹)
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-5-400 uppercase tracking-wider">
                      Suggested Price (₹)
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-3 sm:px-4 py-3 text-xs font-medium text-gray-900 dark:text-white">
                        {product.id}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {product.name}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        <div>
                          <p>{product.sellerName}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{product.sellerId}</p>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {product.category}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        ₹{product.price}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        ₹{product.suggestedPrice}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {product.stock}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => approveProduct(product.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Approve Product"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={() => rejectProduct(product.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Reject Product"
                          >
                            <XCircle size={14} />
                          </button>
                          <a
                            href={`/admin/sellers/products/${product.id}`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit Product"
                          >
                            <AlertTriangle size={14} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 mb-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{product.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-300">{product.id}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Seller: {product.sellerName} ({product.sellerId})</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Category: {product.category}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Price: ₹{product.price}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Suggested Price: ₹{product.suggestedPrice}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Stock: {product.stock}</div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => approveProduct(product.id)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      title="Approve Product"
                    >
                      <CheckCircle size={14} />
                    </button>
                    <button
                      onClick={() => rejectProduct(product.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Reject Product"
                    >
                      <XCircle size={14} />
                    </button>
                    <a
                      href={`/admin/sellers/products/${product.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Edit Product"
                    >
                      <AlertTriangle size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}