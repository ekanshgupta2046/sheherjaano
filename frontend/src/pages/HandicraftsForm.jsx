import { useEffect, useState,useCallback } from "react";
import { useForm,useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight,Video, ImagePlus, Instagram, Link as LinkIcon,X,Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/api/axios"
import { State, City } from "country-state-city";
import { useAuth } from "../context/AuthProvider";

export default function HandicraftsForm() {
  const { initAuth } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors,isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
        localMarkets: [
    { name: "", address: "" }
  ],
      description: "",
      state: "",
      city: "",
      priceRange: "",
      images:[""],
      videoLink: "",
      instagramLink: "",
      permission: false,
    }
  });

  const { fields, append, remove } = useFieldArray({
  control,
  name: "localMarkets",
});


  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedStateCode, setSelectedStateCode] = useState("");

  const allStates = State.getStatesOfCountry("IN");
  const allCities = selectedStateCode
    ? City.getCitiesOfState("IN", selectedStateCode)
    : [];

  const handleImageAdd = (e) => {
  const files = Array.from(e.target.files);
  
  if (selectedFiles.length + files.length > 5) {
    alert("You can only upload a maximum of 5 images.");
    return;
  }

  setSelectedFiles((prev) => [...prev, ...files]);
  e.target.value = ""; 
};

  const removeImage = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const permission = watch("permission");

  const onSubmit = useCallback(async (data) => {


    if (!data.permission) {
      alert("Please confirm permission to submit!");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("Please add at least one image!");
      return;
    }

    try {
      let imageUrls = [];

      // Upload images from State Array
      const formData = new FormData();
      selectedFiles.forEach((file) => {
          formData.append("images", file);
      });

      const uploadRes = await api.post(
        "/upload-images",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      imageUrls = uploadRes.data.urls;
      const cleanedMarkets = data.localMarkets.filter(
  (m) => m.name.trim() !== ""
);

      // Save Handicraft or Contribute
      const res = await api.post("/handicrafts", {
        ...data,
        images: imageUrls,
        localMarkets: cleanedMarkets,
      });

      const message = res.data.isNewPlace 
        ? "New handicraft added successfully!" 
        : "Your contribution has been added to this handicraft!";
      alert(message);
      reset();
      setSelectedFiles([]); 
      setSelectedStateCode("");
      await initAuth();

    } catch (err) {
      console.error("Error:", err);
      alert("Failed to save data");
    }
  }, [selectedFiles]);

  return (
    <section className="relative pt-6 pb-14 sm:pt-8 sm:pb-20 bg-gradient-to-b from-yellow-50 via-amber-100 to-orange-50 overflow-hidden min-h-screen">
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
          <h2 className="text-3xl sm:text-5xl mb-1 sm:mb-2  font-bold font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Add a Handicraft
          </h2>
          <p className="text-base sm:text-lg text-orange-700 font-medium">
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
          <Card className="relative bg-white/70 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-xl p-5 sm:p-8 max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              
              {/* Name */}
              <div>
                <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">Handicraft Name</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  placeholder="e.g., Blue Pottery, Madhubani Painting"
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 
                             focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
  
  {/* STATE SELECTION */}
  <div>
    <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">
      State
    </label>
    <input type="hidden" {...register("state", { required: true })} />

    <select
      className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
      onChange={(e) => {
        const stateCode = e.target.value;
        const stateName = e.target.options[e.target.selectedIndex].text;
        
        // 1. Update local state for logic (fetching cities)
        setSelectedStateCode(stateCode);
        
        // 2. Update Form value for submission (saving "Bihar", not "BR")
        setValue("state", stateName);
        
        // 3. Reset city field so user doesn't keep old city with new state
        setValue("city", ""); 
      }}
    >
      <option value="">-- Select State --</option>
      {allStates.map((state) => (
        <option key={state.isoCode} value={state.isoCode}>
          {state.name}
        </option>
      ))}
    </select>
    {/* We manually handle validation message since we aren't using {...register} directly on this specific select to handle the logic split */}
    {selectedStateCode === "" && errors.state && (
      <p className="text-red-500 text-sm mt-1">State is required</p>
    )}
  </div>

  {/* CITY SELECTION */}
  <div>
    <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">
      City
    </label>
    <select
      {...register("city", { required: true })}
      disabled={!selectedStateCode} // Disable if no state selected
      className={`w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900 
      ${!selectedStateCode ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <option value="">-- Select City --</option>
      {allCities.map((city) => (
        <option key={city.name} value={city.name}>
          {city.name}
        </option>
      ))}
    </select>
    {errors.city && (
      <p className="text-red-500 text-sm mt-1">City is required</p>
    )}
  </div>
</div>


              {/* Description */}
              <div>
                <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">Description</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows="4"
                  placeholder="Describe what makes this handicraft unique..."
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 
                             focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
              </div>

              {/* Location / Local Shops */}
              <div>
{/* Local Markets / Shops */}
<div className="space-y-4">
  <label className="block text-amber-900 font-semibold">
    Local Markets / Shops (optional)
  </label>

  {fields.map((field, index) => (
    <div
      key={field.id}
      className="flex gap-3 items-start bg-amber-50/60 p-3 sm:p-4 rounded-xl border border-amber-200"
    >
      <div className="flex-1 space-y-2">
        <input
          {...register(`localMarkets.${index}.name`)}
          placeholder="Market / Shop name (e.g. Johari Bazaar)"
          className="w-full p-2 rounded-lg border border-amber-200 bg-white"
        />

        <input
          {...register(`localMarkets.${index}.address`)}
          placeholder="Area / address (optional)"
          className="w-full p-2 rounded-lg border border-amber-200 bg-white"
        />
      </div>

<button
  type="button"
  onClick={() => fields.length > 1 && remove(index)}
  className={`${
    fields.length === 1
      ? "opacity-40 cursor-not-allowed"
      : "text-red-500 hover:text-red-700"
  }`}
>
  <X className="w-5 h-5" />
</button>

    </div>
  ))}

  <button
    type="button"
    onClick={() => append({ name: "", address: "" })}
    className="flex items-center gap-1.5 sm:gap-2 text-sm font-semibold text-amber-700 hover:text-amber-900"
  >
    + Add market
  </button>
</div>

              </div>

              {/* Price Range */}
              <div>
                <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">Price Range</label>
                <input
                  {...register("priceRange")}
                  placeholder="e.g., ₹300 – ₹1000"
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 
                             focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
              </div>

              {/* Media Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                  <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                    <ImagePlus className="w-5 h-5 text-amber-600" /> Upload Images (Max 5)
                  </label>

                  {/* Hidden Input controlled by custom handler */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageAdd} // 👈 Custom handler
                    className="w-full p-2 rounded-xl border border-amber-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
                  />

                  {/* Preview Section */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          {/* Thumbnail */}
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-full h-20 sm:h-24 object-cover rounded-lg border border-amber-200"
                          />
                          
                          {/* Remove Button (X) */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                    <Video className="w-5 h-5 text-amber-600" /> Video Link (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    {...register("videoLink")}
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                    <Instagram className="w-5 h-5 text-amber-600" /> Insta Reels Link
                    (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/..."
                    {...register("instagramLink")}
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-start gap-1.5 sm:gap-2 ">
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

              <Button
                type="submit"
                disabled={!permission || isSubmitting} // 👈 Disable while submitting
                className={`w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 font-bold text-orange-800
                  bg-gradient-to-r from-yellow-200 via-yellow-100 to-white
                  shadow-md rounded-full transition-all duration-200
                  ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg active:scale-95"} 
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-orange-800" /> {/* 👈 Spinner */}
                    Saving Spot...
                  </>
                ) : (
                  <>
                    Add Spot <ArrowRight className="h-5 w-5 text-orange-800" />
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
