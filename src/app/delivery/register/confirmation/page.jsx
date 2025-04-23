"use client"

import Link from "next/link"
import React from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Home } from "lucide-react"

export default function RegistrationConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/20 p-3">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Application Submitted!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for applying to be a delivery partner with Green Thicks. We've received your application and will
          review it shortly.
        </p>

        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="flex justify-between mb-4">
            <span className="text-muted-foreground">Application ID:</span>
            <span className="font-medium">APP-{Math.floor(10000 + Math.random() * 90000)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated Review Time:</span>
            <span className="font-medium">2-3 business days</span>
          </div>
        </div>

        <div className="bg-primary/10 rounded-lg border border-primary/20 p-4 mb-8">
          <p className="text-sm">
            We'll notify you via email and SMS once your application has been reviewed. If approved, you'll receive
            instructions on how to get started.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>

          <Link href="/delivery/login">
            <Button className="w-full sm:w-auto">
              Check Application Status
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
