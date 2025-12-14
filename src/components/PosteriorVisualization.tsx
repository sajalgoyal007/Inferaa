/**
 * Real-time Posterior Distribution Visualization
 * Shows probability distributions for learned parameters
 */

import { useMemo } from 'react';
import type { GlobalPosterior } from '@/lib/hierarchical-bayesian';

interface PosteriorVisualizationProps {
  globalPosterior: GlobalPosterior | null;
  width?: number;
  height?: number;
}

export function PosteriorVisualization({ 
  globalPosterior, 
  width = 300, 
  height = 200 
}: PosteriorVisualizationProps) {
  const gravityDistribution = useMemo(() => {
    if (!globalPosterior) return null;
    
    const { mean, variance } = globalPosterior.gravity;
    const stdDev = Math.sqrt(variance);
    const points: Array<{ x: number; y: number }> = [];
    
    // Generate Gaussian curve
    for (let i = 0; i < 100; i++) {
      const x = mean - 3 * stdDev + (i / 100) * 6 * stdDev;
      const y = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) / (stdDev * Math.sqrt(2 * Math.PI));
      points.push({ x, y });
    }
    
    return { points, mean, stdDev };
  }, [globalPosterior]);

  if (!globalPosterior || !gravityDistribution) {
    return (
      <div className="w-full h-48 bg-purple-900/10 rounded border border-purple-500/20 flex items-center justify-center text-white/50 text-xs">
        Collecting data...
      </div>
    );
  }

  const { points, mean, stdDev } = gravityDistribution;
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const maxY = Math.max(...points.map(p => p.y));

  // Normalize for visualization
  const normalizedPoints = points.map(p => ({
    x: ((p.x - minX) / (maxX - minX)) * width,
    y: (1 - p.y / maxY) * height
  }));

  return (
    <div className="w-full bg-purple-900/10 rounded border border-purple-500/20 p-4">
      <div className="text-xs text-purple-300 mb-2 font-semibold">Gravity Posterior Distribution</div>
      <svg width={width} height={height} className="w-full">
        {/* Grid lines */}
        <defs>
          <linearGradient id="posteriorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9b5de5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9b5de5" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={`grid-${ratio}`}
            x1={0}
            y1={ratio * height}
            x2={width}
            y2={ratio * height}
            stroke="rgba(155, 93, 229, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Mean line */}
        <line
          x1={((mean - minX) / (maxX - minX)) * width}
          y1={0}
          x2={((mean - minX) / (maxX - minX)) * width}
          y2={height}
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Distribution curve */}
        <path
          d={`M ${normalizedPoints[0].x} ${normalizedPoints[0].y} ${normalizedPoints
            .slice(1)
            .map(p => `L ${p.x} ${p.y}`)
            .join(' ')} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#posteriorGradient)"
          stroke="#9b5de5"
          strokeWidth="2"
        />

        {/* Confidence intervals */}
        <line
          x1={((mean - stdDev - minX) / (maxX - minX)) * width}
          y1={0}
          x2={((mean - stdDev - minX) / (maxX - minX)) * width}
          y2={height}
          stroke="#d0a2f7"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <line
          x1={((mean + stdDev - minX) / (maxX - minX)) * width}
          y1={0}
          x2={((mean + stdDev - minX) / (maxX - minX)) * width}
          y2={height}
          stroke="#d0a2f7"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* Labels */}
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          fill="#e5e5e5"
          fontSize="10"
          className="font-mono"
        >
          μ = {mean.toFixed(2)}, σ = {stdDev.toFixed(2)}
        </text>
      </svg>
    </div>
  );
}




