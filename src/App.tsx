/**
 * Infera: The Probabilistic Universe Simulator
 * Main application component
 */

import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ParticleSystem } from '@/lib/particle';
import type { Particle } from '@/lib/particle';
import { HierarchicalBayesianUniverse } from '@/lib/hierarchical-bayesian';
import { EquationDiscovery } from '@/lib/equation-discovery';
import { MetaLearningAgent } from '@/lib/meta-learning';
import { Universe } from '@/components/Universe';
import { ControlPanel } from '@/components/ControlPanel';
import { StatisticsPanel } from '@/components/StatisticsPanel';
import { PosteriorVisualization } from '@/components/PosteriorVisualization';
import { AutoCamera } from '@/components/AutoCamera';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { SimulationPresets } from '@/components/SimulationPresets';
import { VisualEffects } from '@/components/VisualEffects';
import { CollisionEffects } from '@/components/CollisionEffects';
import { LandingPage } from '@/components/LandingPage';
import { TutorialOverlay } from '@/components/TutorialOverlay';

function App() {
  const [showSimulation, setShowSimulation] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [learningEnabled, setLearningEnabled] = useState(true);
  const [globalPosterior, setGlobalPosterior] = useState<any>(null);
  const [discoveredEquations, setDiscoveredEquations] = useState<any>(null);
  const [mutualInformation, setMutualInformation] = useState(0);
  const [convergenceMetrics, setConvergenceMetrics] = useState<any>(null);
  const [autoCamera, setAutoCamera] = useState(true);
  const [showPresets, setShowPresets] = useState(false);
  const [collisionEvents, setCollisionEvents] = useState<any[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const hierarchicalBayesianRef = useRef<HierarchicalBayesianUniverse | null>(null);
  const equationDiscoveryRef = useRef<EquationDiscovery | null>(null);
  const metaLearningRef = useRef<MetaLearningAgent | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeStepRef = useRef(0);

  // Initialize systems
  useEffect(() => {
    particleSystemRef.current = new ParticleSystem();
    hierarchicalBayesianRef.current = new HierarchicalBayesianUniverse();
    equationDiscoveryRef.current = new EquationDiscovery();
    metaLearningRef.current = new MetaLearningAgent();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Animation loop with advanced features
  useEffect(() => {
    const animate = () => {
      if (particleSystemRef.current && hierarchicalBayesianRef.current && 
          equationDiscoveryRef.current && metaLearningRef.current) {
        
        // Update particle physics and get collision events
        // const collisions = particleSystemRef.current.update();
        const collisions = particleSystemRef.current.update(learningEnabled);


        const updatedParticles = particleSystemRef.current.getParticles();
        setParticles(updatedParticles);
        setCollisionEvents(collisions);

        // Update hierarchical Bayesian universe
        updatedParticles.forEach((particle) => {
          const state = particle.filter.getState();
          const variance = particle.filter.getVariance();
          
          hierarchicalBayesianRef.current!.updateGlobalPosterior(particle.id, {
            g: state.g,
            m: state.m,
            μ: state.μ,
            variance
          });

          // Collect observations for equation discovery
          if (particle.trail.length >= 2) {
            const prev = particle.trail[particle.trail.length - 2];
            const curr = particle.trail[particle.trail.length - 1];
            const dt = 0.016;
            
            const velocity = {
              x: (curr.x - prev.x) / dt,
              y: (curr.y - prev.y) / dt
            };
            
            const prevVel = particle.trail.length >= 3 
              ? {
                  x: (prev.x - particle.trail[particle.trail.length - 3].x) / dt,
                  y: (prev.y - particle.trail[particle.trail.length - 3].y) / dt
                }
              : { x: 0, y: 0 };
            
            const acceleration = {
              x: (velocity.x - prevVel.x) / dt,
              y: (velocity.y - prevVel.y) / dt
            };

            equationDiscoveryRef.current!.addObservation(
              { x: curr.x, y: curr.y },
              velocity,
              acceleration,
              timeStepRef.current
            );
          }

          // Meta-learning adaptation
          const previousVariance = particle.trail.length > 1 
            ? particle.trail[particle.trail.length - 2].variance 
            : variance;
          metaLearningRef.current!.adapt(variance, previousVariance, timeStepRef.current);
        });

        // Update global state
        const posterior = hierarchicalBayesianRef.current.getGlobalPosterior();
        setGlobalPosterior(posterior);
        
        const equations = equationDiscoveryRef.current.getAllDiscoveredEquations();
        setDiscoveredEquations(equations);
        
        const mi = hierarchicalBayesianRef.current.calculateMutualInformation();
        setMutualInformation(mi);
        
        const convergence = hierarchicalBayesianRef.current.getConvergenceMetrics();
        setConvergenceMetrics(convergence);

        timeStepRef.current += 0.016;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleSpawnParticle = () => {
    if (!particleSystemRef.current) return;

    const id = `particle-${Date.now()}-${Math.random()}`;
    const position = {
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 2
    };
    const velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: 0
    };

    particleSystemRef.current.createParticle(id, position, velocity);
    setParticles(particleSystemRef.current.getParticles());
  };

  const handleClear = () => {
    if (particleSystemRef.current) {
      particleSystemRef.current.clear();
      setParticles([]);
    }
    if (hierarchicalBayesianRef.current) {
      hierarchicalBayesianRef.current = new HierarchicalBayesianUniverse();
    }
    if (equationDiscoveryRef.current) {
      equationDiscoveryRef.current = new EquationDiscovery();
    }
    timeStepRef.current = 0;
  };

  const handlePresetSelect = (preset: {
    count: number;
    initialVelocity: { x: number; y: number; z: number };
    spread: number;
  }) => {
    handleClear();
    
    // Spawn particles according to preset
    for (let i = 0; i < preset.count; i++) {
      setTimeout(() => {
        if (!particleSystemRef.current) return;
        
        const angle = (i / preset.count) * Math.PI * 2;
        const radius = Math.random() * preset.spread;
        const position = {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius + 2,
          z: (Math.random() - 0.5) * preset.spread * 0.5
        };
        
        const velocity = {
          x: preset.initialVelocity.x + (Math.random() - 0.5) * 0.5,
          y: preset.initialVelocity.y + (Math.random() - 0.5) * 0.5,
          z: preset.initialVelocity.z + (Math.random() - 0.5) * 0.5
        };
        
        const id = `particle-preset-${Date.now()}-${i}`;
        particleSystemRef.current.createParticle(id, position, velocity);
        setParticles(particleSystemRef.current.getParticles());
      }, i * 100);
    }
    
    setShowPresets(false);
  };

  // Show landing page first
  if (!showSimulation) {
    return <LandingPage onEnter={() => {
      setShowSimulation(true);
      setShowTutorial(true); // Show tutorial when entering simulation
    }} />;
  }

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        className="bg-black"
      >
        <Universe particles={particles} />
        <VisualEffects />
        <CollisionEffects collisions={collisionEvents} />
        <AutoCamera particles={particles} enabled={autoCamera} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          enabled={!autoCamera}
        />
      </Canvas>

      {/* Control Panel */}
      <ControlPanel

  particles={particles}
  onSpawnParticle={handleSpawnParticle}
  onClear={handleClear}
  autoCamera={autoCamera}
  onToggleAutoCamera={() => setAutoCamera(!autoCamera)}
  onShowPresets={() => setShowPresets(!showPresets)}
  onShowTutorial={() => setShowTutorial(true)}
  learningEnabled={learningEnabled}
  onToggleLearning={() => setLearningEnabled(!learningEnabled)}
/>

       

      {/* Simulation Presets */}
      {showPresets && (
        <SimulationPresets onPresetSelect={handlePresetSelect} />
      )}

      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Statistics Panel */}
      <StatisticsPanel
        globalPosterior={globalPosterior}
        discoveredEquations={discoveredEquations}
        mutualInformation={mutualInformation}
        convergenceMetrics={convergenceMetrics}
      />

      {/* Posterior Visualization */}
      <div className="fixed bottom-4 right-4 w-80">
        <PosteriorVisualization globalPosterior={globalPosterior} />
      </div>

      {/* Title Overlay */}
      <div className="fixed top-4 left-4 text-white/90 z-10">
        <h1 className="text-4xl font-bold text-purple-300 mb-2" style={{ fontFamily: 'Playwrite MX Guides, serif' }}>
          Infera
        </h1>
        <p className="text-sm text-white/70 italic">
          The Probabilistic Universe Simulator
        </p>
      </div>

      {/* Tutorial Overlay */}
      <TutorialOverlay
        isVisible={showTutorial}
        onClose={() => setShowTutorial(false)}
        onSpawnParticle={handleSpawnParticle}
        onShowPresets={() => setShowPresets(true)}
        particles={particles}
      />

      {/* Subtle radial gradient background effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at center, rgba(155, 93, 229, 0.1) 0%, transparent 70%)'
        }}
      />
    </div>
  );
}

export default App;
