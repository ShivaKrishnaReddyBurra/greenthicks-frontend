"use server"

import { getAuthToken } from "@/lib/auth-utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function sendEmail(data) {
  try {
    const token = getAuthToken()

    if (!token) {
      return { success: false, error: "Authentication required" }
    }

    // Convert single recipient to array for bulk processing
    const recipients = data.recipient
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email)

    const response = await fetch(`${API_BASE_URL}/messaging/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        template: data.template,
        recipients,
        subject: data.subject,
        message: data.message,
        orderData: data.orderData,
        orderStatus: data.orderStatus,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || "Failed to send email" }
    }

    return { success: true, message: result.message }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error: "Network error occurred" }
  }
}

export async function sendSms(data) {
  try {
    const token = getAuthToken()

    if (!token) {
      return { success: false, error: "Authentication required" }
    }

    // Convert single phone number to array for bulk processing
    const phoneNumbers = data.phoneNumber
      .split(",")
      .map((phone) => phone.trim())
      .filter((phone) => phone)

    const response = await fetch(`${API_BASE_URL}/messaging/sms/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        template: data.template,
        phoneNumbers,
        message: data.message,
        orderData: data.orderData,
        orderStatus: data.orderStatus,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || "Failed to send SMS" }
    }

    return { success: true, message: result.message }
  } catch (error) {
    console.error("SMS sending error:", error)
    return { success: false, error: "Network error occurred" }
  }
}

export async function sendWhatsApp(data) {
  try {
    const token = getAuthToken()

    if (!token) {
      return { success: false, error: "Authentication required" }
    }

    // Convert single phone number to array for bulk processing
    const phoneNumbers = data.phoneNumber
      .split(",")
      .map((phone) => phone.trim())
      .filter((phone) => phone)

    const response = await fetch(`${API_BASE_URL}/messaging/whatsapp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        template: data.template,
        phoneNumbers,
        message: data.message,
        includeMedia: data.includeMedia,
        mediaUrl: data.mediaUrl,
        mediaCaption: data.mediaCaption,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || "Failed to send WhatsApp message" }
    }

    return { success: true, message: result.message }
  } catch (error) {
    console.error("WhatsApp sending error:", error)
    return { success: false, error: "Network error occurred" }
  }
}