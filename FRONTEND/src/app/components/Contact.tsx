import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    content: "+1 (555) 123-4567",
    link: "tel:+15551234567"
  },
  {
    icon: Mail,
    title: "Email",
    content: "hello@dentalcare.com",
    link: "mailto:hello@dentalcare.com"
  },
  {
    icon: MapPin,
    title: "Address",
    content: "123 Dental Street, Health City, HC 12345",
    link: "#"
  },
  {
    icon: Clock,
    title: "Hours",
    content: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
    link: "#"
  }
];

export function Contact() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#2d4538] to-[#3a5b4a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-4 py-2 bg-white/10 text-[#a8bfb3] rounded-full text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-[#a8bfb3]">
            Schedule your appointment today and take the first step towards a healthier smile
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8 sm:p-10 bg-white/95 backdrop-blur-sm border-none rounded-2xl shadow-2xl">
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#2d4538] mb-2">
                      First Name
                    </label>
                    <Input 
                      placeholder="John"
                      className="border-[#7ba591]/30 focus:border-[#7ba591] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d4538] mb-2">
                      Last Name
                    </label>
                    <Input 
                      placeholder="Doe"
                      className="border-[#7ba591]/30 focus:border-[#7ba591] rounded-xl"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#2d4538] mb-2">
                      Email
                    </label>
                    <Input 
                      type="email"
                      placeholder="john@example.com"
                      className="border-[#7ba591]/30 focus:border-[#7ba591] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d4538] mb-2">
                      Phone
                    </label>
                    <Input 
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="border-[#7ba591]/30 focus:border-[#7ba591] rounded-xl"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#2d4538] mb-2">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Tell us about your dental needs..."
                    rows={5}
                    className="border-[#7ba591]/30 focus:border-[#7ba591] rounded-xl resize-none"
                  />
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-[#7ba591] to-[#6a9480] hover:from-[#6a9480] hover:to-[#5a8470] text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
          
          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <Card 
                key={index}
                className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors duration-300 rounded-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {info.title}
                    </h3>
                    <a 
                      href={info.link}
                      className="text-sm text-[#a8bfb3] hover:text-white transition-colors"
                    >
                      {info.content}
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
