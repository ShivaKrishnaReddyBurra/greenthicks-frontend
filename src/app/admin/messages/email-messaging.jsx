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
import { sendEmail } from "./actions"

const EMAIL_TEMPLATES = [
  { id: "custom", name: "Custom Email" },
  { id: "verification", name: "Verification Email" },
  { id: "welcome", name: "Welcome Email" },
  { id: "order-placed", name: "Order Placed" },
  { id: "order-status", name: "Order Status Update" },
  { id: "order-cancelled", name: "Order Cancelled" },
]

export default function EmailMessaging() {
  const { status, setStatus, error, setError, success, setSuccess } = useMessage()
  const [template, setTemplate] = useState("custom")
  const [recipients, setRecipients] = useState([""])
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [orderData, setOrderData] = useState("")
  const [orderStatus, setOrderStatus] = useState("processing")

  const addRecipient = () => {
    setRecipients([...recipients, ""])
  }

  const removeRecipient = (index) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index))
    }
  }

  const updateRecipient = (index, value) => {
    const newRecipients = [...recipients]
    newRecipients[index] = value
    setRecipients(newRecipients)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("sending")
    setError(null)
    setSuccess(null)

    try {
      // Filter out empty recipients
      const validRecipients = recipients.filter((email) => email.trim())

      if (validRecipients.length === 0) {
        setStatus("error")
        setError("At least one recipient email is required")
        return
      }

      // Prepare data based on template
      const data = {
        template,
        recipient: validRecipients.join(","), // Join multiple recipients
        subject,
        message,
      }

      if (["order-placed", "order-status", "order-cancelled"].includes(template)) {
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
      const result = await sendEmail(data)

      if (result.success) {
        setStatus("success")
        setSuccess(result.message || "Email sent successfully!")
      } else {
        setStatus("error")
        setError(result.error || "Failed to send email")
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
          <Label htmlFor="template">Email Template</Label>
          <Select
            value={template}
            onValueChange={(value) => {
              setTemplate(value)
              // Reset fields when changing templates
              if (value === "custom") {
                setSubject("")
                setMessage("")
              } else if (value === "verification") {
                setSubject("Verify Your Email Address")
                setMessage("Please verify your email address to complete your registration.")
              } else if (value === "welcome") {
                setSubject("Welcome to GreenThicks!")
                setMessage("Thank you for joining GreenThicks. We're excited to have you on board!")
              } else if (value === "order-placed") {
                setSubject("Your Order Has Been Placed")
                setMessage("Thank you for your order. We'll notify you when it ships.")
              } else if (value === "order-status") {
                setSubject("Order Status Update")
                setMessage("Your order status has been updated.")
              } else if (value === "order-cancelled") {
                setSubject("Your Order Has Been Cancelled")
                setMessage("Your order has been cancelled as requested.")
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {EMAIL_TEMPLATES.map((tmpl) => (
                <SelectItem key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Recipient Emails</Label>
          <div className="space-y-2">
            {recipients.map((recipient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="customer@example.com"
                  value={recipient}
                  onChange={(e) => updateRecipient(index, e.target.value)}
                  required={index === 0}
                  className="flex-1"
                />
                {recipients.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeRecipient(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addRecipient} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Recipient
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        {["order-placed", "order-status", "order-cancelled"].includes(template) && (
          <>
            <div>
              <Label htmlFor="orderData">Order Data (JSON)</Label>
              <Textarea
                id="orderData"
                placeholder='{"id": "12345", "total": 99.99, "items": [], "shippingAddress": {}}'
                value={orderData}
                onChange={(e) => setOrderData(e.target.value)}
                className="font-mono text-sm"
                rows={5}
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
            rows={6}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Email"
        )}
      </Button>
    </form>
  )
}