let isMobile = window.innerWidth <= 768;
let noiseScale = isMobile ? 0.008 : 0.002; 
let particles = [];
let numParticles = isMobile ? 2000 : 5000; 
let timeOffset = 0;
let startTime = 0;
let fadeOutStarted = false;
let opacity = 255;
let lastWidth, lastHeight;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');
  
  lastWidth = windowWidth;
  lastHeight = windowHeight;

  background(isMobile ? 10 : 20); 
  noStroke();
  startTime = millis();
  opacity = 255;
  fadeOutStarted = false;

  for (let i = 0; i < numParticles; i++) {
    particles[i] = createVector(random(width), random(height));
  }
}

function draw() {
  // Desktop: Original alpha (8), Mobile: Faster fade (22) for less brightness buildup
  background(isMobile ? 10 : 20, isMobile ? 22 : 8); 

  let currentTime = millis();
  if (currentTime - startTime >= 10000 && !fadeOutStarted) {
    fadeOutStarted = true;
  }

  if (fadeOutStarted) {
    opacity = max(0, opacity - 5);
    if (opacity <= 0) {
      startTime = currentTime;
      opacity = 255;
      fadeOutStarted = false;
      background(isMobile ? 10 : 20);
      for (let i = 0; i < numParticles; i++) {
        particles[i] = createVector(random(width), random(height));
      }
    }
  }

  timeOffset += 0.001;

  for (let i = 0; i < numParticles; i++) {
    let p = particles[i];
    let noiseValue = noise(p.x * noiseScale, p.y * noiseScale, timeOffset);
    let angle = map(noiseValue, 0, 1, 0, TWO_PI * 2);
    
    let v = p5.Vector.fromAngle(angle);
    let speed = map(noiseValue, 0, 1, isMobile ? 0.5 : 0.8, isMobile ? 1.5 : 2.0); // Slower for mobile
    v.mult(speed);
    p.add(v);
    
    // Desktop & Mobile: Unified subtle alpha (30-100)
    let alpha = map(noiseValue, 0, 1, 30, 100);
    alpha *= (opacity / 255);
    
    fill(isMobile ? 230 : 220, alpha); 
    
    // Desktop: Original size (1-2), Mobile: Larger size (1.5-3.5)
    let size = isMobile ? map(noiseValue, 0, 1, 1.5, 3.5) : map(noiseValue, 0, 1, 1, 2);
    ellipse(p.x, p.y, size, size);
    
    if (p.x > width) { p.x = 0; p.y = random(height); }
    if (p.x < 0) { p.x = width; p.y = random(height); }
    if (p.y > height) { p.y = 0; p.x = random(width); }
    if (p.y < 0) { p.y = height; p.x = random(width); }
  }
}

function windowResized() {
  if (abs(windowWidth - lastWidth) > 50 || abs(windowHeight - lastHeight) > 50) {
    resizeCanvas(windowWidth, windowHeight);
    lastWidth = windowWidth;
    lastHeight = windowHeight;
    isMobile = window.innerWidth <= 768;
    background(isMobile ? 10 : 20);
    
    for (let i = 0; i < numParticles; i++) {
      particles[i] = createVector(random(width), random(height));
    }
  }
}