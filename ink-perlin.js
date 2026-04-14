let noiseScale = window.innerWidth > 768 ? 0.002 : 0.1; // Adjust noise scale based on device width
let particles = [];
const numParticles = 5000; // Increased particle count for better coverage
let timeOffset = 0; // Time offset for continuous flow
let startTime = 0; // Track animation start time
let fadeOutStarted = false; // Track fade state
let opacity = 255; // Global opacity for fade effect

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');
  
  background(20); // Dark background
  noStroke();
  startTime = millis(); // Initialize start time
  opacity = 255; // Reset opacity
  fadeOutStarted = false;

  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles[i] = createVector(random(width), random(height));
  }
}

function draw() {
  background(20, 8); // Reduced fade for more persistence

  // Check if 10 seconds have passed
  let currentTime = millis();
  if (currentTime - startTime >= 10000 && !fadeOutStarted) {
    fadeOutStarted = true;
  }

  // Handle fade out
  if (fadeOutStarted) {
    opacity = max(0, opacity - 5); // Gradually reduce opacity
    if (opacity <= 0) {
      // Reset animation
      startTime = currentTime;
      opacity = 255;
      fadeOutStarted = false;
      background(20); // Clear background
      // Randomize particle positions
      for (let i = 0; i < numParticles; i++) {
        particles[i] = createVector(random(width), random(height));
      }
    }
  }

  timeOffset += 0.001; // Increment time offset for continuous flow

  for (let i = 0; i < numParticles; i++) {
    let p = particles[i];
    
    // Calculate noise value with time offset for endless flow
    let noiseValue = noise(p.x * noiseScale, p.y * noiseScale, timeOffset);
    let angle = map(noiseValue, 0, 1, 0, TWO_PI * 2); // Increased angle range
    
    // Update particle movement with varying speed
    let v = p5.Vector.fromAngle(angle);
    let speed = map(noiseValue, 0, 1, 0.8, 2.0); // Variable speed
    v.mult(speed);
    p.add(v);
    
    // Draw particle with enhanced opacity
    let alpha = map(noiseValue, 0, 1, 30, 100) * (opacity / 255);
    fill(220, alpha); // Light gray with fade-out effect
    let size = map(noiseValue, 0, 1, 1, 2); // Variable size
    ellipse(p.x, p.y, size, size);
    
    // Smooth wrapping with position redistribution
    if (p.x > width) {
      p.x = 0;
      p.y = random(height);
    }
    if (p.x < 0) {
      p.x = width;
      p.y = random(height);
    }
    if (p.y > height) {
      p.y = 0;
      p.x = random(width);
    }
    if (p.y < 0) {
      p.y = height;
      p.x = random(width);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(20);
  
  // Reset particles on resize
  for (let i = 0; i < numParticles; i++) {
    particles[i] = createVector(random(width), random(height));
  }
}