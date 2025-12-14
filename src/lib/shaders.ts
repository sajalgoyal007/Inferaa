/**
 * Custom GLSL Shaders for Uncertainty Visualization
 * Creates beautiful glow effects based on Bayesian variance
 */

// Vertex shader for uncertainty particles
export const uncertaintyVertexShader = `
  uniform float time;
  uniform float variance;
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;
  varying float vVariance;
  
  void main() {
    vColor = customColor;
    vVariance = variance;
    
    // Subtle pulse effect based on uncertainty - less distracting
    float pulse = 1.0 + sin(time * 1.5 + position.x * 5.0) * variance * 0.05;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Larger base size for better visibility
    gl_PointSize = size * pulse * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment shader for uncertainty particles - SHARP AND VISIBLE
export const uncertaintyFragmentShader = `
  uniform float time;
  varying vec3 vColor;
  varying float vVariance;
  
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    // SHARP solid core - no smoothing for crisp edges
    float coreRadius = 0.2;
    float core = step(dist, coreRadius);
    
    // THICK, VISIBLE border ring 
    float borderInner = coreRadius;
    float borderOuter = coreRadius + 0.1;
    float border = step(dist, borderOuter) * (1.0 - step(dist, borderInner));
    
    // Optional thin outer ring for uncertainty visualization
    float outerRingInner = borderOuter;
    float outerRingOuter = borderOuter + 0.05;
    float outerRing = step(dist, outerRingOuter) * (1.0 - step(dist, outerRingInner)) * vVariance;
    
    // Discard fragments outside our defined areas - no blur at all
    if (dist > outerRingOuter) {
      discard;
    }
    
    // SOLID, HIGH-CONTRAST colors
    vec3 coreColor = mix(vec3(1.0, 1.0, 1.0), vec3(0.8, 0.4, 1.0), vVariance); // White to purple
    vec3 borderColor = vec3(0.2, 0.1, 0.4); // Dark purple border
    vec3 outerColor = vec3(0.6, 0.3, 0.9); // Light purple uncertainty ring
    
    vec3 finalColor;
    float finalAlpha;
    
    if (core > 0.5) {
      // Solid core
      finalColor = coreColor;
      finalAlpha = 1.0;
    } else if (border > 0.5) {
      // Solid border
      finalColor = borderColor;
      finalAlpha = 1.0;
    } else if (outerRing > 0.1) {
      // Uncertainty ring
      finalColor = outerColor;
      finalAlpha = 0.8;
    } else {
      discard; // No blur, just discard
    }
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

// Trail shader for particle history
export const trailVertexShader = `
  attribute float alpha;
  attribute vec3 customColor;
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vColor = customColor;
    vAlpha = alpha;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const trailFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    // Make trails more visible and less blurry
    float alpha = vAlpha * 0.7;
    
    // Add slight glow but keep it crisp
    vec3 brighterColor = vColor * 1.2;
    
    gl_FragColor = vec4(brighterColor, alpha);
  }
`;

// Background shader for cosmic effect
export const backgroundVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const backgroundFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  
  // Noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Create flowing energy patterns
    float n1 = noise(uv * 10.0 + time * 0.1);
    float n2 = noise(uv * 20.0 - time * 0.05);
    float n3 = noise(uv * 5.0 + time * 0.02);
    
    // Combine noise for cosmic effect
    float pattern = (n1 + n2 * 0.5 + n3 * 0.3) / 1.8;
    
    // Purple gradient from center
    vec2 center = uv - 0.5;
    float dist = length(center);
    float radial = 1.0 - dist;
    
    // Final color
    vec3 color = vec3(0.37, 0.0, 0.78) * pattern * radial * 0.1;
    color += vec3(0.15, 0.0, 0.3) * (1.0 - dist) * 0.05;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Information flow shader for connecting particles
export const connectionVertexShader = `
  uniform float time;
  attribute float progress;
  varying float vProgress;
  
  void main() {
    vProgress = progress;
    
    // Animate connection flow
    vec3 pos = position;
    float wave = sin(time * 4.0 + progress * 10.0) * 0.02;
    pos.y += wave;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const connectionFragmentShader = `
  uniform float time;
  varying float vProgress;
  
  void main() {
    // Flowing energy effect
    float flow = sin(time * 6.0 - vProgress * 20.0) * 0.5 + 0.5;
    float alpha = flow * (1.0 - abs(vProgress - 0.5) * 2.0);
    
    vec3 color = vec3(0.6, 0.36, 0.9); // Purple
    gl_FragColor = vec4(color, alpha * 0.3);
  }
`;