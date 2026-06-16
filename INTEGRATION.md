# Dental Clinic Integration Documentation

This document explains the integration completed between the React Frontend and Spring Boot Backend, as well as instructions on how to extend it as you develop the remaining backend APIs.

---

## 1. Overview of Changes Made

To bridge the frontend with the Spring Boot backend without modifying the premium UI/UX, we have:
1. **Created a Centralized API Service:** [apiService.ts](file:///e:/PROJECT(2)/FRONTEND/src/app/services/apiService.ts) handles all HTTP communication using the standard `fetch` API.
2. **Removed Hardcoded States:** Page and form views now fetch services, doctors, and available time slots from the `apiService`.
3. **Wired up Login and Signup:**
   - Sign up calls `/auth/signup` with registration parameters.
   - Login calls `/auth/login` and matches the user's email against `/allusers` to retrieve their user ID (`patentId`), saving the active session to `localStorage`.
4. **Wired up Patient Verification and Creation:**
   - In Step 4 of the appointment booking, the app checks if the logged-in user has an existing patient profile using `/patient/email/{email}`.
   - If found, it pre-populates details automatically.
   - If not found, the user enters their details and the app creates a new Patient record in the database using `/patient/create/{userId}` upon confirming the appointment.
5. **Integrated Logging and Loading states:** Feedback messages (such as validation errors, passwords mismatch, or success indicators) are gracefully rendered with micro-animations.

---

## 2. API Service Layer (`apiService.ts`)

The API configurations are centralized in [apiService.ts](file:///e:/PROJECT(2)/FRONTEND/src/app/services/apiService.ts). It detects the backend server URL from the environment variable (`VITE_API_URL`):

- **Development:** Defined in [FRONTEND/.env](file:///e:/PROJECT(2)/FRONTEND/.env) as `http://localhost:8080`.
- **Production:** Simply set `VITE_API_URL` in your production environment variables to your deployment address.

### Active Endpoints Integrated:
- `POST /auth/signup` (Creates user account)
- `POST /auth/login` (Authenticates user)
- `GET /allusers` (Fetches users to map credentials to `patentId` on login)
- `GET /patient/email/{email}` (Locates profile of the logged-in user)
- `POST /patient/create/{userId}` (Creates patient record in database)

---

## 3. How to Connect Upcoming Backend APIs

When you build your upcoming backend tables and controllers (Doctors, Services, Appointments), follow these instructions to hook them up directly to the frontend.

### A. Doctors API Integration
Currently, the doctors list is simulated inside `apiService.ts`. Once you build a `DoctorController` in Spring Boot with a `GET /doctor/all` endpoint returning a list of doctors, update the method in [apiService.ts](file:///e:/PROJECT(2)/FRONTEND/src/app/services/apiService.ts#L182-L190) like this:

```typescript
// Replace:
async getDoctors(): Promise<Doctor[]> {
  return [
    { id: "dr-smith", name: "Dr. Sarah Smith", specialty: "General Dentist", avatar: "SS" },
    ...
  ];
}

// With:
async getDoctors(): Promise<Doctor[]> {
  return this.request<Doctor[]>("/doctor/all");
}
```

### B. Dental Services API Integration
Once you build a `ServiceController` returning all available treatments at `GET /service/all`, update the method in [apiService.ts](file:///e:/PROJECT(2)/FRONTEND/src/app/services/apiService.ts#L170-L179) like this:

```typescript
// Replace:
async getServices(): Promise<DentalService[]> {
  return [
    { id: "general", label: "General Checkup", duration: "30 min", icon: "🦷" },
    ...
  ];
}

// With:
async getServices(): Promise<DentalService[]> {
  return this.request<DentalService[]>("/service/all");
}
```

### C. Appointments API Integration
Currently, appointments are saved to local memory (`localStorage`) to simulate successful booking. Once you build an `AppointmentController` with a `POST /appointment/create` or similar endpoint:
1. Update your TypeScript interfaces if your JSON response parameters change.
2. Replace [createAppointment](file:///e:/PROJECT(2)/FRONTEND/src/app/services/apiService.ts#L198-L220) with:

```typescript
// Replace the simulation code with:
async createAppointment(appointment: Appointment): Promise<Appointment> {
  return this.request<Appointment>("/appointment/create", {
    method: "POST",
    body: JSON.stringify(appointment),
  });
}
```

---

## 4. Run Locally

### 1. Run Backend
Ensure your Spring Boot backend is active and running on port `8080`.

### 2. Run Frontend
Navigate to the `FRONTEND` directory and run:
```bash
npm install
npm run dev
```
Open your browser at the displayed local URL (typically `http://localhost:5173`) to test the complete user registration, login, and patient profile booking workflows.
