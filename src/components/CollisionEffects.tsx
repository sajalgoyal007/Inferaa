/**
 * Visual effects for collisions
 */

import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { CollisionEvent } from '@/lib/collision';

interface CollisionEffectsProps {
  collisions: CollisionEvent[];
}

interface ImpactParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
}

export function CollisionEffects({ collisions }: CollisionEffectsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const impactParticlesRef = useRef<ImpactParticle[]>([]);

  useEffect(() => {
    // Create impact particles for each collision
    collisions.forEach((collision) => {
      const impactStrength = Math.min(collision.impact / 5, 1);
      const particleCount = Math.floor(impactStrength * 15 + 5);

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 0.5 + Math.random() * 1.5;
        
        impactParticlesRef.current.push({
          position: new THREE.Vector3(
            collision.position.x,
            collision.position.y,
            collision.position.z
          ),
          velocity: new THREE.Vector3(
            Math.cos(angle) * speed * (0.5 + Math.random()),
            Math.sin(angle) * speed * (0.5 + Math.random()),
            (Math.random() - 0.5) * speed
          ),
          life: 1.0,
          maxLife: 0.3 + Math.random() * 0.4,
          size: 0.05 + Math.random() * 0.1
        });
      }
    });
  }, [collisions]);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    // Clear existing meshes
    while (groupRef.current.children.length > 0) {
      const child = groupRef.current.children[0];
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material instanceof THREE.Material) child.material.dispose();
      }
      groupRef.current.remove(child);
    }

    // Update and render impact particles
    impactParticlesRef.current = impactParticlesRef.current.filter((particle) => {
      particle.life -= delta;
      if (particle.life <= 0) return false;

      // Update position
      particle.position.add(
        particle.velocity.clone().multiplyScalar(delta)
      );
      
      // Apply gravity to particles
      particle.velocity.y -= 9.8 * delta * 0.5;
      particle.velocity.multiplyScalar(0.95); // damping

      // Create mesh for particle
      const geometry = new THREE.SphereGeometry(particle.size, 8, 8);
      const alpha = particle.life / particle.maxLife;
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(1, 0.5 + alpha * 0.5, 1), // white to purple
        transparent: true,
        opacity: alpha * 0.8,
        blending: THREE.AdditiveBlending
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(particle.position);
      if (groupRef.current) {
        groupRef.current.add(mesh);
      }

      return true;
    });
  });

  return <group ref={groupRef} />;
}

