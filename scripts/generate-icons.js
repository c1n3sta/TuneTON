import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Create a simple icon
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);
  
  // Draw circle
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw inner circle
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.15, 0, Math.PI * 2);
  ctx.fill();
  
  return canvas.toBuffer('image/png');
}

// Generate icons
const sizes = [192, 512];
sizes.forEach(size => {
  const buffer = createIcon(size);
  const filename = `pwa-${size}x${size}.png`;
  writeFileSync(join('public', filename), buffer);
  console.log(`Generated ${filename}`);
});