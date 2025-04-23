import { Leaf, Truck, Award, Recycle } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: <Leaf className="h-10 w-10 text-primary" />,
      title: "100% Certified Organic",
      description:
        "All our vegetables are grown without synthetic pesticides or fertilizers, ensuring you get the purest, most nutritious produce possible.",
    },
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: "Farm to Table in 24 Hours",
      description:
        "We harvest vegetables at peak ripeness and deliver them to your doorstep within 24 hours, preserving maximum freshness and nutrients.",
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Quality Guaranteed",
      description:
        "We stand behind the quality of our produce. If you're not completely satisfied, we'll replace it or refund your purchase, no questions asked.",
    },
    {
      icon: <Recycle className="h-10 w-10 text-primary" />,
      title: "Eco-Friendly Packaging",
      description:
        "Our packaging is made from biodegradable or recyclable materials, minimizing environmental impact while keeping your vegetables fresh.",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Green Thicks?</h2>
          <p className="text-muted-foreground">
            We're committed to providing the freshest, most nutritious organic vegetables while supporting sustainable
            farming practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
