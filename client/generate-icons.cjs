const fs = require('fs');
const { createCanvas } = require('canvas');

const sizes = [192, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.15);
  ctx.fill();

  // Fire emoji (simplified as a shape since canvas doesn't render emoji well)
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🔥', size / 2, size / 2);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/pwa-${size}x${size}.png`, buffer);
  console.log(`Created pwa-${size}x${size}.png`);
});

console.log('Done! Icons created in public/');