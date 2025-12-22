
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import api, { setAccessToken } from "@/api/axios";
import { useNavigate, Link } from "react-router-dom";


// ✅ Zod validation schema
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(24, "Password too long")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/\d/, "Must include at least one number")
    .regex(/[@$!%*?&]/, "Must include one special character"),
});

export default function SignIn() {

  
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

const { setAuth } = useAuth();
const [errorMsg, setErrorMsg] = useState("");

const onSubmit = async (data) => {

  try {
    setErrorMsg("");

    const response = await api.post("/auth/login", data, {
      withCredentials: true,
    });

    const accessToken = response?.data?.accessToken;
    const user = response?.data?.user;
    const role = response?.data?.role;

    setAuth({ user, accessToken, role });

    setAccessToken(response.data.accessToken);

    console.log("✅ Login Successful:", user);
    alert("Sign-in successful!");
    navigate("/", { replace: true });
  } catch (err) {
    if (!err?.response) {
      setErrorMsg("No Server Response");
    } else if (err.response?.status === 400) {
      setErrorMsg("Missing Email or Password");
    } else if (err.response?.status === 401) {
      setErrorMsg("Unauthorized: Invalid credentials");
    } else {
      setErrorMsg("Login Failed");
    }
  }
};


  return (
    <section className="min-h-screen relative pt-10 pb-24 bg-gradient-to-b from-yellow-50 via-amber-100 to-orange-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/ethnic-pattern.png')] opacity-[0.05] bg-repeat"></div>

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
            Welcome Back
          </h2>
          <p className="text-lg text-orange-700 font-medium">
            Sign in to continue your{" "}
            <span className="font-semibold">SheherJaano</span> journey!
          </p>
          <div className="mt-5 w-24 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"></div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="relative bg-white/70 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-xl p-8 max-w-lg mx-auto space-y-6">
            {isSubmitSuccessful ? (
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-amber-900">🎉 Signed In Successfully!</h3>
              </div>
            ) : (
              <>
               {errorMsg && (
        <p className="text-center text-red-600 font-medium mb-2">{errorMsg}</p>
      )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-amber-600" /> Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-amber-900 font-semibold mb-2 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-600" /> Password
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 outline-none text-amber-900"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 font-bold text-orange-800
                    bg-gradient-to-r from-yellow-200 via-yellow-100 to-white
                    shadow-md hover:shadow-lg active:scale-95 transition-transform duration-200 rounded-full"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                  <LogIn className="h-5 w-5 text-orange-800" />
                </Button>

                <p className="text-center text-sm text-amber-800 mt-6">
                  Don’t have an account?{" "}
                  <Link to="/register" className="text-orange-700 font-semibold hover:underline">
                    Register
                  </Link>
                </p>
              </form>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
