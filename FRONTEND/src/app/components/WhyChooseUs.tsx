import { Award, Clock, Users, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const features = [
  {
    icon: Award,
    title: "Expert Team",
    description: "Board-certified dentists with 20+ years of experience"
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Evening and weekend appointments available"
  },
  {
    icon: Users,
    title: "5000+ Happy Patients",
    description: "Trusted by families across the community"
  },
  {
    icon: Star,
    title: "5-Star Reviews",
    description: "Consistently rated as the top dental practice"
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#f8f6f3] to-[#f0f4f1]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="inline-block px-4 py-2 bg-[#7ba591]/10 text-[#4a6b5a] rounded-full text-sm font-medium mb-6">
              Why Choose Us
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#2d4538] mb-6">
              Excellence in Every Smile We Create
            </h2>
            
            <p className="text-lg text-[#5a6a62] mb-8 leading-relaxed">
              We believe everyone deserves a healthy, beautiful smile. Our practice combines 
              advanced technology with compassionate care to deliver exceptional results.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7ba591] to-[#6a9480] flex items-center justify-center shadow-lg">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2d4538] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#5a6a62]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#7ba591]/30 to-[#d4a574]/30 rounded-3xl blur-2xl"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&q=80"
                      alt="Dental equipment"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80"
                      alt="Dentist with patient"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1609840114035-3c981960b1ab?w=400&q=80"
                      alt="Dental clinic"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&q=80"
                      alt="Modern dentistry"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
