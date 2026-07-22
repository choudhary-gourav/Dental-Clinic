import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Sparkles, Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { apiService } from "../services/apiService";

export function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (apiService.isCurrentAdminLoggedIn()) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await apiService.adminLogin(form.email, form.password);
      setSuccessMsg("Admin logged in successfully! Entering portal...");
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#fefdfb] to-[#f0f4f1] flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-[#1c2e24]/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#d4a574]/5 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to normal login */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[#5a6a62] hover:text-[#7ba591] transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to User Login
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1c2e24] text-white shadow-sm border border-[#1c2e24]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#d4a574]" />
            Secure Admin Area
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-[#1c2e24]/5 p-8 border border-[#1c2e24]/10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1c2e24] to-[#2d4538] flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#2d4538]">DentalCare</h1>
              <p className="text-xs text-[#d4a574] font-semibold tracking-wide">ADMIN PORTAL</p>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-[#2d4538] mb-2">Admin Sign In</h2>
            <p className="text-[#5a6a62] text-sm">
              Please enter your administrator credentials to access the clinic console.
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a9a90]" />
              <input
                type="email"
                placeholder="Admin Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#e8e0d8] focus:border-[#1c2e24] outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-colors"
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
                className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-[#e8e0d8] focus:border-[#1c2e24] outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-colors"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a9a90] hover:text-[#1c2e24] transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1c2e24] hover:bg-[#2d4538] text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all mt-4 flex items-center justify-center gap-2"
              size="lg"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign In to Console
            </Button>
          </form>

          {/* Help notice */}
          <p className="text-center text-[#8a9a90] mt-6 text-xs leading-relaxed">
            Admin accounts are provisioned directly in the system database. If you do not have credentials, please contact the clinic administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
