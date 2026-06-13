import { Card } from "./ui/card";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Patient since 2020",
    content: "The best dental experience I've ever had! The team is professional, caring, and the results are outstanding. My smile has never looked better.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
  },
  {
    name: "James Wilson",
    role: "Patient since 2019",
    content: "I was always nervous about dental visits, but the team here made me feel completely at ease. The clinic is modern and welcoming.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
  },
  {
    name: "Emily Rodriguez",
    role: "Patient since 2021",
    content: "From the moment you walk in, you feel valued. The staff is friendly, appointments are on time, and the quality of care is exceptional.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80"
  }
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-4 py-2 bg-[#7ba591]/10 text-[#4a6b5a] rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#2d4538] mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-[#5a6a62]">
            Don't just take our word for it - hear from our satisfied patients
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-8 border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-[#f8f6f3] rounded-2xl"
            >
              <div className="mb-6">
                <Quote className="h-10 w-10 text-[#7ba591]/30" />
              </div>
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#d4a574] text-[#d4a574]" />
                ))}
              </div>
              
              <p className="text-[#5a6a62] mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#7ba591]/20"
                />
                <div>
                  <h4 className="font-semibold text-[#2d4538]">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-[#5a6a62]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
