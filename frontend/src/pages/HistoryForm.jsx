import { useCallback,useState} from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, ImagePlus, Video, Instagram, Sparkles,X,Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/api/axios"
import { State, City } from "country-state-city";
import { useAuth } from "../context/AuthProvider";

export default function HistoryForm() {
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
      placeName: "",
      state:"",
      city:"",
      era: "",
      category: "",
      shortDescription: "",
      builtBy: "",
      yearBuilt: "",
      historyDescription: "",
      address: "",
      mapLink: "",
      images: [""],
      videoLink: "",
      instagramLink: "",
      confirm: false,
    },
  });
  const confirm = watch("confirm");
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

  const onSubmit = useCallback(async (data) => {


    if (!data.confirm) {
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

      // Save History or Contribute
      const res = await api.post("/history", {
        ...data,
        images: imageUrls,
      });

      const message = res.data.isNewPlace 
        ? "New history record created successfully!" 
        : "Your contribution has been added to this history!";
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


  const generateHistory = useCallback(() => {
    setValue(
      "historyDescription",
      "A timeless monument that stands as a testament to the city's cultural and architectural heritage."
    );
  }, [setValue]);

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
          <h2 className="text-3xl sm:text-5xl mb-1 sm:mb-2 sm:mb-3 font-bold font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Add a Historical Place
          </h2>
          <p className="text-base sm:text-lg text-orange-700 font-medium">
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
          <Card className="relative bg-white/70 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-xl p-5 sm:p-8 max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">Place Name</label>
                  <input
                    type="text"
                    {...register("placeName", { required: true })}
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                    placeholder="e.g., Red Fort"
                  />
                  {errors.placeName && <p className="text-red-500 text-sm">Required field</p>}
                </div>

                

                <div>
                  <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">Era / Period</label>
                  <input
                    type="text"
                    {...register("era")}
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                    placeholder="e.g., Mughal Era"
                  />
                </div>
              </div>
              <div>
                <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">Address</label>
                <input
                  {...register("address")}
                  placeholder="e.g., Chandni Chowk, Delhi"
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
  
  {/* STATE SELECTION */}
  <div>
    <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">
      State
    </label>
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

              {/* Category & Description */}
              <div>
                <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">Category</label>
                <select
                  {...register("category")}
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
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
                <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">
                  Short Description
                </label>
                <textarea
                  {...register("shortDescription")}
                  rows="3"
                  placeholder="A brief note on its historical importance..."
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
              </div>

              {/* Historical Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">Built By</label>
                  <input
                    {...register("builtBy")}
                    placeholder="e.g., Shah Jahan"
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-1 sm:mb-2">Year Built</label>
                  <input
                    {...register("yearBuilt")}
                    placeholder="e.g., 1638"
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 flex items-center justify-between">
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
                  rows="3"
                  placeholder="Describe its history, legends, and significance..."
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                />
              </div>

              {/* Location */}

              

              {/* Media */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                <div>
                  <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 flex items-center gap-2">
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
                  <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-600" /> YouTube Video Link
                  </label>
                  <input
                    type="url"
                    {...register("videoLink")}
                    placeholder="https://youtube.com/..."
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-amber-600" /> Instagram Link
                  </label>
                  <input
                    type="url"
                    {...register("instagramLink")}
                    placeholder="https://instagram.com/..."
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none"
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
                disabled={!confirm || isSubmitting} // 👈 Disable while submitting
                className={`w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 font-bold text-orange-800
                  bg-gradient-to-r from-yellow-200 via-yellow-100 to-white
                  shadow-md rounded-full transition-all duration-200
                  ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg active:scale-95"} 
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-orange-800" /> {/* 👈 Spinner */}
                    Saving History...
                  </>
                ) : (
                  <>
                    Add History <ArrowRight className="h-5 w-5 text-orange-800" />
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
