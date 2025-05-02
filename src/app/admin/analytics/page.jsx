"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, Calendar } from "lucide-react"

export default function Analytics() {
  const [period, setPeriod] = useState("month")
  const [loading, setLoading] = useState(true)
  const [salesData, setSalesData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [topSellers, setTopSellers] = useState([])

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchData = async () => {
      try {
        // In a real app, this would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample sales data
        const monthlySalesData = [
          { name: "Jan", sales: 12000, orders: 150 },
          { name: "Feb", sales: 15000, orders: 180 },
          { name: "Mar", sales: 18000, orders: 220 },
          { name: "Apr", sales: 16000, orders: 200 },
          { name: "May", sales: 21000, orders: 250 },
          { name: "Jun", sales: 19000, orders: 230 },
          { name: "Jul", sales: 22000, orders: 270 },
          { name: "Aug", sales: 25000, orders: 300 },
          { name: "Sep", sales: 23000, orders: 280 },
          { name: "Oct", sales: 26000, orders: 320 },
          { name: "Nov", sales: 28000, orders: 350 },
          { name: "Dec", sales: 32000, orders: 400 },
        ]

        const weeklySalesData = [
          { name: "Week 1", sales: 5000, orders: 60 },
          { name: "Week 2", sales: 6200, orders: 75 },
          { name: "Week 3", sales: 5800, orders: 70 },
          { name: "Week 4", sales: 7000, orders: 85 },
        ]

        const dailySalesData = [
          { name: "Mon", sales: 1200, orders: 15 },
          { name: "Tue", sales: 1500, orders: 18 },
          { name: "Wed", sales: 1300, orders: 16 },
          { name: "Thu", sales: 1700, orders: 21 },
          { name: "Fri", sales: 1900, orders: 23 },
          { name: "Sat", sales: 2200, orders: 27 },
          { name: "Sun", sales: 1800, orders: 22 },
        ]

        // Sample category data
        const categorySalesData = [
          { name: "Vegetables", value: 35 },
          { name: "Fruits", value: 25 },
          { name: "Dairy", value: 15 },
          { name: "Bakery", value: 10 },
          { name: "Organic", value: 15 },
        ]

        // Sample top products
        const topProductsData = [
          { id: 1, name: "Organic Tomatoes", sales: 1200, quantity: 500 },
          { id: 2, name: "Fresh Spinach Bundle", sales: 980, quantity: 420 },
          { id: 3, name: "Organic Apples", sales: 850, quantity: 350 },
          { id: 4, name: "Farm Fresh Eggs", sales: 780, quantity: 300 },
          { id: 5, name: "Organic Honey", sales: 650, quantity: 150 },
        ]

        // Sample top sellers
        const topSellersData = [
          { id: "SEL-001", name: "Organic Farms Ltd", sales: 45000, products: 24 },
          { id: "SEL-003", name: "Nature's Basket", sales: 38000, products: 32 },
          { id: "SEL-002", name: "Fresh Harvest Co.", sales: 32000, products: 18 },
          { id: "SEL-004", name: "Green Valley Produce", sales: 18000, products: 15 },
          { id: "SEL-009", name: "Healthy Greens", sales: 12000, products: 10 },
        ]

        // Set data based on selected period
        if (period === "day") {
          setSalesData(dailySalesData)
        } else if (period === "week") {
          setSalesData(weeklySalesData)
        } else {
          setSalesData(monthlySalesData)
        }

        setCategoryData(categorySalesData)
        setTopProducts(topProductsData)
        setTopSellers(topSellersData)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  const handleExportData = () => {
    // In a real app, this would generate and download a CSV/Excel file
    alert("Data export functionality would be implemented here.")
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Analytics & Reports</h1>
        <button
          onClick={handleExportData}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center"
        >
          <Download size={20} className="mr-2" />
          Export Data
        </button>
      </div>

      {/* Period Filter */}
      <div className="bg-card rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center">
          <Calendar size={18} className="mr-2 text-muted-foreground" />
          <span className="mr-4">Time Period:</span>
          <select
            className="border rounded-md bg-background px-3 py-2"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="day">Last 7 Days</option>
            <option value="week">Last 4 Weeks</option>
            <option value="month">Last 12 Months</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Sales Overview */}
          <div className="bg-card rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    name="Sales (₹)"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Category Distribution */}
            <div className="bg-card rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Sales by Category</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-card rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Sales (₹)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Sellers */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Top Sellers</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left py-3 px-4">Seller ID</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Total Sales</th>
                    <th className="text-left py-3 px-4">Products</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellers.map((seller) => (
                    <tr key={seller.id} className="border-t hover:bg-muted/50">
                      <td className="py-3 px-4">{seller.id}</td>
                      <td className="py-3 px-4">{seller.name}</td>
                      <td className="py-3 px-4">₹{seller.sales.toLocaleString()}</td>
                      <td className="py-3 px-4">{seller.products}</td>
                      <td className="py-3 px-4">
                        <a href={`/admin/sellers/${seller.id}`} className="text-primary hover:underline">
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
