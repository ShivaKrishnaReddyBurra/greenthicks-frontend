
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 leaf-pattern">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-100 to-green-50 py-12 md:py-16 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10 bg-no-repeat bg-center"
            style={{ 
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M54.627,2.269c-0.062-0.062-0.125-0.125-0.187-0.187c-3.498-3.498-9.178-3.498-12.676,0L24.792,18.254 c-0.5,0.5-0.5,1.312,0,1.812c0.5,0.5,1.312,0.5,1.812,0L43.576,3.082c2.873-2.873,7.553-2.873,10.425,0 c2.873,2.873,2.873,7.553,0,10.425L37.029,30.468c-2.873,2.873-7.553,2.873-10.425,0c-0.5-0.5-1.312-0.5-1.812,0 c-0.5,0.5-0.5,1.312,0,1.812c3.873,3.873,10.175,3.873,14.048,0l16.972-16.972C59.575,11.447,59.575,7.217,54.627,2.269z' fill='%2322c55e'/%3E%3Cpath d='M36.729,21.628c-3.873-3.873-10.175-3.873-14.048,0L5.71,38.601c-3.873,3.873-3.873,10.175,0,14.048 c0.062,0.062,0.125,0.125,0.187,0.187c3.498,3.498,9.178,3.498,12.676,0l17.073-17.073c0.5-0.5,0.5-1.312,0-1.812 c-0.5-0.5-1.312-0.5-1.812,0L16.76,50.933c-2.873,2.873-7.553,2.873-10.425,0c-2.873-2.873-2.873-7.553,0-10.425l16.972-16.972 c2.873-2.873,7.553-2.873,10.425,0c0.5,0.5,1.312,0.5,1.812,0C37.229,22.94,37.229,22.128,36.729,21.628z' fill='%2322c55e'/%3E%3C/svg%3E\")" 
            }}
          ></div>
          <div className="container px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
              <p className="text-gray-600 text-lg">
                Have questions or feedback? We'd love to hear from you! Our team is here to help with any inquiries about our organic vegetables or services.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Our Location</h3>
                      <address className="not-italic text-gray-600">
                        123 Green Street<br />
                        Farmington, CA 92123<br />
                        United States
                      </address>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">
                        <a href="tel:+11234567890" className="hover:text-primary transition-colors">
                          +1 (123) 456-7890
                        </a>
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Mon-Fri: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:contact@greenthicks.com" className="hover:text-primary transition-colors">
                          contact@greenthicks.com
                        </a>
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                
                {/* Map */}
                <div className="mt-8 rounded-2xl overflow-hidden h-64 border border-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.305935303!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sca!4v1650000000000!5m2!1sen!2sca"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Green Thicks Location"
                  ></iframe>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Write your message here..."
                      className="mt-1 min-h-32"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-hover gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-white">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Frequently Asked Questions</h2>
              <p className="text-gray-600 mb-8 text-center">
                Find quick answers to our most common questions.
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">What areas do you deliver to?</h3>
                  <p className="text-gray-600">
                    We currently deliver to all addresses within a 25-mile radius of our distribution center in Farmington. You can check if your address is within our delivery area during checkout.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">How fresh are your vegetables?</h3>
                  <p className="text-gray-600">
                    Our vegetables are harvested within 24 hours of delivery to ensure maximum freshness and nutritional value. We work directly with local farms to minimize the time from harvest to your doorstep.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Are all your products organic?</h3>
                  <p className="text-gray-600">
                    Yes, all our vegetables are certified organic. We work exclusively with farms that follow organic farming practices and have proper certification.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">What is your return policy?</h3>
                  <p className="text-gray-600">
                    We stand behind the quality of our products. If you're not satisfied with the quality of your vegetables, please contact our customer service within 24 hours of delivery, and we'll provide a refund or replacement.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">
                  Still have questions? Check out our detailed FAQ page.
                </p>
                <Button asChild variant="outline">
                  <Link to="/faq">View All FAQs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
