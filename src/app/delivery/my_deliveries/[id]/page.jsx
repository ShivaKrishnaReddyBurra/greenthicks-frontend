"use client"
import { DeliveryLayout } from "@/components/delivery-layout"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation,
  MessageSquare,
  Camera,
} from "lucide-react"

// Mock data for the delivery
const getDeliveryData = (id) => {
  return {
    id: id,
    orderId: "ORD-5678",
    type: "order",
    status: "pending",
    assignedAt: "2023-05-01T10:30:00",
    deliveryTime: "2023-05-01T14:00:00",
    amount: 450,
    earnings: 60,
    distance: "3.2 km",
    customer: {
      name: "Rahul Sharma",
      phone: "+91 9876543210",
      address: "123 Main Street, Bangalore, Karnataka, 560001",
      location: {
        lat: 12.9716,
        lng: 77.5946,
      },
    },
    items: [
      { name: "Organic Tomatoes", quantity: 2, price: 80 },
      { name: "Fresh Spinach", quantity: 1, price: 60 },
    ],
    notes: "Please deliver to the front door. Call when you arrive.",
    timeline: [
      {
        status: "Assigned",
        time: "2023-05-01T10:30:00",
        description: "Delivery assigned to you",
      },
    ],
    paymentMethod: "Online Payment (Completed)",
    photos: [], // For proof of delivery
  }
}

