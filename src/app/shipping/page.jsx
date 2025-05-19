import { Truck, Clock, MapPin, AlertCircle } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="leaf-pattern-2">
        <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shipping & Delivery</h1>
          <p className="text-muted-foreground">
            Information about our shipping policies, delivery areas, and timelines.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Delivery Areas</h2>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <p className="mb-4">
                Green Thicks currently delivers to the following cities and their surrounding areas:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="bg-muted/50 p-2 rounded text-center">Warangal</div>
                <div className="bg-muted/50 p-2 rounded text-center">Hanamkonda</div>
                <div className="bg-muted/50 p-2 rounded text-center">Kazipet</div>

              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                We're constantly expanding our delivery network. To check if we deliver to your area, enter your pincode
                during checkout.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Delivery Timeframes</h2>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Standard Delivery</h3>
                  <p>
                    Orders are typically delivered within 24-48 hours of being placed. Orders placed before 3 PM are
                    usually shipped the same day.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Express Delivery</h3>
                  <p>
                    For an additional fee, we offer same-day delivery for orders placed before 12 PM in select areas.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Delivery Windows</h3>
                  <p>You can select your preferred delivery window during checkout:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Morning: 6 AM - 10 AM</li>
                    <li>Evening: 5 PM - 9 PM</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Shipping Costs</h2>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Standard Shipping</h3>
                  <p>
                    <br />
                    Orders over ₹500: FREE shipping
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Express Shipping</h3>
                  <p>
                    Same-day delivery: Additional ₹14.99
                    <br />
                    Available only in select areas
                  </p>
                </div>

                <div className="bg-primary/10 p-4 rounded-md mt-4">
                  <p className="text-sm">
                    <strong>Pro Tip:</strong> Sign up for our subscription service to get free shipping on all your
                    orders, regardless of order value!
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Important Information</h2>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Delivery Confirmation</h3>
                  <p>
                    You'll receive email notifications when your order is out for delivery and when it has been
                    delivered.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Missed Deliveries</h3>
                  <p>
                    If you're not available to receive your order, our delivery partner will try to leave it with a
                    neighbor or security guard. If that's not possible, they'll attempt delivery again the next day.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Order Tracking</h3>
                  <p>
                    You can track your order status through your account dashboard or using the tracking link sent to
                    your email and phone.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Packaging</h3>
                  <p>
                    All our products are packed in eco-friendly, biodegradable packaging to maintain freshness while
                    minimizing environmental impact.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    </div>
  );
}
