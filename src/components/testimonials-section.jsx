import Image from "next/image";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Health Enthusiast",
      content:
        "I've been ordering from Green Thicks for over a year now, and the quality is consistently excellent. The spinach and kale are always fresh and last much longer than store-bought greens.",
      rating: 5,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Rahul Patel",
      role: "Home Chef",
      content:
        "As someone who cooks daily, having access to truly fresh vegetables makes all the difference. Green Thicks delivers the best quality produce I've found anywhere in the city.",
      rating: 5,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Anita Desai",
      role: "Nutritionist",
      content:
        "I recommend Green Thicks to all my clients. Their organic vegetables are not only delicious but also retain more nutrients due to their farm-to-table approach.",
      rating: 5,
      image: "/placeholder.svg?height=80&width=80",
    },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground">
            Don't just take our word for it. Here's what our happy customers have to say about Green Thicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-card rounded-lg p-6 border shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>

              <p className="text-muted-foreground">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
