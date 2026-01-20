import { useCallback,useState } from "react";
import { useForm,useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ImagePlus, Video, Instagram,X,Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/api/axios"
import { State, City } from "country-state-city";
import { useAuth } from "../context/AuthProvider";

export default function FamousSpotsForm() {
  const { initAuth } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors,isSubmitting },
  } = useForm({
    defaultValues: {
      spotName: "",
      state:"",
      city:"",
      category: "",
      address: "",
      description: "",
      openingHours: "",
      entryFee: "",
      bestTime: "",
      videoLink: "",
      instagramLink: "",
      permission: false,
      images: [""],
    },
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
        formData
      );

      imageUrls = uploadRes.data.urls;

      // Save Spot or Contribute
      const res = await api.post("/famous-spots", {
        ...data,
        images: imageUrls,
      });

      const message = res.data.isNewPlace 
        ? "New spot created successfully!" 
        : "Your contribution has been added to this spot!";
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

    const generateDescription = useCallback(() => {
      setValue(
        "description",
        "A breathtaking destination in the heart of SheherJaano, known for its cultural depth and scenic beauty."
      );
    }, [setValue]);

  console.log("FamousSpots re-rendered! (RHF Version)");

  return (
    <section className="relative sm:pt-8 sm:pb-20 pt-6 pb-12 bg-gradient-to-b from-yellow-50 via-amber-100 to-orange-50 overflow-hidden min-h-screen">
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
          <h2 className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-3 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Add a Famous Spot
          </h2>
          <p className="text-base sm:text-lg text-orange-700 font-medium">
            Share your city’s hidden gems with SheherJaano
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
          <Card className="relative bg-white/70 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-xl p-5 sm:p-8 max-w-3xl space-y-4 mx-auto sm:space-y-6">
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
                    className="p-2.5 w-full sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-sm">This field is required</p>
                  )}
                </div>
              ))}

                            {/* City */}
{/* State & City Selection */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
  
  {/* STATE SELECTION */}
  <div>
    <label className="block text-amber-900 font-semibold mb-2">
      State
    </label>
    <select
      className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
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
    <label className="block text-amber-900 font-semibold mb-2">
      City
    </label>
    <select
      {...register("city", { required: true })}
      disabled={!selectedStateCode} // Disable if no state selected
      className={`w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900 
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
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
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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

              <Button
                type="submit"
                disabled={!permission || isSubmitting} // 👈 Disable while submitting
                className={`w-full flex items-center justify-center gap-2 py-2.5 sm:py-3
 font-bold text-orange-800
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
