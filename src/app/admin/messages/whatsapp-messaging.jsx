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
import { sendWhatsApp } from "./actions"
import { Switch } from "@/components/ui/switch"

const WHATSAPP_TEMPLATES = [
  { id: "custom", name: "Custom Message" },
  { id: "order-update", name: "Order Update" },
  { id: "delivery-notification", name: "Delivery Notification" },
  { id: "promotional", name: "Promotional Message" },
]

export default function WhatsAppMessaging() {
  const { status, setStatus, error, setError, success, setSuccess } = useMessage()
  const [template, setTemplate] = useState("custom")
  const [phoneNumbers, setPhoneNumbers] = useState([""])
  const [message, setMessage] = useState("")
  const [includeMedia, setIncludeMedia] = useState(false)
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaCaption, setMediaCaption] = useState("")

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

      // Prepare data
      const data = {
        template,
        phoneNumber: validPhoneNumbers.join(","), // Join multiple phone numbers
        message,
        includeMedia,
        mediaUrl: includeMedia ? mediaUrl : "",
        mediaCaption: includeMedia ? mediaCaption : "",
      }

      // Call the server action
      const result = await sendWhatsApp(data)

      if (result.success) {
        setStatus("success")
        setSuccess(result.message || "WhatsApp message sent successfully!")
      } else {
        setStatus("error")
        setError(result.error || "Failed to send WhatsApp message")
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
          <Label htmlFor="template">Message Template</Label>
          <Select
            value={template}
            onValueChange={(value) => {
              setTemplate(value)
              // Reset fields when changing templates
              if (value === "custom") {
                setMessage("")
              } else if (value === "order-update") {
                setMessage(
                  "Your order #12345 has been updated. Current status: Processing. Expected delivery: Tomorrow between 2-4 PM.",
                )
              } else if (value === "delivery-notification") {
                setMessage(
                  "Your GreenThicks order is out for delivery! Your fresh produce will arrive within the next 2 hours.",
                )
              } else if (value === "promotional") {
                setMessage(
                  "🌱 Weekend Special at GreenThicks! Get 20% off on all organic vegetables. Use code FRESH20 at checkout. Valid until Sunday. Shop now: https://greenthicks.live",
                )
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {WHATSAPP_TEMPLATES.map((tmpl) => (
                <SelectItem key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>WhatsApp Numbers</Label>
          <div className="space-y-2">
            {phoneNumbers.map((phoneNumber, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="+91 9723456789"
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

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Enter your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="include-media" checked={includeMedia} onCheckedChange={setIncludeMedia} />
          <Label htmlFor="include-media">Include Media</Label>
        </div>

        {includeMedia && (
          <>
            <div>
              <Label htmlFor="mediaUrl">Media URL</Label>
              <Input
                id="mediaUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Supported formats: JPG, PNG, PDF (max 5MB)</p>
            </div>

            <div>
              <Label htmlFor="mediaCaption">Media Caption (Optional)</Label>
              <Input
                id="mediaCaption"
                placeholder="Caption for your media"
                value={mediaCaption}
                onChange={(e) => setMediaCaption(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send WhatsApp Message"
        )}
      </Button>
    </form>
  )
}