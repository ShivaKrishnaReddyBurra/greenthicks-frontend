"use client"

import { useState } from "react"
import { Save, RefreshCw } from "lucide-react"

export default function AdminSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Green Thicks",
    siteDescription: "Organic and fresh products delivered to your doorstep",
    contactEmail: "support@greenthicks.com",
    contactPhone: "+91 9876543210",
    address: "123 Main St, Hyderabad, 500001",
  })

  const [paymentSettings, setPaymentSettings] = useState({
    enableCashOnDelivery: true,
    enableUPI: true,
    enableCreditCard: true,
    minOrderAmount: 200,
    maxCashOnDeliveryAmount: 5000,
  })

  const [deliverySettings, setDeliverySettings] = useState({
    freeDeliveryMinAmount: 500,
    deliveryCharge: 50,
    maxDeliveryDistance: 15,
    deliveryTimeSlots: "10:00 AM - 1:00 PM, 2:00 PM - 5:00 PM, 6:00 PM - 9:00 PM",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStockAlert: true,
    newProductAlert: true,
    promotionalEmails: true,
  })

  const [activeTab, setActiveTab] = useState("general")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleGeneralChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    })
  }

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target
    setPaymentSettings({
      ...paymentSettings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target
    setDeliverySettings({
      ...deliverySettings,
      [name]: value,
    })
  }

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    try {
      // In a real app, this would be an API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "general"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "payment"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("payment")}
        >
          Payment Settings
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "delivery"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("delivery")}
        >
          Delivery Settings
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "notification"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("notification")}
        >
          Notification Settings
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <RefreshCw size={20} className="mr-2 animate-spin" />
          Settings saved successfully!
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-md p-6">
        {/* General Settings */}
        {activeTab === "general" && (
          <div>
            <h2 className="text-xl font-bold mb-4">General Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label htmlFor="siteName" className="block text-sm font-medium mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  className="w-full p-2 border rounded-md bg-background"
                  value={generalSettings.siteName}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="contactEmail" className="block text-sm font-medium mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  className="w-full p-2 border rounded-md bg-background"
                  value={generalSettings.contactEmail}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="contactPhone" className="block text-sm font-medium mb-2">
                  Contact Phone
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  className="w-full p-2 border rounded-md bg-background"
                  value={generalSettings.contactPhone}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  Business Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full p-2 border rounded-md bg-background"
                  value={generalSettings.address}
                  onChange={handleGeneralChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="siteDescription" className="block text-sm font-medium mb-2">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                rows="3"
                className="w-full p-2 border rounded-md bg-background"
                value={generalSettings.siteDescription}
                onChange={handleGeneralChange}
              ></textarea>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === "payment" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Payment Settings</h2>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Payment Methods</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableCashOnDelivery"
                    name="enableCashOnDelivery"
                    className="mr-2"
                    checked={paymentSettings.enableCashOnDelivery}
                    onChange={handlePaymentChange}
                  />
                  <label htmlFor="enableCashOnDelivery">Enable Cash on Delivery</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableUPI"
                    name="enableUPI"
                    className="mr-2"
                    checked={paymentSettings.enableUPI}
                    onChange={handlePaymentChange}
                  />
                  <label htmlFor="enableUPI">Enable UPI Payment</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableCreditCard"
                    name="enableCreditCard"
                    className="mr-2"
                    checked={paymentSettings.enableCreditCard}
                    onChange={handlePaymentChange}
                  />
                  <label htmlFor="enableCreditCard">Enable Credit/Debit Card</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label htmlFor="minOrderAmount" className="block text-sm font-medium mb-2">
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  id="minOrderAmount"
                  name="minOrderAmount"
                  min="0"
                  className="w-full p-2 border rounded-md bg-background"
                  value={paymentSettings.minOrderAmount}
                  onChange={handlePaymentChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="maxCashOnDeliveryAmount" className="block text-sm font-medium mb-2">
                  Maximum Cash on Delivery Amount (₹)
                </label>
                <input
                  type="number"
                  id="maxCashOnDeliveryAmount"
                  name="maxCashOnDeliveryAmount"
                  min="0"
                  className="w-full p-2 border rounded-md bg-background"
                  value={paymentSettings.maxCashOnDeliveryAmount}
                  onChange={handlePaymentChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delivery Settings */}
        {activeTab === "delivery" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Delivery Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label htmlFor="freeDeliveryMinAmount" className="block text-sm font-medium mb-2">
                  Free Delivery Minimum Amount (₹)
                </label>
                <input
                  type="number"
                  id="freeDeliveryMinAmount"
                  name="freeDeliveryMinAmount"
                  min="0"
                  className="w-full p-2 border rounded-md bg-background"
                  value={deliverySettings.freeDeliveryMinAmount}
                  onChange={handleDeliveryChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="deliveryCharge" className="block text-sm font-medium mb-2">
                  Standard Delivery Charge (₹)
                </label>
                <input
                  type="number"
                  id="deliveryCharge"
                  name="deliveryCharge"
                  min="0"
                  className="w-full p-2 border rounded-md bg-background"
                  value={deliverySettings.deliveryCharge}
                  onChange={handleDeliveryChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="maxDeliveryDistance" className="block text-sm font-medium mb-2">
                  Maximum Delivery Distance (km)
                </label>
                <input
                  type="number"
                  id="maxDeliveryDistance"
                  name="maxDeliveryDistance"
                  min="0"
                  className="w-full p-2 border rounded-md bg-background"
                  value={deliverySettings.maxDeliveryDistance}
                  onChange={handleDeliveryChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="deliveryTimeSlots" className="block text-sm font-medium mb-2">
                  Delivery Time Slots
                </label>
                <input
                  type="text"
                  id="deliveryTimeSlots"
                  name="deliveryTimeSlots"
                  className="w-full p-2 border rounded-md bg-background"
                  value={deliverySettings.deliveryTimeSlots}
                  onChange={handleDeliveryChange}
                />
                <p className="text-xs text-muted-foreground mt-1">Separate time slots with commas</p>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notification" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Notification Settings</h2>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Email Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orderConfirmation"
                    name="orderConfirmation"
                    className="mr-2"
                    checked={notificationSettings.orderConfirmation}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="orderConfirmation">Order Confirmation</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orderShipped"
                    name="orderShipped"
                    className="mr-2"
                    checked={notificationSettings.orderShipped}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="orderShipped">Order Shipped</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orderDelivered"
                    name="orderDelivered"
                    className="mr-2"
                    checked={notificationSettings.orderDelivered}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="orderDelivered">Order Delivered</label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Admin Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowStockAlert"
                    name="lowStockAlert"
                    className="mr-2"
                    checked={notificationSettings.lowStockAlert}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="lowStockAlert">Low Stock Alerts</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newProductAlert"
                    name="newProductAlert"
                    className="mr-2"
                    checked={notificationSettings.newProductAlert}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="newProductAlert">New Product Submissions</label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Marketing Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="promotionalEmails"
                    name="promotionalEmails"
                    className="mr-2"
                    checked={notificationSettings.promotionalEmails}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="promotionalEmails">Promotional Emails</label>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md flex items-center hover:bg-primary/90 transition-colors"
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw size={20} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
