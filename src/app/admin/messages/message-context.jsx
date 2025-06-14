"use client"

import { createContext, useContext, useState } from "react"

const MessageContext = createContext(undefined)

export function MessageProvider({ children }) {
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  return (
    <MessageContext.Provider
      value={{
        status,
        setStatus,
        error,
        setError,
        success,
        setSuccess,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export function useMessage() {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error("useMessage must be used within a MessageProvider")
  }
  return context
}