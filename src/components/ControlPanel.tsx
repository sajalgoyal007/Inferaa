/**
 * Control panel for particle simulation
 */

import { Button } from '@/components/ui/button';
import type { Particle } from '@/lib/particle';

interface ControlPanelProps {
  particles: Particle[];
  onSpawnParticle: () => void;
  onClear: () => void;

  autoCamera?: boolean;
  onToggleAutoCamera?: () => void;
  onShowPresets?: () => void;
  onShowTutorial?: () => void;

  learningEnabled: boolean;
  onToggleLearning: () => void;
}

export function ControlPanel({
  particles,
  onSpawnParticle,
  onClear,

  autoCamera = false,
  onToggleAutoCamera,
  onShowPresets,
  onShowTutorial,

  learningEnabled,
  onToggleLearning,
}: ControlPanelProps) {
  const latestParticle = particles[particles.length - 1];
  const state = latestParticle ? latestParticle.filter.getState() : null;

  return (
    <div className="fixed top-4 right-4 w-80 bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 text-white/90 shadow-2xl">
      <h2
        className="text-2xl font-bold mb-4 text-purple-300"
        style={{ fontFamily: 'Playwrite MX Guides, serif' }}
      >
        Infera
      </h2>

      <p className="text-sm text-white/70 mb-6 italic">
        A world that learns gravity — not one that knows it.
      </p>

      <div className="space-y-3 mb-6">
        <Button
          onClick={onSpawnParticle}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Spawn Particle
        </Button>

        <Button
          onClick={onToggleLearning}
          className={`w-full text-sm ${
            learningEnabled
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'border border-purple-500/50 text-purple-300 hover:bg-purple-500/20'
          }`}
        >
          {learningEnabled ? '🧠 Learning: ON' : '⏸ Learning: OFF'}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onClear}
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 text-sm"
          >
            Clear
          </Button>

          {onShowPresets && (
            <Button
              onClick={onShowPresets}
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 text-sm"
            >
              Presets
            </Button>
          )}
        </div>

        {onShowTutorial && (
          <Button
            onClick={onShowTutorial}
            variant="outline"
            className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20 text-sm"
          >
            Tutorial
          </Button>
        )}

        {onToggleAutoCamera && (
          <Button
            onClick={onToggleAutoCamera}
            variant={autoCamera ? 'default' : 'outline'}
            className={`w-full text-sm ${
              autoCamera
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'border-purple-500/50 text-purple-300 hover:bg-purple-500/20'
            }`}
          >
            {autoCamera ? '✓ Auto Camera' : 'Manual Camera'}
          </Button>
        )}
      </div>

      {state && (
        <div className="space-y-3 pt-4 border-t border-purple-500/30">
          <h3 className="text-sm font-semibold text-purple-300 mb-2">
            Learned Parameters
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/70">Gravity (g):</span>
              <span className="text-white font-mono">
                {state.g.toFixed(2)} ±{' '}
                {Math.sqrt(
                  latestParticle.filter.getCovariance().data[4][4]
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/70">Mass (m):</span>
              <span className="text-white font-mono">
                {state.m.toFixed(2)} ±{' '}
                {Math.sqrt(
                  latestParticle.filter.getCovariance().data[5][5]
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/70">Friction (μ):</span>
              <span className="text-white font-mono">
                {state.μ.toFixed(3)} ±{' '}
                {Math.sqrt(
                  latestParticle.filter.getCovariance().data[6][6]
                ).toFixed(3)}
              </span>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-purple-500/20">
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Uncertainty:</span>
              <span className="text-white font-mono">
                {(latestParticle.variance * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-purple-500/30 text-xs text-white/50">
        <p>Particles: {particles.length}</p>
        <p className="mt-1">
          Watch as uncertainty fades and motion stabilizes.
        </p>
      </div>
    </div>
  );
}
