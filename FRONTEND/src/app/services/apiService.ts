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
    const headers = {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    };

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

  // Swap with dynamic backend fetch: fetch(`${BASE_URL}/doctors`)
  async getDoctors(): Promise<Doctor[]> {
    return [
      { id: "dr-smith", name: "Dr. Sarah Smith", specialty: "General Dentist", avatar: "SS" },
      { id: "dr-patel", name: "Dr. Raj Patel", specialty: "Orthodontist", avatar: "RP", image: doctorImg },
      { id: "dr-chen", name: "Dr. Emily Chen", specialty: "Periodontist", avatar: "EC" },
    ];
  }

  // Swap with dynamic backend fetch or query availability logic
  async getAvailableTimeSlots(doctorId: string, date: string): Promise<string[]> {
    // Return standard available slots, could filter based on doctor & date in the future
    return [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
      "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
      "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    ];
  }

  // Swap with dynamic backend call: POST /appointments
  async createAppointment(appointment: Appointment): Promise<Appointment> {
    // Currently, we simulate saving to localized memory/localStorage.
    // When the backend AppointmentController is ready, replace this with:
    // return this.request<Appointment>("/appointments", { method: "POST", body: JSON.stringify(appointment) });
    const localAppointmentsJson = localStorage.getItem("dental_care_appointments") || "[]";
    const localAppointments = JSON.parse(localAppointmentsJson) as Appointment[];

    const newAppointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
    };

    localAppointments.push(newAppointment);
    localStorage.setItem("dental_care_appointments", JSON.stringify(localAppointments));

    // Simulate minor network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return newAppointment;
  }
}

export const apiService = new ApiService();
