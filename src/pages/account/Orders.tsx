
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Eye, Package } from "lucide-react";
import { products } from "@/data/products";

// Sample orders data
const sampleOrders = [
  {
    id: "ORD-2345",
    date: "March 15, 2025",
    status: "delivered" as const,
    total: 48.95,
    items: [
      { 
        product: products[0],
        quantity: 2,
        selectedWeight: products[0].weightOptions[0].value,
      },
      { 
        product: products[1],
        quantity: 1,
        selectedWeight: products[1].weightOptions[0].value,
      },
    ],
  },
  {
    id: "ORD-1234",
    date: "March 10, 2025",
    status: "delivered" as const,
    total: 32.75,
    items: [
      { 
        product: products[2],
        quantity: 1,
        selectedWeight: products[2].weightOptions[0].value,
      },
      { 
        product: products[3],
        quantity: 2,
        selectedWeight: products[3].weightOptions[0].value,
      },
    ],
  },
  {
    id: "ORD-3456",
    date: "April 16, 2025",
    status: "shipped" as const,
    total: 54.20,
    items: [
      { 
        product: products[4],
        quantity: 3,
        selectedWeight: products[4].weightOptions[0].value,
      },
    ],
  },
  {
    id: "ORD-4567",
    date: "April 17, 2025",
    status: "processing" as const,
    total: 27.80,
    items: [
      { 
        product: products[5],
        quantity: 1,
        selectedWeight: products[5].weightOptions[0].value,
      },
      { 
        product: products[6],
        quantity: 1,
        selectedWeight: products[6].weightOptions[0].value,
      },
    ],
  },
];

// Order status badge colors
const statusColors: Record<string, string> = {
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-yellow-100 text-yellow-800 border-yellow-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const Orders = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  
  // Filter orders based on selected tab
  const filteredOrders = selectedTab === "all" 
    ? sampleOrders 
    : sampleOrders.filter(order => order.status === selectedTab);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
        
        <Tabs
          defaultValue="all"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab}>
            {filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map(order => (
                  <div 
                    key={order.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.id}</span>
                          <Badge className={statusColors[order.status]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Ordered on {order.date}
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <Button 
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-1"
                        >
                          <Link to={`/account/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="p-4">
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div 
                            key={index}
                            className="flex items-center gap-3"
                          >
                            <div className="w-16 h-16 rounded overflow-hidden">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium text-gray-900">
                                {item.product.name}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <span>Qty: {item.quantity}</span>
                                <span className="mx-2">•</span>
                                <span>
                                  {item.product.weightOptions.find(w => w.value === item.selectedWeight)?.label}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-500">Total</span>
                        <span className="font-semibold text-lg">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Order Actions */}
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm" className="gap-1">
                          <Package className="h-4 w-4" />
                          Buy Again
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Cancel Order
                        </Button>
                      )}
                      {["shipped", "processing"].includes(order.status) && (
                        <div className="text-sm text-gray-600">
                          Estimated Delivery: April 20, 2025
                        </div>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        className="ml-auto"
                      >
                        <Link to={`/account/orders/${order.id}`}>
                          Track Order
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {selectedTab === "all" 
                    ? "You haven't placed any orders yet."
                    : `You don't have any ${selectedTab} orders.`}
                </p>
                <Button asChild className="mt-6">
                  <Link to="/shop">Start Shopping</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;
