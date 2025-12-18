import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, ImagePlus, Mail, Phone, User, MessageSquareHeart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function YourInfoForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      contactMethod: "",
      phone: "",
      email: "",
      profilePic: null,
      consent: false,
    },
  });

  const profilePic = watch("profilePic");
  const consent = watch("consent");

  const onSubmit = useCallback((data) => {
    if (!data.consent) {
      alert("Please confirm consent before submitting!");
      return;
    }
    console.log("User Info Submitted:", data);
    alert("Your information has been submitted successfully!");
  }, []);

  const handleImageUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      setValue("profilePic", file);
    },
    [setValue]
  );

  console.log("YourInfo re-rendered (RHF Version)");

  return (
    <section className="relative pt-10 pb-20 bg-gradient-to-b from-amber-50 via-yellow-100 to-orange-50 overflow-hidden min-h-screen">
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
            Your Information
          </h2>
          <p className="text-lg text-orange-700 font-medium">
            Help tourists reach out to you and discover your local insights
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

              {/* Name & Role */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-600" /> Full Name
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="e.g., Ekansh Gupta"
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">This field is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-2">
                    Your Role
                  </label>
                  <select
                    {...register("role", { required: true })}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  >
                    <option value="">Select role</option>
                    <option>Local Guide</option>
                    <option>Craftsman / Artisan</option>
                    <option>Shop Owner</option>
                    <option>Resident</option>
                    <option>Student / Volunteer</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm">Please select a role</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                  <MessageSquareHeart className="w-5 h-5 text-amber-600" /> Bio / About You
                </label>
                <textarea
                  {...register("bio")}
                  placeholder="Share your story or what makes your contribution special..."
                  rows="4"
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
              </div>

              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-amber-600" /> Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g., +91 9876543210"
                    {...register("phone")}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-amber-600" /> Email (optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., example@email.com"
                    {...register("email")}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  />
                </div>
              </div>

              {/* Contact Preference */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Preferred Contact Method
                </label>
                <select
                  {...register("contactMethod")}
                  className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                >
                  <option value="">Select method</option>
                  <option>Chat on SheherJaano</option>
                  <option>Phone Call</option>
                  <option>Email</option>
                  <option>Instagram / WhatsApp</option>
                  <option>Any</option>
                </select>
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                  <ImagePlus className="w-5 h-5 text-amber-600" /> Upload Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none"
                />
                {profilePic && (
                  <p className="text-sm text-amber-700 mt-1">
                    {profilePic.name} selected
                  </p>
                )}
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("consent")}
                  className="mt-1 accent-amber-600"
                />
                <p className="text-sm text-amber-800">
                  I consent to share my details and allow{" "}
                  <span className="font-semibold text-orange-700">SheherJaano</span>{" "}
                  to display them publicly and enable chat communication with me.
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={!consent}
                className="w-full flex items-center justify-center gap-2 py-3 font-bold text-orange-800
                  bg-gradient-to-r from-yellow-200 via-yellow-100 to-white
                  shadow-md hover:shadow-lg active:scale-95 transition-transform duration-200 rounded-full"
              >
                Submit Info <ArrowRight className="h-5 w-5 text-orange-800" />
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
