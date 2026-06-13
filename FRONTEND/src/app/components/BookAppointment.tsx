import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Sparkles, Calendar, Clock, User, Mail, Phone, MessageSquare, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "./ui/button";

const services = [
  { id: "general", label: "General Checkup", duration: "30 min", icon: "🦷" },
  { id: "cleaning", label: "Teeth Cleaning", duration: "45 min", icon: "✨" },
  { id: "whitening", label: "Teeth Whitening", duration: "60 min", icon: "⭐" },
  { id: "braces", label: "Braces / Invisalign", duration: "90 min", icon: "😁" },
  { id: "implants", label: "Dental Implants", duration: "120 min", icon: "🔬" },
  { id: "emergency", label: "Emergency Care", duration: "45 min", icon: "🚨" },
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

const doctors = [
  { id: "dr-smith", name: "Dr. Sarah Smith", specialty: "General Dentist", avatar: "SS" },
  { id: "dr-patel", name: "Dr. Raj Patel", specialty: "Orthodontist", avatar: "RP" },
  { id: "dr-chen", name: "Dr. Emily Chen", specialty: "Periodontist", avatar: "EC" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function BookAppointment() {
  const today = new Date();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDate(null);
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayMidnight || date.getDay() === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#fefdfb] to-[#f0f4f1] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#7ba591] flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl text-[#2d4538] mb-4">Appointment Booked!</h2>
          <p className="text-[#5a6a62] mb-2">
            We've confirmed your appointment with <strong>{selectedDoctorData?.name}</strong>.
          </p>
          <p className="text-[#5a6a62] mb-8">
            {monthNames[currentMonth]} {selectedDate}, {currentYear} at {selectedTime}
          </p>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#7ba591]/10 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#8a9a90]">Service</span>
                <span className="text-[#2d4538] font-medium">{selectedServiceData?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a9a90]">Doctor</span>
                <span className="text-[#2d4538] font-medium">{selectedDoctorData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a9a90]">Date & Time</span>
                <span className="text-[#2d4538] font-medium">{monthNames[currentMonth]} {selectedDate} · {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a9a90]">Patient</span>
                <span className="text-[#2d4538] font-medium">{form.name}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#8a9a90] mb-6">A confirmation has been sent to {form.email}</p>
          <Link to="/">
            <Button className="bg-[#7ba591] hover:bg-[#6a9480] text-white rounded-xl px-8">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#fefdfb] to-[#f0f4f1]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#7ba591]/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="h-4 w-4 text-[#5a6a62] group-hover:text-[#7ba591] group-hover:-translate-x-1 transition-all" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7ba591] to-[#6a9480] flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-[#2d4538]">DentalCare</span>
            </div>
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step > s ? "bg-[#7ba591] text-white" :
                  step === s ? "bg-[#2d4538] text-white" :
                  "bg-[#e8e0d8] text-[#8a9a90]"
                }`}>
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 4 && <div className={`w-8 h-px ${step > s ? "bg-[#7ba591]" : "bg-[#e8e0d8]"}`} />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
        {/* Step labels */}
        <div className="flex justify-between text-xs text-[#8a9a90] mb-8 max-w-xs mx-auto">
          <span className={step === 1 ? "text-[#2d4538] font-medium" : ""}>Service</span>
          <span className={step === 2 ? "text-[#2d4538] font-medium" : ""}>Doctor</span>
          <span className={step === 3 ? "text-[#2d4538] font-medium" : ""}>Date & Time</span>
          <span className={step === 4 ? "text-[#2d4538] font-medium" : ""}>Details</span>
        </div>

        {/* STEP 1: Service Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl text-[#2d4538] mb-2">Choose a Service</h2>
            <p className="text-[#5a6a62] mb-8">Select the dental service you need</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-md group ${
                    selectedService === service.id
                      ? "border-[#7ba591] bg-[#7ba591]/5 shadow-md"
                      : "border-[#e8e0d8] bg-white hover:border-[#7ba591]/50"
                  }`}
                >
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-[#2d4538] mb-1">{service.label}</h3>
                  <p className="text-sm text-[#8a9a90]">{service.duration}</p>
                  {selectedService === service.id && (
                    <div className="mt-3 flex items-center gap-1 text-[#7ba591] text-sm font-medium">
                      <Check className="h-4 w-4" /> Selected
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedService}
                className="bg-[#7ba591] hover:bg-[#6a9480] text-white rounded-xl px-8 disabled:opacity-40"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Doctor Selection */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl text-[#2d4538] mb-2">Choose Your Doctor</h2>
            <p className="text-[#5a6a62] mb-8">Select a dentist for your appointment</p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc.id)}
                  className={`p-6 rounded-2xl border-2 text-center transition-all hover:shadow-md ${
                    selectedDoctor === doc.id
                      ? "border-[#7ba591] bg-[#7ba591]/5 shadow-md"
                      : "border-[#e8e0d8] bg-white hover:border-[#7ba591]/50"
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7ba591] to-[#6a9480] flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg shadow-lg">
                    {doc.avatar}
                  </div>
                  <h3 className="font-semibold text-[#2d4538] mb-1">{doc.name}</h3>
                  <p className="text-sm text-[#8a9a90]">{doc.specialty}</p>
                  {selectedDoctor === doc.id && (
                    <div className="mt-3 flex items-center justify-center gap-1 text-[#7ba591] text-sm font-medium">
                      <Check className="h-4 w-4" /> Selected
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="border-[#7ba591] text-[#4a6b5a] rounded-xl px-8">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedDoctor}
                className="bg-[#7ba591] hover:bg-[#6a9480] text-white rounded-xl px-8 disabled:opacity-40"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Date & Time */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl text-[#2d4538] mb-2">Pick a Date & Time</h2>
            <p className="text-[#5a6a62] mb-8">Choose when you'd like your appointment</p>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendar */}
              <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-[#f0f4f1] transition-colors">
                    <ChevronLeft className="h-5 w-5 text-[#2d4538]" />
                  </button>
                  <h3 className="font-semibold text-[#2d4538]">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-[#f0f4f1] transition-colors">
                    <ChevronRight className="h-5 w-5 text-[#2d4538]" />
                  </button>
                </div>
                <div className="grid grid-cols-7 mb-2">
                  {daysOfWeek.map(d => (
                    <div key={d} className="text-center text-xs text-[#8a9a90] py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
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
                        className={`aspect-square rounded-xl text-sm font-medium transition-all ${
                          selected ? "bg-[#7ba591] text-white shadow-md" :
                          disabled ? "text-[#c8d4cc] cursor-not-allowed" :
                          "text-[#2d4538] hover:bg-[#7ba591]/10 hover:text-[#4a6b5a]"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="font-semibold text-[#2d4538] mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#7ba591]" />
                  Available Time Slots
                </h3>
                {selectedDate ? (
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all ${
                          selectedTime === time
                            ? "border-[#7ba591] bg-[#7ba591] text-white shadow-md"
                            : "border-[#e8e0d8] bg-white text-[#2d4538] hover:border-[#7ba591]/60 hover:bg-[#7ba591]/5"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-[#8a9a90] bg-white rounded-2xl border border-[#e8e0d8]">
                    <div className="text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Select a date first</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(2)} className="border-[#7ba591] text-[#4a6b5a] rounded-xl px-8">
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!selectedDate || !selectedTime}
                className="bg-[#7ba591] hover:bg-[#6a9480] text-white rounded-xl px-8 disabled:opacity-40"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Personal Details */}
        {step === 4 && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl text-[#2d4538] mb-2">Your Details</h2>
              <p className="text-[#5a6a62] mb-8">Almost done! Fill in your information</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a9a90]" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#e8e0d8] focus:border-[#7ba591] outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-colors"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a9a90]" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#e8e0d8] focus:border-[#7ba591] outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-colors"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a9a90]" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#e8e0d8] focus:border-[#7ba591] outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-colors"
                    required
                  />
                </div>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-[#8a9a90]" />
                  <textarea
                    placeholder="Any special notes or concerns? (optional)"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={4}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#e8e0d8] focus:border-[#7ba591] outline-none bg-white text-[#2d4538] placeholder-[#8a9a90] transition-colors resize-none"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(3)} className="border-[#7ba591] text-[#4a6b5a] rounded-xl px-8">
                    Back
                  </Button>
                  <Button type="submit" className="bg-[#7ba591] hover:bg-[#6a9480] text-white rounded-xl px-8 shadow-lg">
                    Confirm Appointment
                  </Button>
                </div>
              </form>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm h-fit">
              <h3 className="font-semibold text-[#2d4538] mb-4">Appointment Summary</h3>
              <div className="space-y-4">
                <div className="p-3 bg-[#f0f4f1] rounded-xl">
                  <p className="text-xs text-[#8a9a90] mb-1">Service</p>
                  <p className="font-medium text-[#2d4538]">{selectedServiceData?.icon} {selectedServiceData?.label}</p>
                  <p className="text-sm text-[#7ba591]">{selectedServiceData?.duration}</p>
                </div>
                <div className="p-3 bg-[#f0f4f1] rounded-xl">
                  <p className="text-xs text-[#8a9a90] mb-1">Doctor</p>
                  <p className="font-medium text-[#2d4538]">{selectedDoctorData?.name}</p>
                  <p className="text-sm text-[#7ba591]">{selectedDoctorData?.specialty}</p>
                </div>
                <div className="p-3 bg-[#f0f4f1] rounded-xl">
                  <p className="text-xs text-[#8a9a90] mb-1">Date & Time</p>
                  <p className="font-medium text-[#2d4538]">
                    {monthNames[currentMonth]} {selectedDate}, {currentYear}
                  </p>
                  <p className="text-sm text-[#7ba591]">{selectedTime}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
