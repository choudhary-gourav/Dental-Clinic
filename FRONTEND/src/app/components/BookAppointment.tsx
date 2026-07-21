import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Sparkles, Calendar, Clock, User, Mail, Phone, MessageSquare, ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { apiService, DentalService, Doctor, User as ApiUser } from "../services/apiService";
// @ts-ignore
import confetti from "canvas-confetti";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function BookAppointment() {
  const today = new Date();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  // Dynamic lists from backend/API
  const [services, setServices] = useState<DentalService[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  
  // Auth and Patient states
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // 1. Initial configuration fetch & login check
  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);

    // Load services and doctors
    Promise.all([
      apiService.getServices(),
      apiService.getDoctors(),
    ]).then(([fetchedServices, fetchedDoctors]) => {
      setServices(fetchedServices);
      setDoctors(fetchedDoctors);
      setLoading(false);
    }).catch(err => {
      console.error("Error loading services/doctors:", err);
      setLoading(false);
    });

    // Check if patient profile exists for this logged in user
    apiService.getPatientByEmail(user.email).then((patient) => {
      // Patient exists, prefill details
      const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.trim();
      setForm({
        name: fullName,
        email: patient.email,
        phone: patient.phone,
        notes: "",
      });
      setIsNewPatient(false);
    }).catch((err) => {
      // Patient doesn't exist, we keep isNewPatient = true, and prefill email from User account
      setForm((prev) => ({
        ...prev,
        name: user.username,
        email: user.email,
      }));
      setIsNewPatient(true);
    });
  }, [navigate]);

  // 2. Fetch available time slots dynamically when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      apiService.getAvailableTimeSlots(selectedDoctor, dateString).then((slots) => {
        setTimeSlots(slots);
      }).catch(err => {
        console.error("Error loading slots:", err);
      });
    } else {
      setTimeSlots([]);
    }
  }, [selectedDoctor, selectedDate, currentMonth, currentYear]);

  // 3. Confetti effect on successful booking
  useEffect(() => {
    if (submitted) {
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.65 },
          colors: ["#7ba591", "#d4a574", "#2d4538", "#ffffff"]
        });
      } catch (e) {
        console.error("Confetti animation failed", e);
      }
    }
  }, [submitted]);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDate(null);
    setSelectedTime("");
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDate(null);
    setSelectedTime("");
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayMidnight || date.getDay() === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Create Patient record in DB if they are a new patient
      if (isNewPatient) {
        const nameParts = form.name.trim().split(/\s+/);
        const firstName = nameParts[0] || "Patient";
        const lastName = nameParts.slice(1).join(" ");

        await apiService.createPatient(currentUser.patentId, {
          firstName,
          lastName,
          email: form.email,
          phone: form.phone,
          age: 27,
          dob: "1999-01-01",
          gender: "Other",
          address: "Not Specified",
        });
        setIsNewPatient(false);
      }

      // 2. Book appointment
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      await apiService.createAppointment({
        serviceId: selectedService,
        doctorId: selectedDoctor,
        date: dateString,
        time: selectedTime,
        patientName: form.name,
        patientEmail: form.email,
        patientPhone: form.phone,
        notes: form.notes,
      });

      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to book appointment. Please check your network and details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#fefdfb] to-[#f0f4f1] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#7ba591]/10 blur-[100px]"></div>
        </div>
        <div className="text-center relative z-10 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#7ba591]/15 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Loader2 className="h-8 w-8 text-[#7ba591] animate-spin" />
          </div>
          <p className="text-[#5a6a62] font-semibold tracking-wide font-serif">Curating clinic data...</p>
          <p className="text-xs text-[#8a9a90] mt-1">Preparing your luxury dental experience</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#fefdfb] to-[#f0f4f1] relative overflow-hidden flex items-center justify-center px-4 py-16">
        {/* Background Decorative Glows */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#7ba591]/10 blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#d4a574]/8 blur-[150px]"></div>
        </div>

        <div className="text-center max-w-md w-full relative z-10 animate-scale-in bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_24px_80px_rgba(45,69,56,0.06)] rounded-3xl p-8 sm:p-10">
          <div className="w-20 h-20 rounded-full bg-[#7ba591] flex items-center justify-center mx-auto mb-6 shadow-xl ring-8 ring-[#7ba591]/10 border border-white/20">
            <Check className="h-10 w-10 text-white stroke-[2.5]" />
          </div>
          
          <span className="text-xs font-bold tracking-widest text-[#d4a574] uppercase block mb-2">Confirmed</span>
          <h2 className="text-3xl text-[#2d4538] font-serif mb-4">Reservation Placed</h2>
          <p className="text-sm text-[#5a6a62] mb-8 max-w-sm mx-auto leading-relaxed">
            We are pleased to confirm your appointment reservation with <strong>{selectedDoctorData?.name}</strong>.
          </p>
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-[#e8e0d8] mb-8 text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4a574]"></div>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center py-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8a9a90]">Service</span>
                <span className="text-sm font-bold text-[#2d4538] flex items-center gap-1.5">
                  {selectedServiceData?.icon} {selectedServiceData?.label}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-[#e8e0d8]/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8a9a90]">Specialist</span>
                <span className="text-sm font-bold text-[#2d4538]">{selectedDoctorData?.name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-[#e8e0d8]/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8a9a90]">Date & Time</span>
                <span className="text-sm font-bold text-[#2d4538]">
                  {monthNames[currentMonth]} {selectedDate} · {selectedTime}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-[#e8e0d8]/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8a9a90]">Patient</span>
                <span className="text-sm font-bold text-[#2d4538]">{form.name}</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-[#8a9a90] mb-8 font-medium">A confirmation receipt has been sent to <span className="text-[#2d4538] font-semibold">{form.email}</span></p>
          
          <Link to="/">
            <Button className="bg-gradient-to-r from-[#7ba591] to-[#6a9480] hover:from-[#6a9480] hover:to-[#59836f] text-white rounded-xl px-10 py-5 font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#fefdfb] to-[#f0f4f1] relative overflow-hidden flex flex-col">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#7ba591]/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#d4a574]/8 blur-[150px]"></div>
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#7ba591]/5 blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="bg-white/75 backdrop-blur-md border-b border-[#e8e0d8] sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group relative z-10">
            <ArrowLeft className="h-4 w-4 text-[#5a6a62] group-hover:text-[#7ba591] group-hover:-translate-x-1 transition-all" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7ba591] to-[#6a9480] flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-[#2d4538] font-serif">DentalCare</span>
            </div>
          </Link>

          {/* Step progress timeline */}
          <div className="flex items-center gap-2 sm:gap-3 relative z-10">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2 sm:gap-3">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-semibold tracking-wider transition-all duration-300 ${
                  step > s ? "bg-[#7ba591] text-white shadow-sm font-bold" :
                  step === s ? "bg-[#2d4538] text-white ring-4 ring-[#2d4538]/10 font-bold" :
                  "bg-white/50 text-[#8a9a90] border border-[#e8e0d8] font-medium"
                }`}>
                  {step > s ? <Check className="h-4 w-4 stroke-[2.5]" /> : s}
                </div>
                {s < 4 && <div className={`w-6 sm:w-10 h-0.5 rounded-full ${step > s ? "bg-gradient-to-r from-[#7ba591] to-[#6a9480]" : "bg-[#e8e0d8]"}`} />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl relative z-10 flex items-center justify-center">
        <div className="w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_24px_80px_rgba(45,69,56,0.06)] rounded-3xl p-6 sm:p-10 lg:p-12 transition-all duration-500">
          
          {/* Step Labels / Mini Progress Timeline */}
          <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-[#8a9a90] mb-10 max-w-md mx-auto border-b border-[#e8e0d8]/40 pb-4">
            <span className={step === 1 ? "text-[#2d4538] border-b-2 border-[#7ba591] pb-4 -mb-[18px] transition-all" : "pb-4"}>1. Service</span>
            <span className={step === 2 ? "text-[#2d4538] border-b-2 border-[#7ba591] pb-4 -mb-[18px] transition-all" : "pb-4"}>2. Dentist</span>
            <span className={step === 3 ? "text-[#2d4538] border-b-2 border-[#7ba591] pb-4 -mb-[18px] transition-all" : "pb-4"}>3. Schedule</span>
            <span className={step === 4 ? "text-[#2d4538] border-b-2 border-[#7ba591] pb-4 -mb-[18px] transition-all" : "pb-4"}>4. Details</span>
          </div>

          {/* STEP 1: Service Selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center sm:text-left mb-8">
                <span className="text-xs font-bold tracking-widest text-[#d4a574] uppercase block mb-2">Exquisite Care</span>
                <h2 className="text-3xl sm:text-4xl text-[#2d4538] font-serif mb-2">Select Your Treatment</h2>
                <p className="text-[#5a6a62]">Choose from our range of bespoke dental services tailored to you</p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-6 rounded-2xl border text-left transition-all duration-300 relative group cursor-pointer flex flex-col justify-between ${
                      selectedService === service.id
                        ? "border-[#7ba591] bg-gradient-to-b from-[#7ba591]/8 to-white shadow-[0_12px_30px_rgba(123,165,145,0.12)] ring-1 ring-[#7ba591]/30"
                        : "border-[#e8e0d8] bg-white hover:border-[#7ba591]/40 hover:shadow-[0_12px_24px_rgba(0,0,0,0.02)] hover:-translate-y-0.5"
                    }`}
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#f8f6f3] flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <h3 className="font-semibold text-[#2d4538] text-base mb-1 tracking-tight group-hover:text-[#7ba591] transition-colors">{service.label}</h3>
                      <p className="text-xs text-[#8a9a90] mb-4 line-clamp-2">Bespoke treatment crafted for your complete oral health and beauty.</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#e8e0d8]/30 w-full">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-[#d4a574]/10 text-[#a3794e] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <Clock className="h-3 w-3" />
                        {service.duration}
                      </span>
                      
                      {selectedService === service.id && (
                        <div className="w-6 h-6 rounded-full bg-[#7ba591] flex items-center justify-center text-white shadow-sm animate-scale-in">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end mt-10 pt-6 border-t border-[#e8e0d8]/40">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedService}
                  className="bg-gradient-to-r from-[#7ba591] to-[#6a9480] hover:from-[#6a9480] hover:to-[#59836f] text-white rounded-xl px-10 py-6 font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Doctor Selection */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="text-center sm:text-left mb-8">
                <span className="text-xs font-bold tracking-widest text-[#d4a574] uppercase block mb-2">Our Specialists</span>
                <h2 className="text-3xl sm:text-4xl text-[#2d4538] font-serif mb-2">Choose Your Dentist</h2>
                <p className="text-[#5a6a62]">Select from our distinguished dentists offering world-class expertise</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mb-10">
                {doctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc.id)}
                    className={`p-6 rounded-2xl border text-center transition-all duration-300 relative group cursor-pointer ${
                      selectedDoctor === doc.id
                        ? "border-[#7ba591] bg-gradient-to-b from-[#7ba591]/8 to-white shadow-[0_12px_30px_rgba(123,165,145,0.12)] ring-1 ring-[#7ba591]/30"
                        : "border-[#e8e0d8] bg-white hover:border-[#7ba591]/40 hover:shadow-[0_12px_24px_rgba(0,0,0,0.02)] hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      {doc.image ? (
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-full h-full rounded-full object-cover shadow-md ring-4 ring-[#7ba591]/15 ring-offset-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#7ba591] to-[#6a9480] flex items-center justify-center text-white font-bold text-xl shadow-md ring-4 ring-[#7ba591]/15 ring-offset-2 group-hover:scale-105 transition-transform duration-300">
                          {doc.avatar}
                        </div>
                      )}
                      {selectedDoctor === doc.id && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#7ba591] flex items-center justify-center text-white shadow-sm border-2 border-white animate-scale-in">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-[#2d4538] text-base mb-1 group-hover:text-[#7ba591] transition-colors">{doc.name}</h3>
                    <p className="text-xs text-[#8a9a90] mb-3">{doc.specialty}</p>
                    
                    <span className="inline-block text-[10px] uppercase tracking-wider font-bold bg-[#f0f4f1] text-[#4a6b5a] px-2.5 py-1 rounded-full">
                      Expert Clinician
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t border-[#e8e0d8]/40">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)} 
                  className="border-[#7ba591]/65 text-[#4a6b5a] hover:bg-[#7ba591]/10 rounded-xl px-8 font-medium transition-colors cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedDoctor}
                  className="bg-gradient-to-r from-[#7ba591] to-[#6a9480] hover:from-[#6a9480] hover:to-[#59836f] text-white rounded-xl px-10 py-6 font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Date & Time */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center sm:text-left mb-8">
                <span className="text-xs font-bold tracking-widest text-[#d4a574] uppercase block mb-2">Scheduling</span>
                <h2 className="text-3xl sm:text-4xl text-[#2d4538] font-serif mb-2">Select Date & Time</h2>
                <p className="text-[#5a6a62]">Select a convenient slot for your visit to our luxury dental suite</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Calendar - 7 cols */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#e8e0d8]/80 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#7ba591]"></div>
                  <div className="flex items-center justify-between mb-6 pl-2">
                    <button onClick={prevMonth} className="p-2 rounded-xl border border-[#e8e0d8] hover:bg-[#f0f4f1] transition-all cursor-pointer">
                      <ChevronLeft className="h-5 w-5 text-[#2d4538]" />
                    </button>
                    <h3 className="font-semibold text-[#2d4538] text-base font-serif">
                      {monthNames[currentMonth]} {currentYear}
                    </h3>
                    <button onClick={nextMonth} className="p-2 rounded-xl border border-[#e8e0d8] hover:bg-[#f0f4f1] transition-all cursor-pointer">
                      <ChevronRight className="h-5 w-5 text-[#2d4538]" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 mb-3 text-center">
                    {daysOfWeek.map(d => (
                      <div key={d} className="text-[10px] font-bold uppercase tracking-wider text-[#8a9a90] py-1">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const disabled = isDateDisabled(day);
                      const selected = selectedDate === day;
                      return (
                        <button
                          key={day}
                          onClick={() => !disabled && setSelectedDate(day)}
                          disabled={disabled}
                          className={`aspect-square rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center relative ${
                            selected 
                              ? "bg-gradient-to-br from-[#7ba591] to-[#6a9480] text-white shadow-md ring-2 ring-[#7ba591]/30 font-bold scale-[1.05]" 
                              : disabled 
                              ? "text-[#e8e0d8] opacity-35 cursor-not-allowed" 
                              : "text-[#2d4538] hover:bg-[#7ba591]/10 hover:text-[#4a6b5a] bg-white border border-[#e8e0d8]/30"
                          }`}
                        >
                          {day}
                          {day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() && !selected && (
                            <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#d4a574]"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots - 5 cols */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-[#2d4538] text-base mb-4 flex items-center gap-2">
                      <Clock className="h-4.5 w-4.5 text-[#7ba591]" />
                      Available Time Slots
                    </h3>
                    {selectedDate ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 px-2 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                              selectedTime === time
                                ? "border-[#7ba591] bg-gradient-to-r from-[#7ba591] to-[#6a9480] text-white shadow-md"
                                : "border-[#e8e0d8] bg-white text-[#2d4538] hover:border-[#7ba591]/50 hover:bg-[#7ba591]/5"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 text-[#8a9a90] bg-white rounded-2xl border border-[#e8e0d8]/60 p-6">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-full bg-[#f8f6f3] flex items-center justify-center mx-auto mb-3 shadow-inner">
                            <Calendar className="h-5 w-5 text-[#8a9a90] opacity-60" />
                          </div>
                          <p className="text-xs font-medium">Select an appointment date from the calendar</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t border-[#e8e0d8]/40">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)} 
                  className="border-[#7ba591]/65 text-[#4a6b5a] hover:bg-[#7ba591]/10 rounded-xl px-8 font-medium transition-colors cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!selectedDate || !selectedTime}
                  className="bg-gradient-to-r from-[#7ba591] to-[#6a9480] hover:from-[#6a9480] hover:to-[#59836f] text-white rounded-xl px-10 py-6 font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Personal Details */}
          {step === 4 && (
            <div className="grid lg:grid-cols-12 gap-8 animate-fade-in">
              <div className="lg:col-span-7">
                <div className="mb-6">
                  <span className="text-xs font-bold tracking-widest text-[#d4a574] uppercase block mb-2">Final Step</span>
                  <h2 className="text-3xl text-[#2d4538] font-serif mb-2">Your Details</h2>
                  <p className="text-[#5a6a62]">Provide your details to complete your luxury suite booking</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 animate-shake">
                      {submitError}
                    </div>
                  )}

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#7ba591]" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] focus:ring-4 focus:ring-[#7ba591]/10 outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-all duration-300 font-semibold"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#7ba591]" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] focus:ring-4 focus:ring-[#7ba591]/10 outline-none bg-white/60 text-[#2d4538] placeholder-[#8a9a90] transition-all duration-300 font-semibold cursor-not-allowed"
                      required
                      disabled
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#7ba591]" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] focus:ring-4 focus:ring-[#7ba591]/10 outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-all duration-300 font-semibold"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 h-4.5 w-4.5 text-[#7ba591]" />
                    <textarea
                      placeholder="Any special notes or concerns? (optional)"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={4}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#e8e0d8] focus:border-[#7ba591] focus:ring-4 focus:ring-[#7ba591]/10 outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-all duration-300 font-semibold resize-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(3)} 
                      className="border-[#7ba591]/65 text-[#4a6b5a] hover:bg-[#7ba591]/10 rounded-xl px-8 font-medium transition-colors cursor-pointer"
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-[#7ba591] to-[#6a9480] hover:from-[#6a9480] hover:to-[#59836f] text-white rounded-xl px-8 py-5 font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Reserving...
                        </>
                      ) : (
                        "Confirm Appointment"
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Summary Ticket - 5 cols */}
              <div className="lg:col-span-5">
                <div className="bg-gradient-to-b from-[#fdfbf9] to-[#f5f2ed] rounded-2xl border border-[#e8e0d8] p-6 relative overflow-hidden shadow-md">
                  {/* Gold Top Border Ribbon */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#d4a574]"></div>
                  
                  <h3 className="font-semibold text-[#2d4538] text-base mb-6 font-serif text-center pb-3 border-b border-[#e8e0d8]/60">
                    Reservation Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#7ba591]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="h-4 w-4 text-[#7ba591]" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-[#8a9a90]">Service</p>
                        <p className="text-sm font-semibold text-[#2d4538]">{selectedServiceData?.icon} {selectedServiceData?.label}</p>
                        <p className="text-xs text-[#7ba591] font-medium">{selectedServiceData?.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#7ba591]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="h-4 w-4 text-[#7ba591]" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-[#8a9a90]">Specialist</p>
                        <p className="text-sm font-semibold text-[#2d4538]">{selectedDoctorData?.name}</p>
                        <p className="text-xs text-[#7ba591] font-medium">{selectedDoctorData?.specialty}</p>
                      </div>
                    </div>

                    {/* Perforated ticket-like notch line */}
                    <div className="border-t border-dashed border-[#e8e0d8] my-4 relative -mx-6">
                      <span className="absolute -left-[6px] -top-1 w-2 h-2 rounded-full bg-white/95 border-r border-[#e8e0d8]"></span>
                      <span className="absolute -right-[6px] -top-1 w-2 h-2 rounded-full bg-white/95 border-l border-[#e8e0d8]"></span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#7ba591]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Calendar className="h-4 w-4 text-[#7ba591]" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-[#8a9a90]">Schedule</p>
                        <p className="text-sm font-semibold text-[#2d4538]">
                          {monthNames[currentMonth]} {selectedDate}, {currentYear}
                        </p>
                        <p className="text-xs text-[#7ba591] font-medium">{selectedTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#e8e0d8]/60 text-center">
                    <p className="text-[10px] text-[#8a9a90] italic">Please review details before confirming.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
