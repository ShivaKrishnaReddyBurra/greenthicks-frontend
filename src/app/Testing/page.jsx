"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createSubscriptionPlan, getProducts } from "@/lib/api"

const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  )
}

export default function CreateSubscriptionPlanPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    frequency: "weekly",
    discount: "",
    features: [],
    items: [],
    active: true,
    popular: false,
  })
  const [products, setProducts] = useState([])
  const [newFeature, setNewFeature] = useState("")
  const [selectedProducts, setSelectedProducts] = useState([])
  const [actionLoading, setActionLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const actionTimeout = useRef(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data.products || [])
      } catch (error) {
        console.error("Error fetching products:", error)
        // Mock products for preview
        setProducts([
          { globalId: 1, name: "Tomatoes", price: 40 },
          { globalId: 2, name: "Onions", price: 30 },
          { globalId: 3, name: "Potatoes", price: 25 },
          { globalId: 4, name: "Carrots", price: 35 },
          { globalId: 5, name: "Spinach", price: 20 },
          { globalId: 6, name: "Broccoli", price: 60 },
        ])
      }
    }

    fetchProducts()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const toggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.globalId === product.globalId)
      if (exists) {
        return prev.filter((p) => p.globalId !== product.globalId)
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  const updateProductQuantity = (productId, quantity) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.globalId === productId ? { ...p, quantity: Math.max(1, quantity) } : p)),
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    clearTimeout(actionTimeout.current)
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true)
      try {
        const planData = {
          ...formData,
          price: Number.parseFloat(formData.price),
          originalPrice: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : null,
          discount: formData.discount ? Number.parseFloat(formData.discount) : 0,
          items: selectedProducts.map((p) => ({
            productId: p.globalId,
            name: p.name,
            quantity: p.quantity,
            price: p.price,
          })),
        }

        await createSubscriptionPlan(planData)

        toast({
          title: "Plan Created",
          description: "Subscription plan has been created successfully.",
        })

        router.push("/admin/subscriptions")
      } catch (error) {
        console.error("Error creating plan:", error)
        toast({
          title: "Preview Mode",
          description: "Plan would be created in live version.",
        })
      } finally {
        setActionLoading(false)
      }
    }, 500)
  }

  const handleNavigation = async (e, href) => {
    e.preventDefault()
    setActionLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push(href)
    setActionLoading(false)
  }

  return (
    <>
      {actionLoading && <LeafLoader />}
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/admin/subscriptions"
              onClick={(e) => handleNavigation(e, "/admin/subscriptions")}
              className="inline-flex items-center text-primary hover:underline text-sm sm:text-base"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Subscriptions
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Create Subscription Plan</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Create a new subscription plan for customers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details for the subscription plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Weekly Fresh Box"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency *</Label>
                    <select
                      id="frequency"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3"
                      required
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what's included in this subscription plan"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="299.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="399.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount %</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="active"
                      name="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="popular"
                      name="popular"
                      checked={formData.popular}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, popular: checked }))}
                    />
                    <Label htmlFor="popular">Mark as Popular</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>Add features and benefits of this subscription plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature (e.g., Free delivery)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <span>{feature}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Included Products</CardTitle>
                <CardDescription>Select products to include in this subscription plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {products.map((product) => {
                    const isSelected = selectedProducts.find((p) => p.globalId === product.globalId)
                    return (
                      <div
                        key={product.globalId}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                        onClick={() => toggleProduct(product)}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox checked={!!isSelected} readOnly />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300">₹{product.price}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="mt-2">
                            <Label className="text-xs">Quantity:</Label>
                            <Input
                              type="number"
                              min="1"
                              value={isSelected.quantity}
                              onChange={(e) => updateProductQuantity(product.globalId, Number.parseInt(e.target.value))}
                              className="mt-1 h-8"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {selectedProducts.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Selected Products:</h4>
                    <div className="space-y-2">
                      {selectedProducts.map((product) => (
                        <div
                          key={product.globalId}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                          <span className="text-sm">
                            {product.name} x {product.quantity}
                          </span>
                          <Badge variant="outline">₹{(product.price * product.quantity).toFixed(2)}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Link href="/admin/subscriptions" onClick={(e) => handleNavigation(e, "/admin/subscriptions")}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={actionLoading}>
                <Save className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
