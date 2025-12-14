/**
 * Particle physics system with probabilistic learning
 */

import { ExtendedKalmanFilter } from './kalman-filter';
import type { StateVector } from './kalman-filter';
import { CollisionSystem } from './collision';
import type { CollisionEvent } from './collision';

export interface Particle {
  id: string;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  filter: ExtendedKalmanFilter;
  variance: number;
  trail: Array<{ x: number; y: number; z: number; variance: number }>;
  age: number;
}

export class ParticleSystem {
  private particles: Map<string, Particle> = new Map();
  private dt: number = 0.016; // ~60fps
  private trueGravity: number = 9.8;
  private bounds: { min: number; max: number } = { min: -5, max: 5 };
  private collisionSystem: CollisionSystem = new CollisionSystem();
  private collisionEvents: CollisionEvent[] = [];

  /**
   * Create a new particle with uncertain initial beliefs
   */
  createParticle(
    id: string,
    position: { x: number; y: number; z: number },
    initialVelocity: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
  ): Particle {
    // Initial state with uncertain parameters
    // Gravity: g ~ N(9.8, 5.0²) - high uncertainty
    // Mass: m ~ N(1.0, 2.0²)
    // Friction: μ ~ N(0.1, 1.0²)
    // Constrain initial values to reasonable ranges
    const initialGravity = Math.max(0, Math.min(20, 9.8 + (Math.random() - 0.5) * 10)); // ±5 range, clamped
    const initialMass = Math.max(0.1, Math.min(10, 1.0 + (Math.random() - 0.5) * 2)); // ±1 range, clamped
    const initialFriction = Math.max(0, Math.min(2, 0.1 + (Math.random() - 0.5) * 0.5)); // ±0.25 range, clamped

    const initialState: StateVector = {
      px: position.x,
      py: position.y,
      vx: initialVelocity.x,
      vy: initialVelocity.y,
      g: initialGravity,
      m: initialMass,
      μ: initialFriction
    };

    const filter = new ExtendedKalmanFilter(initialState, 10.0, this.dt);

    const particle: Particle = {
      id,
      position: { ...position },
      velocity: { ...initialVelocity },
      filter,
      variance: filter.getVariance(),
      trail: [],
      age: 0
    };

    this.particles.set(id, particle);
    return particle;
  }

  /**
   * Update all particles for one time step
   */
<<<<<<< HEAD
  // update(): CollisionEvent[] {
  update(learningEnabled: boolean): CollisionEvent[] {
=======
  update(): CollisionEvent[] {
>>>>>>> 2c65c367e0dcd038c0b442c199461dbea0c2db1e
    this.collisionEvents = [];
    const particlesArray = Array.from(this.particles.values());

    // First, check particle-to-particle collisions
    const particleCollisions = this.collisionSystem.checkParticleCollisions(particlesArray);
    this.collisionEvents.push(...particleCollisions);

    this.particles.forEach((particle) => {
      // Predict next state using Kalman filter
      particle.filter.predict();

      // Apply true physics (simulate actual motion)
      const trueState = this.applyPhysics(particle);

      // Update filter with "observed" motion (true physics + noise)
      const observedPosition = {
        x: trueState.px + (Math.random() - 0.5) * 0.01, // small observation noise
        y: trueState.py + (Math.random() - 0.5) * 0.01
      };
      const observedVelocity = {
        x: trueState.vx + (Math.random() - 0.5) * 0.01,
        y: trueState.vy + (Math.random() - 0.5) * 0.01
      };

<<<<<<< HEAD
      // particle.filter.update(observedPosition, observedVelocity);
      if (learningEnabled) {
  particle.filter.update(observedPosition, observedVelocity);
}

=======
      particle.filter.update(observedPosition, observedVelocity);
>>>>>>> 2c65c367e0dcd038c0b442c199461dbea0c2db1e

      // Update particle state
      const updatedState = particle.filter.getState();
      particle.position.x = updatedState.px;
      particle.position.y = updatedState.py;
      particle.velocity.x = updatedState.vx;
      particle.velocity.y = updatedState.vy;
      particle.variance = particle.filter.getVariance();
      particle.age += this.dt;

      // Add to trail (for visualization)
      particle.trail.push({
        x: particle.position.x,
        y: particle.position.y,
        z: particle.position.z,
        variance: particle.variance
      });

      // Limit trail length
      if (particle.trail.length > 50) {
        particle.trail.shift();
      }

      // Boundary conditions with collision detection
      const damping = 0.85;
      
      // Check and handle boundary collisions
      if (particle.position.x < this.bounds.min) {
        particle.position.x = this.bounds.min;
        if (particle.velocity.x < 0) {
          particle.velocity.x *= -damping;
          const boundaryCollision = this.collisionSystem.checkBoundaryCollision(particle, this.bounds);
          if (boundaryCollision) this.collisionEvents.push(boundaryCollision);
        }
      } else if (particle.position.x > this.bounds.max) {
        particle.position.x = this.bounds.max;
        if (particle.velocity.x > 0) {
          particle.velocity.x *= -damping;
          const boundaryCollision = this.collisionSystem.checkBoundaryCollision(particle, this.bounds);
          if (boundaryCollision) this.collisionEvents.push(boundaryCollision);
        }
      }
      
      if (particle.position.y < this.bounds.min) {
        particle.position.y = this.bounds.min;
        if (particle.velocity.y < 0) {
          particle.velocity.y *= -damping;
          const boundaryCollision = this.collisionSystem.checkBoundaryCollision(particle, this.bounds);
          if (boundaryCollision) this.collisionEvents.push(boundaryCollision);
        }
      } else if (particle.position.y > this.bounds.max) {
        particle.position.y = this.bounds.max;
        if (particle.velocity.y > 0) {
          particle.velocity.y *= -damping;
          const boundaryCollision = this.collisionSystem.checkBoundaryCollision(particle, this.bounds);
          if (boundaryCollision) this.collisionEvents.push(boundaryCollision);
        }
      }
      
      if (particle.position.z < this.bounds.min) {
        particle.position.z = this.bounds.min;
        if (particle.velocity.z < 0) {
          particle.velocity.z *= -damping;
        }
      } else if (particle.position.z > this.bounds.max) {
        particle.position.z = this.bounds.max;
        if (particle.velocity.z > 0) {
          particle.velocity.z *= -damping;
        }
      }
    });

    return this.collisionEvents;
  }

  getCollisionEvents(): CollisionEvent[] {
    return this.collisionEvents;
  }

  /**
   * Apply true physics (what actually happens in the universe)
   */
  private applyPhysics(particle: Particle): StateVector {
    const { position, velocity } = particle;
    const dt = this.dt;
    const g = this.trueGravity;
    const μ = 0.1; // true friction

    // True motion: p_{t+1} = p_t + v_t * dt - 0.5 * g * dt² (gravity pulls down)
    //              v_{t+1} = v_t - g * dt - μ * v_t * dt (gravity is negative in Y-up system)
    return {
      px: position.x + velocity.x * dt,
      py: position.y + velocity.y * dt - 0.5 * g * dt * dt, // negative gravity (pulls down)
      vx: velocity.x - μ * velocity.x * dt,
      vy: velocity.y - g * dt - μ * velocity.y * dt, // negative gravity (pulls down)
      g: this.trueGravity,
      m: 1.0,
      μ: 0.1
    };
  }

  getParticles(): Particle[] {
    return Array.from(this.particles.values());
  }

  getParticle(id: string): Particle | undefined {
    return this.particles.get(id);
  }

  removeParticle(id: string): void {
    this.particles.delete(id);
  }

  clear(): void {
    this.particles.clear();
  }
}

