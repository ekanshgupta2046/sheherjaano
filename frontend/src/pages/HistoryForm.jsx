import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, ImagePlus, Video, Instagram, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HistoryForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      placeName: "",
      era: "",
      category: "",
      shortDescription: "",
      builtBy: "",
      yearBuilt: "",
      historyDescription: "",
      address: "",
      mapLink: "",
      images: [],
      videoLink: "",
      instagramLink: "",
      confirm: false,
    },
  });

  const images = watch("images") || [];
  const confirm = watch("confirm");

  const onSubmit = useCallback((data) => {
    if (!data.confirm) {
      alert("Please confirm the details before submitting!");
      return;
    }
    console.log("Historical Place Data:", data);
  }, []);

  const handleImageUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      setValue("images", files);
    },
    [setValue]
  );

  const generateHistory = useCallback(() => {
    setValue(
      "historyDescription",
      "A timeless monument that stands as a testament to the city's cultural and architectural heritage."
    );
  }, [setValue]);

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
            Add a Historical Place
          </h2>
          <p className="text-lg text-orange-700 font-medium">
            Preserve your city’s timeless tales and architectural wonders
          </p>
          <div className="mt-5 w-24 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"></div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="relative bg-white/70 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-xl p-8 max-w-3xl mx-auto space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-amber-900 font-semibold mb-2">Place Name</label>
                  <input
                    type="text"
                    {...register("placeName", { required: true })}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                    placeholder="e.g., Red Fort"
                  />
                  {errors.placeName && <p className="text-red-500 text-sm">Required field</p>}
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-2">Era / Period</label>
                  <input
                    type="text"
                    {...register("era")}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                    placeholder="e.g., Mughal Era"
                  />
                </div>
              </div>

              {/* Category & Description */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">Category</label>
                <select
                  {...register("category")}
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                >
                  <option value="">Select category</option>
                  <option>Fort</option>
                  <option>Palace</option>
                  <option>Monument</option>
                  <option>Temple</option>
                  <option>Museum</option>
                  <option>Memorial</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Short Description
                </label>
                <textarea
                  {...register("shortDescription")}
                  rows="3"
                  placeholder="A brief note on its historical importance..."
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
              </div>

              {/* Historical Details */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-amber-900 font-semibold mb-2">Built By</label>
                  <input
                    {...register("builtBy")}
                    placeholder="e.g., Shah Jahan"
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-2">Year Built</label>
                  <input
                    {...register("yearBuilt")}
                    placeholder="e.g., 1638"
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-900 font-semibold mb-2 flex items-center justify-between">
                  Historical Description
                  <button
                    type="button"
                    onClick={generateHistory}
                    className="flex items-center gap-1 text-sm text-amber-700 hover:text-orange-700 transition"
                  >
                    <Sparkles className="w-4 h-4" /> Generate with AI
                  </button>
                </label>
                <textarea
                  {...register("historyDescription")}
                  rows="4"
                  placeholder="Describe its history, legends, and significance..."
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">Address</label>
                <input
                  {...register("address")}
                  placeholder="e.g., Chandni Chowk, Delhi"
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
              </div>

              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Google Maps Link (optional)
                </label>
                <input
                  {...register("mapLink")}
                  placeholder="https://maps.google.com/..."
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
              </div>

              {/* Media */}
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
                    <Video className="w-5 h-5 text-amber-600" /> YouTube Video Link
                  </label>
                  <input
                    type="url"
                    {...register("videoLink")}
                    placeholder="https://youtube.com/..."
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-amber-600" /> Instagram Link
                  </label>
                  <input
                    type="url"
                    {...register("instagramLink")}
                    placeholder="https://instagram.com/..."
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Confirm */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("confirm")}
                  className="mt-1 accent-amber-600"
                />
                <p className="text-sm text-amber-800">
                  I confirm that the information and media I’ve shared are accurate and allow{" "}
                  <span className="font-semibold text-orange-700">SheherJaano</span> to display them
                  publicly.
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={!confirm}
                className="w-full flex items-center justify-center gap-2 py-3 font-bold text-orange-800
                  bg-gradient-to-r from-yellow-200 via-yellow-100 to-white
                  shadow-md hover:shadow-lg active:scale-95 transition-transform duration-200 rounded-full"
              >
                Submit Place <ArrowRight className="h-5 w-5 text-orange-800" />
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
