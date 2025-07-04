// Generate abstract technology images for blog posts using Canvas
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'src/assets/images');

// Function to generate an abstract tech pattern
function generateAbstractTechImage(filename, title, colors, shapes) {
  const width = 1600;
  const height = 900;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors.bg1);
  gradient.addColorStop(1, colors.bg2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add abstract shapes
  ctx.globalAlpha = 0.1;
  
  // Grid pattern
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i < width; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
  for (let i = 0; i < height; i += 50) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }

  // Random connecting lines (representing API connections)
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = colors.lines;
  ctx.lineWidth = 2;
  
  const nodes = [];
  for (let i = 0; i < shapes.nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height
    });
  }

  // Draw connections
  nodes.forEach((node, i) => {
    const connections = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < connections; j++) {
      const target = nodes[Math.floor(Math.random() * nodes.length)];
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    }
  });

  // Draw nodes
  ctx.globalAlpha = 0.8;
  nodes.forEach(node => {
    const radius = Math.random() * 10 + 5;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = colors.nodes;
    ctx.fill();
  });

  // Add geometric shapes
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < shapes.shapeCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 200 + 50;
    
    ctx.strokeStyle = colors.shapes;
    ctx.lineWidth = 2;
    
    if (Math.random() > 0.5) {
      // Rectangle
      ctx.strokeRect(x - size/2, y - size/2, size, size);
    } else {
      // Circle
      ctx.beginPath();
      ctx.arc(x, y, size/2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Add title text
  ctx.globalAlpha = 1;
  ctx.font = 'bold 60px sans-serif';
  ctx.fillStyle = colors.text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, width / 2, height / 2);

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, filename), buffer);
  console.log(`Generated: ${filename}`);
}

// Generate images for each blog post
generateAbstractTechImage('api-ai-integration.jpg', 'API + AI', {
  bg1: '#0f172a',
  bg2: '#1e293b',
  grid: '#ffffff',
  lines: '#3b82f6',
  nodes: '#60a5fa',
  shapes: '#8b5cf6',
  text: '#ffffff'
}, { nodeCount: 20, shapeCount: 8 });

generateAbstractTechImage('astro-blog-stack.jpg', 'Astro Stack', {
  bg1: '#1a1a2e',
  bg2: '#0f0f23',
  grid: '#ffffff',
  lines: '#ff6b6b',
  nodes: '#ffa502',
  shapes: '#ff006e',
  text: '#ffffff'
}, { nodeCount: 15, shapeCount: 10 });

generateAbstractTechImage('ai-dev-tools.jpg', 'AI Dev Tools', {
  bg1: '#0d1117',
  bg2: '#161b22',
  grid: '#ffffff',
  lines: '#2ea043',
  nodes: '#56d364',
  shapes: '#1f6feb',
  text: '#ffffff'
}, { nodeCount: 25, shapeCount: 6 });

generateAbstractTechImage('zellij-workspace.jpg', 'Zellij', {
  bg1: '#1a1a1a',
  bg2: '#2d2d2d',
  grid: '#ffffff',
  lines: '#00ff88',
  nodes: '#00ffcc',
  shapes: '#ff6600',
  text: '#ffffff'
}, { nodeCount: 30, shapeCount: 12 });

generateAbstractTechImage('voice-coding-workflow.jpg', 'Voice First', {
  bg1: '#4a044e',
  bg2: '#1a0033',
  grid: '#ffffff',
  lines: '#f72585',
  nodes: '#b5179e',
  shapes: '#7209b7',
  text: '#ffffff'
}, { nodeCount: 18, shapeCount: 15 });

console.log('All images generated successfully!');