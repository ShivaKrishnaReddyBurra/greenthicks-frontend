
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Filter, ArrowUpDown, Eye } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";

// Mock orders data
const orders = [
  {
    id: "ORD001",
    customer: "John Doe",
    email: "john@example.com",
    date: "2023-04-15",
    status: "delivered",
    amount: 2499,
    items: 3
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2023-04-14",
    status: "processing",
    amount: 3899,
    items: 4
  },
  {
    id: "ORD003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    date: "2023-04-13",
    status: "shipped",
    amount: 1599,
    items: 2
  },
  {
    id: "ORD004",
    customer: "Sarah Williams",
    email: "sarah@example.com",
    date: "2023-04-12",
    status: "delivered",
    amount: 4299,
    items: 5
  },
  {
    id: "ORD005",
    customer: "David Brown",
    email: "david@example.com",
    date: "2023-04-11",
    status: "cancelled",
    amount: 1999,
    items: 2
  }
];

// Status badge colors
const statusColors: Record<string, string> = {
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  shipped: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
};

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter orders
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight dark:text-gray-100">Orders</h1>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Date Range
        </Button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by order ID, customer name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="outline" className="min-w-[150px]">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  <button className="flex items-center">
                    Order ID
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  <button className="flex items-center">
                    Date
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  <button className="flex items-center">
                    Amount
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{order.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-gray-900 dark:text-gray-100">{order.customer}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{order.date}</td>
                  <td className="py-3 px-4">
                    <Badge className={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(order.amount)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{order.items} items</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
