
import { 
  Package, 
  ShoppingCart, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Calendar 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 8000 },
  { name: "May", sales: 7000 },
  { name: "Jun", sales: 9000 },
  { name: "Jul", sales: 11000 },
];

const categoryData = [
  { name: "Leafy Greens", value: 35 },
  { name: "Root Vegetables", value: 25 },
  { name: "Cruciferous", value: 20 },
  { name: "Seasonal", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const recentOrders = [
  { id: "ORD001", customer: "John Doe", date: "Today, 9:22 AM", status: "Delivered", amount: 1499 },
  { id: "ORD002", customer: "Jane Smith", date: "Today, 11:45 AM", status: "Processing", amount: 2599 },
  { id: "ORD003", customer: "Mike Johnson", date: "Yesterday, 3:20 PM", status: "Shipped", amount: 799 },
  { id: "ORD004", customer: "Sarah Williams", date: "Yesterday, 5:15 PM", status: "Delivered", amount: 3199 },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight dark:text-gray-100">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: Just now</span>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" /> Today
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value="₹1,85,239"
          description="+20.1% from last month"
          trend="up"
          icon={<IndianRupee className="h-8 w-8 text-primary" />}
        />
        <StatsCard
          title="Total Orders"
          value="243"
          description="+12.5% from last month"
          trend="up"
          icon={<ShoppingCart className="h-8 w-8 text-orange-500" />}
        />
        <StatsCard
          title="Products"
          value="85"
          description="12 new this month"
          trend="neutral"
          icon={<Package className="h-8 w-8 text-blue-500" />}
        />
        <StatsCard
          title="Customers"
          value="152"
          description="+25.8% from last month"
          trend="up"
          icon={<Users className="h-8 w-8 text-purple-500" />}
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Sales Chart */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Bar dataKey="sales" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Category Distribution Chart */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
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
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{order.id}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{order.customer}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{order.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-gray-100">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  description, 
  trend, 
  icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  trend: 'up' | 'down' | 'neutral'; 
  icon: React.ReactNode; 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">{value}</h3>
          </div>
          <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-700">{icon}</div>
        </div>
        <div className={`flex items-center mt-2 text-sm ${
          trend === 'up' 
            ? 'text-green-600 dark:text-green-400' 
            : trend === 'down' 
            ? 'text-red-600 dark:text-red-400' 
            : 'text-gray-600 dark:text-gray-400'
        }`}>
          {trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
          {trend === 'down' && <TrendingUp className="h-4 w-4 mr-1 rotate-180" />}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Import Button component
import { Button } from "@/components/ui/button";

export default AdminDashboard;
