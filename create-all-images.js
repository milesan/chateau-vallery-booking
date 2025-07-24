const fs = require('fs');
const path = require('path');

// Create a more sophisticated SVG placeholder with gradient
const createPlaceholder = (name, section, index) => {
  const colors = {
    'pigeonnier': '#2a1f3d',
    'renaissance': '#3d1f2a',
    'oriental': '#3d2a1f',
    'palmeraie': '#1f3d2a',
    'medieval': '#1f2a3d'
  };
  
  const baseColor = colors[section] || '#2a1f3d';
  
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${baseColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0a0b14;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad${index})"/>
    <rect x="20" y="20" width="760" height="560" fill="none" stroke="#d4c5a0" stroke-width="1" opacity="0.2"/>
    <text x="50%" y="50%" font-family="Georgia, serif" font-size="32" fill="#d4c5a0" text-anchor="middle" dominant-baseline="middle" opacity="0.6">
      ${name}
    </text>
  </svg>`;
};

// Import room data
const roomsData = require('./data/rooms.json');

// Create public/images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

let imageIndex = 0;

// Generate images for each room
Object.entries(roomsData.sections).forEach(([sectionKey, section]) => {
  section.rooms.forEach(room => {
    // Generate 1-2 images per room
    const numImages = room.id === 'suite-nuptiale' || room.id === 'loft-suite' ? 2 : 1;
    
    for (let i = 1; i <= numImages; i++) {
      const filename = `${room.id}-${i}.jpg`;
      const svg = createPlaceholder(room.name.en, sectionKey, imageIndex++);
      fs.writeFileSync(path.join(imagesDir, filename), svg);
    }
  });
});

console.log(`Created ${imageIndex} placeholder images!`);