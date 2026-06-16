import { Link } from "react-router";
import { Button } from "./ui/button";
import { Calendar, Phone, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import doctorImg from "../../imports/doctor.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#f8f6f3] via-[#fefdfb] to-[#f0f4f1]">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[#7ba591] blur-3xl"></div>
        <div className="absolute bottom-20 right-40 w-80 h-80 rounded-full bg-[#d4a574] blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 z-10">
            <div className="inline-block">
              <span className="px-4 py-2 bg-[#7ba591]/10 text-[#4a6b5a] rounded-full text-sm font-medium">
                Welcome to Excellence in Dental Care
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
              <span className="block text-[#2d4538]">Your Smile,</span>
              <span className="block text-[#7ba591]">Our Priority</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-[#5a6a62] max-w-xl leading-relaxed">
              Experience world-class dental care in a warm, welcoming environment. 
              We combine cutting-edge technology with personalized attention.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button size="lg" className="bg-[#7ba591] hover:bg-[#6a9480] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-[#7ba591] text-[#4a6b5a] hover:bg-[#7ba591]/10 px-8 py-6 text-lg rounded-xl">
                <Phone className="mr-2 h-5 w-5" />
                Call Us Now
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-[#5a6a62]">
                <div className="w-12 h-12 rounded-full bg-[#7ba591]/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-[#7ba591]" />
                </div>
                <div>
                  <p className="font-semibold text-[#2d4538]">Visit Us</p>
                  <p className="text-sm">123 Dental Street</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative lg:block hidden">
            <div className="relative w-full h-[600px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7ba591]/20 to-[#d4a574]/20 rounded-3xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-[#2d4538]/5 rounded-3xl transform -rotate-2"></div>
              <div className="absolute inset-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
                <ImageWithFallback 
                  src={doctorImg}
                  alt="Dr. Raj Patel - Lead Dentist"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
