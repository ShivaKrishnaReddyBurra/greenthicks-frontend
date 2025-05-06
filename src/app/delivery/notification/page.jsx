"use client";

import { useState } from "react";
import { DeliveryLayout } from "@/components/delivery-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  Calendar,
  Package,
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "notif-001",
      type: "delivery",
      title: "New Delivery Request",
      message: "You have a new delivery request from Restaurant ABC.",
      time: "10 minutes ago",
      read: false,
      icon: Package,
    },
    {
      id: "notif-002",
      type: "payment",
      title: "Payment Received",
      message: "You received a payment of $25.50 for order #ORD-123.",
      time: "2 hours ago",
      read: false,
      icon: DollarSign,
    },
    {
      id: "notif-003",
      type: "system",
      title: "System Maintenance",
      message: "The app will be under maintenance on June 15th from 2-4 AM.",
      time: "Yesterday",
      read: true,
      icon: Info,
    },
    {
      id: "notif-004",
      type: "delivery",
      title: "Delivery Completed",
      message: "You successfully completed delivery #DEL-456.",
      time: "Yesterday",
      read: true,
      icon: CheckCircle,
    },
    {
      id: "notif-005",
      type: "alert",
      title: "High Demand Alert",
      message: "There's high demand in your area. Log in to receive more orders!",
      time: "2 days ago",
      read: true,
      icon: AlertTriangle,
    },
    {
      id: "notif-006",
      type: "payment",
      title: "Weekly Earnings Summary",
      message: "Your weekly earnings summary is now available. You earned $320.75 this week.",
      time: "3 days ago",
      read: true,
      icon: DollarSign,
    },
    {
      id: "notif-007",
      type: "system",
      title: "App Update Available",
      message: "A new version of the app (v2.1.0) is now available. Please update for the latest features.",
      time: "4 days ago",
      read: true,
      icon: Info,
    },
    {
      id: "notif-008",
      type: "schedule",
      title: "Schedule Reminder",
      message: "Don't forget your scheduled delivery shift tomorrow from 10 AM to 2 PM.",
      time: "5 days ago",
      read: true,
      icon: Calendar,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const renderNotificationCard = (notification) => {
    const Icon = notification.icon;

    return (
      <div key={notification.id}>
        <div className={`flex items-start p-4 rounded-lg ${notification.read ? "bg-background" : "bg-muted"}`}>
          <div className="mr-4 mt-0.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{notification.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
              </div>
              {!notification.read && (
                <Badge className="bg-primary text-primary-foreground">New</Badge>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">{notification.time}</span>
              <div className="flex space-x-2">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="h-8 px-2 text-xs"
                  >
                    Mark as Read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNotification(notification.id)}
                  className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-2" />
      </div>
    );
  };

  const renderTabContent = (type, title, description, emptyIcon, emptyMessage, emptySubtext) => {
    const filtered =
      type === "all"
        ? notifications
        : type === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === type);

    return (
      <TabsContent value={type} className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {filtered.length > 0 ? (
              <div className="space-y-4">
                {filtered.map((notification) => renderNotificationCard(notification))}
              </div>
            ) : (
              <div className="text-center py-8">
                {emptyIcon}
                <h3 className="text-lg font-medium mt-4">{emptyMessage}</h3>
                <p className="text-muted-foreground">{emptySubtext}</p>
              </div>
            )}
          </CardContent>
          {type === "all" && filtered.length > 8 && (
            <CardFooter className="justify-center">
              <Button variant="outline">Load More</Button>
            </CardFooter>
          )}
        </Card>
      </TabsContent>
    );
  };

  return (
    <DeliveryLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              Mark All as Read
            </Button>
            <Button variant="outline" onClick={clearAllNotifications} disabled={notifications.length === 0}>
              Clear All
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All
              {notifications.length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">{notifications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {renderTabContent(
            "all",
            "All Notifications",
            "View all your recent notifications",
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />,
            "No notifications",
            "You're all caught up!"
          )}

          {renderTabContent(
            "unread",
            "Unread Notifications",
            "View your unread notifications",
            <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />,
            "No unread notifications",
            "You're all caught up!"
          )}

          {renderTabContent(
            "delivery",
            "Delivery Notifications",
            "View notifications related to your deliveries",
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />,
            "No delivery notifications",
            "You have no delivery notifications at this time"
          )}

          {renderTabContent(
            "payment",
            "Payment Notifications",
            "View notifications related to your payments",
            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />,
            "No payment notifications",
            "You have no payment notifications at this time"
          )}

          {renderTabContent(
            "system",
            "System Notifications",
            "View system announcements and updates",
            <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />,
            "No system notifications",
            "You have no system notifications at this time"
          )}
        </Tabs>
      </div>
    </DeliveryLayout>
  );
}
