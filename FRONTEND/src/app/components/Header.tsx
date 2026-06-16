import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Menu, X, Phone, Sparkles, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { apiService, User } from "../services/apiService";

const navigation = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" }
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(apiService.getCurrentUser());
  }, []);

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#7ba591]/10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7ba591] to-[#6a9480] flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2d4538]">DentalCare</h1>
              <p className="text-xs text-[#7ba591]">Excellence in Smiles</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#5a6a62] hover:text-[#7ba591] transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 mr-2 text-[#2d4538] font-medium text-sm">
                  <UserIcon className="h-4 w-4 text-[#7ba591]" />
                  <span>{user.username}</span>
                </div>
                <Button variant="outline" onClick={handleLogout} className="border-[#7ba591] text-[#4a6b5a] hover:bg-[#7ba591]/10 rounded-xl">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="border-[#7ba591] text-[#4a6b5a] hover:bg-[#7ba591]/10 rounded-xl">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
            <Link to="/book">
              <Button className="bg-[#7ba591] hover:bg-[#6a9480] text-white rounded-xl shadow-lg">
                <Phone className="mr-2 h-4 w-4" />
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-[#7ba591]/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-[#2d4538]" />
            ) : (
              <Menu className="h-6 w-6 text-[#2d4538]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#7ba591]/10">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[#5a6a62] hover:text-[#7ba591] transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-2 text-[#2d4538] font-medium text-sm border-b border-[#7ba591]/10">
                    <UserIcon className="h-4 w-4 text-[#7ba591]" />
                    <span>{user.username}</span>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="border-[#7ba591] text-[#4a6b5a] rounded-xl w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="border-[#7ba591] text-[#4a6b5a] rounded-xl w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
              <Link to="/book">
                <Button className="bg-[#7ba591] hover:bg-[#6a9480] text-white rounded-xl shadow-lg w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
