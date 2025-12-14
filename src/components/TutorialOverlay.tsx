/**
 * Interactive Tutorial Overlay for Infera
 * Guides new users through Bayesian learning concepts
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft, Brain, Eye, Zap } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  highlight?: string;
  icon: React.ReactNode;
  action?: string;
}

interface TutorialOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  onSpawnParticle: () => void;
  onShowPresets: () => void;
  particles: any[];
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Infera',
    description: 'This is a universe where particles don\'t know physics — they learn it through Bayesian inference. Watch as uncertainty transforms into knowledge.',
    icon: <Brain className="w-8 h-8 text-purple-300" />,
    highlight: 'title-overlay'
  },
  {
    id: 'uncertainty',
    title: 'Understanding Uncertainty',
    description: 'Purple glow = High uncertainty about gravity, mass, and friction. White light = Confident knowledge. The visual intensity represents the particle\'s belief variance.',
    icon: <Eye className="w-8 h-8 text-purple-300" />,
    highlight: 'visual-explanation'
  },
  {
    id: 'spawn',
    title: 'Create Your First Particle',
    description: 'Click "Spawn Particle" to add a learning entity. It starts with high uncertainty (purple) and gradually learns the true physics constants.',
    icon: <Zap className="w-8 h-8 text-purple-300" />,
    action: 'spawn-particle',
    highlight: 'control-panel'
  },
  {
    id: 'learning',
    title: 'Watch the Learning Process',
    description: 'Observe as the particle moves chaotically at first, then stabilizes. The Extended Kalman Filter updates beliefs based on observed motion vs predicted motion.',
    icon: <Brain className="w-8 h-8 text-purple-300" />
  },
  {
    id: 'statistics',
    title: 'Mathematical Insights',
    description: 'The Statistics Panel shows real-time Bayesian metrics: entropy (uncertainty), mutual information (particle agreement), and discovered equations.',
    icon: <Eye className="w-8 h-8 text-purple-300" />,
    highlight: 'statistics-panel'
  },
  {
    id: 'presets',
    title: 'Try Advanced Scenarios',
    description: 'Use presets like "Explosion" or "Chaos" to see collective learning. Multiple particles share knowledge through hierarchical Bayesian inference.',
    icon: <Zap className="w-8 h-8 text-purple-300" />,
    action: 'show-presets'
  },
  {
    id: 'complete',
    title: 'Explore and Discover',
    description: 'You\'ve learned the basics! Experiment with different scenarios and watch how uncertainty fades into scientific knowledge through probabilistic reasoning.',
    icon: <Brain className="w-8 h-8 text-purple-300" />
  }
];

export function TutorialOverlay({ 
  isVisible, 
  onClose, 
  onSpawnParticle, 
  onShowPresets,
  particles 
}: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSpawnedParticle, setHasSpawnedParticle] = useState(false);

  const step = tutorialSteps[currentStep];

  // Check if user has spawned a particle
  useEffect(() => {
    if (particles.length > 0) {
      setHasSpawnedParticle(true);
    }
  }, [particles]);

  // Auto-advance from spawn step if particle was created
  useEffect(() => {
    if (step.id === 'spawn' && hasSpawnedParticle) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 1500);
    }
  }, [hasSpawnedParticle, step.id, currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAction = () => {
    if (step.action === 'spawn-particle') {
      onSpawnParticle();
    } else if (step.action === 'show-presets') {
      onShowPresets();
      setTimeout(() => setCurrentStep(currentStep + 1), 1000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      {/* Highlight overlays */}
      {step.highlight === 'control-panel' && (
        <div className="fixed top-4 right-4 w-80 h-120 border-4 border-purple-400 rounded-lg bg-purple-400/10 animate-pulse" />
      )}
      {step.highlight === 'statistics-panel' && (
        <div className="fixed bottom-4 left-4 w-96 h-140 border-4 border-purple-400 rounded-lg bg-purple-400/10 animate-pulse" />
      )}
      {step.highlight === 'title-overlay' && (
        <div className="fixed top-2 left-2 w-64 h-20 border-4 border-purple-400 rounded-lg bg-purple-400/10 animate-pulse" />
      )}

      {/* Tutorial modal */}
      <div className="bg-black/95 backdrop-blur-xl border border-purple-500/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {step.icon}
            <div>
              <h2 
                className="text-2xl font-bold text-purple-300"
                style={{ fontFamily: 'Playwrite MX Guides, serif' }}
              >
                {step.title}
              </h2>
              <p className="text-sm text-white/50">
                Step {currentStep + 1} of {tutorialSteps.length}
              </p>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-purple-500/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-purple-900/30 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className="text-lg text-white/90 leading-relaxed">
            {step.description}
          </p>

          {/* Special content for certain steps */}
          {step.id === 'uncertainty' && (
            <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full blur-sm"></div>
                <span className="text-sm text-purple-300">High Uncertainty (Learning)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-white rounded-full"></div>
                <span className="text-sm text-white">Low Uncertainty (Learned)</span>
              </div>
            </div>
          )}

          {step.id === 'learning' && particles.length > 0 && (
            <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
              <p className="text-sm text-purple-300 mb-2">Current particle status:</p>
              <p className="text-xs text-white/70 font-mono">
                Uncertainty: {(particles[0]?.variance * 100).toFixed(1)}%
                {particles[0]?.variance > 5 ? ' (Still learning)' : ' (Gaining confidence)'}
              </p>
            </div>
          )}
        </div>

        {/* Action button for interactive steps */}
        {step.action && (
          <div className="mb-6">
            <Button
              onClick={handleAction}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-3"
              disabled={step.action === 'spawn-particle' && hasSpawnedParticle}
            >
              {step.action === 'spawn-particle' && hasSpawnedParticle 
                ? '✓ Particle Created' 
                : step.action === 'spawn-particle' 
                ? 'Spawn Your First Particle'
                : 'Show Simulation Presets'
              }
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-purple-400' 
                    : index < currentStep 
                    ? 'bg-purple-600' 
                    : 'bg-purple-900/50'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Start Exploring' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}