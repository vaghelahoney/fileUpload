"use client";
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  Shield,
  Users,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { z } from "zod";
import image_ from "public/images/icsLogo.png";
import SocialLogin from "./SocialLogin";
import { toast } from "sonner";
import { signInWithEmail } from "@/lib/action/auth-actions";

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().nonempty("Password is required"),
});

const ForgotSchema = z.object({
  resetEmail: z
    .string()
    .nonempty("Email is required")
    .email("Enter a valid email"),
});

export default function Login() {
  const [viewMode, setViewMode] = useState<"login" | "forgot-password">(
    "login"
  );
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState<
    Record<"email" | "password", string | undefined>
  >({
    email: undefined,
    password: undefined,
  });

  const [forgotData, setForgotData] = useState({ resetEmail: "" });
  const [forgotErrors, setForgotErrors] = useState({
    resetEmail: undefined as string | undefined,
  });

  const features = [
    { icon: CheckCircle, text: "AI-Powered Immigration Reports" },
    { icon: Shield, text: "Secure & GDPR Compliant" },
    { icon: Users, text: "Expert Consultation Support" },
    { icon: Globe, text: "Multiple Immigration Pathways" },
  ];

  const validateField = (
    schema: z.ZodTypeAny,
    data: any,
    field: string
  ): string | undefined => {
    const result = schema.safeParse(data);
    if (!result.success) {
      return result.error.errors.find((e) => e.path[0] === field)?.message;
    }
    return undefined;
  };

  const handleLoginChange = (field: "email" | "password", value: string) => {
    const updatedData = { ...loginData, [field]: value };
    setLoginData(updatedData);

    const error = validateField(LoginSchema, updatedData, field);
    setLoginErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = LoginSchema.safeParse(loginData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setLoginErrors(errors as any);
      return;
    }

    const userSignIn = await signInWithEmail({
      email: loginData.email, password: loginData.password, callbackURL: "/dashboard",
    });

    if (userSignIn.error) {
      toast.error(userSignIn.error.message || "An error occurred during sign in");
      return;
    }
  };

  const handleForgotChange = (value: string) => {
    const updated = { resetEmail: value };
    setForgotData(updated);

    const error = validateField(ForgotSchema, updated, "resetEmail");
    setForgotErrors({ resetEmail: error });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = ForgotSchema.safeParse(forgotData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setForgotErrors(errors as any);
      return;
    }

    console.log("Reset Email:", forgotData.resetEmail);
    setResetEmailSent(true);
  };

  const handleBackToLogin = () => {
    setViewMode("login");
    setResetEmailSent(false);
    setForgotData({ resetEmail: "" });
    setForgotErrors({ resetEmail: undefined });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#e23a41]/10 to-[#ff6b35]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="hidden md:block space-y-8">
          <h2 className="text-[#1e293b] mb-4">Welcome Back!</h2>
          <p className="text-[--color-text-secondary] text-lg mb-8">
            Access your personalized immigration reports, track your progress,
            and manage your journey.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-2.5 bg-gradient-to-br from-[#e23a41] to-[#ff6b35] rounded-lg">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-[#1e293b]">{feature.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-emerald-900 text-sm">Premium Access - $99</p>
                <small className="text-emerald-700">
                  Full access to all features and reports
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
            <div className="mb-6">
              <Image src={image_} alt="ICS Canada Logo" />
            </div>

            {viewMode === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {/* EMAIL */}
                <div>
                  <label className="block mb-2 text-[#1e293b]">
                    Email Address <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) =>
                        handleLoginChange("email", e.target.value)
                      }
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#e23a41] transition-all ${loginErrors.email ? "border-red-500" : "border-gray-200"
                        }`}
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-[#1e293b]">
                    Password <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) =>
                        handleLoginChange("password", e.target.value)
                      }
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#e23a41] transition-all ${loginErrors.password
                        ? "border-red-500"
                        : "border-gray-200"
                        }`}
                    />
                  </div>
                  {loginErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#e23a41] to-[#ff6b35] text-white rounded-xl hover:scale-[1.02] transition-all shadow-lg border border-white/20 group mt-8"
                >
                  <span className="text-lg">Sign In to Your Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <SocialLogin />
              </form>
            )}

            {viewMode === "forgot-password" && (
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 text-[#1e293b]">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={forgotData.resetEmail}
                      onChange={(e) => handleForgotChange(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#e23a41] transition-all ${forgotErrors.resetEmail
                        ? "border-red-500"
                        : "border-gray-200"
                        }`}
                    />
                  </div>

                  {forgotErrors.resetEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {forgotErrors.resetEmail}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#e23a41] to-[#ff6b35] text-white rounded-xl hover:scale-[1.02] transition-all shadow-lg border border-white/20 group mt-8"
                >
                  <span className="text-lg">Reset Password</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#e23a41]" />
                <small className="text-[--color-text-secondary]">
                  Secure login powered by ICS Canada
                </small>
              </div>

              {viewMode === "login" ? (
                <button
                  type="button"
                  className="text-sm text-[#e23a41] hover:underline"
                  onClick={() => setViewMode("forgot-password")}
                >
                  Forgot Password?
                </button>
              ) : (
                <button
                  type="button"
                  className="text-sm text-[#e23a41] hover:underline"
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </button>
              )}

              {resetEmailSent && (
                <p className="text-sm text-green-500 mt-2">
                  A password reset link has been sent to {forgotData.resetEmail}
                  .
                </p>
              )}
            </div>
          </div>

          <div className="md:hidden mt-6 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-emerald-900 text-sm">
                  Premium Access - $99 CAD
                </p>
                <small className="text-emerald-700">
                  Full access to all features and personalized reports
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
