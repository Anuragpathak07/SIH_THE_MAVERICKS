import { Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">GeoSentinel AI</h4>
            <p className="text-sm text-foreground/70">
              Professional, innovative, and trustworthy solutions for industrial safety.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-semibold tracking-wide text-foreground/80 mb-3">Contact</h5>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contact@geosentinel.ai</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 123 Industrial Park, Tech City</li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold tracking-wide text-foreground/80 mb-3">Follow</h5>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-full glass-card hover:shadow-md transition-shadow"><Linkedin className="w-4 h-4" /></a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-full glass-card hover:shadow-md transition-shadow"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-10 text-xs text-foreground/50">© {new Date().getFullYear()} GeoSentinel AI. All rights reserved.</div>
      </div>
    </footer>
  );
};


