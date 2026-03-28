"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import bcrypt from "bcryptjs";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  interface FormData {
    name: string;
    mobile: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const userData = {
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        password: hashedPassword,
      };

      const response = await axios.post("/api/signup", userData);

      if (response.status !== 201) {
        throw new Error(response.data.message || "Registration failed");
      }

     const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      // Redirect to home page or callback URL
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header with Logo */}
        <div className="bg-firstColor p-6 text-center">
          <Link href="/" className="inline-block">
            <Image
              src="https://i.postimg.cc/d0kzsGv8/technicallogo.jpg"
              alt="Company Logo"
              width={160}
              height={80}
              className="mx-auto h-16 w-auto object-contain"
              priority
            />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-white">Create Account</h1>
          <p className="mt-1 text-indigo-100">Join us today</p>
        </div>

        {/* Main Form */}
        <div className="p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { 
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters"
                  }
                })}
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? "border-red-300" : "border-gray-300"} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                {...register("mobile", { 
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Invalid mobile number"
                  }
                })}
                className={`w-full px-4 py-3 rounded-lg border ${errors.mobile ? "border-red-300" : "border-gray-300"} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="1234567890"
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-300" : "border-gray-300"} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? "border-red-300" : "border-gray-300"} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: (value) => 
                    value === watch('password') || "Passwords do not match"
                })}
                className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? "border-red-300" : "border-gray-300"} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${loading ? 'bg-green-400' : 'bg-firstColor hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-firstColor hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}