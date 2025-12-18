import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative bg-gradient-to-br from-amber-100 to-yellow-200">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 font-serif bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            Ready to Explore?
          </h2>
          <p className="text-xl text-red-600 mb-10">
            Join thousands of travelers and locals discovering authentic city experiences
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Browse Cities Button */}
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-lg transition-transform hover:scale-105"
              onClick={() => navigate("/cities")}
            >
              Browse Cities <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Contribute Button */}
            
          </div>
        </div>
      </div>
    </section>
  );
}
