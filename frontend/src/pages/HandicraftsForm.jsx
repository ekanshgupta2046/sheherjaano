import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, ImagePlus, Instagram, Link as LinkIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HandicraftsForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (!data.permission) {
      alert("Please confirm permission to submit!");
      return;
    }
    console.log("Handicraft Form Data:", data);
    reset();
  };

  return (
    <section className="relative pt-8 pb-20 bg-gradient-to-b from-yellow-50 via-amber-100 to-orange-50 overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-[url('/ethnic-pattern.png')] opacity-[0.04] bg-repeat"></div>

      <div className="relative container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-3 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Add a Handicraft
          </h2>
          <p className="text-lg text-orange-700 font-medium">
            Celebrate your city’s artistry — share its handmade wonders!
          </p>
          <div className="mt-5 w-24 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"></div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="relative bg-white/70 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-xl p-8 max-w-3xl mx-auto space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Name */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">Handicraft Name</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  placeholder="e.g., Blue Pottery, Madhubani Painting"
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 
                             focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">Description</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows="4"
                  placeholder="Describe what makes this handicraft unique..."
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 
                             focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
              </div>

              {/* Location / Local Shops */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">Location / Local Shops</label>
                <input
                  {...register("location", { required: "Location is required" })}
                  placeholder="e.g., Jaipur markets, Dilli Haat, etc."
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 
                             focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
                {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>}
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">Price Range</label>
                <input
                  {...register("priceRange")}
                  placeholder="e.g., ₹300 – ₹1000"
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 
                             focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
              </div>

              {/* Media Uploads */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                    <ImagePlus className="w-5 h-5 text-amber-600" /> Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="w-full p-2 rounded-xl border border-amber-200 bg-white/80 
                               focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-amber-600" /> Instagram / Other Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/... or website link"
                    {...register("link")}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 
                               focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("permission", { required: true })}
                  className="mt-1 accent-amber-600"
                />
                <p className="text-sm text-amber-800">
                  I confirm that the information and media I’ve shared are accurate and I allow{" "}
                  <span className="font-semibold text-orange-700">SheherJaano</span> to display them publicly.
                </p>
                {errors.permission && (
                  <p className="text-sm text-red-600 mt-1">Please provide your consent.</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 font-bold text-orange-800
                  bg-gradient-to-r from-yellow-200 via-yellow-100 to-white
                  shadow-md hover:shadow-lg active:scale-95 transition-transform duration-200 rounded-full"
              >
                Add Handicraft <ArrowRight className="h-5 w-5 text-orange-800" />
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
