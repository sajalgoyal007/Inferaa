/**
 * Landing page for Infera
 */

import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="w-screen h-screen bg-black relative overflow-y-auto">
      {/* Navbar */}
      <Navbar onEnter={onEnter} />
      {/* Background effects */}
      <div 
        className="fixed inset-0 opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(155, 93, 229, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(96, 10, 199, 0.2) 0%, transparent 50%)'
        }}
      />
      
      {/* Animated particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-white mb-6"
            style={{ fontFamily: 'Playwrite MX Guides, serif' }}
          >
            Infera
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-purple-300 mb-4 font-light italic">
            The Probabilistic Universe Simulator
          </p>
          
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            A world that learns gravity — not one that knows it.
          </p>

          <Button
            onClick={onEnter}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-lg px-10 py-6 rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105"
            size="lg"
          >
            Enter the Universe
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-purple-300 mb-8 text-center"
            style={{ fontFamily: 'Playwrite MX Guides, serif' }}
          >
            About
          </h2>
          
          <div className="space-y-6 text-white/80 text-lg leading-relaxed">
            <p>
              An interactive 3D sandbox where particles don't know physics — they learn it. 
              Each object begins uncertain about constants like gravity, mass, and friction.
            </p>
            
            <p>
              Through Bayesian inference and Kalman filtering, the simulation continuously 
              updates these beliefs as the universe evolves. The entire world learns the laws 
              of motion in real time, visualized as glowing, uncertain particles in a black 
              minimalist cosmos.
            </p>
            
            <p>
              Watch as particles start with high uncertainty (purple, blurry) and gradually 
              learn the true physical constants, becoming more certain (white, sharp) as they 
              observe motion.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-4 py-16 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-purple-300 mb-12 text-center"
            style={{ fontFamily: 'Playwrite MX Guides, serif' }}
          >
            Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 hover:border-purple-400/50 transition-colors">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-purple-300 mb-3">Bayesian Learning</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Particles use Extended Kalman Filters to learn physical constants through observation. 
                Each particle maintains probabilistic beliefs that converge toward true values.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 hover:border-purple-400/50 transition-colors">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-purple-300 mb-3">Real-time Metrics</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Information theory, convergence analysis, and equation discovery in real-time. 
                Watch entropy decrease and consensus form as particles learn.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 hover:border-purple-400/50 transition-colors">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-purple-300 mb-3">Visual Learning</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Uncertainty visualized as glow intensity - watch knowledge emerge from chaos. 
                Purple represents high uncertainty, white represents learned certainty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Section */}
      <section id="technical" className="relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-purple-300 mb-8 text-center"
            style={{ fontFamily: 'Playwrite MX Guides, serif' }}
          >
            Technical Foundation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Mathematical Core</h3>
              <ul className="text-sm text-white/70 space-y-2">
                <li>• Extended Kalman Filter (EKF)</li>
                <li>• Hierarchical Bayesian Inference</li>
                <li>• Information Theory (Entropy, Mutual Information)</li>
                <li>• Convergence Analysis</li>
              </ul>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Technologies</h3>
              <ul className="text-sm text-white/70 space-y-2">
                <li>• React + Three.js</li>
                <li>• Real-time 3D Visualization</li>
                <li>• Custom Physics Engine</li>
                <li>• Symbolic Equation Discovery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold text-purple-300 mb-6"
            style={{ fontFamily: 'Playwrite MX Guides, serif' }}
          >
            Ready to Explore?
          </h2>
          
          <p className="text-lg text-white/70 mb-8 leading-relaxed">
            Witness a universe discovering itself through probabilistic reasoning and Bayesian learning.
          </p>
          
          <Button
            onClick={onEnter}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-lg px-12 py-6 rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105"
            size="lg"
          >
            Enter the Universe
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-8 border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-white/40 mb-2">Built with React, Three.js, and Bayesian Inference</p>
          <p className="text-xs text-white/40">
            Hierarchical Bayesian Learning • Extended Kalman Filters • Information Theory • Equation Discovery
          </p>
        </div>
      </footer>

      {/* Add CSS animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
      `}</style>
    </div>
  );
}
