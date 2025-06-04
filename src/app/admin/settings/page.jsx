"use client"

import { useState, useEffect } from "react"
import { Save, RefreshCw } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getAdminSettings, updateAdminSettings } from "@/lib/fetch-without-auth" // Updated import path

export default function AdminSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Green Thicks",
    siteDescription: "Organic and fresh products delivered to your doorstep",
    contactEmail: "support@greenthicks.com",
    contactPhone: "+91 9876543210",
    address: "123 Main St, Hyderabad, 500001",
  })

  const [darkMode, setDarkMode] = useState(false)

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
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const [emailNotifications, setEmailNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [soundAlerts, setSoundAlerts] = useState(false)
  const [selectedRingtone, setSelectedRingtone] = useState("default")

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setError(null)
        const data = await getAdminSettings()

        if (data.general) {
          setGeneralSettings(data.general)
        }
        if (data.payment) {
          setPaymentSettings(data.payment)
        }
        if (data.delivery) {
          setDeliverySettings(data.delivery)
        }
        if (data.notification) {
          setNotificationSettings(data.notification)
          setEmailNotifications(data.notification.emailNotifications || false)
          setPushNotifications(data.notification.pushNotifications || false)
          setSmsNotifications(data.notification.smsNotifications || false)
          setSoundAlerts(data.notification.soundAlerts || false)
          setSelectedRingtone(data.notification.selectedRingtone || "default")
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

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
    setError(null)

    try {
      let settingsData

      switch (activeTab) {
        case "general":
          settingsData = generalSettings
          break
        case "payment":
          settingsData = paymentSettings
          break
        case "delivery":
          settingsData = deliverySettings
          break
        case "notification":
          settingsData = {
            ...notificationSettings,
            emailNotifications,
            pushNotifications,
            smsNotifications,
            soundAlerts,
            selectedRingtone,
          }
          break
        default:
          throw new Error("Invalid settings category")
      }

      await updateAdminSettings(activeTab, settingsData)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading settings...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

      {/* Error Message */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

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
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground pb-9">Toggle dark theme</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
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

            <div className="flex items-center justify-between">
              <div className="space-y-0.5 mt-5">
                <h3 className="text-base">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive emails for updates</p>
              </div>
              <Switch
                className="space-y-0.5 mt-5"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 mt-5">
                <h3 className="text-base">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive push alerts on device</p>
              </div>
              <Switch className="space-y-0.5 mt-5" checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
            <div className="flex items-center justify-between ">
              <div className="space-y-0.5 mt-5">
                <h3 className="text-base">SMS Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive SMS updates</p>
              </div>
              <Switch className="space-y-0.5 mt-5" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 mt-5">
                <h3 className="text-base">Sound Alerts</h3>
                <p className="text-sm text-muted-foreground space-y-9">Enable sound for notifications</p>
              </div>
              <Switch className="space-y-0.5 mt-5" checked={soundAlerts} onCheckedChange={setSoundAlerts} />
            </div>

            {/* NEW: Ringtone Select */}
            <div className="space-y-2 mt-5">
              <h3 htmlFor="ringtone">Notification Ringtone</h3>
              <Select className="space-y-0.5 mt-5" value={selectedRingtone} onValueChange={setSelectedRingtone}>
                <SelectTrigger id="ringtone" className="w-[200px]">
                  <SelectValue placeholder="Select ringtone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="chime">Chime</SelectItem>
                  <SelectItem value="ping">Ping</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                  <SelectItem value="beep">Beep</SelectItem>
                </SelectContent>
              </Select>
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
