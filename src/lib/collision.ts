/**
 * Collision detection and response system
 */

import type { Particle } from './particle';

export interface CollisionEvent {
  particle1: string;
  particle2: string | 'boundary';
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  impact: number; // impact strength
}

export class CollisionSystem {
  private collisionRadius: number = 0.4; // minimum distance between particles
  private restitution: number = 0.8; // bounce coefficient
  private minImpactVelocity: number = 0.5; // minimum velocity for impact effect

  /**
   * Check and resolve particle-to-particle collisions
   */
  checkParticleCollisions(particles: Particle[]): CollisionEvent[] {
    const events: CollisionEvent[] = [];
    const n = particles.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const p1 = particles[i];
        const p2 = particles[j];

        const dx = p2.position.x - p1.position.x;
        const dy = p2.position.y - p1.position.y;
        const dz = p2.position.z - p1.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Check if particles are overlapping
        if (distance < this.collisionRadius * 2 && distance > 0.01) {
          // Normalize collision vector
          const nx = dx / distance;
          const ny = dy / distance;
          const nz = dz / distance;

          // Relative velocity
          const rvx = p2.velocity.x - p1.velocity.x;
          const rvy = p2.velocity.y - p1.velocity.y;
          const rvz = p2.velocity.z - p1.velocity.z;

          // Relative velocity along collision normal
          const velAlongNormal = rvx * nx + rvy * ny + rvz * nz;

          // Don't resolve if velocities are separating
          if (velAlongNormal > 0) continue;

          // Calculate impulse
          const impulse = -(1 + this.restitution) * velAlongNormal;
          
          // Apply impulse (assuming equal mass for simplicity)
          const impulseX = impulse * nx * 0.5;
          const impulseY = impulse * ny * 0.5;
          const impulseZ = impulse * nz * 0.5;

          p1.velocity.x -= impulseX;
          p1.velocity.y -= impulseY;
          p1.velocity.z -= impulseZ;

          p2.velocity.x += impulseX;
          p2.velocity.y += impulseY;
          p2.velocity.z += impulseZ;

          // Separate particles to prevent overlap
          const overlap = this.collisionRadius * 2 - distance;
          const separationX = nx * overlap * 0.5;
          const separationY = ny * overlap * 0.5;
          const separationZ = nz * overlap * 0.5;

          p1.position.x -= separationX;
          p1.position.y -= separationY;
          p1.position.z -= separationZ;

          p2.position.x += separationX;
          p2.position.y += separationY;
          p2.position.z += separationZ;

          // Record collision event if impact is significant
          const impactStrength = Math.abs(velAlongNormal);
          if (impactStrength > this.minImpactVelocity) {
            events.push({
              particle1: p1.id,
              particle2: p2.id,
              position: {
                x: (p1.position.x + p2.position.x) / 2,
                y: (p1.position.y + p2.position.y) / 2,
                z: (p1.position.z + p2.position.z) / 2
              },
              velocity: {
                x: (p1.velocity.x + p2.velocity.x) / 2,
                y: (p1.velocity.y + p2.velocity.y) / 2,
                z: (p1.velocity.z + p2.velocity.z) / 2
              },
              impact: impactStrength
            });
          }
        }
      }
    }

    return events;
  }

  /**
   * Check boundary collisions and return events
   * Note: This only detects collisions, doesn't modify particle
   */
  checkBoundaryCollision(
    particle: Particle,
    bounds: { min: number; max: number }
  ): CollisionEvent | null {
    let collided = false;
    const impact = { x: 0, y: 0, z: 0 };
    const collisionPos = { ...particle.position };

    // Check X boundaries
    if (particle.position.x <= bounds.min && particle.velocity.x < 0) {
      impact.x = Math.abs(particle.velocity.x);
      collided = true;
    } else if (particle.position.x >= bounds.max && particle.velocity.x > 0) {
      impact.x = Math.abs(particle.velocity.x);
      collided = true;
    }

    // Check Y boundaries
    if (particle.position.y <= bounds.min && particle.velocity.y < 0) {
      impact.y = Math.abs(particle.velocity.y);
      collided = true;
    } else if (particle.position.y >= bounds.max && particle.velocity.y > 0) {
      impact.y = Math.abs(particle.velocity.y);
      collided = true;
    }

    // Check Z boundaries
    if (particle.position.z <= bounds.min && particle.velocity.z < 0) {
      impact.z = Math.abs(particle.velocity.z);
      collided = true;
    } else if (particle.position.z >= bounds.max && particle.velocity.z > 0) {
      impact.z = Math.abs(particle.velocity.z);
      collided = true;
    }

    if (collided) {
      const totalImpact = Math.sqrt(impact.x * impact.x + impact.y * impact.y + impact.z * impact.z);
      if (totalImpact > this.minImpactVelocity) {
        return {
          particle1: particle.id,
          particle2: 'boundary',
          position: collisionPos,
          velocity: { ...particle.velocity },
          impact: totalImpact
        };
      }
    }

    return null;
  }
}

