/**
 * Auto-framing camera that follows particles
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { Particle } from '@/lib/particle';

interface AutoCameraProps {
  particles: Particle[];
  enabled: boolean;
}

export function AutoCamera({ particles, enabled }: AutoCameraProps) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const cameraPositionRef = useRef(new THREE.Vector3(0, 0, 15));

  useFrame(() => {
    if (!enabled || particles.length === 0) return;

    // Calculate bounding box of all particles
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    particles.forEach((particle) => {
      minX = Math.min(minX, particle.position.x);
      maxX = Math.max(maxX, particle.position.x);
      minY = Math.min(minY, particle.position.y);
      maxY = Math.max(maxY, particle.position.y);
      minZ = Math.min(minZ, particle.position.z);
      maxZ = Math.max(maxZ, particle.position.z);
    });

    // Center of mass
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    // Size of bounding box
    const sizeX = maxX - minX || 5;
    const sizeY = maxY - minY || 5;
    const sizeZ = maxZ - minZ || 5;
    const maxSize = Math.max(sizeX, sizeY, sizeZ);

    // Calculate optimal camera distance (with padding)
    const padding = 2.0;
    const optimalDistance = Math.max(8, maxSize * 1.5 + padding);

    // Smoothly interpolate target and camera position
    targetRef.current.lerp(new THREE.Vector3(centerX, centerY, centerZ), 0.05);
    cameraPositionRef.current.lerp(
      new THREE.Vector3(0, 0, optimalDistance),
      0.05
    );

    // Update camera
    camera.position.copy(cameraPositionRef.current);
    camera.lookAt(targetRef.current);
  });

  return null;
}

