import { BrowserRouter, Routes, Route } from "react-router";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { LoginPage } from "./components/LoginPage";
import { BookAppointment } from "./components/BookAppointment";

function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section id="home">
          <Hero />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="about">
          <WhyChooseUs />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book" element={<BookAppointment />} />
      </Routes>
    </BrowserRouter>
  );
}
