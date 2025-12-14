/**
 * Meta-Learning Layer
 * Adaptively tunes learning rates and noise covariances
 */

export interface MetaLearningState {
  learningRate: number;
  processNoise: number;
  measurementNoise: number;
  adaptationHistory: Array<{
    time: number;
    learningRate: number;
    performance: number;
  }>;
}

export class MetaLearningAgent {
  private state: MetaLearningState;
  private performanceHistory: number[] = [];
  private maxHistory: number = 100;

  constructor() {
    this.state = {
      learningRate: 1.0,
      processNoise: 0.01,
      measurementNoise: 0.1,
      adaptationHistory: []
    };
  }

  /**
   * Update meta-parameters based on learning performance
   * Uses gradient-free optimization (simulated annealing approach)
   */
  adapt(
    currentVariance: number,
    previousVariance: number,
    timeStep: number
  ): MetaLearningState {
    // Performance metric: rate of variance reduction
    const varianceReduction = previousVariance > 0 
      ? (previousVariance - currentVariance) / previousVariance 
      : 0;
    
    this.performanceHistory.push(varianceReduction);
    if (this.performanceHistory.length > this.maxHistory) {
      this.performanceHistory.shift();
    }

    // Calculate average performance
    const avgPerformance = this.performanceHistory.length > 0
      ? this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length
      : 0;

    // Adaptive learning rate: increase if learning well, decrease if struggling
    if (avgPerformance > 0.01) {
      // Learning well - can be more aggressive
      this.state.learningRate = Math.min(2.0, this.state.learningRate * 1.01);
    } else if (avgPerformance < -0.01) {
      // Struggling - be more conservative
      this.state.learningRate = Math.max(0.1, this.state.learningRate * 0.99);
    }

    // Adaptive process noise: higher uncertainty = higher noise
    this.state.processNoise = 0.005 + currentVariance * 0.001;

    // Adaptive measurement noise: decrease as we learn more
    this.state.measurementNoise = Math.max(0.01, 0.1 - avgPerformance * 0.5);

    // Record adaptation
    this.state.adaptationHistory.push({
      time: timeStep,
      learningRate: this.state.learningRate,
      performance: avgPerformance
    });

    if (this.state.adaptationHistory.length > this.maxHistory) {
      this.state.adaptationHistory.shift();
    }

    return { ...this.state };
  }

  /**
   * Get optimal parameters for Kalman filter
   */
  getOptimalParameters(): {
    learningRate: number;
    processNoise: number;
    measurementNoise: number;
  } {
    return {
      learningRate: this.state.learningRate,
      processNoise: this.state.processNoise,
      measurementNoise: this.state.measurementNoise
    };
  }

  getState(): MetaLearningState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Calculate learning efficiency metric
   */
  getLearningEfficiency(): number {
    if (this.performanceHistory.length < 10) return 0;
    
    // Efficiency = average performance / variance in performance
    const mean = this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length;
    const variance = this.performanceHistory.reduce((sum, val) => {
      return sum + Math.pow(val - mean, 2);
    }, 0) / this.performanceHistory.length;
    
    return variance > 0 ? mean / Math.sqrt(variance) : 0;
  }
}




