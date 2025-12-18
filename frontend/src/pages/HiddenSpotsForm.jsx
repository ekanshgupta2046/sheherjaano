import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ImagePlus, Video, Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HiddenSpotsForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      spotName: "",
      category: "",
      address: "",
      description: "",
      openingHours: "",
      entryFee: "",
      bestTime: "",
      videoLink: "",
      instagramLink: "",
      permission: false,
    },
  });

  const images = watch("images") || [];
  const permission = watch("permission");

  const onSubmit = useCallback((data) => {
    if (!data.permission) {
      alert("Please confirm permission to submit!");
      return;
    }

    console.log("Form Data:", data);
  }, []);

  const handleImageUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      setValue("images", files);
    },
    [setValue]
  );

  const generateDescription = useCallback(() => {
    setValue(
      "description",
      "A breathtaking destination in the heart of SheherJaano, known for its cultural depth and scenic beauty."
    );
  }, [setValue]);

  console.log("FamousSpots re-rendered! (RHF Version)");

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
            Add a Hidden Spot
          </h2>
          <p className="text-lg text-orange-700 font-medium">
            Share those underrated spots that deserve to be discovered by true explorers
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
              {/* Spot Name & Address */}
              {[
                ["spotName", "Spot Name", "text"],
                ["address", "Location / Address", "text"],
              ].map(([name, label, type]) => (
                <div key={name}>
                  <label className="block text-amber-900 font-semibold mb-2">
                    {label}
                  </label>
                  <input
                    type={type}
                    {...register(name, { required: true })}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-sm">This field is required</p>
                  )}
                </div>
              ))}

              {/* Category */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Category
                </label>
                <select
                  {...register("category", { required: true })}
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                >
                  <option value="">Select category</option>
                  <option>Historical</option>
                  <option>Religious</option>
                  <option>Natural</option>
                  <option>Entertainment</option>
                  <option>Food</option>
                  <option>Shopping</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">Please select a category</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2 flex items-center justify-between">
                  Description
                  <button
                    type="button"
                    onClick={generateDescription}
                    className="flex items-center gap-1 text-sm text-amber-700 hover:text-orange-700 transition"
                  >
                    <Sparkles className="w-4 h-4" /> Generate with AI
                  </button>
                </label>
                <textarea
                  {...register("description")}
                  rows="4"
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
              </div>

              {/* Media Upload */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                    <ImagePlus className="w-5 h-5 text-amber-600" /> Upload Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full p-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                  {images.length > 0 && (
                    <p className="text-sm text-amber-700 mt-1">
                      {images.length} image(s) selected
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-600" /> Video Link (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    {...register("videoLink")}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-amber-600" /> Insta Reels Link
                    (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/..."
                    {...register("instagramLink")}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Visiting Info */}
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  ["openingHours", "Opening Hours"],
                  ["entryFee", "Entry Fee"],
                  ["bestTime", "Best Time to Visit"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-amber-900 font-semibold mb-2">
                      {label}
                    </label>
                    <input
                      {...register(name)}
                      className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Permission */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("permission")}
                  className="mt-1 accent-amber-600"
                />
                <p className="text-sm text-amber-800">
                  I confirm that the information and media I’ve shared are
                  accurate and I allow{" "}
                  <span className="font-semibold text-orange-700">SheherJaano</span> to
                  display them publicly.
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={!permission}
                className="w-full flex items-center justify-center gap-2 py-3 font-bold text-orange-800
                  bg-gradient-to-r from-yellow-200 via-yellow-100 to-white
                  shadow-md hover:shadow-lg active:scale-95 transition-transform duration-200 rounded-full"
              >
                Add Spot <ArrowRight className="h-5 w-5 text-orange-800" />
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
