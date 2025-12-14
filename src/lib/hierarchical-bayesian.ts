/**
 * Hierarchical Bayesian Universe
 * Particles share information to form a global consensus about physical constants
 */

// StateVector type not needed here

export interface GlobalPosterior {
  gravity: {
    mean: number;
    variance: number;
    samples: number[];
    entropy: number;
  };
  mass: {
    mean: number;
    variance: number;
    samples: number[];
    entropy: number;
  };
  friction: {
    mean: number;
    variance: number;
    samples: number[];
    entropy: number;
  };
  consensusStrength: number; // How much particles agree (0-1)
  informationGain: number; // Total information gained over time
}

export class HierarchicalBayesianUniverse {
  private globalPosterior: GlobalPosterior;
  private particleBeliefs: Map<string, { g: number; m: number; μ: number; variance: number }> = new Map();
  private history: GlobalPosterior[] = [];
  private maxHistory: number = 1000;

  constructor() {
    this.globalPosterior = {
      gravity: {
        mean: 9.8,
        variance: 25.0, // High initial uncertainty
        samples: [],
        entropy: this.calculateEntropy(25.0)
      },
      mass: {
        mean: 1.0,
        variance: 4.0,
        samples: [],
        entropy: this.calculateEntropy(4.0)
      },
      friction: {
        mean: 0.1,
        variance: 1.0,
        samples: [],
        entropy: this.calculateEntropy(1.0)
      },
      consensusStrength: 0.0,
      informationGain: 0.0
    };
  }

