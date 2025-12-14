/**
 * Advanced Statistics and Mathematical Metrics Panel
 */

import type { GlobalPosterior } from '@/lib/hierarchical-bayesian';
import type { DiscoveredEquation } from '@/lib/equation-discovery';

interface StatisticsPanelProps {
  globalPosterior: GlobalPosterior | null;
  discoveredEquations: {
    gravity: DiscoveredEquation | null;
    velocity: DiscoveredEquation | null;
    position: DiscoveredEquation | null;
  } | null;
  mutualInformation: number;
  convergenceMetrics: {
    converged: boolean;
    convergenceRate: number;
    stability: number;
  } | null;
}

export function StatisticsPanel({
  globalPosterior,
  discoveredEquations,
  mutualInformation,
  convergenceMetrics
}: StatisticsPanelProps) {
<<<<<<< HEAD
  const isConverged = convergenceMetrics?.converged;

=======
>>>>>>> 2c65c367e0dcd038c0b442c199461dbea0c2db1e
  return (
    <div className="fixed bottom-4 left-4 w-96 bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 text-white/90 shadow-2xl max-h-[60vh] overflow-y-auto">
      <h3 className="text-xl font-bold mb-4 text-purple-300" style={{ fontFamily: 'Playwrite MX Guides, serif' }}>
        Mathematical Metrics
      </h3>

<<<<<<< HEAD
      <div className="mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isConverged
              ? "bg-white text-black"
              : "bg-purple-600 text-white"
          }`}
        >
          {isConverged ? "⚪ Converged" : "🟣 Learning"}
        </span>
      </div>

=======
>>>>>>> 2c65c367e0dcd038c0b442c199461dbea0c2db1e
      {/* Information Theory */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-purple-200 mb-2">Information Theory</h4>
        <div className="space-y-2 text-xs">
          {globalPosterior && (
            <>
              <div className="flex justify-between">
                <span className="text-white/70">Gravity Entropy (H):</span>
                <span className="text-white font-mono">
                  {globalPosterior.gravity.entropy.toFixed(3)} bits
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Mass Entropy (H):</span>
                <span className="text-white font-mono">
                  {globalPosterior.mass.entropy.toFixed(3)} bits
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Friction Entropy (H):</span>
                <span className="text-white font-mono">
                  {globalPosterior.friction.entropy.toFixed(3)} bits
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-purple-500/20">
                <span className="text-white/70">Total Information Gain:</span>
                <span className="text-white font-mono">
                  {globalPosterior.informationGain.toFixed(3)} bits
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Mutual Information I(X;Y):</span>
                <span className="text-white font-mono">
                  {mutualInformation.toFixed(3)} bits
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Convergence Analysis */}
      {convergenceMetrics && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-purple-200 mb-2">Convergence Analysis</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/70">Converged:</span>
              <span className={`font-mono ${convergenceMetrics.converged ? 'text-green-400' : 'text-yellow-400'}`}>
                {convergenceMetrics.converged ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Convergence Rate:</span>
              <span className="text-white font-mono">
                {(convergenceMetrics.convergenceRate * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Stability (1/σ²):</span>
              <span className="text-white font-mono">
                {convergenceMetrics.stability.toFixed(3)}
              </span>
            </div>
            {globalPosterior && (
              <div className="flex justify-between">
                <span className="text-white/70">Consensus Strength:</span>
                <span className="text-white font-mono">
                  {(globalPosterior.consensusStrength * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Discovered Equations */}
      {discoveredEquations && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-purple-200 mb-2">Discovered Equations</h4>
          <div className="space-y-3 text-xs">
            {discoveredEquations.gravity && (
              <div className="bg-purple-900/20 p-2 rounded border border-purple-500/30">
                <div className="font-mono text-purple-300 mb-1">
                  {discoveredEquations.gravity.form}
                </div>
                <div className="space-y-1">
                  {discoveredEquations.gravity.parameters.map((param: { name: string; value: number; confidence: number }) => (
                    <div key={param.name} className="flex justify-between text-white/80">
                      <span>{param.name}:</span>
                      <span className="font-mono">
                        {param.value.toFixed(3)} (R² = {discoveredEquations.gravity?.rSquared.toFixed(3) ?? '0.000'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {discoveredEquations.velocity && (
              <div className="bg-purple-900/20 p-2 rounded border border-purple-500/30">
                <div className="font-mono text-purple-300 mb-1">
                  {discoveredEquations.velocity.form}
                </div>
                <div className="text-white/80 font-mono text-[10px]">
                  R² = {discoveredEquations.velocity.rSquared.toFixed(3)}
                </div>
              </div>
            )}
            {discoveredEquations.position && (
              <div className="bg-purple-900/20 p-2 rounded border border-purple-500/30">
                <div className="font-mono text-purple-300 mb-1">
                  {discoveredEquations.position.form}
                </div>
                <div className="text-white/80 font-mono text-[10px]">
                  R² = {discoveredEquations.position.rSquared.toFixed(3)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bayesian Statistics */}
      {globalPosterior && (
        <div>
          <h4 className="text-sm font-semibold text-purple-200 mb-2">Global Posterior</h4>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-white/70">Gravity:</span>
                <span className="text-white font-mono">
                  {globalPosterior.gravity.mean.toFixed(3)} ± {Math.sqrt(globalPosterior.gravity.variance).toFixed(3)}
                </span>
              </div>
              <div className="text-white/50 text-[10px]">
                N({globalPosterior.gravity.mean.toFixed(2)}, {globalPosterior.gravity.variance.toFixed(2)})
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-white/70">Mass:</span>
                <span className="text-white font-mono">
                  {globalPosterior.mass.mean.toFixed(3)} ± {Math.sqrt(globalPosterior.mass.variance).toFixed(3)}
                </span>
              </div>
              <div className="text-white/50 text-[10px]">
                N({globalPosterior.mass.mean.toFixed(2)}, {globalPosterior.mass.variance.toFixed(2)})
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-white/70">Friction:</span>
                <span className="text-white font-mono">
                  {globalPosterior.friction.mean.toFixed(3)} ± {Math.sqrt(globalPosterior.friction.variance).toFixed(3)}
                </span>
              </div>
              <div className="text-white/50 text-[10px]">
                N({globalPosterior.friction.mean.toFixed(2)}, {globalPosterior.friction.variance.toFixed(2)})
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

