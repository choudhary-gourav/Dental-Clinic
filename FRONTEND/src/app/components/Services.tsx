import { Sparkles, Heart, Shield, Smile } from "lucide-react";
import { Card } from "./ui/card";

const services = [
  {
    icon: Smile,
    title: "Cosmetic Dentistry",
    description: "Transform your smile with our advanced cosmetic procedures including whitening, veneers, and bonding.",
    color: "from-[#7ba591] to-[#6a9480]",
    bgColor: "bg-[#7ba591]/10"
  },
  {
    icon: Shield,
    title: "Preventive Care",
    description: "Regular checkups, cleanings, and preventive treatments to keep your smile healthy for life.",
    color: "from-[#d4a574] to-[#c49564]",
    bgColor: "bg-[#d4a574]/10"
  },
  {
    icon: Sparkles,
    title: "Advanced Treatments",
    description: "State-of-the-art procedures including implants, orthodontics, and restorative dentistry.",
    color: "from-[#4a6b5a] to-[#3a5b4a]",
    bgColor: "bg-[#4a6b5a]/10"
  },
  {
    icon: Heart,
    title: "Family Dentistry",
    description: "Comprehensive dental care for patients of all ages in a comfortable, family-friendly environment.",
    color: "from-[#a8bfb3] to-[#98af9f]",
    bgColor: "bg-[#a8bfb3]/10"
  }
];

export function Services() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-4 py-2 bg-[#7ba591]/10 text-[#4a6b5a] rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#2d4538] mb-4">
            Comprehensive Dental Solutions
          </h2>
          <p className="text-lg text-[#5a6a62]">
            From routine care to advanced treatments, we offer everything you need for optimal oral health
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group p-6 sm:p-8 border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white hover:-translate-y-2 rounded-2xl"
            >
              <div className={`w-16 h-16 rounded-2xl ${service.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`h-8 w-8 bg-gradient-to-br ${service.color} bg-clip-text text-transparent`} strokeWidth={2.5} style={{ stroke: 'url(#gradient)' }} />
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" className={service.color.split(' ')[0].replace('from-', '')} />
                      <stop offset="100%" className={service.color.split(' ')[1].replace('to-', '')} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-[#2d4538] mb-3">
                {service.title}
              </h3>
              
              <p className="text-[#5a6a62] leading-relaxed">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
