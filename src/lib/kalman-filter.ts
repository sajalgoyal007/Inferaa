/**
 * Extended Kalman Filter for probabilistic physics simulation
 * Each particle uses this to learn physical constants (gravity, friction, mass)
 */

export interface StateVector {
  px: number; // position x
  py: number; // position y
  vx: number; // velocity x
  vy: number; // velocity y
  g: number;  // gravity (learned)
  m: number;  // mass (learned)
  μ: number;  // friction (learned)
}

export interface CovarianceMatrix {
  // 7x7 matrix for state vector [px, py, vx, vy, g, m, μ]
  data: number[][];
}

export interface KalmanFilterState {
  state: StateVector;
  covariance: CovarianceMatrix;
  variance: number; // overall uncertainty (for visualization)
}

export class ExtendedKalmanFilter {
  private state: StateVector;
  private P: number[][];
  private Q: number[][]; // process noise
  private R: number; // measurement noise
  private dt: number;

  constructor(
    initialState: StateVector,
    initialCovariance: number = 10.0,
    dt: number = 0.016 // ~60fps
  ) {
    this.state = { ...initialState };
    this.dt = dt;
    this.R = 0.1; // measurement noise

    // Initialize covariance matrix (7x7)
    this.P = Array(7).fill(0).map(() => Array(7).fill(0));
    
    // Set initial uncertainties
    for (let i = 0; i < 7; i++) {
      this.P[i][i] = initialCovariance;
    }
    // Higher uncertainty for learned parameters (g, m, μ)
    this.P[4][4] = 5.0; // gravity uncertainty
    this.P[5][5] = 2.0; // mass uncertainty
    this.P[6][6] = 1.0; // friction uncertainty

    // Process noise (how much we trust our model)
    this.Q = Array(7).fill(0).map(() => Array(7).fill(0));
    // Lower process noise for position/velocity (they change quickly)
    this.Q[0][0] = 0.01; // px
    this.Q[1][1] = 0.01; // py
    this.Q[2][2] = 0.01; // vx
    this.Q[3][3] = 0.01; // vy
    // Very low process noise for parameters (they should be constant)
    this.Q[4][4] = 0.0001; // g - parameters change very slowly
    this.Q[5][5] = 0.0001; // m
    this.Q[6][6] = 0.0001; // μ
  }

  /**
   * Prediction step: predict next state based on current beliefs
   */
  predict(): StateVector {
    const { px, py, vx, vy, g, m, μ } = this.state;
    const dt = this.dt;

    // Motion model: p_{t+1} = p_t + v_t * dt + 0.5 * (-g_t) * dt² (gravity pulls down)
    //               v_{t+1} = v_t - g_t * dt - μ_t * v_t * dt (gravity is negative in Y-up system)
    const predictedState: StateVector = {
      px: px + vx * dt + 0.5 * 0 * dt * dt, // gravity only affects y
      py: py + vy * dt - 0.5 * g * dt * dt, // negative gravity (pulls down)
      vx: vx - μ * vx * dt, // friction
      vy: vy - g * dt - μ * vy * dt, // negative gravity (pulls down)
      g: g, // parameters don't change (only our belief about them changes)
      m: m,
      μ: μ
    };

    // Compute Jacobian F (linearization of motion model)
    const F = this.computeJacobian();

    // Predict covariance: P_t|t-1 = F * P_{t-1|t-1} * F^T + Q
    this.P = this.matrixMultiply(
      this.matrixMultiply(F, this.P),
      this.transpose(F)
    );
    this.P = this.matrixAdd(this.P, this.Q);

    this.state = predictedState;
    return { ...this.state };
  }

