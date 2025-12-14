/**
 * Additional visual effects for hackathon polish
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function VisualEffects() {
  const particlesRef = useRef<THREE.Points>(null);
  const { scene } = useThree();

  useFrame(({ clock }) => {
    if (!particlesRef.current) {
      const geometry = new THREE.BufferGeometry();
      const count = 300;
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 40;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: 0x9b5de5,
        size: 0.08,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });

      const points = new THREE.Points(geometry, material);
      particlesRef.current = points;
      scene.add(points);
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.elapsedTime * 0.02;
    }
  });

  return null;
}

