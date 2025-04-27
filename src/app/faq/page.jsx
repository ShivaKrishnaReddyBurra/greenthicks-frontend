import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. You'll need to create an account or log in to complete your purchase.",
    },
    {
      question: "What areas do you deliver to?",
      answer:
        "We currently deliver to most major cities in India. You can check if we deliver to your area by entering your pincode on the checkout page.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "We aim to deliver all orders within 24-48 hours. Orders placed before 3 PM are typically shipped the same day.",
    },
    {
      question: "What if I'm not home during delivery?",
      answer:
        "Our delivery partner will attempt to contact you. If you're unavailable, they'll try to leave your order with a neighbor or security guard, or reschedule for the next day.",
    },
    {
      question: "How do I know the vegetables are truly organic?",
      answer:
        "All our partner farms are certified organic. We regularly inspect farms and test products to ensure they meet our strict organic standards. Our certifications are available on request.",
    },
    {
      question: "What if I receive damaged or poor quality vegetables?",
      answer:
        "We have a 100% satisfaction guarantee. If you're not happy with the quality of any item, please contact us within 24 hours of delivery, and we'll replace it or provide a refund.",
    },
    {
      question: "Can I modify or cancel my order?",
      answer:
        "You can modify or cancel your order up to 2 hours after placing it. After that, your order enters our fulfillment process and cannot be changed.",
    },
    {
      question: "Do you offer subscriptions or regular deliveries?",
      answer:
        "Yes, we offer weekly and bi-weekly subscription boxes. You can customize your box contents and delivery schedule through your account settings.",
    },
    {
      question: "How do I apply a coupon code?",
      answer:
        "You can apply a coupon code during checkout on the cart page. Enter your code in the designated field and click 'Apply' to see the discount applied to your order.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, UPI, net banking, and cash on delivery. All online payments are processed through secure payment gateways.",
    },
    {
      question: "How do I become a seller on Green Thicks?",
      answer:
        "To become a seller, click on 'Become a Seller' in the navigation menu. You'll need to complete an application form and provide documentation of your organic farming practices.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order through your account dashboard.",
    },
  ];

  return (
    <div className="leaf-pattern-2">
        <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about our products, delivery, and services.
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="bg-primary/10 rounded-lg border border-primary/20 p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-4">
            If you couldn't find the answer to your question, please feel free to contact our customer support team.
          </p>
          <Link href="/contact">
            <Button>Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
    </div>
    
  );
}