  /**
   * Update step: correct predictions based on observations
   */
  update(observedPosition: { x: number; y: number }, observedVelocity: { x: number; y: number }): void {
    // Observation vector: [px, py, vx, vy]
    const z = [observedPosition.x, observedPosition.y, observedVelocity.x, observedVelocity.y];
    
    // Predicted observation
    const h = [this.state.px, this.state.py, this.state.vx, this.state.vy];
    
    // Innovation (error between observation and prediction)
    const y = z.map((zi, i) => zi - h[i]);

    // Observation matrix H (maps state to observations)
    const H = this.computeObservationMatrix();

    // Innovation covariance: S = H * P * H^T + R
    const HP = this.matrixMultiply(H, this.P);
    const S = this.matrixAdd(
      this.matrixMultiply(HP, this.transpose(H)),
      this.scalarMultiply(this.identity(4), this.R)
    );

    // Kalman gain: K = P * H^T * S^(-1)
    const K = this.matrixMultiply(
      this.matrixMultiply(this.P, this.transpose(H)),
      this.inverse(S)
    );

    // Update state: x = x + K * y
    const Ky = this.matrixVectorMultiply(K, y);
    this.state.px += Ky[0];
    this.state.py += Ky[1];
    this.state.vx += Ky[2];
    this.state.vy += Ky[3];
    
    // Update parameters with constraints and learning rate
    // Parameters are learned indirectly, so we need to be more conservative
    const paramLearningRate = 0.1; // Slow learning for unobserved parameters
    
    // Constrain gravity: should be positive and reasonable (0 to 20)
    const gUpdate = (Ky[4] || 0) * paramLearningRate;
    this.state.g = Math.max(0, Math.min(20, this.state.g + gUpdate));
    
    // Constrain mass: should be positive and reasonable (0.1 to 10)
    const mUpdate = (Ky[5] || 0) * paramLearningRate;
    this.state.m = Math.max(0.1, Math.min(10, this.state.m + mUpdate));
    
    // Constrain friction: should be positive and reasonable (0 to 2)
    const μUpdate = (Ky[6] || 0) * paramLearningRate;
    this.state.μ = Math.max(0, Math.min(2, this.state.μ + μUpdate));

    // Update covariance: P = (I - K * H) * P
    const I = this.identity(7);
    const KH = this.matrixMultiply(K, H);
    const I_KH = this.matrixSubtract(I, KH);
    this.P = this.matrixMultiply(I_KH, this.P);
  }

  /**
   * Compute Jacobian of motion model (linearization)
   */
  private computeJacobian(): number[][] {
    const { vx, vy, μ } = this.state;
    const dt = this.dt;

    // F = ∂f/∂x (partial derivatives of motion model)
    return [
      [1, 0, dt, 0, 0, 0, 0],                    // ∂px/∂[px,py,vx,vy,g,m,μ]
      [0, 1, 0, dt, -0.5*dt*dt, 0, 0],          // ∂py/∂[px,py,vx,vy,g,m,μ] (negative gravity)
      [0, 0, 1-μ*dt, 0, 0, 0, -vx*dt],          // ∂vx/∂[px,py,vx,vy,g,m,μ]
      [0, 0, 0, 1-μ*dt, -dt, 0, -vy*dt],        // ∂vy/∂[px,py,vx,vy,g,m,μ] (negative gravity)
      [0, 0, 0, 0, 1, 0, 0],                     // ∂g/∂[px,py,vx,vy,g,m,μ]
      [0, 0, 0, 0, 0, 1, 0],                     // ∂m/∂[px,py,vx,vy,g,m,μ]
      [0, 0, 0, 0, 0, 0, 1]                      // ∂μ/∂[px,py,vx,vy,g,m,μ]
    ];
  }

  /**
   * Observation matrix: maps state to observed measurements
   */
  private computeObservationMatrix(): number[][] {
    return [
      [1, 0, 0, 0, 0, 0, 0], // px observed
      [0, 1, 0, 0, 0, 0, 0], // py observed
      [0, 0, 1, 0, 0, 0, 0], // vx observed
      [0, 0, 0, 1, 0, 0, 0]  // vy observed
    ];
  }

  getState(): StateVector {
    return { ...this.state };
  }

  getVariance(): number {
    // Overall uncertainty: trace of covariance matrix
    let trace = 0;
    for (let i = 0; i < 7; i++) {
      trace += this.P[i][i];
    }
    return trace / 7; // normalized
  }

