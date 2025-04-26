"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="leaf-pattern">
        <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products or services? We're here to help. Reach out to us using any of the methods
            below.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-card rounded-lg border p-6 text-center">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Our Location</h3>
            <p className="text-muted-foreground">
              Warangal District
              Telengana State
              <br />
               India
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 text-center">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Phone Number</h3>
            <p className="text-muted-foreground">
              Customer Service:
              <br />
              +91 9705045594
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 text-center">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Email Address</h3>
            <p className="text-muted-foreground">
              infogreenthicks@gmail.com
              <br />
              greenthickss@gmailcom.com
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Your Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="min-h-[150px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>

          <div>
            <div className="bg-card rounded-lg border p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Business Hours
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>4:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>4:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">How do I track my order?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can track your order by logging into your account and viewing your order history.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">What is your return policy?</h4>
                  <p className="text-sm text-muted-foreground">
                    If you're not satisfied with your purchase, please contact us within 24 hours of delivery.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Do you deliver to my area?</h4>
                  <p className="text-sm text-muted-foreground">
                    We currently deliver to most major cities. Enter your pincode on the checkout page to check
                    availability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );
}
