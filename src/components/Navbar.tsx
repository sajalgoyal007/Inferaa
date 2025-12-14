/**
 * Navigation bar for landing page
 */

import { Button } from '@/components/ui/button';

interface NavbarProps {
  onEnter: () => void;
}

export function Navbar({ onEnter }: NavbarProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/60 backdrop-blur-xl border border-purple-500/40 rounded-full px-6 py-3 shadow-2xl">
        <div className="flex items-center justify-center space-x-6">
          {/* Logo */}
          <div 
            className="text-xl font-bold text-purple-300 cursor-pointer hover:text-purple-200 transition-colors"
            style={{ fontFamily: 'Playwrite MX Guides, serif' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Infera
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-purple-500/30" />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              onClick={() => scrollToSection('about')}
              className="text-white/70 hover:text-purple-300 transition-colors text-sm px-3 py-1.5 rounded-full hover:bg-purple-500/10"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-white/70 hover:text-purple-300 transition-colors text-sm px-3 py-1.5 rounded-full hover:bg-purple-500/10"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('technical')}
              className="text-white/70 hover:text-purple-300 transition-colors text-sm px-3 py-1.5 rounded-full hover:bg-purple-500/10"
            >
              Technical
            </button>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-purple-500/30" />

          {/* CTA Button */}
          <Button
            onClick={onEnter}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-sm px-5 py-1.5 rounded-full shadow-lg"
          >
            Enter Universe
          </Button>
        </div>
      </div>
    </nav>
  );
}
