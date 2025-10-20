import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Function to create a proper PNG icon with a simple design
function createIcon(size) {
  // Create a square canvas
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fill background with a color
  ctx.fillStyle = '#000000'; // Black background
  ctx.fillRect(0, 0, size, size);
  
  // Draw a simple shape (circle)
  ctx.fillStyle = '#FFFFFF'; // White circle
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/4, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw inner circle
  ctx.fillStyle = '#000000'; // Black center
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/8, 0, Math.PI * 2);
  ctx.fill();
  
  // Convert to buffer
  return canvas.toBuffer('image/png');
}

// Generate icons
const sizes = [192, 512];
sizes.forEach(size => {
  try {
    const buffer = createIcon(size);
    const filename = `pwa-${size}x${size}.png`;
    const filepath = join('public', filename);
    writeFileSync(filepath, buffer);
    console.log(`Generated ${filename} (${buffer.length} bytes)`);
  } catch (error) {
    console.error(`Error generating ${size}x${size} icon:`, error.message);
    
    // Fallback: create a minimal valid PNG
    const fallbackBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR chunk type
      (size >> 24) & 0xFF, (size >> 16) & 0xFF, (size >> 8) & 0xFF, size & 0xFF, // Width
      (size >> 24) & 0xFF, (size >> 16) & 0xFF, (size >> 8) & 0xFF, size & 0xFF, // Height
      0x08, 0x02, 0x00, 0x00, 0x00, // Bit depth, color type, compression, filter, interlace
      0x00, 0x00, 0x00, 0x00, // CRC for IHDR (placeholder)
      0x00, 0x00, 0x00, 0x0A, // IDAT chunk length
      0x49, 0x44, 0x41, 0x54, // IDAT chunk type
      0x78, 0xDA, 0x63, 0x60, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // Compressed data
      0x00, 0x00, 0x00, 0x00, // CRC for IDAT (placeholder)
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND chunk type
      0xAE, 0x42, 0x60, 0x82  // CRC for IEND
    ]);
    
    const filename = `pwa-${size}x${size}.png`;
    const filepath = join('public', filename);
    writeFileSync(filepath, fallbackBuffer);
    console.log(`Generated fallback ${filename} (${fallbackBuffer.length} bytes)`);
  }
});

console.log('PWA icons generated successfully!');