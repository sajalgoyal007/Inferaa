/**
 * 3D Universe visualization using Three.js
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import type { Particle } from '@/lib/particle';

interface UniverseProps {
  particles: Particle[];
}

export function Universe({ particles }: UniverseProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Set up camera
  useMemo(() => {
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Update particle positions and visual properties
  useFrame(() => {
    if (!groupRef.current) return;

    // Clear existing meshes
    while (groupRef.current.children.length > 0) {
      const child = groupRef.current.children[0];
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
      groupRef.current.remove(child);
    }

    // Create/update particle meshes
    particles.forEach((particle) => {
      // Create LARGER, more visible spheres
      const geometry = new THREE.SphereGeometry(0.3, 32, 32);
      
      // Variance-based color: purple (high uncertainty) -> white (low uncertainty)
      const varianceNorm = Math.min(particle.variance / 10.0, 1.0);
      const purple = new THREE.Color(0x9b5de5);
      const white = new THREE.Color(0xffffff);
      const color = purple.clone().lerp(white, 1 - varianceNorm);

      // SOLID, OPAQUE particles - no transparency blur
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color.clone().multiplyScalar(0.5), // Strong self-illumination
        transparent: false, // Make solid for sharp edges
        metalness: 0.2,
        roughness: 0.4
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(particle.position.x, particle.position.y, particle.position.z);
      
      // Consistent size - no scaling blur
      const scale = 1.0;
      mesh.scale.set(scale, scale, scale);

      // ALWAYS add a THICK, VISIBLE wireframe outline
      const outlineGeometry = new THREE.SphereGeometry(0.35, 16, 16);
      const outlineMaterial = new THREE.MeshBasicMaterial({
        color: varianceNorm > 0.5 ? purple : new THREE.Color(0x4a148c), // Dark purple outline
        transparent: false,
        wireframe: true
      });
      const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
      outline.position.copy(mesh.position);
      outline.scale.set(1.1, 1.1, 1.1); // Slightly larger for visible outline

      // Add both solid particle and outline
      groupRef.current!.add(mesh);
      groupRef.current!.add(outline);

      // Add a small indicator cube at the center for maximum visibility
      const cubeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const cubeMaterial = new THREE.MeshBasicMaterial({
        color: varianceNorm > 0.5 ? 0xff00ff : 0xffffff, // Bright magenta or white
        transparent: false
      });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.copy(mesh.position);
      groupRef.current!.add(cube);

      // Create trail
      if (particle.trail.length > 1) {
        const trailGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particle.trail.length * 3);
        const colors = new Float32Array(particle.trail.length * 3);

        particle.trail.forEach((point, i) => {
          positions[i * 3] = point.x;
          positions[i * 3 + 1] = point.y;
          positions[i * 3 + 2] = point.z;

          const trailVarianceNorm = Math.min(point.variance / 10.0, 1.0);
          const trailColor = purple.clone().lerp(white, 1 - trailVarianceNorm);
          colors[i * 3] = trailColor.r;
          colors[i * 3 + 1] = trailColor.g;
          colors[i * 3 + 2] = trailColor.b;
        });

        trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        trailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const trailMaterial = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: false, // Solid trails for visibility
          linewidth: 5 // Thicker lines
        });

        const trail = new THREE.Line(trailGeometry, trailMaterial);
        groupRef.current!.add(trail);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Use sharp, visible particles instead of blurry shader effects */}
      {/* <EnhancedParticleRenderer particles={particles} /> */}
      
      {/* BRIGHT lighting for maximum visibility */}
      <ambientLight intensity={0.8} color={0xffffff} />
      <pointLight position={[0, 0, 10]} intensity={1.2} color={0xffffff} />
      <pointLight position={[-5, 5, 5]} intensity={0.8} color={0x9b5de5} />
      <pointLight position={[5, -5, 5]} intensity={0.8} color={0x9b5de5} />
      <directionalLight position={[0, 10, 5]} intensity={0.6} color={0xffffff} />
      
      {/* Grid floor for reference */}
      <gridHelper args={[10, 20, 0x9b5de5, 0x9b5de5]} position={[0, -5, 0]} />
    </group>
  );
}