  getCovariance(): CovarianceMatrix {
    return { data: JSON.parse(JSON.stringify(this.P)) };
  }

  // Matrix operations
  private matrixMultiply(A: number[][], B: number[][]): number[][] {
    const rows = A.length;
    const cols = B[0].length;
    const result: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        for (let k = 0; k < A[0].length; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return result;
  }

  private matrixAdd(A: number[][], B: number[][]): number[][] {
    return A.map((row, i) => row.map((val, j) => val + B[i][j]));
  }

  private matrixSubtract(A: number[][], B: number[][]): number[][] {
    return A.map((row, i) => row.map((val, j) => val - B[i][j]));
  }

  private scalarMultiply(A: number[][], scalar: number): number[][] {
    return A.map(row => row.map(val => val * scalar));
  }

  private transpose(A: number[][]): number[][] {
    return A[0].map((_, i) => A.map(row => row[i]));
  }

  private identity(n: number): number[][] {
    return Array(n).fill(0).map((_, i) => 
      Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
    );
  }

  private matrixVectorMultiply(A: number[][], v: number[]): number[] {
    return A.map(row => row.reduce((sum, val, i) => sum + val * v[i], 0));
  }

  private inverse(A: number[][]): number[][] {
    // Simple 4x4 matrix inverse (for observation covariance)
    const n = A.length;
    if (n === 4) {
      // Use adjugate method for 4x4
      const det = this.determinant4x4(A);
      if (Math.abs(det) < 1e-10) return this.identity(n);
      const adj = this.adjugate4x4(A);
      return adj.map(row => row.map(val => val / det));
    }
    return this.identity(n);
  }

  private determinant4x4(A: number[][]): number {
    // Simplified for 4x4
    return A[0][0] * (A[1][1] * A[2][2] * A[3][3] - A[1][1] * A[2][3] * A[3][2] -
                      A[1][2] * A[2][1] * A[3][3] + A[1][2] * A[2][3] * A[3][1] +
                      A[1][3] * A[2][1] * A[3][2] - A[1][3] * A[2][2] * A[3][1]) -
           A[0][1] * (A[1][0] * A[2][2] * A[3][3] - A[1][0] * A[2][3] * A[3][2] -
                      A[1][2] * A[2][0] * A[3][3] + A[1][2] * A[2][3] * A[3][0] +
                      A[1][3] * A[2][0] * A[3][2] - A[1][3] * A[2][2] * A[3][0]) +
           A[0][2] * (A[1][0] * A[2][1] * A[3][3] - A[1][0] * A[2][3] * A[3][1] -
                      A[1][1] * A[2][0] * A[3][3] + A[1][1] * A[2][3] * A[3][0] +
                      A[1][3] * A[2][0] * A[3][1] - A[1][3] * A[2][1] * A[3][0]) -
           A[0][3] * (A[1][0] * A[2][1] * A[3][2] - A[1][0] * A[2][2] * A[3][1] -
                      A[1][1] * A[2][0] * A[3][2] + A[1][1] * A[2][2] * A[3][0] +
                      A[1][2] * A[2][0] * A[3][1] - A[1][2] * A[2][1] * A[3][0]);
  }

  private adjugate4x4(A: number[][]): number[][] {
    // Simplified adjugate for 4x4
    const adj: number[][] = Array(4).fill(0).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const minor = this.getMinor(A, i, j, 4);
        adj[j][i] = Math.pow(-1, i + j) * this.determinant3x3(minor);
      }
    }
    return adj;
  }

  private getMinor(A: number[][], row: number, col: number, n: number): number[][] {
    const minor: number[][] = [];
    for (let i = 0; i < n; i++) {
      if (i === row) continue;
      const minorRow: number[] = [];
      for (let j = 0; j < n; j++) {
        if (j === col) continue;
        minorRow.push(A[i][j]);
      }
      minor.push(minorRow);
    }
    return minor;
  }

  private determinant3x3(A: number[][]): number {
    return A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
           A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
           A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
  }
}

