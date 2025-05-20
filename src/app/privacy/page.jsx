import React from "react";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return React.createElement("div", { className: "container mx-auto px-4 py-12" },
    React.createElement("div", { className: "max-w-3xl mx-auto" },
      React.createElement("div", { className: "text-center mb-12" },
        React.createElement("h1", { className: "text-4xl font-bold mb-4" }, "Privacy Policy"),
        React.createElement("p", { className: "text-muted-foreground" }, "Last updated: April 7, 2025")
      ),
      React.createElement("div", { className: "prose prose-green dark:prose-invert max-w-none" },
        React.createElement("section", { className: "mb-8" },
          React.createElement("div", { className: "flex items-center gap-3 mb-4" },
            React.createElement("div", { className: "bg-primary/10 p-2 rounded-full" },
              React.createElement(Shield, { className: "h-5 w-5 text-primary" })
            ),
            React.createElement("h2", { className: "text-2xl font-semibold" }, "Introduction")
          ),
          React.createElement("p", null,
            "Green Thicks (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains",
            " how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile",
            " application, or make purchases from us."
          ),
          React.createElement("p", null,
            "Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you",
            " have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree,",
            " please do not access or use our services."
          )
        ),
        React.createElement("section", { className: "mb-8" },
          React.createElement("div", { className: "flex items-center gap-3 mb-4" },
            React.createElement("div", { className: "bg-primary/10 p-2 rounded-full" },
              React.createElement(FileText, { className: "h-5 w-5 text-primary" })
            ),
            React.createElement("h2", { className: "text-2xl font-semibold" }, "Information We Collect")
          ),
          React.createElement("h3", { className: "text-xl font-medium mt-6 mb-3" }, "Personal Information"),
          React.createElement("p", null, "We may collect personal information that you voluntarily provide to us when you:"),
          React.createElement("ul", { className: "list-disc pl-6 mb-4" },
            React.createElement("li", null, "Register for an account"),
            React.createElement("li", null, "Place an order"),
            React.createElement("li", null, "Sign up for our newsletter"),
            React.createElement("li", null, "Contact our customer service"),
            React.createElement("li", null, "Apply to become a seller"),
            React.createElement("li", null, "Participate in promotions or surveys")
          ),
          React.createElement("p", null, "This information may include:"),
          React.createElement("ul", { className: "list-disc pl-6 mb-4" },
            React.createElement("li", null, "Name"),
            React.createElement("li", null, "Email address"),
            React.createElement("li", null, "Phone number"),
            React.createElement("li", null, "Billing and shipping address"),
            React.createElement("li", null, "Payment information"),
            React.createElement("li", null, "Demographic information")
          ),
          React.createElement("h3", { className: "text-xl font-medium mt-6 mb-3" }, "Automatically Collected Information"),
          React.createElement("p", null,
            "When you access our website or mobile application, we may automatically collect certain information,",
            " including:"
          ),
          React.createElement("ul", { className: "list-disc pl-6 mb-4" },
            React.createElement("li", null, "IP address"),
            React.createElement("li", null, "Browser type"),
            React.createElement("li", null, "Device information"),
            React.createElement("li", null, "Operating system"),
            React.createElement("li", null, "Pages visited"),
            React.createElement("li", null, "Time and date of visits"),
            React.createElement("li", null, "Referring website"),
            React.createElement("li", null, "Clickstream data")
          )
        ),
        React.createElement("section", { className: "mb-8" },
          React.createElement("div", { className: "flex items-center gap-3 mb-4" },
            React.createElement("div", { className: "bg-primary/10 p-2 rounded-full" },
              React.createElement(Eye, { className: "h-5 w-5 text-primary" })
            ),
            React.createElement("h2", { className: "text-2xl font-semibold" }, "How We Use Your Information")
          ),
          React.createElement("p", null, "We may use the information we collect for various purposes, including:"),
          React.createElement("ul", { className: "list-disc pl-6 mb-4" },
            React.createElement("li", null, "Processing and fulfilling your orders"),
            React.createElement("li", null, "Creating and managing your account"),
            React.createElement("li", null, "Providing customer support"),
            React.createElement("li", null, "Sending transactional emails and order updates"),
            React.createElement("li", null, "Sending marketing communications (with your consent)"),
            React.createElement("li", null, "Improving our website, products, and services"),
            React.createElement("li", null, "Analyzing usage patterns and trends"),
            React.createElement("li", null, "Preventing fraudulent transactions and monitoring against theft"),
            React.createElement("li", null, "Complying with legal obligations")
          )
        ),
        React.createElement("section", { className: "mb-8" },
          React.createElement("div", { className: "flex items-center gap-3 mb-4" },
            React.createElement("div", { className: "bg-primary/10 p-2 rounded-full" },
              React.createElement(Lock, { className: "h-5 w-5 text-primary" })
            ),
            React.createElement("h2", { className: "text-2xl font-semibold" }, "How We Protect Your Information")
          ),
          React.createElement("p", null,
            "We implement appropriate security measures to protect your personal information from unauthorized access,",
            " alteration, disclosure, or destruction. These measures include:"
          ),
          React.createElement("ul", { className: "list-disc pl-6 mb-4" },
            React.createElement("li", null, "Secure Socket Layer (SSL) encryption for data transmission"),
            React.createElement("li", null, "Regular security assessments and audits"),
            React.createElement("li", null, "Access controls and authentication procedures"),
            React.createElement("li", null, "Secure data storage systems"),
            React.createElement("li", null, "Employee training on privacy and security practices")
          ),
          React.createElement("p", null,
            "However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive",
            " to use commercially acceptable means to protect your personal information, we cannot guarantee its",
            " absolute security."
          )
        ),
        React.createElement("section", { className: "mb-8" },
          React.createElement("h2", { className: "text-2xl font-semibold mb-4" }, "Disclosure of Your Information"),
          React.createElement("p", null, "We may share your information in the following situations:"),
          React.createElement("ul", { className: "list-disc pl-6 mb-4" },
            React.createElement("li", null,
              React.createElement("strong", null, "Service Providers:"),
              " We may share your information with third-party vendors, service providers, and other business partners who perform services on our behalf."
            ),
            React.createElement("li", null,
              React.createElement("strong", null, "Business Transfers:"),
              " If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction."
            ),
            React.createElement("li", null,
              React.createElement("strong", null, "Legal Requirements:"),
              " We may disclose your information if required to do so by law or in response to valid requests by public authorities."
            ),
            React.createElement("li", null,
              React.createElement("strong", null, "Protection of Rights:"),
              " We may disclose your information to protect our rights, privacy, safety, or property, and that of our customers or others."
            ),
            React.createElement("li", null,
              React.createElement("strong", null, "With Your Consent:"),
              " We may share your information with third parties when we have your consent to do so."
            )
          )
        ),
        React.createElement("section", { className: "mb-8" },
          React.createElement("h2", { className: "text-2xl font-semibold mb-4" }, "Your Privacy Rights"),
          React.createElement("p", null,
            "Depending on your location, you may have certain rights regarding your personal information, including:"
          ),
          React.createElement("ul", { className: "list-disc pl-6 mb-4" },
            React.createElement("li", null, "The right to access the personal information we have about you"),
            React.createElement("li", null, "The right to request correction of inaccurate personal information"),
            React.createElement("li", null, "The right to request deletion of your personal information"),
            React.createElement("li", null, "The right to object to or restrict processing of your personal information"),
            React.createElement("li", null, "The right to data portability"),
            React.createElement("li", null, "The right to withdraw consent at any time")
          ),
          React.createElement("p", null,
            "To exercise these rights, please contact us using the information provided in the \"Contact Us\" section",
            " below."
          )
        ),
        React.createElement("section", { className: "mb-8" },
          React.createElement("h2", { className: "text-2xl font-semibold mb-4" }, "Cookies and Similar Technologies"),
          React.createElement("p", null,
            "We use cookies and similar tracking technologies to collect and store information about your interactions",
            " with our website. You can instruct your browser to refuse all cookies or to indicate when a cookie is",
            " being sent. However, if you do not accept cookies, you may not be able to use some portions of our",
            " service."
          )
        ),
        React.createElement("section", { className: "mb-8" },
          React.createElement("h2", { className: "text-2xl font-semibold mb-4" }, "Children's Privacy"),
          React.createElement("p", null,
            "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal",
            " information from children. If you are a parent or guardian and believe that your child has provided us",
            " with personal information, please contact us so that we can take appropriate action."
          )
        ),
        React.createElement("section", { className: "mb-8" },
          React.createElement("h2", { className: "text-2xl font-semibold mb-4" }, "Changes to This Privacy Policy"),
          React.createElement("p", null,
            "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new",
            " Privacy Policy on this page and updating the \"Last updated\" date. You are advised to review this Privacy",
            " Policy periodically for any changes."
          )
        ),
        React.createElement("section", null,
          React.createElement("h2", { className: "text-2xl font-semibold mb-4" }, "Contact Us"),
          React.createElement("p", null, "If you have any questions about this Privacy Policy, please contact us at:"),
          React.createElement("ul", { className: "list-none pl-0 mb-4" },
            React.createElement("li", null, "Email: greenthickss@gmail.com"),
            React.createElement("li", null, "Phone: +91 9705045597"),
            React.createElement("li", null, "Address: Hanamkonda, Warangal, Telangana, India - 506001")
          )
        )
      )
    )
  );
}
