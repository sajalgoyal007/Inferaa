/**
 * Enhanced Particle Renderer with Custom Shaders
 * Beautiful uncertainty visualization using WebGL
 */

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import type { Particle } from '@/lib/particle';
import { 
  uncertaintyVertexShader,
  uncertaintyFragmentShader,
  trailVertexShader,
  trailFragmentShader,
  connectionVertexShader,
  connectionFragmentShader
} from '@/lib/shaders';

interface EnhancedParticleRendererProps {
  particles: Particle[];
}

export function EnhancedParticleRenderer({ particles }: EnhancedParticleRendererProps) {
  const particlesGroupRef = useRef<THREE.Group>(null);
  const trailsGroupRef = useRef<THREE.Group>(null);
  const connectionsGroupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Custom particle material with uncertainty shader
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        variance: { value: 1.0 }
      },
      vertexShader: uncertaintyVertexShader,
      fragmentShader: uncertaintyFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);

  // Trail material
  const trailMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: trailVertexShader,
      fragmentShader: trailFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);

  // Connection material for information flow
  const connectionMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: connectionVertexShader,
      fragmentShader: connectionFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);

  useFrame((_state, delta) => {
    timeRef.current += delta;

    // Update shader uniforms
    particleMaterial.uniforms.time.value = timeRef.current;
    trailMaterial.uniforms.time.value = timeRef.current;
    connectionMaterial.uniforms.time.value = timeRef.current;

    if (!particlesGroupRef.current || !trailsGroupRef.current || !connectionsGroupRef.current) return;

    // Clear existing geometries
    [particlesGroupRef.current, trailsGroupRef.current, connectionsGroupRef.current].forEach(group => {
      while (group.children.length > 0) {
        const child = group.children[0];
        if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.Line) {
          if (child.geometry) child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat instanceof THREE.Material && mat.dispose());
          } else if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
        group.remove(child);
      }
    });

    // Render particles with enhanced effects
    particles.forEach((particle, index) => {
      // Main particle with custom shader
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array([particle.position.x, particle.position.y, particle.position.z]);
      const sizes = new Float32Array([1.0 + particle.variance * 0.4]); // Slightly larger for visibility
      const colors = new Float32Array([
        particle.variance, // Use variance to control color in shader
        particle.variance,
        particle.variance
      ]);

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));

      const particleSystem = new THREE.Points(geometry, particleMaterial.clone());
      particleSystem.material.uniforms.variance.value = Math.min(particle.variance / 10.0, 1.0);
      particlesGroupRef.current!.add(particleSystem);

      // Enhanced trail rendering
      if (particle.trail.length > 2) {
        const trailGeometry = new THREE.BufferGeometry();
        const trailPositions: number[] = [];
        const trailColors: number[] = [];
        const trailAlphas: number[] = [];

        particle.trail.forEach((point, i) => {
          trailPositions.push(point.x, point.y, point.z);
          
          const normalizedVariance = Math.min(point.variance / 10.0, 1.0);
          const purple = new THREE.Color(0.6, 0.36, 0.9);
          const white = new THREE.Color(1.0, 1.0, 1.0);
          const color = purple.clone().lerp(white, 1 - normalizedVariance);
          
          trailColors.push(color.r, color.g, color.b);
          trailAlphas.push(i / particle.trail.length); // Fade towards head
        });

        trailGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(trailPositions), 3));
        trailGeometry.setAttribute('customColor', new THREE.BufferAttribute(new Float32Array(trailColors), 3));
        trailGeometry.setAttribute('alpha', new THREE.BufferAttribute(new Float32Array(trailAlphas), 1));

        const trail = new THREE.Line(trailGeometry, trailMaterial.clone());
        trailsGroupRef.current!.add(trail);
      }

      // Information flow connections between particles (if multiple particles)
      if (particles.length > 1 && index < particles.length - 1) {
        const otherParticle = particles[index + 1];
        const distance = new THREE.Vector3()
          .subVectors(
            new THREE.Vector3(particle.position.x, particle.position.y, particle.position.z),
            new THREE.Vector3(otherParticle.position.x, otherParticle.position.y, otherParticle.position.z)
          ).length();

        // Only draw connections if particles are close enough and have similar variance
        if (distance < 3.0 && Math.abs(particle.variance - otherParticle.variance) < 2.0) {
          const connectionGeometry = new THREE.BufferGeometry();
          const connectionPositions: number[] = [];
          const connectionProgress: number[] = [];

          // Create curved connection
          const segments = 20;
          for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = particle.position.x + (otherParticle.position.x - particle.position.x) * t;
            const y = particle.position.y + (otherParticle.position.y - particle.position.y) * t + 
                      Math.sin(t * Math.PI) * 0.2; // Arc curve
            const z = particle.position.z + (otherParticle.position.z - particle.position.z) * t;
            
            connectionPositions.push(x, y, z);
            connectionProgress.push(t);
          }

          connectionGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(connectionPositions), 3));
          connectionGeometry.setAttribute('progress', new THREE.BufferAttribute(new Float32Array(connectionProgress), 1));

          const connection = new THREE.Line(connectionGeometry, connectionMaterial.clone());
          connectionsGroupRef.current!.add(connection);
        }
      }
    });
  });

  return (
    <>
      <group ref={connectionsGroupRef} />
      <group ref={trailsGroupRef} />
      <group ref={particlesGroupRef} />
    </>
  );
}