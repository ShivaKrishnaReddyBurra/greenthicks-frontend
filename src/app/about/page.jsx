import Image from "next/image";
import React from "react";
import { Leaf, Truck, Award, Users } from "lucide-react";
import about from "@/public/About.png";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About Green Thicks</h1>

        <div className="mb-12 relative">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src= {about}
              alt="Organic farm"
              width={1200}
              height={600}
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 px-8 py-4 rounded-full shadow-lg">
            <h2 className="text-xl font-semibold text-primary text-center">Fresh From Farm to Table</h2>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p className="lead">
            Green Thicks was founded with a simple mission: to deliver the freshest, most nutritious organic vegetables
            directly from farms to your table.
          </p>
          <p>
            Our journey began in 2025 when our founders recognized a growing disconnect between consumers and the source
            of their food...
          </p>
          <p>
            We believed there was a better way. By partnering directly with local organic farmers, we've created a
            supply chain that prioritizes freshness, nutrition, and sustainability above all else.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Our Organic Commitment</h3>
          <p>
            At Green Thicks, "organic" isn't just a marketing term—it's our core philosophy. We work exclusively with
            certified organic farmers who follow strict growing practices:
          </p>
          <ul>
            <li>No synthetic pesticides or fertilizers</li>
            <li>No genetically modified organisms (GMOs)</li>
            <li>Sustainable farming methods that protect soil health</li>
            <li>Crop rotation to naturally manage pests and diseases</li>
            <li>Conservation of water resources</li>
          </ul>
          <p>
            Every farm in our network undergoes rigorous certification and regular inspections to ensure they maintain
            these high standards...
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">From Farm to Your Doorstep</h3>
          <p>
            Unlike conventional produce that might change hands a dozen times before reaching you, our vegetables follow
            a direct path:
          </p>
          <ol>
            <li>Harvested at peak ripeness by our partner farmers</li>
            <li>Carefully cleaned and sorted at our local processing centers</li>
            <li>Packed in eco-friendly, temperature-controlled packaging</li>
            <li>Delivered to your door within 12-24 hours of harvest</li>
          </ol>
          <p>
            This streamlined approach ensures you receive vegetables with maximum nutritional value and flavor, while
            also reducing food waste and environmental impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <InfoCard icon={<Leaf className="text-primary h-6 w-6" />} title="100% Organic" text="Certified organic produce with no synthetic chemicals or GMOs" />
          <InfoCard icon={<Truck className="text-primary h-6 w-6" />} title="Farm Fresh Delivery" text="From harvest to your home in 24-48 hours" />
          <InfoCard icon={<Award className="text-primary h-6 w-6" />} title="Quality Guaranteed" text="Rigorous quality checks at every stage" />
          <InfoCard icon={<Users className="text-primary h-6 w-6" />} title="Supporting Farmers" text="Fair partnerships with local organic farmers" />
        </div>

        <div className="bg-primary/5 p-8 rounded-lg border border-primary/20">
          <h3 className="text-2xl font-semibold mb-4 text-center">Join Our Green Movement</h3>
          <p className="text-center mb-6">
            By choosing Green Thicks, you're not just getting the freshest organic vegetables—you're supporting
            sustainable agriculture, local farmers, and a healthier planet.
          </p>
          <div className="flex justify-center">
            <a
              href="/products"
              className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Shop Our Organic Collection
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-primary/10 p-6 rounded-lg text-center">
      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
