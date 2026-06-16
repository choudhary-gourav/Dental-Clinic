import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Sparkles, Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { apiService } from "../services/apiService";

export function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  // Reset messages when switching modes
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === "signup") {
        // 1. Signup the user
        await apiService.signup(form.name, form.email, form.password);
        setSuccessMsg("Account created successfully! Logging you in...");
        
        // 2. Auto-login on successful signup
        await apiService.login(form.email, form.password);
        setTimeout(() => {
          navigate("/book");
        }, 1500);
      } else {
        // Login the user
        await apiService.login(form.email, form.password);
        setSuccessMsg("Logged in successfully!");
        setTimeout(() => {
          navigate("/book");
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Simulated Google Auth login, pre-populating a mock user
    localStorage.setItem(
      "dental_care_user",
      JSON.stringify({
        username: "Google User",
        email: "googleuser@gmail.com",
        patentId: 999,
      })
    );
    navigate("/book");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#fefdfb] to-[#f0f4f1] flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-[#7ba591]/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#d4a574]/10 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#5a6a62] hover:text-[#7ba591] transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl shadow-[#7ba591]/10 p-8 border border-[#7ba591]/10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7ba591] to-[#6a9480] flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#2d4538]">DentalCare</h1>
              <p className="text-xs text-[#7ba591]">Excellence in Smiles</p>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl text-[#2d4538] mb-2">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-[#5a6a62]">
              {mode === "login"
                ? "Sign in to manage your appointments"
                : "Join us for better dental care"}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
              {successMsg}
            </div>
          )}

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-[#e8e0d8] hover:border-[#7ba591] hover:bg-[#7ba591]/5 transition-all group mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-[#2d4538] font-medium group-hover:text-[#4a6b5a] transition-colors">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#e8e0d8]"></div>
            <span className="text-sm text-[#8a9a90]">or</span>
            <div className="flex-1 h-px bg-[#e8e0d8]"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a9a90]" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#e8e0d8] focus:border-[#7ba591] outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a9a90]" />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#e8e0d8] focus:border-[#7ba591] outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a9a90]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-[#e8e0d8] focus:border-[#7ba591] outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-colors"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a9a90] hover:text-[#7ba591] transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {mode === "login" && (
              <div className="text-right">
                <button type="button" className="text-sm text-[#7ba591] hover:text-[#6a9480] transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7ba591] hover:bg-[#6a9480] text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all mt-2 flex items-center justify-center gap-2"
              size="lg"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-[#5a6a62] mt-6 text-sm">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-[#7ba591] hover:text-[#6a9480] font-semibold transition-colors"
              disabled={loading}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