  /**
   * Update global posterior with particle beliefs
   * Uses Bayesian updating: P(θ|D_all) ∝ ∏ P(θ|D_i)
   */
  updateGlobalPosterior(
    particleId: string,
    beliefs: { g: number; m: number; μ: number; variance: number }
  ): void {
    this.particleBeliefs.set(particleId, beliefs);

    // Collect all particle beliefs
    const gSamples: number[] = [];
    const mSamples: number[] = [];
    const μSamples: number[] = [];
    const gVariances: number[] = [];
    const mVariances: number[] = [];
    const μVariances: number[] = [];

    this.particleBeliefs.forEach((belief) => {
      gSamples.push(belief.g);
      mSamples.push(belief.m);
      μSamples.push(belief.μ);
      gVariances.push(belief.variance);
      mVariances.push(belief.variance);
      μVariances.push(belief.variance);
    });

    if (gSamples.length === 0) return;

    // Hierarchical Bayesian update
    // Global mean = weighted average of particle means (inverse variance weighting)
    const gWeights = gVariances.map(v => 1 / (v + 0.01)); // Avoid division by zero
    const gWeightSum = gWeights.reduce((a, b) => a + b, 0);
    const gWeightedMean = gSamples.reduce((sum, val, i) => sum + val * gWeights[i], 0) / gWeightSum;
    
    // Global variance = harmonic mean of variances (represents consensus)
    const gHarmonicVariance = gVariances.length / gVariances.reduce((sum, v) => sum + 1 / (v + 0.01), 0);
    
    // Between-particle variance (disagreement)
    const gBetweenVariance = this.calculateVariance(gSamples);
    
    // Total variance = within + between
    const gTotalVariance = gHarmonicVariance + gBetweenVariance;

    // Update gravity posterior
    const oldGEntropy = this.globalPosterior.gravity.entropy;
    this.globalPosterior.gravity.mean = gWeightedMean;
    this.globalPosterior.gravity.variance = gTotalVariance;
    this.globalPosterior.gravity.samples = gSamples;
    this.globalPosterior.gravity.entropy = this.calculateEntropy(gTotalVariance);

    // Same for mass
    const mWeights = mVariances.map(v => 1 / (v + 0.01));
    const mWeightSum = mWeights.reduce((a, b) => a + b, 0);
    const mWeightedMean = mSamples.reduce((sum, val, i) => sum + val * mWeights[i], 0) / mWeightSum;
    const mHarmonicVariance = mVariances.length / mVariances.reduce((sum, v) => sum + 1 / (v + 0.01), 0);
    const mBetweenVariance = this.calculateVariance(mSamples);
    const mTotalVariance = mHarmonicVariance + mBetweenVariance;

    const oldMEntropy = this.globalPosterior.mass.entropy;
    this.globalPosterior.mass.mean = mWeightedMean;
    this.globalPosterior.mass.variance = mTotalVariance;
    this.globalPosterior.mass.samples = mSamples;
    this.globalPosterior.mass.entropy = this.calculateEntropy(mTotalVariance);

    // Same for friction
    const μWeights = μVariances.map(v => 1 / (v + 0.01));
    const μWeightSum = μWeights.reduce((a, b) => a + b, 0);
    const μWeightedMean = μSamples.reduce((sum, val, i) => sum + val * μWeights[i], 0) / μWeightSum;
    const μHarmonicVariance = μVariances.length / μVariances.reduce((sum, v) => sum + 1 / (v + 0.01), 0);
    const μBetweenVariance = this.calculateVariance(μSamples);
    const μTotalVariance = μHarmonicVariance + μBetweenVariance;

    const oldμEntropy = this.globalPosterior.friction.entropy;
    this.globalPosterior.friction.mean = μWeightedMean;
    this.globalPosterior.friction.variance = μTotalVariance;
    this.globalPosterior.friction.samples = μSamples;
    this.globalPosterior.friction.entropy = this.calculateEntropy(μTotalVariance);

    // Calculate consensus strength (inverse of disagreement)
    const gConsensus = 1 / (1 + gBetweenVariance);
    const mConsensus = 1 / (1 + mBetweenVariance);
    const μConsensus = 1 / (1 + μBetweenVariance);
    this.globalPosterior.consensusStrength = (gConsensus + mConsensus + μConsensus) / 3;

    // Information gain = reduction in entropy
    const gInfoGain = Math.max(0, oldGEntropy - this.globalPosterior.gravity.entropy);
    const mInfoGain = Math.max(0, oldMEntropy - this.globalPosterior.mass.entropy);
    const μInfoGain = Math.max(0, oldμEntropy - this.globalPosterior.friction.entropy);
    this.globalPosterior.informationGain += (gInfoGain + mInfoGain + μInfoGain) / 3;

    // Store history
    this.history.push(JSON.parse(JSON.stringify(this.globalPosterior)));
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  /**
   * Calculate entropy of a Gaussian distribution: H = 0.5 * ln(2πeσ²)
   */
  private calculateEntropy(variance: number): number {
    if (variance <= 0) return 0;
    return 0.5 * Math.log(2 * Math.PI * Math.E * variance);
  }

  /**
   * Calculate variance of a sample
   */
  private calculateVariance(samples: number[]): number {
    if (samples.length === 0) return 0;
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const squaredDiffs = samples.map(x => Math.pow(x - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / samples.length;
  }

  /**
   * Calculate mutual information between particles
   * I(X;Y) = H(X) + H(Y) - H(X,Y)
   */
  calculateMutualInformation(): number {
    if (this.particleBeliefs.size < 2) return 0;

    const beliefs = Array.from(this.particleBeliefs.values());
    
    // Simplified mutual information (correlation-based)
    const correlations: number[] = [];
    for (let i = 0; i < beliefs.length; i++) {
      for (let j = i + 1; j < beliefs.length; j++) {
        const b1 = beliefs[i];
        const b2 = beliefs[j];
        // Correlation in parameter space
        const gCorr = 1 - Math.abs(b1.g - b2.g) / (Math.abs(b1.g) + Math.abs(b2.g) + 0.1);
        correlations.push(gCorr);
      }
    }
    
    return correlations.length > 0 
      ? correlations.reduce((a, b) => a + b, 0) / correlations.length 
      : 0;
  }

  /**
   * Get convergence metrics
   */
  getConvergenceMetrics(): {
    converged: boolean;
    convergenceRate: number;
    stability: number;
  } {
    if (this.history.length < 10) {
      return { converged: false, convergenceRate: 0, stability: 0 };
    }

    // Check if variance is decreasing (converging)
    const recentVariances = this.history.slice(-20).map(h => h.gravity.variance);
    const varianceTrend = recentVariances[0] - recentVariances[recentVariances.length - 1];
    const convergenceRate = varianceTrend / recentVariances[0];

    // Stability = inverse of variance of means over time
    const recentMeans = this.history.slice(-20).map(h => h.gravity.mean);
    const meanVariance = this.calculateVariance(recentMeans);
    const stability = 1 / (1 + meanVariance);

    // Converged if variance is low and stable
    const converged = this.globalPosterior.gravity.variance < 0.1 && stability > 0.9;

    return { converged, convergenceRate, stability };
  }

  getGlobalPosterior(): GlobalPosterior {
    return JSON.parse(JSON.stringify(this.globalPosterior));
  }

  getHistory(): GlobalPosterior[] {
    return JSON.parse(JSON.stringify(this.history));
  }

  removeParticle(particleId: string): void {
    this.particleBeliefs.delete(particleId);
  }
}

