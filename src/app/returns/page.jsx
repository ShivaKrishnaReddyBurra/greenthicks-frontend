import React from "react";
import { RefreshCw, ShieldCheck, Clock, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ReturnsPage() {
  return (
    <div className="leaf-pattern-2">
        <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
          <p className="text-muted-foreground">
            Our policy on returns, replacements, and refunds for your peace of mind.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Our Quality Guarantee</h2>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <p className="mb-4">
                At Green Thicks, we stand behind the quality of every product we deliver. Our 100% satisfaction
                guarantee ensures that you'll be happy with your purchase or we'll make it right.
              </p>

              <p>
                If you receive vegetables that don't meet our quality standards (damaged, spoiled, or significantly
                different from what was advertised), we'll gladly provide a replacement or refund.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Return Process</h2>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Step 1: Contact Us</h3>
                  <p>
                    If you're not satisfied with your order, please contact our customer service team within 24 hours of
                    delivery. You can reach us through:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Email: support@greenthicks.com</li>
                    <li>Phone: +91 98765 43210</li>
                    <li>Contact form on our website</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Step 2: Provide Details</h3>
                  <p>Please be ready to provide:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Your order number</li>
                    <li>Description of the issue</li>
                    <li>Photos of the affected items (if possible)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Step 3: Resolution</h3>
                  <p>Our team will review your request and offer one of the following solutions:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Replacement with your next order</li>
                    <li>Store credit for future purchases</li>
                    <li>Refund to your original payment method</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Refund Timeline</h2>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Processing Time</h3>
                  <p>Once approved, refunds are processed within 1-2 business days.</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Credit/Debit Card Refunds</h3>
                  <p>
                    Refunds to credit or debit cards typically appear in your account within 5-7 business days,
                    depending on your bank's policies.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Other Payment Methods</h3>
                  <p>
                    Refunds for other payment methods (UPI, net banking, etc.) usually take 3-5 business days to
                    process.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Store Credit</h3>
                  <p>Store credit is applied to your account immediately and can be used for future purchases.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Can I return part of my order?</h3>
                  <p className="text-muted-foreground">
                    Yes, we can process partial returns if only some items in your order don't meet our quality
                    standards.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">What if I change my mind about my order?</h3>
                  <p className="text-muted-foreground">
                    Due to the perishable nature of our products, we cannot accept returns for change of mind. However,
                    you can modify or cancel your order up to 2 hours after placing it.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Do I need to return the items to get a refund?</h3>
                  <p className="text-muted-foreground">
                    In most cases, you won't need to return the items. We may ask for photos to verify the quality
                    issue, but we typically don't require physical returns of perishable goods.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">What if I'm not home during delivery?</h3>
                  <p className="text-muted-foreground">
                    If you're not available to inspect your order at delivery, please check it as soon as possible and
                    contact us within 24 hours if there are any issues.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-primary/10 rounded-lg border border-primary/20 p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our returns and refunds policy, our customer service team is here to help.
            </p>
            <Link href="/contact">
              <Button>Contact Customer Service</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
