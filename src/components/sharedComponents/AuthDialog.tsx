"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import axios from "axios";
import bcrypt from "bcryptjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  name: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  
  const loginForm = useForm<LoginFormData>();
  const signupForm = useForm<SignupFormData>();

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Logged in successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const response = await axios.post("/api/signup", {
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        password: hashedPassword,
      });

     if (response.status !== 201) {
        throw new Error(response.data.message || "Registration failed");
      }

      // Auto-login after signup
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Account created successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {activeTab === "login" ? "Sign in to your account" : "Create a new account"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs
          value={activeTab}
          onValueChange={(val: string) => setActiveTab(val as "login" | "signup")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="pt-4">
            <form
              onSubmit={loginForm.handleSubmit(handleLogin) as React.FormEventHandler<HTMLFormElement>}
              className="space-y-4"
            >
              <div>
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              {...loginForm.register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {loginForm.formState.errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {loginForm.formState.errors.email.message as string}
              </p>
            )}
              </div>
              
              <div>
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              {...loginForm.register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {loginForm.formState.errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {loginForm.formState.errors.password.message as string}
              </p>
            )}
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="pt-4">
            <form
              onSubmit={signupForm.handleSubmit(handleSignup) as React.FormEventHandler<HTMLFormElement>}
              className="space-y-4"
            >
              <div>
            <Label htmlFor="signup-name">Full Name</Label>
            <Input
              id="signup-name"
              {...signupForm.register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters"
                }
              })}
            />
            {signupForm.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {signupForm.formState.errors.name.message as string}
              </p>
            )}
              </div>
              
              <div>
            <Label htmlFor="signup-mobile">Mobile Number</Label>
            <Input
              id="signup-mobile"
              type="tel"
              {...signupForm.register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Invalid mobile number"
                }
              })}
            />
            {signupForm.formState.errors.mobile && (
              <p className="text-sm text-red-500 mt-1">
                {signupForm.formState.errors.mobile.message as string}
              </p>
            )}
              </div>
              
              <div>
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              {...signupForm.register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {signupForm.formState.errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {signupForm.formState.errors.email.message as string}
              </p>
            )}
              </div>
              
              <div>
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              {...signupForm.register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {signupForm.formState.errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {signupForm.formState.errors.password.message as string}
              </p>
            )}
              </div>
              
              <div>
            <Label htmlFor="signup-confirm-password">Confirm Password</Label>
            <Input
              id="signup-confirm-password"
              type="password"
              {...signupForm.register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value: string) =>
                  value === signupForm.watch("password") || "Passwords do not match"
              })}
            />
            {signupForm.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {signupForm.formState.errors.confirmPassword.message as string}
              </p>
            )}
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}