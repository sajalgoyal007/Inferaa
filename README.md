<<<<<<< HEAD
# Infera: The Probabilistic Universe Simulator



https://github.com/user-attachments/assets/baeb841b-5cb1-4e5b-93b8-6e1b78a3fd50



*"A world that learns gravity — not one that knows it."*
[![Demo](https://img.shields.io/badge/Live_Demo-2f00bd?logo=posrtfolio&logoColor=white&style=for-the-badge)](https://infera-jet.vercel.app/)
[![Bayesian](https://img.shields.io/badge/Bayesian_Learning-purple?logo=posrtfolio&logoColor=white&style=for-the-badge)](https://en.wikipedia.org/wiki/Bayesian_inference)
[![Three.js](https://img.shields.io/badge/Three.js-008080?logo=posrtfolio&logoColor=white&style=for-the-badge)](https://threejs.org/)


## Quick Start

```bash
# Clone the repository
git clone https://github.com/aditisingh02/Infera.git
cd Infera

# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:5173 in your browser
```

## What is Infera?

Infera is an interactive 3D physics sandbox where **particles don't know physics — they learn it**. Each object begins uncertain about fundamental constants like gravity, mass, and friction. Through **Bayesian inference** and **Extended Kalman Filtering**, particles continuously update their beliefs as they observe their own motion.

**The result?** A mesmerizing visualization of scientific discovery itself — watch uncertainty (purple glow) fade into certainty (white light) as the universe learns its own laws.

### Bayesian Learning Process Flow

```mermaid
flowchart TD
    A[Initialize Particle] --> B[Set Prior Beliefs]
    B --> C["State: x = [pos, vel, g, m, f]ᵀ"]
    C --> D["Covariance: P (High Uncertainty)"]
    
    D --> E[Prediction Step]
    E --> F["x̂ₜ|ₜ₋₁ = f(x̂ₜ₋₁|ₜ₋₁)"]
    F --> G["Pₜ|ₜ₋₁ = FₜPₜ₋₁|ₜ₋₁Fₜᵀ + Qₜ"]
    
    G --> H[Observe Motion]
    H --> I["Measurement: zₜ"]
    
    I --> J[Compute Kalman Gain]
    J --> K["Kₜ = Pₜ|ₜ₋₁Hₜᵀ(HₜPₜ|ₜ₋₁Hₜᵀ + Rₜ)⁻¹"]
    
    K --> L[Update Beliefs]
    L --> M["x̂ₜ|ₜ = x̂ₜ|ₜ₋₁ + Kₜ(zₜ - Hₜx̂ₜ|ₜ₋₁)"]
    M --> N["Pₜ|ₜ = (I - KₜHₜ)Pₜ|ₜ₋₁"]
    
    N --> O{Uncertainty < Threshold?}
    O -->|No| P[Continue Learning]
    O -->|Yes| Q[Converged Beliefs]
    
    P --> R[Share with Global Prior]
    R --> S["P(θ|D) ∝ P(D|θ) × P(θ)"]
    S --> E
    
    Q --> T[Stable Physics Knowledge]
    T --> U[Visual: Purple → White]
    
    style A fill:#4d0de0
    style Q fill:#013436
    style T fill:#013436
    style U fill:#013436
    style M fill:#910459
    style N fill:#910459
```

### Core Mathematical Foundation

**State Vector:** Each particle maintains beliefs about:
```
x_t = [position_x, position_y, velocity_x, velocity_y, gravity, mass, friction]ᵀ
```

**Bayesian Update Rule:**
```
P(θ|D) ∝ P(D|θ) × P(θ)
posterior = likelihood × prior
```

**Extended Kalman Filter:**
- **Prediction:** Forecast next motion based on current beliefs
- **Update:** Correct beliefs based on observed reality
- **Convergence:** Uncertainty shrinks as evidence accumulates

### Advanced Features

#### Hierarchical Bayesian Universe
All particles contribute to a shared global consensus about universal constants, modeling how scientific communities form collective knowledge.

#### Real-time Information Theory
- **Entropy Calculation:** H = -Σ P(x) log P(x)
- **Mutual Information:** I(X;Y) between particle beliefs  
- **Convergence Analysis:** Stability metrics and learning rates

#### Symbolic Equation Discovery
The system attempts to rediscover physical laws (like F = ma) from learned data, demonstrating AI-driven scientific discovery.

#### Uncertainty Visualization
Custom algorithms map probability distributions to visual effects:
```glsl
glow_intensity = exp(-variance * decay_factor)
color = mix(purple, white, confidence_level)
```

## Technical Architecture

### Frontend Stack
- **React 19** - Modern UI framework with hooks
- **Three.js** - WebGL 3D rendering and physics visualization  
- **@react-three/fiber** - React renderer for Three.js
- **Tailwind CSS** - Utility-first styling with custom design system
- **TypeScript** - Type-safe development with advanced inference

### Mathematical Engine
- **Custom Extended Kalman Filter** - Nonlinear state estimation
- **Bayesian Inference Engine** - Posterior distribution updates
- **Collision Detection System** - Advanced particle interactions
- **Information Theory Metrics** - Entropy and mutual information

### Performance Optimizations
- **WebGL Instanced Rendering** - Efficient particle systems
- **Frame-rate Monitoring** - Real-time performance metrics
- **Memory Management** - Automatic cleanup and optimization



## Mathematical Deep Dive

### Kalman Filter Implementation
The Extended Kalman Filter handles nonlinear motion dynamics:

**Prediction Step:**
```
x̂_t|t-1 = f(x̂_t-1|t-1)  // Motion model
P_t|t-1 = F_t P_t-1|t-1 F_t^T + Q_t  // Covariance prediction
```

**Update Step:**
```
K_t = P_t|t-1 H_t^T (H_t P_t|t-1 H_t^T + R_t)^-1  // Kalman gain
x̂_t|t = x̂_t|t-1 + K_t(z_t - H_t x̂_t|t-1)  // State update  
P_t|t = (I - K_t H_t) P_t|t-1  // Covariance update
```

### Information-Theoretic Metrics
- **Differential Entropy:** H(X) = -∫ p(x) log p(x) dx
- **Mutual Information:** I(X;Y) = H(X) + H(Y) - H(X,Y)
- **Kullback-Leibler Divergence:** D_KL(P||Q) for belief comparison

## References & Inspiration

- **Kalman Filtering:** R.E. Kalman (1960) - Optimal state estimation
- **Bayesian Inference:** Thomas Bayes (1763) - Probability theory foundations
- **Information Theory:** Claude Shannon (1948) - Mathematical communication theory
- **Scientific Method:** Visual representation of hypothesis testing and belief updating

**🥇 Winner - EHC OpenHack**
---

*Witness a universe discovering itself through probabilistic reasoning.*
=======
# Infera — The Probabilistic Universe Simulator
[![Live Demo](https://img.shields.io/badge/LIVE-DEMO-purple)](https://inferaa.vercel.app/)
![Bayesian Learning](https://img.shields.io/badge/Bayesian-Learning-blueviolet)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black)


🔗 **Live Demo:** [https://inferaa.vercel.app](https://inferaa.vercel.app)

🎥 **Video Demo:** [https://youtu.be/mygj_FOPKk4](https://youtu.be/mygj_FOPKk4)

> **A world that learns gravity — not one that knows it.**

---

## Inspiration

Physics simulations usually **hard-code laws** like gravity and friction.
But the real universe didn’t start with a textbook — it started with **uncertainty**.

We asked a simple question:

> *What if physics wasn’t programmed, but discovered?*

That question led to **Infera** — a universe where laws **emerge from observation**, not equations.

---

## What is Infera?

Infera is an interactive **3D probabilistic universe simulator** where particles begin with **no knowledge of physics**.

Each particle starts uncertain about:

* Gravity
* Mass
* Friction

Instead of fixed formulas, particles **infer these laws** from their own motion using **Bayesian inference and Kalman filtering**.

You don’t code physics here — you **watch it emerge**.

---

## What works today ✅

* 🌍 Real-time 3D simulation (Three.js)
* 🧠 Particles maintain probabilistic beliefs over physical constants
* 📉 Online belief updates via **Extended Kalman Filter**
* 🎨 Uncertainty visualization:

  * **Purple glow** → high uncertainty
  * **White glow** → learned certainty
* 📊 Live metrics: entropy, convergence, posterior distributions
* 🧪 Discovered equations shown during simulation

Everything above is **implemented and visible** in the demo.

---

## Why this is different

Traditional engines assume physics is known.

**Infera treats physics as something to be learned.**

It visually demonstrates:

* How uncertainty collapses into knowledge
* How evidence stabilizes laws
* How scientific understanding can *emerge*

This makes Infera both:

* a **research playground**
* a **visual explanation of the scientific method**

---

## How to experience it 🕹️

1. Open the live demo
2. Spawn particles
3. Watch uncertainty fade as motion stabilizes
4. Reload to reset the universe and observe learning again

No setup. No configuration. Just observation.

---

## Demo Preview

<img width="2048" height="1007" alt="image" src="https://github.com/user-attachments/assets/aa3915dc-a0b8-4b93-af9f-9d877f67ea07" />

<img width="2048" height="1015" alt="image" src="https://github.com/user-attachments/assets/7d1c2026-0e0a-4421-abc7-64097f6c80d8" />


---

## Technical Architecture

### Core Engine

* Custom physics engine in **TypeScript**
* State-space models for particle motion
* Gaussian priors over all physical constants

### Inference System

* Bayesian updates every frame
* Extended Kalman Filter for continuous correction
* Particle filtering for non-linear behaviors

### Visualization

* WebGL-powered 3D rendering
* Real-time uncertainty glow mapping
* Posterior distribution graphs

---

## Challenges

* Modeling motion without predefined physics
* Maintaining numerical stability in inference loops
* Running real-time filters efficiently in the browser
* Making learning visually intuitive, not chaotic

---

## Accomplishments

* Built a universe where **laws emerge instead of being programmed**
* Implemented real-time Bayesian physics learning
* Achieved smooth performance with complex inference
* Created a clean UI for a deeply technical concept

---

## What we learned

* Designing systems where uncertainty is the starting point
* Practical implementation of Kalman and particle filters
* Performance-friendly real-time simulations in the browser
* Communicating complex science through interaction

---

## What’s next

* Neural variational inference for faster learning
* Extreme environments (zero-g, anomalies, black holes)
* Rewindable timelines to inspect belief updates
* Shared universes with collective physics discovery

---

## Built With

React · Three.js · TypeScript · WebGL · Zustand · Plotly · Kalman filtering
>>>>>>> 2c65c367e0dcd038c0b442c199461dbea0c2db1e
