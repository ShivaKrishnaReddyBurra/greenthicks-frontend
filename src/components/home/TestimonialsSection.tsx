
import { Separator } from "@/components/ui/separator";

const testimonials = [
  {
    id: 1,
    content: "The quality of vegetables from Green Thicks is exceptional. Everything I've ordered has been fresh, flavorful, and lasts well in the fridge.",
    author: "Sarah Johnson",
    role: "Health Coach",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    content: "I've been ordering from Green Thicks for 6 months now and haven't been disappointed once. Their seasonal selections are always exciting.",
    author: "Michael Chen",
    role: "Home Chef",
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: 3,
    content: "The convenience of doorstep delivery combined with truly organic produce makes Green Thicks an essential service for my family.",
    author: "Emily Rodriguez",
    role: "Busy Parent",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600">
            Don't just take our word for it. Hear from our satisfied customers about their 
            experience with our organic vegetables and service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow card-hover animate-fade-in"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    className="w-5 h-5 text-yellow-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <Separator className="mb-6" />
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{testimonial.author}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
