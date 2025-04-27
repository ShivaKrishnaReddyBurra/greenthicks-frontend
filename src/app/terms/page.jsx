import { FileText, Scale, Clock, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="leaf-pattern-2">
        <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: April 7, 2025</p>
        </div>

        <div className="prose prose-green dark:prose-invert max-w-none">
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Introduction</h2>
            </div>

            <p>
              Welcome to Green Thicks. These Terms and Conditions govern your use of our website, mobile application,
              and services. By accessing or using our services, you agree to be bound by these Terms. If you disagree
              with any part of these Terms, you may not access our services.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Use of Our Services</h2>
            </div>

            <h3 className="text-xl font-medium mt-6 mb-3">Account Registration</h3>
            <p>
              To access certain features of our services, you may be required to register for an account. You agree to
              provide accurate, current, and complete information during the registration process and to update such
              information to keep it accurate, current, and complete.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Account Security</h3>
            <p>
              You are responsible for safeguarding the password that you use to access our services and for any
              activities or actions under your password. We encourage you to use "strong" passwords (passwords that use
              a combination of upper and lower case letters, numbers, and symbols) with your account.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Prohibited Activities</h3>
            <p>You agree not to engage in any of the following prohibited activities:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Using our services for any illegal purpose or in violation of any local, state, national, or
                international law
              </li>
              <li>Violating or infringing upon the rights of others, including their intellectual property rights</li>
              <li>Attempting to circumvent any security features of our services</li>
              <li>Interfering with or disrupting our services or servers or networks connected to our services</li>
              <li>
                Impersonating or attempting to impersonate Green Thicks, a Green Thicks employee, another user, or any
                other person or entity
              </li>
              <li>Engaging in any automated use of the system, such as using scripts to send comments or messages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Products and Orders</h2>

            <h3 className="text-xl font-medium mt-6 mb-3">Product Information</h3>
            <p>
              We strive to provide accurate product descriptions, pricing, and availability information. However, we do
              not warrant that product descriptions, pricing, or other content on our services is accurate, complete,
              reliable, current, or error-free.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Ordering</h3>
            <p>
              When you place an order through our services, you are making an offer to purchase the products you have
              selected. We reserve the right to accept or decline your order for any reason, including but not limited
              to product availability, errors in product or pricing information, or problems identified by our fraud
              detection systems.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Pricing and Payment</h3>
            <p>
              All prices are in Indian Rupees (INR) and include applicable taxes. Payment must be made at the time of
              placing your order. We accept various payment methods, including credit/debit cards, UPI, net banking, and
              cash on delivery.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Delivery</h3>
            <p>
              We aim to deliver products within the timeframe specified at checkout. However, delivery times are
              estimates and not guaranteed. We are not responsible for delays that are beyond our reasonable control.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Returns and Refunds</h2>
            </div>

            <p>
              Please refer to our Returns & Refunds Policy for information about returns, replacements, and refunds. By
              making a purchase, you agree to the terms of our Returns & Refunds Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>

            <p>
              The content, organization, graphics, design, compilation, and other matters related to our services are
              protected by applicable copyrights, trademarks, and other proprietary rights. Copying, redistributing,
              using, or publishing any such content is strictly prohibited without our express permission.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            </div>

            <p>
              To the maximum extent permitted by law, Green Thicks shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly
              or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your access to or use of or inability to access or use our services</li>
              <li>Any conduct or content of any third party on our services</li>
              <li>Any content obtained from our services</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>

            <p>
              You agree to defend, indemnify, and hold harmless Green Thicks, its officers, directors, employees, and
              agents, from and against any claims, liabilities, damages, losses, and expenses, including, without
              limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access
              to or use of our services or your violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>

            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its
              conflict of law provisions. Any dispute arising from or relating to these Terms shall be subject to the
              exclusive jurisdiction of the courts in [City], India.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to These Terms</h2>

            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of any material changes by
              posting the updated Terms on this page and updating the "Last updated" date. Your continued use of our
              services after such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>

            <p>If you have any questions about these Terms, please contact us at:</p>
            <ul className="list-none pl-0 mb-4">
              <li>Email: legal@greenthicks.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: 123 Organic Way, Green City, India</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
    </div>
  );
}
