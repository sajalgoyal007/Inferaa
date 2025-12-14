/**
 * Symbolic Equation Discovery
 * Attempts to rediscover physical laws from learned data
 */

export interface DiscoveredEquation {
  form: string;
  parameters: { name: string; value: number; confidence: number }[];
  rSquared: number;
  complexity: number;
}

export class EquationDiscovery {
  private observations: Array<{
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    time: number;
  }> = [];
  private maxObservations: number = 500;

  /**
   * Add observation for equation discovery
   */
  addObservation(
    position: { x: number; y: number },
    velocity: { x: number; y: number },
    acceleration: { x: number; y: number },
    time: number
  ): void {
    this.observations.push({ position, velocity, acceleration, time });
    if (this.observations.length > this.maxObservations) {
      this.observations.shift();
    }
  }

  /**
   * Discover motion equation using regression
   * Attempts to find: y'' = -g (gravity equation)
   */
  discoverGravityEquation(): DiscoveredEquation | null {
    if (this.observations.length < 10) return null;

    // Extract accelerations
    const yAccelerations = this.observations.map(o => o.acceleration.y);

    // Linear regression: a_y = -g (constant)
    const meanAccel = yAccelerations.reduce((a, b) => a + b, 0) / yAccelerations.length;
    const discoveredG = -meanAccel;

    // Calculate R² (goodness of fit)
    const ssRes = yAccelerations.reduce((sum, a) => {
      const predicted = -discoveredG;
      return sum + Math.pow(a - predicted, 2);
    }, 0);
    const ssTot = yAccelerations.reduce((sum, a) => {
      const mean = meanAccel;
      return sum + Math.pow(a - mean, 2);
    }, 0);
    const rSquared = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;

    // Confidence based on R² and number of observations
    const confidence = Math.min(1, rSquared * (this.observations.length / 100));

    return {
      form: "y'' = -g",
      parameters: [
        {
          name: "g",
          value: discoveredG,
          confidence
        }
      ],
      rSquared,
      complexity: 1 // Simple constant equation
    };
  }

  /**
   * Discover velocity equation: v = v₀ + at
   */
  discoverVelocityEquation(): DiscoveredEquation | null {
    if (this.observations.length < 10) return null;

    const velocities = this.observations.map(o => o.velocity.y);
    const times = this.observations.map((_, i) => i * 0.016); // Assuming constant dt

    // Linear regression: v = v₀ + a*t
    let sumT = 0, sumV = 0, sumTV = 0, sumT2 = 0;
    for (let i = 0; i < velocities.length; i++) {
      const t = times[i];
      const v = velocities[i];
      sumT += t;
      sumV += v;
      sumTV += t * v;
      sumT2 += t * t;
    }

    const n = velocities.length;
    const slope = (n * sumTV - sumT * sumV) / (n * sumT2 - sumT * sumT);
    const intercept = (sumV - slope * sumT) / n;
    // slope represents acceleration 'a' in v = v₀ + at

    // Calculate R²
    const predicted = velocities.map((_, i) => intercept + slope * times[i]);
    const ssRes = velocities.reduce((sum, v, i) => sum + Math.pow(v - predicted[i], 2), 0);
    const ssTot = velocities.reduce((sum, v) => {
      const mean = sumV / n;
      return sum + Math.pow(v - mean, 2);
    }, 0);
    const rSquared = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;

    return {
      form: "v = v₀ + at",
      parameters: [
        { name: "v₀", value: intercept, confidence: rSquared },
        { name: "a", value: slope, confidence: rSquared }
      ],
      rSquared,
      complexity: 2
    };
  }

  /**
   * Discover position equation: y = y₀ + v₀t + ½at²
   */
  discoverPositionEquation(): DiscoveredEquation | null {
    if (this.observations.length < 20) return null;

    const positions = this.observations.map(o => o.position.y);
    const velocities = this.observations.map(o => o.velocity.y);
    const times = this.observations.map((_, i) => i * 0.016);

    // Polynomial regression: y = a₀ + a₁t + a₂t²
    // Using simplified approach
    const n = positions.length;
    let sumT = 0, sumT2 = 0, sumT3 = 0, sumT4 = 0;
    let sumY = 0, sumTY = 0, sumT2Y = 0;

    for (let i = 0; i < n; i++) {
      const t = times[i];
      const y = positions[i];
      sumT += t;
      sumT2 += t * t;
      sumT3 += t * t * t;
      sumT4 += t * t * t * t;
      sumY += y;
      sumTY += t * y;
      sumT2Y += t * t * y;
    }

    // Solve system: [n, sumT, sumT2] [a₀]   [sumY]
    //               [sumT, sumT2, sumT3] [a₁] = [sumTY]
    //               [sumT2, sumT3, sumT4] [a₂]   [sumT2Y]
    
    // Simplified: use known structure y = y₀ + v₀t + 0.5at²
    const v0 = velocities[0] || 0;
    const y0 = positions[0] || 0;
    // Estimate acceleration from velocity change
    const velocityChange = velocities.length > 1 ? velocities[velocities.length - 1] - velocities[0] : 0;
    const totalTime = times[times.length - 1] - times[0];
    const a = totalTime > 0 ? velocityChange / totalTime : 0;

    // Calculate R²
    const predicted = positions.map((_, i) => {
      const t = times[i];
      return y0 + v0 * t + 0.5 * a * t * t;
    });
    const ssRes = positions.reduce((sum, y, i) => sum + Math.pow(y - predicted[i], 2), 0);
    const ssTot = positions.reduce((sum, y) => {
      const mean = sumY / n;
      return sum + Math.pow(y - mean, 2);
    }, 0);
    const rSquared = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;

    return {
      form: "y = y₀ + v₀t + ½at²",
      parameters: [
        { name: "y₀", value: y0, confidence: rSquared },
        { name: "v₀", value: v0, confidence: rSquared },
        { name: "a", value: a, confidence: rSquared }
      ],
      rSquared,
      complexity: 3
    };
  }

  getAllDiscoveredEquations(): {
    gravity: DiscoveredEquation | null;
    velocity: DiscoveredEquation | null;
    position: DiscoveredEquation | null;
  } {
    return {
      gravity: this.discoverGravityEquation(),
      velocity: this.discoverVelocityEquation(),
      position: this.discoverPositionEquation()
    };
  }
}

