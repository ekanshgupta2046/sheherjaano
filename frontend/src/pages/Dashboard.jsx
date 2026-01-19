import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MapPin, Palette, Plus } from "lucide-react";
import api from "@/api/axios"; 
import { useAuth } from "@/context/AuthProvider";
import {useNavigate} from "react-router-dom";

export default function ContributorDashboard() {
  const { auth, updateUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
    // 1. Log to see how many times this actually runs
    console.log("Dashboard useEffect triggered. Auth Loading:", auth.loading);

    if (auth.loading) return;

    // 2. Optimization: If we already have items and no error, don't fetch again 
    // unless you want to force it. (Optional)
    // if (items.length > 0) return; 

    const fetchContributions = async () => {
      try {
        const res = await api.get("/contributions");
        setItems(res.data.data);
      } catch (err) {
        console.error("Fetch error details:", err.response); // Check err.response for backend messages
        
        // If it is a 403, it usually means Token Invalid or Rate Limit
        if (err.response?.status === 403) {
            setError("Session expired or access denied. Please refresh.");
        } else {
            setError(err.message || "Failed to load data");
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user exists
    if (auth.user) {
        fetchContributions();
    }
    
  }, [auth.loading, auth.user]); // <--- Ensure auth.user object reference isn't changing on every render

const handleDelete = async (id, model, isContribution) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;

  try {
    const isLastItem = items.length === 1;
    await api.delete(`/contributions/${id}?model=${model}&isContribution=${isContribution}`);
    setItems((prev) => prev.filter((item) => item._id !== id));
    if (isLastItem) {
      updateUser({ role: "user" }); // instant navbar update
      navigate("/");                // redirect to home
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete item");
  }
};


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-amber-50 via-yellow-50 to-white p-6 sm:p-10">
      
      {/* Ambient Background Auras */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-radial from-amber-200/30 to-transparent blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-orange-200/20 to-transparent blur-2xl -z-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto z-10 relative">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
              Contributor Dashboard
            </h1>
            <p className="text-orange-800/80 font-medium mt-1">
              Manage your contributions to the city's heritage.
            </p>
          </div>
          <Button onClick={() => navigate("/contribute")} className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 font-bold hover:shadow-[0_4px_15px_rgba(255,180,0,0.4)] border-none transition-all rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" /> Add New Spot
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {[
            { label: "Total Contributions", value: items.length },
            { label: "Cities Covered", value: new Set(items.map((i) => i.city)).size },
          ].map((stat, idx) => (
            <Card key={idx} className="border border-amber-100 bg-white/60 backdrop-blur-md shadow-[0_4px_20px_rgba(245,158,11,0.1)]">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <p className="text-amber-600/70 font-semibold uppercase tracking-wider text-sm mb-1">{stat.label}</p>
                <p className="text-4xl font-serif font-bold text-amber-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contributions Grid */}
        {loading ? (
           <div className="text-center py-20 text-amber-800 animate-pulse">Loading your heritage spots...</div>
        ) : error ? (
           <div className="text-center py-20 text-red-600">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <Card
                key={item._id}
                className="group relative overflow-hidden rounded-2xl border border-amber-100 
                           bg-gradient-to-br from-white/90 via-amber-50/70 to-yellow-50/80 
                           backdrop-blur-xl shadow-md hover:shadow-[0_8px_25px_rgba(255,180,0,0.25)] 
                           transition-all duration-500"
              >
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-400 to-orange-400 opacity-70 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.images || "/placeholder.jpg"}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay Badge */}
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                     {item.type === "Famous Spot" ? <MapPin size={12} className="text-yellow-300" /> : <Palette size={12} className="text-pink-300" />}
                     {item.type}
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold font-serif text-amber-900 group-hover:text-orange-700 transition-colors flex-1">
                      {item.title}
                    </h3>
                    {/* Created/Contributed Tag */}
                    <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      item.isContribution 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {item.isContribution ? 'Contributed' : 'Created'}
                    </span>
                  </div>
                  <p className="text-sm text-amber-700/60 font-medium mb-5 flex items-center gap-1">
                    <MapPin size={14} /> {item.city}
                  </p>

                  <div className="flex gap-3">
                    
                    <Button
                      size="sm"
                      className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-red-200 hover:shadow-[0_4px_15px_rgba(255,100,100,0.3)] transition-all"
                      onClick={() => handleDelete(item._id, item.model, item.isContribution)}
                    >
                      <Trash2 size={14} className="mr-2" /> Delete
                    </Button>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}