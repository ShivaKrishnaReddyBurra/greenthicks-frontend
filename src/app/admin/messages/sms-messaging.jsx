"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMessage } from "./message-context"
import { AlertCircle, CheckCircle2, Loader2, Plus, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { sendSms } from "./actions"

const SMS_TEMPLATES = [
  { id: "custom", name: "Custom SMS" },
  { id: "order-placed", name: "Order Placed" },
  { id: "order-status", name: "Order Status Update" },
]

export default function SmsMessaging() {
  const { status, setStatus, error, setError, success, setSuccess } = useMessage()
  const [template, setTemplate] = useState("custom")
  const [phoneNumbers, setPhoneNumbers] = useState([""])
  const [message, setMessage] = useState("")
  const [orderData, setOrderData] = useState("")
  const [orderStatus, setOrderStatus] = useState("processing")

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""])
  }

  const removePhoneNumber = (index) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index))
    }
  }

  const updatePhoneNumber = (index, value) => {
    const newPhoneNumbers = [...phoneNumbers]
    newPhoneNumbers[index] = value
    setPhoneNumbers(newPhoneNumbers)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("sending")
    setError(null)
    setSuccess(null)

    try {
      // Filter out empty phone numbers
      const validPhoneNumbers = phoneNumbers.filter((phone) => phone.trim())

      if (validPhoneNumbers.length === 0) {
        setStatus("error")
        setError("At least one phone number is required")
        return
      }

      // Prepare data based on template
      const data = {
        template,
        phoneNumber: validPhoneNumbers.join(","), // Join multiple phone numbers
        message,
      }

      if (["order-placed", "order-status"].includes(template)) {
        try {
          const parsedOrderData = JSON.parse(orderData)
          data.orderData = parsedOrderData
          data.orderStatus = orderStatus
        } catch (err) {
          setStatus("error")
          setError("Invalid order data JSON format")
          return
        }
      }

      // Call the server action
      const result = await sendSms(data)

      if (result.success) {
        setStatus("success")
        setSuccess(result.message || "SMS sent successfully!")
      } else {
        setStatus("error")
        setError(result.error || "Failed to send SMS")
      }
    } catch (err) {
      setStatus("error")
      setError(err.message || "An unexpected error occurred")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === "success" && (
        <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="template">SMS Template</Label>
          <Select
            value={template}
            onValueChange={(value) => {
              setTemplate(value)
              // Reset fields when changing templates
              if (value === "custom") {
                setMessage("")
              } else if (value === "order-placed") {
                setMessage("Your order has been placed. Thank you for shopping with GreenThicks!")
              } else if (value === "order-status") {
                setMessage("Your order status has been updated.")
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {SMS_TEMPLATES.map((tmpl) => (
                <SelectItem key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Phone Numbers</Label>
          <div className="space-y-2">
            {phoneNumbers.map((phoneNumber, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="+91 9705045597"
                  value={phoneNumber}
                  onChange={(e) => updatePhoneNumber(index, e.target.value)}
                  required={index === 0}
                  className="flex-1"
                />
                {phoneNumbers.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removePhoneNumber(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addPhoneNumber} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Phone Number
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +1 for US)</p>
        </div>

        {["order-placed", "order-status"].includes(template) && (
          <>
            <div>
              <Label htmlFor="orderData">Order Data (JSON)</Label>
              <Textarea
                id="orderData"
                placeholder='{"id": "12345", "total": 99.99, "items": [], "shippingAddress": {}}'
                value={orderData}
                onChange={(e) => setOrderData(e.target.value)}
                className="font-mono text-sm"
                rows={3}
                required
              />
            </div>

            {template === "order-status" && (
              <div>
                <Label htmlFor="orderStatus">Order Status</Label>
                <Select value={orderStatus} onValueChange={setOrderStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Enter your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground mt-1">{message.length}/160 characters</p>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send SMS"
        )}
      </Button>
    </form>
  )
}