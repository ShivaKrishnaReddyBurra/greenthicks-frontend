"use client"
import { AlertCircle, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const GoogleMapsApiError = ({
  errorType = "UNKNOWN_ERROR",
  errorMessage = "There was a problem with the Google Maps API",
  apiKey = "",
  onRetry = null,
}) => {
  const getErrorDetails = () => {
    switch (errorType) {
      case "BILLING_NOT_ENABLED":
        return {
          title: "Google Maps Billing Error",
          message: "Google Maps requires billing to be enabled on your Google Cloud account.",
          action: "Enable Billing",
          link: "https://console.cloud.google.com/project/_/billing/enable",
        }
      case "API_NOT_ACTIVATED":
        return {
          title: "Google Maps API Not Activated",
          message: "The Google Maps JavaScript API needs to be enabled in your Google Cloud Console.",
          action: "Enable API",
          link: "https://console.cloud.google.com/apis/library/maps-backend.googleapis.com",
        }
      case "INVALID_API_KEY":
        return {
          title: "Invalid API Key",
          message: "The Google Maps API key is invalid or restricted.",
          action: "Check API Key",
          link: "https://console.cloud.google.com/apis/credentials",
        }
      case "REFERER_NOT_ALLOWED":
        return {
          title: "Referer Not Allowed",
          message: "This website is not allowed to use the Google Maps API key.",
          action: "Update API Key",
          link: "https://console.cloud.google.com/apis/credentials",
        }
      default:
        return {
          title: "Google Maps Error",
          message: errorMessage || "There was a problem loading Google Maps.",
          action: "Google Maps Documentation",
          link: "https://developers.google.com/maps/documentation/javascript/error-messages",
        }
    }
  }

  const details = getErrorDetails()

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{details.title}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{details.message}</p>
        {apiKey && (
          <p className="text-xs text-muted-foreground mb-2">
            API Key: {apiKey.substring(0, 10)}...{apiKey.substring(apiKey.length - 4)}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
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
            <a href={details.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
              {details.action}
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

export default GoogleMapsApiError
