"use client"

import { useState } from "react"
import { Save, RefreshCw, Bell, Truck, Database, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function DeliveryAdminSettings() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const [deliverySettings, setDeliverySettings] = useState({
    maxDeliveryDistance: 25,
    maxDeliveriesPerRoute: 10,
    defaultDeliveryTime: 30,
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    enableAutoAssignment: true,
    enableRouteOptimization: true,
    requireDeliveryPhoto: true,
    allowCashOnDelivery: true,
    emergencyContactEnabled: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    deliveryAlerts: true,
    performanceAlerts: true,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
  })

  const [systemSettings, setSystemSettings] = useState({
    apiRateLimit: 1000,
    dataRetentionDays: 365,
    backupFrequency: "daily",
    maintenanceWindow: "02:00",
    debugMode: false,
    analyticsEnabled: true,
    geoTrackingEnabled: true,
    realTimeUpdates: true,
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    googleMapsApiKey: "",
    twilioApiKey: "",
    firebaseConfig: "",
    webhookUrl: "",
    slackWebhook: "",
    enableThirdPartyIntegrations: true,
  })

  const handleSaveSettings = async (settingsType) => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Settings Saved",
        description: `${settingsType} settings have been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeliverySettingChange = (key, value) => {
    setDeliverySettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleNotificationSettingChange = (key, value) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSystemSettingChange = (key, value) => {
    setSystemSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleIntegrationSettingChange = (key, value) => {
    setIntegrationSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Delivery Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Configure delivery operations and system preferences</p>
        </div>
      </div>

      <Tabs defaultValue="delivery" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Delivery Configuration
              </CardTitle>
              <CardDescription>Configure delivery parameters and operational settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxDistance">Maximum Delivery Distance (km)</Label>
                  <Input
                    id="maxDistance"
                    type="number"
                    value={deliverySettings.maxDeliveryDistance}
                    onChange={(e) =>
                      handleDeliverySettingChange("maxDeliveryDistance", Number.parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDeliveries">Max Deliveries per Route</Label>
                  <Input
                    id="maxDeliveries"
                    type="number"
                    value={deliverySettings.maxDeliveriesPerRoute}
                    onChange={(e) =>
                      handleDeliverySettingChange("maxDeliveriesPerRoute", Number.parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">Default Delivery Time (minutes)</Label>
                  <Input
                    id="deliveryTime"
                    type="number"
                    value={deliverySettings.defaultDeliveryTime}
                    onChange={(e) =>
                      handleDeliverySettingChange("defaultDeliveryTime", Number.parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="time"
                      value={deliverySettings.workingHoursStart}
                      onChange={(e) => handleDeliverySettingChange("workingHoursStart", e.target.value)}
                    />
                    <Input
                      type="time"
                      value={deliverySettings.workingHoursEnd}
                      onChange={(e) => handleDeliverySettingChange("workingHoursEnd", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Assignment</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign deliveries to available partners
                    </p>
                  </div>
                  <Switch
                    checked={deliverySettings.enableAutoAssignment}
                    onCheckedChange={(checked) => handleDeliverySettingChange("enableAutoAssignment", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Route Optimization</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic route optimization</p>
                  </div>
                  <Switch
                    checked={deliverySettings.enableRouteOptimization}
                    onCheckedChange={(checked) => handleDeliverySettingChange("enableRouteOptimization", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Delivery Photo Required</Label>
                    <p className="text-sm text-muted-foreground">Require photo proof for delivery completion</p>
                  </div>
                  <Switch
                    checked={deliverySettings.requireDeliveryPhoto}
                    onCheckedChange={(checked) => handleDeliverySettingChange("requireDeliveryPhoto", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cash on Delivery</Label>
                    <p className="text-sm text-muted-foreground">Allow cash payments on delivery</p>
                  </div>
                  <Switch
                    checked={deliverySettings.allowCashOnDelivery}
                    onCheckedChange={(checked) => handleDeliverySettingChange("allowCashOnDelivery", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Emergency Contact</Label>
                    <p className="text-sm text-muted-foreground">Enable emergency contact for delivery partners</p>
                  </div>
                  <Switch
                    checked={deliverySettings.emergencyContactEnabled}
                    onCheckedChange={(checked) => handleDeliverySettingChange("emergencyContactEnabled", checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Delivery")} disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Delivery Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure notification channels and alert preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingChange("smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingChange("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Delivery Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alerts for delivery status changes</p>
                  </div>
                  <Switch
                    checked={notificationSettings.deliveryAlerts}
                    onCheckedChange={(checked) => handleNotificationSettingChange("deliveryAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Performance Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alerts for performance issues</p>
                  </div>
                  <Switch
                    checked={notificationSettings.performanceAlerts}
                    onCheckedChange={(checked) => handleNotificationSettingChange("performanceAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">System Alerts</Label>
                    <p className="text-sm text-muted-foreground">System maintenance and error alerts</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => handleNotificationSettingChange("systemAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly performance reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => handleNotificationSettingChange("weeklyReports", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Monthly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive monthly analytics reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.monthlyReports}
                    onCheckedChange={(checked) => handleNotificationSettingChange("monthlyReports", checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Notification")} disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                System Configuration
              </CardTitle>
              <CardDescription>Configure system performance and data management settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={systemSettings.apiRateLimit}
                    onChange={(e) => handleSystemSettingChange("apiRateLimit", Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={systemSettings.dataRetentionDays}
                    onChange={(e) => handleSystemSettingChange("dataRetentionDays", Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={systemSettings.backupFrequency}
                    onValueChange={(value) => handleSystemSettingChange("backupFrequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenanceWindow">Maintenance Window</Label>
                  <Input
                    id="maintenanceWindow"
                    type="time"
                    value={systemSettings.maintenanceWindow}
                    onChange={(e) => handleSystemSettingChange("maintenanceWindow", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
                  </div>
                  <Switch
                    checked={systemSettings.debugMode}
                    onCheckedChange={(checked) => handleSystemSettingChange("debugMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Analytics Enabled</Label>
                    <p className="text-sm text-muted-foreground">Collect and analyze system performance data</p>
                  </div>
                  <Switch
                    checked={systemSettings.analyticsEnabled}
                    onCheckedChange={(checked) => handleSystemSettingChange("analyticsEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Geo Tracking</Label>
                    <p className="text-sm text-muted-foreground">Enable location tracking for delivery partners</p>
                  </div>
                  <Switch
                    checked={systemSettings.geoTrackingEnabled}
                    onCheckedChange={(checked) => handleSystemSettingChange("geoTrackingEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Real-time Updates</Label>
                    <p className="text-sm text-muted-foreground">Enable real-time status updates</p>
                  </div>
                  <Switch
                    checked={systemSettings.realTimeUpdates}
                    onCheckedChange={(checked) => handleSystemSettingChange("realTimeUpdates", checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("System")} disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Third-party Integrations
              </CardTitle>
              <CardDescription>Configure external service integrations and API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="googleMapsApi">Google Maps API Key</Label>
                  <Input
                    id="googleMapsApi"
                    type="password"
                    placeholder="Enter Google Maps API key"
                    value={integrationSettings.googleMapsApiKey}
                    onChange={(e) => handleIntegrationSettingChange("googleMapsApiKey", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilioApi">Twilio API Key</Label>
                  <Input
                    id="twilioApi"
                    type="password"
                    placeholder="Enter Twilio API key for SMS"
                    value={integrationSettings.twilioApiKey}
                    onChange={(e) => handleIntegrationSettingChange("twilioApiKey", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firebaseConfig">Firebase Configuration</Label>
                  <Textarea
                    id="firebaseConfig"
                    placeholder="Enter Firebase configuration JSON"
                    value={integrationSettings.firebaseConfig}
                    onChange={(e) => handleIntegrationSettingChange("firebaseConfig", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    placeholder="https://your-webhook-url.com"
                    value={integrationSettings.webhookUrl}
                    onChange={(e) => handleIntegrationSettingChange("webhookUrl", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                  <Input
                    id="slackWebhook"
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={integrationSettings.slackWebhook}
                    onChange={(e) => handleIntegrationSettingChange("slackWebhook", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Third-party Integrations</Label>
                  <p className="text-sm text-muted-foreground">Allow external services to connect</p>
                </div>
                <Switch
                  checked={integrationSettings.enableThirdPartyIntegrations}
                  onCheckedChange={(checked) => handleIntegrationSettingChange("enableThirdPartyIntegrations", checked)}
                />
              </div>

              <Button onClick={() => handleSaveSettings("Integration")} disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Integration Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
