import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

export function HomeBanner() {
  return (
    <div className="bg-primary/10 border-y border-primary/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Become a delivery partner and earn extra income!</span>
          </div>
          <Link href="/delivery/register">
            <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
