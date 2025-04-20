
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, CreditCard, Banknote, Wallet } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { products } from "@/data/products";

// Step type definition
type CheckoutStep = "address" | "payment" | "review";

// Payment method type definition
type PaymentMethod = "credit" | "upi" | "cod";

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  
  // Form state
  const [formData, setFormData] = useState({
    // Address form
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    saveAddress: false,
    
    // Payment form
    paymentMethod: "credit" as PaymentMethod,
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    upiId: "",
  });
  
  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleNext = () => {
    if (currentStep === "address") {
      // Validate address form
      if (!formData.fullName || !formData.email || !formData.phone || 
          !formData.address || !formData.city || !formData.state || !formData.postalCode) {
        toast.error("Please fill in all required fields");
        return;
      }
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      // Validate payment form based on selected payment method
      if (formData.paymentMethod === "credit") {
        if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCvv) {
          toast.error("Please fill in all card details");
          return;
        }
      } else if (formData.paymentMethod === "upi") {
        if (!formData.upiId) {
          toast.error("Please enter your UPI ID");
          return;
        }
      }
      setCurrentStep("review");
    } else if (currentStep === "review") {
      // Place order
      navigate("/checkout/success");
    }
  };
  
  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("address");
    } else if (currentStep === "review") {
      setCurrentStep("payment");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 leaf-pattern py-8">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
            
            {/* Checkout Steps */}
            <div className="flex justify-between mb-8">
              <div 
                className={cn(
                  "flex-1 text-center", 
                  currentStep === "address" ? "text-primary" : "text-gray-500"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2",
                  currentStep === "address" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                )}>
                  1
                </div>
                <span className="text-sm">Address</span>
              </div>
              <div className="flex-1 flex items-center">
                <div className={cn(
                  "h-0.5 w-full", 
                  (currentStep === "payment" || currentStep === "review") ? "bg-primary" : "bg-gray-200"
                )}></div>
              </div>
              <div 
                className={cn(
                  "flex-1 text-center", 
                  currentStep === "payment" ? "text-primary" : 
                  currentStep === "review" ? "text-gray-900" : "text-gray-500"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2",
                  currentStep === "payment" ? "bg-primary text-white" : 
                  currentStep === "review" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-700"
                )}>
                  2
                </div>
                <span className="text-sm">Payment</span>
              </div>
              <div className="flex-1 flex items-center">
                <div className={cn(
                  "h-0.5 w-full", 
                  currentStep === "review" ? "bg-primary" : "bg-gray-200"
                )}></div>
              </div>
              <div 
                className={cn(
                  "flex-1 text-center", 
                  currentStep === "review" ? "text-primary" : "text-gray-500"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2",
                  currentStep === "review" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                )}>
                  3
                </div>
                <span className="text-sm">Review</span>
              </div>
            </div>
            
            {/* Address Step */}
            {currentStep === "address" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-gray-900">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      placeholder="John Doe"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="john@example.com"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="(123) 456-7890"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      placeholder="123 Main St, Apt 4B"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state"
                        value={formData.state}
                        onChange={(e) => updateFormData("state", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input 
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => updateFormData("postalCode", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="saveAddress" 
                        checked={formData.saveAddress}
                        onCheckedChange={(checked) => 
                          updateFormData("saveAddress", checked === true)
                        }
                      />
                      <Label htmlFor="saveAddress">Save this address for future orders</Label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button 
                    variant="outline" 
                    asChild
                  >
                    <Link to="/cart">
                      Back to Cart
                    </Link>
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="btn-hover"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}
            
            {/* Payment Step */}
            {currentStep === "payment" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-gray-900">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                
                <RadioGroup 
                  value={formData.paymentMethod}
                  onValueChange={(value) => updateFormData("paymentMethod", value)}
                  className="grid gap-4"
                >
                  {/* Credit Card Option */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="payment-credit" />
                      <Label htmlFor="payment-credit" className="font-medium">Credit / Debit Card</Label>
                      <div className="ml-auto flex space-x-1">
                        <div className="w-8 h-5 bg-blue-600 rounded"></div>
                        <div className="w-8 h-5 bg-red-500 rounded"></div>
                        <div className="w-8 h-5 bg-green-500 rounded"></div>
                      </div>
                    </div>
                    
                    {formData.paymentMethod === "credit" && (
                      <div className="mt-4 pl-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input 
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => updateFormData("cardNumber", e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="sm:col-span-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input 
                            id="cardName"
                            value={formData.cardName}
                            onChange={(e) => updateFormData("cardName", e.target.value)}
                            placeholder="John Doe"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cardExpiry">Expiry Date</Label>
                          <Input 
                            id="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={(e) => updateFormData("cardExpiry", e.target.value)}
                            placeholder="MM/YY"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input 
                            id="cardCvv"
                            value={formData.cardCvv}
                            onChange={(e) => updateFormData("cardCvv", e.target.value)}
                            placeholder="123"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* UPI Option */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="payment-upi" />
                      <Label htmlFor="payment-upi" className="font-medium">UPI</Label>
                      <div className="ml-auto">
                        <div className="w-8 h-5 bg-purple-500 rounded"></div>
                      </div>
                    </div>
                    
                    {formData.paymentMethod === "upi" && (
                      <div className="mt-4 pl-6">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input 
                          id="upiId"
                          value={formData.upiId}
                          onChange={(e) => updateFormData("upiId", e.target.value)}
                          placeholder="yourname@upi"
                          className="mt-1"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          You'll receive a payment request on your UPI app.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Cash on Delivery Option */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="payment-cod" />
                      <Label htmlFor="payment-cod" className="font-medium">Cash on Delivery</Label>
                      <Banknote className="ml-auto h-5 w-5" />
                    </div>
                    
                    {formData.paymentMethod === "cod" && (
                      <div className="mt-2 pl-6">
                        <p className="text-sm text-gray-500">
                          Pay with cash when your order is delivered.
                        </p>
                      </div>
                    )}
                  </div>
                </RadioGroup>
                
                <div className="mt-8 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                  >
                    Back to Address
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="btn-hover"
                  >
                    Review Order
                  </Button>
                </div>
              </div>
            )}
            
            {/* Review Step */}
            {currentStep === "review" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Review</h2>
                
                {/* Delivery Address Summary */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Delivery Address</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{formData.fullName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.postalCode}</p>
                    <p>{formData.phone}</p>
                  </div>
                </div>
                
                {/* Payment Method Summary */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Payment Method</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {formData.paymentMethod === "credit" && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Credit Card ending in {formData.cardNumber.slice(-4)}</span>
                      </div>
                    )}
                    {formData.paymentMethod === "upi" && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        <span>UPI - {formData.upiId}</span>
                      </div>
                    )}
                    {formData.paymentMethod === "cod" && (
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        <span>Cash on Delivery</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded overflow-hidden">
                          <img 
                            src={products[0].image}
                            alt={products[0].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{products[0].name}</p>
                          <p className="text-sm text-gray-500">Qty: 2</p>
                        </div>
                      </div>
                      <p className="font-medium">${(products[0].price * 2).toFixed(2)}</p>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded overflow-hidden">
                          <img 
                            src={products[1].image}
                            alt={products[1].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{products[1].name}</p>
                          <p className="text-sm text-gray-500">Qty: 1</p>
                        </div>
                      </div>
                      <p className="font-medium">${products[1].price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${(products[0].price * 2 + products[1].price).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount</span>
                        <span className="text-green-600">-$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>$4.99</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${(products[0].price * 2 + products[1].price + 4.99).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center mb-4">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-sm ml-2">
                      I agree to the <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </Label>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handleBack}
                    >
                      Back to Payment
                    </Button>
                    <Button 
                      onClick={handleNext}
                      className="btn-hover"
                    >
                      Place Order
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
