import doctorImg from "../../imports/doctor.jpg";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface User {
  username: string;
  email: string;
  patentId: number;
}

export interface SignupRequest {
  Username: string;
  PasswordHash: string;
  Email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
}

export interface PatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age?: number;
  dob?: string; // YYYY-MM-DD
  gender?: string;
  address?: string;
}

export interface PatientResponse {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  dob: string;
  gender: string;
  address: string;
  userId: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  image?: string;
  status?: string;
  email?: string;
  phone?: string;
}

export interface DentalService {
  id: string;
  label: string;
  duration: string;
  icon: string;
}

export interface Appointment {
  id?: string;
  serviceId: string;
  doctorId: string;
  date: string;
  time: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  notes?: string;
}

// Local storage keys
const USER_KEY = "dental_care_user";

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      ...(options?.headers as Record<string, string> || {}),
    };

    if (options?.body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = "An error occurred";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        try {
          const textError = await response.text();
          errorMessage = textError || errorMessage;
        } catch {
          // ignore
        }
      }
      throw new Error(errorMessage);
    }

    // Some endpoints might return raw strings, check content type
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    } else {
      return response.text() as unknown as Promise<T>;
    }
  }

  // ==========================================
  // AUTHENTICATION APIs
  // ==========================================

  async signup(username: string, email: string, passwordHash: string): Promise<string> {
    const signupData: SignupRequest = {
      Username: username,
      Email: email,
      PasswordHash: passwordHash,
    };
    const response = await this.request<{ Message: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(signupData),
    });
    return response.Message || "User Registered Successfully";
  }

  async login(email: string, password: string): Promise<User> {
    const loginData: LoginRequest = {
      email,
      password,
    };

    // Call the backend login endpoint
    const response = await this.request<{ Message: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });

    // Since login just returns a success message rather than the user entity,
    // we fetch the user profile from /allusers to get the user's patentId (User ID).
    const allUsers = await this.request<User[]>("/allusers");
    const matchedUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!matchedUser) {
      throw new Error("Login succeeded, but user profile was not found on the server.");
    }

    // Save user info in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(matchedUser));
    return matchedUser;
  }

  async adminLogin(email: string, password: string): Promise<string> {
    const loginData: LoginRequest = {
      email,
      password,
    };

    const response = await this.request<{ Message: string }>("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });

    // Save admin logged-in state
    localStorage.setItem("dental_care_admin", JSON.stringify({ email }));
    return response.Message || "Admin Logged Successfully";
  }

  adminLogout(): void {
    localStorage.removeItem("dental_care_admin");
  }

  isCurrentAdminLoggedIn(): boolean {
    return localStorage.getItem("dental_care_admin") !== null;
  }

  async googleLogin(idToken: string): Promise<string> {
    const response = await this.request<{ Message: string }>("/auth/google-login", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
    return response.Message || "Logged in with Google successfully";
  }

  async getMatchedUserByEmail(email: string): Promise<User> {
    const allUsers = await this.request<User[]>("/allusers");
    const matchedUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!matchedUser) {
      throw new Error("Google login succeeded, but user profile was not found on the server.");
    }
    return matchedUser;
  }

  logout(): void {
    localStorage.removeItem(USER_KEY);
  }


  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }

  // ==========================================
  // PATIENT APIs (Fully Connected to Spring Boot)
  // ==========================================

  async createPatient(userId: number, patient: PatientRequest): Promise<PatientResponse> {
    return this.request<PatientResponse>(`/patient/create/${userId}`, {
      method: "POST",
      body: JSON.stringify(patient),
    });
  }

  async getPatientById(patientId: number): Promise<PatientResponse> {
    return this.request<PatientResponse>(`/patient/${patientId}`);
  }

  async getPatientByEmail(email: string): Promise<PatientResponse> {
    return this.request<PatientResponse>(`/patient/email/${email}`);
  }

  async getAllPatients(): Promise<PatientResponse[]> {
    return this.request<PatientResponse[]>("/patient/allpatient");
  }

  async updatePatient(patientId: number, patient: PatientRequest): Promise<PatientResponse> {
    return this.request<PatientResponse>(`/patient/${patientId}`, {
      method: "PUT",
      body: JSON.stringify(patient),
    });
  }

  async deletePatient(patientId: number): Promise<string> {
    return this.request<string>(`/patient/${patientId}`, {
      method: "DELETE",
    });
  }

  // ==========================================
  // MOCK/ATTACH-READY APIs
  // (Ready for backend connection when entities are created)
  // ==========================================

  // Swap with dynamic backend fetch: fetch(`${BASE_URL}/services`)
  async getServices(): Promise<DentalService[]> {
    return [
      { id: "general", label: "General Checkup", duration: "30 min", icon: "🦷" },
      { id: "cleaning", label: "Teeth Cleaning", duration: "45 min", icon: "✨" },
      { id: "whitening", label: "Teeth Whitening", duration: "60 min", icon: "⭐" },
      { id: "braces", label: "Braces / Invisalign", duration: "90 min", icon: "😁" },
      { id: "implants", label: "Dental Implants", duration: "120 min", icon: "🔬" },
      { id: "emergency", label: "Emergency Care", duration: "45 min", icon: "🚨" },
    ];
  }

  async getDoctors(): Promise<Doctor[]> {
    const rawDoctors = await this.request<any[]>("/doctor/alldoctor");
    return rawDoctors.map((doc) => {
      const initials = doc.fullname
        .replace(/^(Dr\.|Mr\.|Ms\.)\s+/i, "")
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
      
      let image: string | undefined = undefined;
      if (doc.fullname.includes("Raj Patel")) {
        image = doctorImg;
      }

      return {
        id: String(doc.doctor_id),
        name: doc.fullname,
        specialty: doc.specialization,
        avatar: initials || "DR",
        image,
        status: doc.status || "Active",
        email: doc.email || "",
        phone: doc.phone || "",
      };
    });
  }

  async getAvailableTimeSlots(doctorId: string, date: string): Promise<string[]> {
    return this.request<string[]>(`/appointments/available-slots?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(date)}`);
  }

  async createAppointment(appointment: Appointment): Promise<Appointment> {
    return this.request<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    });
  }

  async getAllAppointments(): Promise<Appointment[]> {
    const raw = await this.request<any[]>("/appointments/all");
    return raw.map((app) => {
      // Extract serviceId and notes from reason if it follows "serviceId - Notes: notes"
      let serviceId = "general";
      let notes = "";
      if (app.reason) {
        const parts = app.reason.split(" - Notes: ");
        serviceId = parts[0] || "general";
        notes = parts[1] || "";
      }

      // Format time (e.g. from "09:00:00" to "09:00 AM")
      let time = app.appointmentTime || "";
      if (time && time.includes(":")) {
        try {
          const timeParts = time.split(":");
          const hour = parseInt(timeParts[0], 10);
          const min = timeParts[1];
          const ampm = hour >= 12 ? "PM" : "AM";
          const displayHour = hour % 12 === 0 ? 12 : hour % 12;
          time = `${String(displayHour).padStart(2, '0')}:${min} ${ampm}`;
        } catch (e) {
          console.error("Failed to parse time", time, e);
        }
      }

      // Safely extract doctor details
      const doctorId = app.doctor ? String(app.doctor.doctor_id) : "";
      
      // Safely extract patient details
      const rawLastName = app.patient?.lastName || "";
      const validLastName = rawLastName.toLowerCase() !== "name" ? rawLastName : "";
      const patientName = app.patient ? `${app.patient.firstName || ""} ${validLastName}`.trim() : "Unknown Patient";
      const patientEmail = app.patient ? app.patient.email || "" : "";
      const patientPhone = app.patient ? app.patient.phone || "" : "";

      return {
        id: String(app.appointmentid),
        serviceId,
        doctorId,
        date: app.appointmentDate || "",
        time,
        patientName,
        patientEmail,
        patientPhone,
        notes,
        status: app.status || "CONFIRMED"
      };
    });
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    return this.request<Appointment>(`/appointments/${id}/status?status=${encodeURIComponent(status)}`, {
      method: "PUT",
    });
  }

  async deleteAppointment(id: string): Promise<void> {
    await this.request<void>(`/appointments/${id}`, {
      method: "DELETE",
    });
  }

  async createDoctor(doctor: { name: string; specialty: string; phone: string; email: string; status: string }): Promise<Doctor> {
    const rawDoctor = {
      fullname: doctor.name,
      specialization: doctor.specialty,
      phone: doctor.phone,
      email: doctor.email,
      status: doctor.status,
    };
    const response = await this.request<any>("/doctor/savedoctor", {
      method: "POST",
      body: JSON.stringify(rawDoctor),
    });
    return {
      id: String(response.doctor_id),
      name: response.fullname,
      specialty: response.specialization,
      avatar: response.fullname.split(" ").map((n: string) => n[0]).join("").toUpperCase(),
      status: response.status || "Active",
      email: response.email || "",
      phone: response.phone || "",
    };
  }

  async updateDoctor(id: string, doctor: { name: string; specialty: string; phone: string; email: string; status: string }): Promise<Doctor> {
    const rawDoctor = {
      fullname: doctor.name,
      specialization: doctor.specialty,
      phone: doctor.phone,
      email: doctor.email,
      status: doctor.status,
    };
    const response = await this.request<any>(`/doctor/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(rawDoctor),
    });
    return {
      id: String(response.doctor_id),
      name: response.fullname,
      specialty: response.specialization,
      avatar: response.fullname.split(" ").map((n: string) => n[0]).join("").toUpperCase(),
      status: response.status || "Active",
      email: response.email || "",
      phone: response.phone || "",
    };
  }

  async deleteDoctor(id: string): Promise<void> {
    await this.request<void>(`/doctor/delete/${id}`, {
      method: "DELETE",
    });
  }

  async resetDatabase(): Promise<string> {
    return this.request<string>("/admin/reset", {
      method: "POST",
    });
  }

}

export const apiService = new ApiService();
