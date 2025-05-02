"use client"

import { useState, useEffect } from "react"
import { Bell, ShoppingBag, AlertTriangle, CheckCircle, Trash2 } from "lucide-react"

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Simulate fetching notifications
    const fetchNotifications = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample notifications data
        const notificationsData = [
          {
            id: 1,
            type: "order",
            title: "New Order Received",
            message: "Order #ORD-1234 has been placed by John Doe",
            time: "10 minutes ago",
            read: false,
          },
          {
            id: 2,
            type: "stock",
            title: "Low Stock Alert",
            message: "Organic Tomatoes is running low on stock (5 remaining)",
            time: "1 hour ago",
            read: false,
          },
          {
            id: 3,
            type: "seller",
            title: "New Seller Registration",
            message: "Farm Fresh Organics has registered as a new seller",
            time: "3 hours ago",
            read: true,
          },
          {
            id: 4,
            type: "order",
            title: "Order Delivered",
            message: "Order #ORD-1230 has been successfully delivered",
            time: "5 hours ago",
            read: true,
          },
          {
            id: 5,
            type: "stock",
            title: "Out of Stock Alert",
            message: "Organic Honey is now out of stock",
            time: "1 day ago",
            read: true,
          },
          {
            id: 6,
            type: "order",
            title: "Order Cancelled",
            message: "Order #ORD-1228 has been cancelled by the customer",
            time: "2 days ago",
            read: true,
          },
          {
            id: 7,
            type: "seller",
            title: "New Product Submission",
            message: "Nature's Basket has submitted a new product for approval",
            time: "2 days ago",
            read: true,
          },
        ]

        setNotifications(notificationsData)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const clearAllNotifications = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([])
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag size={20} className="text-blue-500" />
      case "stock":
        return <AlertTriangle size={20} className="text-amber-500" />
      case "seller":
        return <CheckCircle size={20} className="text-green-500" />
      default:
        return <Bell size={20} className="text-gray-500" />
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {/* Filters and Actions */}
      <div className="bg-card rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <select
              className="border rounded-md bg-background px-3 py-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="order">Orders</option>
              <option value="stock">Stock Alerts</option>
              <option value="seller">Sellers</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-2 border rounded-md hover:bg-muted transition-colors flex items-center"
              disabled={!notifications.some((n) => !n.read)}
            >
              <CheckCircle size={18} className="mr-2" />
              Mark All as Read
            </button>
            <button
              onClick={clearAllNotifications}
              className="px-3 py-2 border rounded-md hover:bg-muted transition-colors flex items-center"
              disabled={notifications.length === 0}
            >
              <Trash2 size={18} className="mr-2" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No notifications found</p>
            <p className="text-muted-foreground">
              {filter !== "all" ? "Try changing your filter to see more notifications" : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? "bg-primary/5" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-muted rounded-full">{getNotificationIcon(notification.type)}</div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>

                  <div className="flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="Mark as Read"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-md"
                      title="Delete Notification"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
