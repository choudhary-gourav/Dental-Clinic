import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  User,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock3,
  RefreshCw,
  XCircle,
  Trash
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { apiService, Appointment, Doctor } from "../services/apiService";

const SERVICE_PRICES: Record<string, number> = {
  general: 80,
  cleaning: 120,
  whitening: 250,
  braces: 1800,
  implants: 3000,
  emergency: 350,
};

const getServicePrice = (serviceId: string) => SERVICE_PRICES[serviceId] || 150;

const getServiceLabel = (serviceId: string) => {
  const labels: Record<string, string> = {
    general: "General Checkup",
    cleaning: "Teeth Cleaning",
    whitening: "Teeth Whitening",
    braces: "Braces / Invisalign",
    implants: "Dental Implants",
    emergency: "Emergency Care",
  };
  return labels[serviceId] || serviceId;
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "appointments" | "doctors" | "patients" | "settings">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Data State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Notification alert state
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    clinicName: "DentalCare Suite",
    email: "info@dentalcare.com",
    phone: "+1 (555) 234-5678",
    address: "100 Medical Plaza, Suite 250",
    workingHours: "Mon - Sat: 9:00 AM - 5:00 PM"
  });

  // Modals & Popups state
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialty: "General Dentist",
    phone: "",
    email: "",
    status: "Active"
  });
  
  // Active row action menu for appointments
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);

  // Load initial settings and backend data
  useEffect(() => {
    const savedSettings = localStorage.getItem("dental_clinic_settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse saved settings", e);
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedApps, fetchedDocs] = await Promise.all([
        apiService.getAllAppointments(),
        apiService.getDoctors()
      ]);
      // Sort appointments by date desc
      setAppointments(fetchedApps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setDoctors(fetchedDocs);
    } catch (err: any) {
      triggerAlert(err.message || "Failed to load database content", "error");
    } finally {
      setLoading(false);
    }
  };

  const triggerAlert = (message: string, type: "success" | "error" | "info" = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Appointment Actions
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiService.updateAppointmentStatus(id, status);
      triggerAlert(`Appointment status updated to ${status}`);
      setActiveActionRow(null);
      fetchData();
    } catch (err: any) {
      triggerAlert(err.message || "Failed to update status", "error");
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await apiService.deleteAppointment(id);
      triggerAlert("Appointment deleted successfully", "info");
      setActiveActionRow(null);
      fetchData();
    } catch (err: any) {
      triggerAlert(err.message || "Failed to delete appointment", "error");
    }
  };

  // Doctor Actions
  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await apiService.updateDoctor(editingDoctor.id, doctorForm);
        triggerAlert("Doctor profile updated successfully");
      } else {
        await apiService.createDoctor(doctorForm);
        triggerAlert("Doctor profile created successfully");
      }
      setDoctorModalOpen(false);
      setEditingDoctor(null);
      setDoctorForm({ name: "", specialty: "General Dentist", phone: "", email: "", status: "Active" });
      fetchData();
    } catch (err: any) {
      triggerAlert(err.message || "Failed to save doctor details", "error");
    }
  };

  const handleEditDoctorClick = (doc: Doctor) => {
    setEditingDoctor(doc);
    setDoctorForm({
      name: doc.name,
      specialty: doc.specialty,
      phone: doc.phone || "",
      email: doc.email || "",
      status: doc.status || "Active"
    });
    setDoctorModalOpen(true);
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await apiService.deleteDoctor(id);
      triggerAlert("Doctor deleted successfully", "info");
      fetchData();
    } catch (err: any) {
      triggerAlert(err.message || "Failed to delete doctor", "error");
    }
  };

  // Settings Actions
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("dental_clinic_settings", JSON.stringify(settings));
    triggerAlert("Clinic configurations saved successfully");
  };

  const handleResetDatabase = async () => {
    const confirmation1 = window.confirm("WARNING: This will permanently delete all appointments and patient profiles. Do you want to continue?");
    if (!confirmation1) return;
    const confirmation2 = window.confirm("Please confirm once more. This action is irreversible. Press OK to wipe all active transactions.");
    if (!confirmation2) return;

    try {
      await apiService.resetDatabase();
      triggerAlert("Database reset completed. All transaction logs wiped.", "info");
      fetchData();
    } catch (err: any) {
      triggerAlert(err.message || "Failed to reset database", "error");
    }
  };

  // derived unique patients
  const uniquePatients = () => {
    const patientMap: Record<string, {
      name: string;
      email: string;
      phone: string;
      visitCount: number;
      lastVisit: string;
      lastService: string;
      lastDoctor: string;
    }> = {};

    appointments.forEach(app => {
      const email = app.patientEmail?.toLowerCase();
      if (!email) return;

      const currentAppDate = new Date(app.date);

      if (!patientMap[email]) {
        patientMap[email] = {
          name: app.patientName,
          email: app.patientEmail,
          phone: app.patientPhone,
          visitCount: 1,
          lastVisit: app.date,
          lastService: getServiceLabel(app.serviceId),
          lastDoctor: doctors.find(d => d.id === app.doctorId)?.name || "Staff",
        };
      } else {
        patientMap[email].visitCount += 1;
        const existingLastVisit = new Date(patientMap[email].lastVisit);
        if (currentAppDate > existingLastVisit) {
          patientMap[email].lastVisit = app.date;
          patientMap[email].lastService = getServiceLabel(app.serviceId);
          patientMap[email].lastDoctor = doctors.find(d => d.id === app.doctorId)?.name || "Staff";
        }
      }
    });

    return Object.values(patientMap);
  };

  // Revenue computations
  const totalRevenue = appointments
    .filter(app => {
      const statusUpper = (app.status || "").toUpperCase();
      return statusUpper === "CONFIRMED" || statusUpper === "COMPLETED";
    })
    .reduce((sum, app) => sum + getServicePrice(app.serviceId || ""), 0);

  const getMonthlyRevenueData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const data: { name: string; revenue: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        name: months[d.getMonth()],
        revenue: 0
      });
    }

    appointments.forEach(app => {
      const statusUpper = (app.status || "").toUpperCase();
      if (statusUpper !== "CONFIRMED" && statusUpper !== "COMPLETED") return;
      if (!app.date) return;
      const appDate = new Date(app.date);
      if (isNaN(appDate.getTime())) return;
      const appMonth = months[appDate.getMonth()];
      const match = data.find(item => item.name === appMonth);
      if (match) {
        match.revenue += getServicePrice(app.serviceId || "");
      }
    });

    return data;
  };

  const getWeeklyTrendData = () => {
    const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    appointments.forEach(app => {
      if (!app.date) return;
      const appDate = new Date(app.date);
      if (isNaN(appDate.getTime())) return;
      const dayIndex = appDate.getDay();
      if (dayIndex >= 0 && dayIndex < 7) {
        counts[dayIndex] += 1;
      }
    });

    return weekdayLabels.map((day, idx) => ({
      name: day,
      appointments: counts[idx]
    }));
  };

  // Filtered Appointments
  const getFilteredAppointments = () => {
    return appointments.filter(app => {
      const query = searchQuery.toLowerCase();
      const patientName = app.patientName || "Unknown Patient";
      const patientEmail = app.patientEmail || "";
      const patientPhone = app.patientPhone || "";
      const serviceId = app.serviceId || "general";
      const status = app.status || "CONFIRMED";

      const matchesSearch =
        patientName.toLowerCase().includes(query) ||
        patientEmail.toLowerCase().includes(query) ||
        patientPhone.toLowerCase().includes(query) ||
        getServiceLabel(serviceId).toLowerCase().includes(query);
      
      const matchesStatus = statusFilter === "ALL" || status.toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  // Today's appointments list
  const todayString = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(app => app.date === todayString);

  // Pending count for nav badges
  const pendingCount = appointments.filter(app => app.status?.toUpperCase() === "PENDING").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#fefdfb] to-[#f0f4f1] flex font-sans text-[#2d4538] relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-[#7ba591]/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#d4a574]/5 blur-3xl"></div>
      </div>

      {/* Slide-out Sidebar for mobile / sticky for desktop */}
      <aside className={`w-72 bg-[#1c2e24] text-white shrink-0 flex flex-col justify-between transition-transform duration-300 fixed lg:sticky top-0 bottom-0 left-0 z-40 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6">
          {/* Logo brand */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7ba591] to-[#6a9480] flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">DentalCare</h1>
                <p className="text-[10px] text-[#7ba591] tracking-wider uppercase font-semibold">Admin Panel</p>
              </div>
            </div>
            
            {/* Close sidebar button on mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/80"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                activeTab === "dashboard"
                  ? "bg-[#7ba591] text-white shadow-md shadow-[#7ba591]/10"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              Dashboard
            </button>

            <button
              onClick={() => { setActiveTab("appointments"); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                activeTab === "appointments"
                  ? "bg-[#7ba591] text-white shadow-md shadow-[#7ba591]/10"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Calendar className="h-4.5 w-4.5" />
                Appointments
              </div>
              {pendingCount > 0 && (
                <span className="bg-[#d4a574] text-[#1c2e24] font-bold text-xs px-2 py-0.5 rounded-full animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab("doctors"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                activeTab === "doctors"
                  ? "bg-[#7ba591] text-white shadow-md shadow-[#7ba591]/10"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              <User className="h-4.5 w-4.5" />
              Doctors
            </button>

            <button
              onClick={() => { setActiveTab("patients"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                activeTab === "patients"
                  ? "bg-[#7ba591] text-white shadow-md shadow-[#7ba591]/10"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              Patients
            </button>

            <button
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                activeTab === "settings"
                  ? "bg-[#7ba591] text-white shadow-md shadow-[#7ba591]/10"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
              Settings
            </button>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <div>
              <p className="text-xs font-bold">System Administrator</p>
              <p className="text-[10px] text-white/50">{settings.clinicName}</p>
            </div>
          </div>
          
          <Link to="/">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-white/75 hover:bg-white/5 hover:text-white transition-colors text-left cursor-pointer">
              <LogOut className="h-3.5 w-3.5 text-[#d4a574]" />
              Back to Site
            </button>
          </Link>
        </div>
      </aside>

      {/* Main workspace container */}
      <div className="flex-1 min-w-0 flex flex-col z-10">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white/75 backdrop-blur-md border-b border-[#e8e0d8] flex items-center justify-between px-6 sticky top-0 z-30">
          
          {/* Left panel: title / mobile hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#e8e0d8] hover:bg-[#7ba591]/10 transition-colors"
            >
              <Menu className="h-5 w-5 text-[#2d4538]" />
            </button>
            
            <div className="hidden sm:block">
              <h2 className="text-lg font-bold tracking-tight text-[#2d4538] capitalize">
                {activeTab} Management
              </h2>
              <p className="text-[11px] text-[#8a9a90] font-medium">DentalCare Clinic Portal</p>
            </div>
          </div>

          {/* Right panel search/notify */}
          <div className="flex items-center gap-4">
            {/* Live Search bar - displays on relevant tabs */}
            {(activeTab === "appointments" || activeTab === "patients") && (
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a9a90]" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-colors"
                />
              </div>
            )}

            {/* Notification Alert Bell */}
            <div className="relative">
              <button className="p-2.5 rounded-xl border border-[#e8e0d8] hover:bg-[#7ba591]/10 transition-colors relative">
                <Bell className="h-4.5 w-4.5 text-[#2d4538]" />
                {pendingCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d4a574]" />
                )}
              </button>
            </div>

            {/* Back to Home Button */}
            <Link to="/" className="text-xs font-bold text-[#7ba591] hover:text-[#6a9480] transition-colors">
              Back to Site
            </Link>
          </div>
        </header>

        {/* Inner Content Grid */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Custom Notification Toast */}
          {alert && (
            <div className={`p-4 rounded-2xl border text-sm flex items-center gap-3 animate-fade-in shadow-sm ${
              alert.type === "success" ? "bg-green-50 border-green-200 text-green-800" :
              alert.type === "error" ? "bg-red-50 border-red-200 text-red-800" :
              "bg-blue-50 border-blue-200 text-blue-800"
            }`}>
              {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />}
              {alert.type === "error" && <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />}
              {alert.type === "info" && <Clock3 className="h-5 w-5 text-blue-600 shrink-0" />}
              <span className="font-semibold">{alert.message}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <RefreshCw className="h-10 w-10 text-[#7ba591] animate-spin mb-4" />
              <p className="font-serif text-[#5a6a62] font-semibold">Updating admin records...</p>
            </div>
          ) : (
            <>
              {/* ========================================== */}
              {/* TAB 1: DASHBOARD                           */}
              {/* ========================================== */}
              {activeTab === "dashboard" && (
                <div className="space-y-6 animate-fade-in">
                  {/* Grid Stat Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-[#e8e0d8] p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#7ba591]"></div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a9a90] mb-1">Total Appointments</p>
                      <h3 className="text-2xl md:text-3xl font-serif text-[#2d4538] font-bold">{appointments.length}</h3>
                      <p className="text-[10px] text-[#5a6a62] mt-1">Booked from all patients</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e8e0d8] p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#d4a574]"></div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a9a90] mb-1">Confirmed</p>
                      <h3 className="text-2xl md:text-3xl font-serif text-[#2d4538] font-bold">
                        {appointments.filter(a => a.status?.toUpperCase() === "CONFIRMED" || a.status?.toUpperCase() === "COMPLETED").length}
                      </h3>
                      <p className="text-[10px] text-green-700 font-semibold mt-1">Active & Approved slots</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e8e0d8] p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500"></div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a9a90] mb-1">Pending Request</p>
                      <h3 className="text-2xl md:text-3xl font-serif text-[#2d4538] font-bold">{pendingCount}</h3>
                      <p className="text-[10px] text-yellow-700 font-semibold mt-1">Awaiting approval</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e8e0d8] p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a9a90] mb-1">Est. Revenue</p>
                      <h3 className="text-2xl md:text-3xl font-serif text-[#2d4538] font-bold">${totalRevenue}</h3>
                      <p className="text-[10px] text-[#5a6a62] mt-1">Sum of treatments cost</p>
                    </div>
                  </div>

                  {/* Chart Grid */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Bar Chart: Revenue */}
                    <div className="bg-white border border-[#e8e0d8] rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
                      <div className="mb-4">
                        <h4 className="font-serif text-base font-bold text-[#2d4538]">6-Month Clinic Revenue</h4>
                        <p className="text-xs text-[#8a9a90]">Dynamic calculations based on confirmed treatments ($)</p>
                      </div>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getMonthlyRevenueData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1ece6" vertical={false} />
                            <XAxis dataKey="name" stroke="#8a9a90" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#8a9a90" fontSize={11} tickLine={false} axisLine={false} />
                            <ChartTooltip cursor={{ fill: "#7ba591", opacity: 0.05 }} />
                            <Bar dataKey="revenue" fill="#7ba591" radius={[8, 8, 0, 0]}>
                              {getMonthlyRevenueData().map((_, idx) => (
                                <Cell key={`cell-${idx}`} fill={idx % 2 === 0 ? "#7ba591" : "#d4a574"} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Line Chart: Appointment Trend */}
                    <div className="bg-white border border-[#e8e0d8] rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
                      <div className="mb-4">
                        <h4 className="font-serif text-base font-bold text-[#2d4538]">Weekly Appointment Trends</h4>
                        <p className="text-xs text-[#8a9a90]">Frequency of bookings across weekdays</p>
                      </div>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={getWeeklyTrendData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1ece6" vertical={false} />
                            <XAxis dataKey="name" stroke="#8a9a90" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#8a9a90" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                            <ChartTooltip />
                            <Line type="monotone" dataKey="appointments" stroke="#d4a574" strokeWidth={3} dot={{ fill: "#d4a574", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Today's Appointments list */}
                  <div className="bg-white border border-[#e8e0d8] rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#2d4538]">Today's Appointment Schedule</h4>
                        <p className="text-xs text-[#8a9a90]">At a glance overview of patient sessions for today</p>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-[#7ba591]/15 text-[#4a6b5a] px-3 py-1 rounded-full">
                        {todayString}
                      </span>
                    </div>

                    {todayAppointments.length === 0 ? (
                      <div className="text-center py-10 text-[#8a9a90] text-sm">
                        No appointments scheduled for today.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="border-b border-[#e8e0d8]">
                              <th className="pb-3 font-semibold text-[#8a9a90]">Patient</th>
                              <th className="pb-3 font-semibold text-[#8a9a90]">Treatment</th>
                              <th className="pb-3 font-semibold text-[#8a9a90]">Dentist</th>
                              <th className="pb-3 font-semibold text-[#8a9a90]">Time</th>
                              <th className="pb-3 font-semibold text-[#8a9a90]">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e8e0d8]/50">
                            {todayAppointments.map((app) => (
                              <tr key={app.id} className="hover:bg-[#f8f6f3]/50">
                                <td className="py-3 font-bold text-[#2d4538]">{app.patientName}</td>
                                <td className="py-3">{getServiceLabel(app.serviceId)}</td>
                                <td className="py-3 font-medium">
                                  {doctors.find(d => d.id === app.doctorId)?.name || "Default Dentist"}
                                </td>
                                <td className="py-3 font-semibold text-[#7ba591]">{app.time}</td>
                                <td className="py-3">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    app.status?.toUpperCase() === "CONFIRMED" ? "bg-green-100 text-green-800" :
                                    app.status?.toUpperCase() === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                    app.status?.toUpperCase() === "COMPLETED" ? "bg-blue-100 text-blue-800" :
                                    "bg-red-100 text-red-800"
                                  }`}>
                                    {app.status || "CONFIRMED"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================== */}
              {/* TAB 2: APPOINTMENTS                        */}
              {/* ========================================== */}
              {activeTab === "appointments" && (
                <div className="space-y-6 animate-fade-in bg-white border border-[#e8e0d8] rounded-3xl p-6 shadow-sm">
                  {/* Title & Filter Pills */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e8e0d8]">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#2d4538]">Appointment Database</h3>
                      <p className="text-xs text-[#8a9a90]">Review, update status, and manage clinic scheduling log</p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(st => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                            statusFilter === st
                              ? "bg-[#7ba591] text-white shadow-sm"
                              : "border border-[#e8e0d8] text-[#5a6a62] hover:bg-[#7ba591]/10 bg-white"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {getFilteredAppointments().length === 0 ? (
                    <div className="text-center py-20 text-[#8a9a90] text-sm">
                      No appointments matching search queries or filters.
                    </div>
                  ) : (
                    <div className="overflow-x-auto relative">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#e8e0d8] text-[#8a9a90] font-semibold uppercase tracking-wider">
                            <th className="pb-3.5 pl-2">Patient</th>
                            <th className="pb-3.5">Contact</th>
                            <th className="pb-3.5">Service</th>
                            <th className="pb-3.5">Specialist</th>
                            <th className="pb-3.5">Date & Time</th>
                            <th className="pb-3.5">Status</th>
                            <th className="pb-3.5 text-right pr-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e8e0d8]/50">
                          {getFilteredAppointments().map((app) => (
                            <tr key={app.id} className="hover:bg-[#f8f6f3]/50 transition-colors">
                              <td className="py-4 pl-2 font-bold text-[#2d4538] text-sm">
                                {app.patientName}
                                {app.notes && (
                                  <p className="text-[10px] text-[#8a9a90] font-normal italic mt-0.5 line-clamp-1">
                                    Notes: {app.notes}
                                  </p>
                                )}
                              </td>
                              <td className="py-4">
                                <p className="font-semibold">{app.patientEmail}</p>
                                <p className="text-[10px] text-[#8a9a90]">{app.patientPhone}</p>
                              </td>
                              <td className="py-4 font-medium text-[#2d4538]">
                                {getServiceLabel(app.serviceId)}
                              </td>
                              <td className="py-4">
                                {doctors.find(d => d.id === app.doctorId)?.name || "Staff"}
                              </td>
                              <td className="py-4">
                                <p className="font-bold text-[#2d4538]">{app.date}</p>
                                <p className="text-[10px] text-[#7ba591] font-semibold uppercase tracking-wide">
                                  {app.time}
                                </p>
                              </td>
                              <td className="py-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  app.status?.toUpperCase() === "CONFIRMED" ? "bg-green-50 border border-green-200 text-green-700" :
                                  app.status?.toUpperCase() === "PENDING" ? "bg-yellow-50 border border-yellow-200 text-yellow-700 animate-pulse" :
                                  app.status?.toUpperCase() === "COMPLETED" ? "bg-blue-50 border border-blue-200 text-blue-700" :
                                  "bg-red-50 border border-red-200 text-red-700"
                                }`}>
                                  {app.status || "CONFIRMED"}
                                </span>
                              </td>
                              <td className="py-4 text-right pr-4 relative">
                                <div className="inline-block text-left">
                                  <button
                                    onClick={() => setActiveActionRow(activeActionRow === app.id ? null : (app.id || null))}
                                    className="p-1.5 rounded-lg border border-[#e8e0d8] hover:bg-[#7ba591]/15 text-[#2d4538] transition-colors"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                  
                                  {activeActionRow === app.id && (
                                    <div className="origin-top-right absolute right-4 mt-1.5 w-44 rounded-2xl shadow-xl bg-white border border-[#e8e0d8] ring-1 ring-black/5 divide-y divide-[#e8e0d8]/40 z-50 animate-scale-in">
                                      <div className="py-1">
                                        <p className="text-[9px] font-bold text-[#8a9a90] px-3 py-1 uppercase tracking-wider">Change Status</p>
                                        <button
                                          onClick={() => app.id && handleUpdateStatus(app.id, "CONFIRMED")}
                                          className="w-full text-left px-3.5 py-2 text-xs text-[#2d4538] hover:bg-[#f0f4f1] font-semibold flex items-center gap-2 cursor-pointer"
                                        >
                                          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                          Confirm
                                        </button>
                                        <button
                                          onClick={() => app.id && handleUpdateStatus(app.id, "PENDING")}
                                          className="w-full text-left px-3.5 py-2 text-xs text-[#2d4538] hover:bg-[#f0f4f1] font-semibold flex items-center gap-2 cursor-pointer"
                                        >
                                          <Clock3 className="h-3.5 w-3.5 text-yellow-600" />
                                          Pending
                                        </button>
                                        <button
                                          onClick={() => app.id && handleUpdateStatus(app.id, "COMPLETED")}
                                          className="w-full text-left px-3.5 py-2 text-xs text-[#2d4538] hover:bg-[#f0f4f1] font-semibold flex items-center gap-2 cursor-pointer"
                                        >
                                          <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                                          Completed
                                        </button>
                                        <button
                                          onClick={() => app.id && handleUpdateStatus(app.id, "CANCELLED")}
                                          className="w-full text-left px-3.5 py-2 text-xs text-[#2d4538] hover:bg-[#f0f4f1] font-semibold flex items-center gap-2 cursor-pointer"
                                        >
                                          <XCircle className="h-3.5 w-3.5 text-red-600" />
                                          Cancelled
                                        </button>
                                      </div>
                                      <div className="py-1">
                                        <button
                                          onClick={() => app.id && handleDeleteAppointment(app.id)}
                                          className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 cursor-pointer"
                                        >
                                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                          Delete Listing
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================== */}
              {/* TAB 3: DOCTORS                             */}
              {/* ========================================== */}
              {activeTab === "doctors" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#2d4538]">Distinguished Specialists</h3>
                      <p className="text-xs text-[#8a9a90]">Manage dentist profiles, contact information, and statuses</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingDoctor(null);
                        setDoctorForm({ name: "", specialty: "General Dentist", phone: "", email: "", status: "Active" });
                        setDoctorModalOpen(true);
                      }}
                      className="bg-[#7ba591] hover:bg-[#6a9480] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Add Doctor
                    </button>
                  </div>

                  {doctors.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-[#e8e0d8] rounded-3xl text-[#8a9a90] text-sm">
                      No doctors registered. Click "Add Doctor" to begin.
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {doctors.map((doc) => {
                        const patientCount = appointments.filter(a => a.doctorId === doc.id).length;
                        return (
                          <div key={doc.id} className="bg-white border border-[#e8e0d8] rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                            
                            {/* Card Header */}
                            <div>
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="relative w-16 h-16 shrink-0">
                                  {doc.image ? (
                                    <img
                                      src={doc.image}
                                      alt={doc.name}
                                      className="w-full h-full rounded-full object-cover shadow-sm border border-[#7ba591]/20"
                                    />
                                  ) : (
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#7ba591] to-[#6a9480] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                      {doc.avatar}
                                    </div>
                                  )}
                                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                    doc.status?.toLowerCase() === "active" ? "bg-green-500" : "bg-red-500"
                                  }`} />
                                </div>

                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  doc.status?.toLowerCase() === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                  {doc.status || "Active"}
                                </span>
                              </div>

                              <h4 className="font-serif text-base font-bold text-[#2d4538] mb-0.5 group-hover:text-[#7ba591] transition-colors">{doc.name}</h4>
                              <p className="text-xs text-[#8a9a90] font-semibold mb-4">{doc.specialty}</p>

                              {/* Contact Details */}
                              <div className="space-y-1.5 text-xs text-[#5a6a62] mb-5 border-t border-[#e8e0d8]/40 pt-3">
                                <p className="flex items-center gap-2">
                                  <Mail className="h-3.5 w-3.5 text-[#7ba591]" />
                                  <span className="truncate">{doc.email || "No email listed"}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                  <Phone className="h-3.5 w-3.5 text-[#7ba591]" />
                                  <span>{doc.phone || "No phone listed"}</span>
                                </p>
                              </div>
                            </div>

                            {/* Ratings / Patient Counts & Actions */}
                            <div className="border-t border-[#e8e0d8]/50 pt-3.5 flex items-center justify-between text-xs w-full">
                              <div className="flex gap-4">
                                <div>
                                  <span className="block text-[9px] text-[#8a9a90] font-bold uppercase">Patients</span>
                                  <span className="font-bold text-[#2d4538]">{patientCount} count</span>
                                </div>
                                <div>
                                  <span className="block text-[9px] text-[#8a9a90] font-bold uppercase">Rating</span>
                                  <span className="font-bold text-[#d4a574]">4.9 ★</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleEditDoctorClick(doc)}
                                  className="p-2 rounded-xl border border-[#e8e0d8] hover:bg-[#7ba591]/10 text-[#4a6b5a] transition-all cursor-pointer"
                                  title="Edit Specialist"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDoctor(doc.id)}
                                  className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 transition-all cursor-pointer"
                                  title="Delete Specialist"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Doctor Modal Form */}
                  {doctorModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                      <div className="bg-white rounded-3xl border border-[#e8e0d8] shadow-2xl p-6 md:p-8 max-w-md w-full relative z-10 animate-scale-in">
                        <button
                          onClick={() => setDoctorModalOpen(false)}
                          className="absolute top-4 right-4 p-1.5 rounded-lg border border-[#e8e0d8] hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <X className="h-5 w-5" />
                        </button>

                        <h3 className="font-serif text-lg font-bold text-[#2d4538] mb-1">
                          {editingDoctor ? "Modify Specialist Profile" : "Register New Specialist"}
                        </h3>
                        <p className="text-xs text-[#8a9a90] mb-6">Provide dentist details to keep scheduling synchronized</p>

                        <form onSubmit={handleSaveDoctor} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-[#8a9a90] uppercase tracking-wider mb-1.5">Full Name</label>
                            <input
                              type="text"
                              required
                              placeholder="Dr. Full Name"
                              value={doctorForm.name}
                              onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] outline-none text-xs font-semibold text-[#2d4538] bg-white placeholder-[#8a9a90] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-[#8a9a90] uppercase tracking-wider mb-1.5">Specialization</label>
                            <select
                              value={doctorForm.specialty}
                              onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] outline-none text-xs font-semibold text-[#2d4538] bg-white transition-colors"
                            >
                              <option>General Dentist</option>
                              <option>Orthodontist</option>
                              <option>Periodontist</option>
                              <option>Endodontist</option>
                              <option>Oral Surgeon</option>
                              <option>Pediatric Dentist</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-[#8a9a90] uppercase tracking-wider mb-1.5">Email Address</label>
                            <input
                              type="email"
                              required
                              placeholder="name@dentalcare.com"
                              value={doctorForm.email}
                              onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] outline-none text-xs font-semibold text-[#2d4538] bg-white placeholder-[#8a9a90] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-[#8a9a90] uppercase tracking-wider mb-1.5">Phone Number</label>
                            <input
                              type="tel"
                              required
                              placeholder="+1 (555) 000-0000"
                              value={doctorForm.phone}
                              onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] outline-none text-xs font-semibold text-[#2d4538] bg-white placeholder-[#8a9a90] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-[#8a9a90] uppercase tracking-wider mb-1.5">Duty Status</label>
                            <select
                              value={doctorForm.status}
                              onChange={(e) => setDoctorForm({ ...doctorForm, status: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] outline-none text-xs font-semibold text-[#2d4538] bg-white transition-colors"
                            >
                              <option value="Active">Active / On Duty</option>
                              <option value="Inactive">Inactive / On Leave</option>
                            </select>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-[#e8e0d8]/40">
                            <button
                              type="button"
                              onClick={() => setDoctorModalOpen(false)}
                              className="px-4 py-2 text-xs font-bold border border-[#e8e0d8] text-[#5a6a62] rounded-xl hover:bg-[#7ba591]/10 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="bg-[#7ba591] hover:bg-[#6a9480] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
                            >
                              {editingDoctor ? "Update specialist" : "Register specialist"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ========================================== */}
              {/* TAB 4: PATIENTS                            */}
              {/* ========================================== */}
              {activeTab === "patients" && (
                <div className="space-y-6 animate-fade-in bg-white border border-[#e8e0d8] rounded-3xl p-6 shadow-sm">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2d4538]">Patient Directory</h3>
                    <p className="text-xs text-[#8a9a90]">Auto-derived from active and historical appointment logs</p>
                  </div>

                  {uniquePatients().length === 0 ? (
                    <div className="text-center py-20 text-[#8a9a90] text-sm">
                      No patient profiles derived. Once patients book appointments, they will list here.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#e8e0d8] text-[#8a9a90] font-semibold uppercase tracking-wider">
                            <th className="pb-3.5 pl-2">Patient Name</th>
                            <th className="pb-3.5">Email Address</th>
                            <th className="pb-3.5">Phone Number</th>
                            <th className="pb-3.5 text-center">Visits Count</th>
                            <th className="pb-3.5">Last Appointment</th>
                            <th className="pb-3.5">Last Service</th>
                            <th className="pb-3.5">Last Dentist Assigned</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e8e0d8]/50">
                          {uniquePatients().filter(pat => {
                            const q = searchQuery.toLowerCase();
                            return pat.name.toLowerCase().includes(q) || pat.email.toLowerCase().includes(q) || pat.phone.includes(q);
                          }).map((pat, idx) => (
                            <tr key={idx} className="hover:bg-[#f8f6f3]/50 transition-colors">
                              <td className="py-4 pl-2 font-bold text-[#2d4538] text-sm">{pat.name}</td>
                              <td className="py-4 font-semibold text-[#5a6a62]">{pat.email}</td>
                              <td className="py-4 font-semibold text-[#5a6a62]">{pat.phone}</td>
                              <td className="py-4 text-center">
                                <span className="bg-[#7ba591]/15 text-[#4a6b5a] font-bold px-3 py-1 rounded-full text-xs">
                                  {pat.visitCount}
                                </span>
                              </td>
                              <td className="py-4 font-bold text-[#2d4538]">{pat.lastVisit}</td>
                              <td className="py-4 font-medium text-[#7ba591]">{pat.lastService}</td>
                              <td className="py-4">{pat.lastDoctor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================== */}
              {/* TAB 5: SETTINGS                            */}
              {/* ========================================== */}
              {activeTab === "settings" && (
                <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
                  {/* Left Form: General settings */}
                  <div className="md:col-span-2 bg-white border border-[#e8e0d8] rounded-3xl p-6 shadow-sm space-y-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#2d4538]">Clinic Configuration</h3>
                      <p className="text-xs text-[#8a9a90]">Update contact details, operating schedules, and brand name</p>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-[#8a9a90] uppercase tracking-wider mb-1.5">Clinic Brand Name</label>
                          <div className="relative">
                            <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7ba591]" />
                            <input
                              type="text"
                              required
                              value={settings.clinicName}
                              onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] outline-none text-xs font-semibold text-[#2d4538] bg-white transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#8a9a90] uppercase tracking-wider mb-1.5">Contact Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7ba591]" />
                            <input
                              type="text"
                              required
                              value={settings.phone}
                              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] outline-none text-xs font-semibold text-[#2d4538] bg-white transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-[#8a9a90] uppercase tracking-wider mb-1.5">Public Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7ba591]" />
                            <input
                              type="email"
                              required
                              value={settings.email}
                              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] outline-none text-xs font-semibold text-[#2d4538] bg-white transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#8a9a90] uppercase tracking-wider mb-1.5">Operating Working Hours</label>
                          <div className="relative">
                            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7ba591]" />
                            <input
                              type="text"
                              required
                              value={settings.workingHours}
                              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] outline-none text-xs font-semibold text-[#2d4538] bg-white transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8a9a90] uppercase tracking-wider mb-1.5">Suite Physical Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-[#7ba591]" />
                          <textarea
                            required
                            rows={3}
                            value={settings.address}
                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] outline-none text-xs font-semibold text-[#2d4538] bg-white transition-colors resize-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-3">
                        <button
                          type="submit"
                          className="bg-[#7ba591] hover:bg-[#6a9480] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-colors cursor-pointer"
                        >
                          Save Clinic Details
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-white border border-red-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <h4 className="font-serif text-base font-bold text-red-600 mb-1">Danger Zone</h4>
                      <p className="text-xs text-[#8a9a90] mb-4 leading-relaxed">
                        Resetting the database wipes all appointment reservations, user matching logs, and patient records from the MySQL schema permanently.
                      </p>
                    </div>

                    <button
                      onClick={handleResetDatabase}
                      className="w-full bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                      Reset Database
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

    </div>
  );
}
