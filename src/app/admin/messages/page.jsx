"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Mail, MessageSquare, Send } from "lucide-react"
import EmailMessaging from "./email-messaging"
import SmsMessaging from "./sms-messaging"
import WhatsAppMessaging from "./whatsapp-messaging"
import { MessageProvider } from "./message-context"

export default function MessagingDashboard() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("email")

  return (
    <MessageProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mail_logo-TOPo4i5gmpaT2eAqEeizteg64AILgK.png"
              alt="GreenThicks Logo"
              className="h-12 w-12 rounded-full"
            />
            <h1 className="text-2xl font-bold">Messaging Center</h1>
          </div>

        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>GreenThicks Messaging</CardTitle>
            <CardDescription>Send emails, SMS, and WhatsApp messages to your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Email</span>
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">SMS</span>
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="email">
                <EmailMessaging />
              </TabsContent>
              <TabsContent value="sms">
                <SmsMessaging />
              </TabsContent>
              <TabsContent value="whatsapp">
                <WhatsAppMessaging />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MessageProvider>
  )
}
