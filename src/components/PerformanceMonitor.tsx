/**
 * Performance monitoring and FPS display
 */

import { useState, useEffect } from 'react';

export function PerformanceMonitor() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsInterval = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        fpsInterval = Math.round((frameCount * 1000) / delta);
        setFps(fpsInterval);
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    const animationId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-20 bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded px-3 py-2 text-xs text-white/80 font-mono">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${fps >= 55 ? 'bg-green-400' : fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'}`} />
          <span>{fps} FPS</span>
        </div>
      </div>
    </div>
  );
}

