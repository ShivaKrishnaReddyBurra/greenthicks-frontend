"use client"
import { AlertCircle, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const GoogleMapsBillingError = ({ onRetry = null }) => {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Google Maps Billing Required</AlertTitle>
      <AlertDescription>
        <p className="mb-2">Google Maps requires billing to be enabled on your Google Cloud account to display maps.</p>
        <p className="text-xs text-muted-foreground mb-4">
          You need to enable billing in your Google Cloud Console and ensure the Maps JavaScript API is enabled.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onRetry) {
                onRetry()
              } else {
                window.location.reload()
              }
            }}
          >
            Try Again
          </Button>
          <Button size="sm" asChild>
            <a
              href="https://console.cloud.google.com/project/_/billing/enable"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              Enable Billing
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a
              href="https://developers.google.com/maps/documentation/javascript/error-messages#api-not-activated-map-error"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              Documentation
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

export default GoogleMapsBillingError
