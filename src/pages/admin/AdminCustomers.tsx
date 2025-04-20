
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ArrowUpDown, 
  UserPlus, 
  Eye, 
  Mail,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";

// Mock customers data
const customers = [
  {
    id: "USR001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    location: "Mumbai, Maharashtra",
    orderCount: 8,
    totalSpent: 12599,
    joinDate: "2023-01-15",
    status: "active"
  },
  {
    id: "USR002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+91 9876543211",
    location: "Delhi, NCR",
    orderCount: 5,
    totalSpent: 8799,
    joinDate: "2023-02-20",
    status: "active"
  },
  {
    id: "USR003",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+91 9876543212",
    location: "Bangalore, Karnataka",
    orderCount: 3,
    totalSpent: 4599,
    joinDate: "2023-03-05",
    status: "inactive"
  },
  {
    id: "USR004",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+91 9876543213",
    location: "Chennai, Tamil Nadu",
    orderCount: 10,
    totalSpent: 15999,
    joinDate: "2023-01-10",
    status: "active"
  },
  {
    id: "USR005",
    name: "David Brown",
    email: "david@example.com",
    phone: "+91 9876543214",
    location: "Kolkata, West Bengal",
    orderCount: 2,
    totalSpent: 3499,
    joinDate: "2023-03-25",
    status: "inactive"
  }
];

const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter customers
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight dark:text-gray-100">Customers</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search by name, email, or location..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Location</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  <button className="flex items-center">
                    Orders
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  <button className="flex items-center">
                    Total Spent
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Joined {customer.joinDate}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {customer.email}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {customer.location}
                    </p>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{customer.orderCount}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                    {formatIndianRupees(customer.totalSpent)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={customer.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800'
                    }>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </Badge>
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

export default AdminCustomers;
