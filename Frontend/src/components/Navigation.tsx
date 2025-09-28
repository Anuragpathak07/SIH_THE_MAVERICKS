import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Activity } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = ({ onLogoClick }: { onLogoClick?: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={onLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 neon-glow-aqua">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-semibold text-foreground">GeoSentinel AI</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#solutions" className="text-foreground/80 hover:text-primary transition-colors">
              Solutions
            </a>
            <a href="#technology" className="text-foreground/80 hover:text-primary transition-colors">
              Technology
            </a>
            <a href="#dashboard" className="text-foreground/80 hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="hero" size="sm" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Live Demo</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg glass-card"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a href="#solutions" className="block text-foreground/80 hover:text-primary transition-colors">
              Solutions
            </a>
            <a href="#technology" className="block text-foreground/80 hover:text-primary transition-colors">
              Technology
            </a>
            <a href="#dashboard" className="block text-foreground/80 hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#contact" className="block text-foreground/80 hover:text-primary transition-colors">
              Contact
            </a>
            <div className="pt-4 space-y-2">
              <div className="flex justify-center pb-2">
                <ThemeToggle />
              </div>
              <Button variant="ghost" size="sm" className="w-full">
                Sign In
              </Button>
              <Button variant="hero" size="sm" className="w-full">
                Live Demo
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};