export default function DeliveryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [delivery, setDelivery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationAction, setConfirmationAction] = useState(null)
  const [processingAction, setProcessingAction] = useState(false)
  const [deliveryNote, setDeliveryNote] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")
  const [selectedImage, setSelectedImage] = useState(null)
  const [deliveryPhotos, setDeliveryPhotos] = useState([])

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDelivery(getDeliveryData(params.id))
      setLoading(false)
    }, 500)
  }, [params.id])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Completed
          </span>
        )
      case "accepted":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Accepted
          </span>
        )
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Pending
          </span>
        )
      case "declined":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Declined
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        )
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5 text-green-500" />
      case "refund":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const handleAcceptDelivery = () => {
    setConfirmationAction("accept")
    setShowConfirmation(true)
  }

  const handleDeclineDelivery = () => {
    setConfirmationAction("decline")
    setShowConfirmation(true)
  }

  const handleCompleteDelivery = () => {
    if (delivery.type === "order" && deliveryPhotos.length === 0) {
      setNotificationType("error")
      setNotificationMessage("Please add at least one photo as proof of delivery")
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
      return
    }
    
    setConfirmationAction("complete")
    setShowConfirmation(true)
  }

  const confirmAction = () => {
    setProcessingAction(true)
    setShowConfirmation(false)

    // Simulate API call
    setTimeout(() => {
      const updatedDelivery = { ...delivery }
      
      if (confirmationAction === "accept") {
        updatedDelivery.status = "accepted"
        updatedDelivery.timeline.push({
          status: "Accepted",
          time: new Date().toISOString(),
          description: "Delivery accepted by you"
        })
        setNotificationType("success")
        setNotificationMessage("Delivery accepted successfully!")
      } else if (confirmationAction === "decline") {
        updatedDelivery.status = "declined"
        updatedDelivery.timeline.push({
          status: "Declined",
          time: new Date().toISOString(),
          description: "Delivery declined by you"
        })
        setNotificationType("info")
        setNotificationMessage("Delivery declined")
      } else if (confirmationAction === "complete") {
        updatedDelivery.status = "completed"
        updatedDelivery.timeline.push({
          status: "Completed",
          time: new Date().toISOString(),
          description: deliveryNote ? `Delivery completed. Note: ${deliveryNote}` : "Delivery completed successfully"
        })
        updatedDelivery.photos = [...deliveryPhotos]
        setNotificationType("success")
        setNotificationMessage("Delivery marked as completed!")
      }

      setDelivery(updatedDelivery)
      setProcessingAction(false)
      setDeliveryNote("")
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }, 1500)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setDeliveryPhotos([...deliveryPhotos, event.target.result])
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index) => {
    const updatedPhotos = [...deliveryPhotos]
    updatedPhotos.splice(index, 1)
    setDeliveryPhotos(updatedPhotos)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded mt-6"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mt-6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!delivery) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Delivery Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The delivery you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/delivery/my-deliveries"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Deliveries
          </Link>
        </div>
      </div>
    )
  }

  return (
    <DeliveryLayout>
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Notification */}
        {showNotification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notificationType === "success" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : 
            notificationType === "info" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" :
            "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
          }`}>
            {notificationMessage}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link
              href="/delivery/my-deliveries"
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                {getTypeIcon(delivery.type)}
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {delivery.type === "order" ? "Order" : "Refund"} #{delivery.orderId}
                </h1>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Delivery ID: {delivery.id}
              </p>
            </div>
          </div>
          <div>{getStatusBadge(delivery.status)}</div>
        </div>

        {/* Action Buttons */}
        {delivery.status === "pending" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Delivery Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAcceptDelivery}
                disabled={processingAction}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Delivery
              </button>
              <button
                onClick={handleDeclineDelivery}
                disabled={processingAction}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline Delivery
              </button>
            </div>
          </div>
        )}

        {/* Complete Delivery Section */}
        {delivery.status === "accepted" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Complete Delivery</h2>
            
            {delivery.type === "order" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Proof of Delivery
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {deliveryPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={photo || "/placeholder.svg"} 
                        alt={`Delivery proof ${index + 1}`} 
                        className="h-24 w-full object-cover rounded-lg cursor-pointer"
                        onClick={() => setSelectedImage(photo)}
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                  {deliveryPhotos.length < 4 && (
                    <div className="h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                      <label className="cursor-pointer flex flex-col items-center">
                        <Camera className="h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">Add Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="deliveryNote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Delivery Note (Optional)
              </label>
              <textarea
                id="deliveryNote"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                placeholder="Add any notes about the delivery"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleCompleteDelivery}
                disabled={processingAction}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Completed
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{delivery.customer.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{delivery.customer.phone}</h3>
                  <a 
                    href={`tel:${delivery.customer.phone}`} 
                    className="text-sm text-green-600 dark:text-green-400 hover:underline"
                  >
                    Call Customer
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{delivery.customer.address}</h3>
                  <div className="flex space-x-2 mt-1">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${delivery.customer.location.lat},${delivery.customer.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Open in Maps
                    </a>
                    <Link 
                      href="/delivery/map" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View in App Map
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Delivery Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Assigned At:</span>
                <span className="font-medium text-gray-800 dark:text-white flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  {formatDate(delivery.assignedAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expected Delivery:</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {formatDate(delivery.deliveryTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                <span className="font-medium text-gray-800 dark:text-white">{delivery.distance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span className="font-medium text-gray-800 dark:text-white">{delivery.paymentMethod}</span>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800 dark:text-white">Order Amount:</span>
                  <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(delivery.amount)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-semibold text-gray-800 dark:text-white">Your Earnings:</span>
                  <span className="font-bold text-green-600">{formatCurrency(delivery.earnings)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {delivery.type === "order" ? "Order Items" : "Refund Details"}
            </h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {delivery.items.map((item, index) => (
              <div key={index} className="p-6 flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white">
                      {item.name} {item.quantity > 1 ? `(${item.quantity}x)` : ""}
                    </h3>
                    {item.price && (
                      <p className="ml-4 text-base font-medium text-gray-800 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Notes */}
        {delivery.notes && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Delivery Notes
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">{delivery.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Photos - Only show for completed deliveries */}
        {delivery.status === "completed" && delivery.photos && delivery.photos.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <Camera className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Delivery Photos
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {delivery.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
                    onClick={() => setSelectedImage(photo)}
                  >
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Delivery photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delivery Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Delivery Timeline</h2>
          </div>
          <div className="p-6">
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {delivery.timeline.map((event, index) => (
                <li key={index} className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-green-900">
                    {event.status === "Assigned" && (
                      <Package className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Accepted" && (
                      <CheckCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Completed" && (
                      <CheckCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Declined" && (
                      <XCircle className="w-3 h-3 text-red-800 dark:text-red-300" />
                    )}
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-800 dark:text-white">
                    {event.status}
                  </h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                    {formatDate(event.time)}
                  </time>
                  <p className="text-base font-normal text-gray-600 dark:text-gray-400">{event.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg\  black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Selected Image" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
    </DeliveryLayout>
  );
}
