/**
 * Simulation presets for different scenarios
 */

import { Button } from '@/components/ui/button';

interface SimulationPresetsProps {
  onPresetSelect: (preset: {
    count: number;
    initialVelocity: { x: number; y: number; z: number };
    spread: number;
  }) => void;
}

export function SimulationPresets({ onPresetSelect }: SimulationPresetsProps) {
  const presets = [
    {
<<<<<<< HEAD
  name: "Demo: Learn Gravity",
  description: "Perfect judge demo",
  config: { count: 5, initialVelocity: { x: 0, y: -1, z: 0 }, spread: 2 }
},

    {
=======
>>>>>>> 2c65c367e0dcd038c0b442c199461dbea0c2db1e
      name: "Single Particle",
      description: "Watch one particle learn",
      config: { count: 1, initialVelocity: { x: 0, y: 0, z: 0 }, spread: 1 }
    },
    {
      name: "Cascade",
      description: "Multiple particles falling",
      config: { count: 5, initialVelocity: { x: 0, y: -1, z: 0 }, spread: 2 }
    },
    {
      name: "Explosion",
      description: "Particles launched outward",
      config: { count: 10, initialVelocity: { x: 0, y: 0, z: 0 }, spread: 3 }
    },
    {
      name: "Orbit",
      description: "Circular motion patterns",
      config: { count: 8, initialVelocity: { x: 1, y: 0.5, z: 0 }, spread: 2.5 }
    },
    {
      name: "Chaos",
      description: "High uncertainty start",
      config: { count: 15, initialVelocity: { x: 2, y: 2, z: 0 }, spread: 4 }
    }
  ];

  return (
    <div className="fixed top-20 right-4 w-80 bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 text-white/90 shadow-2xl z-10">
      <h3 className="text-lg font-bold mb-3 text-purple-300" style={{ fontFamily: 'Playwrite MX Guides, serif' }}>
        Simulation Presets
      </h3>
      <div className="space-y-2">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            onClick={() => onPresetSelect(preset.config)}
            variant="outline"
            className="w-full justify-start border-purple-500/50 text-purple-300 hover:bg-purple-500/20 text-sm"
          >
            <div className="text-left">
              <div className="font-semibold">{preset.name}</div>
              <div className="text-xs text-white/60">{preset.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

