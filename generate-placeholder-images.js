const fs = require('fs');
const path = require('path');

// Create a simple SVG placeholder
const createPlaceholder = (name, color) => {
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Georgia, serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
      ${name}
    </text>
  </svg>`;
};

const rooms = [
  'suite-nuptiale-1.jpg',
  'suite-nuptiale-2.jpg',
];

// Create public/images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate placeholder images
rooms.forEach((room, index) => {
  const color = `hsl(${index * 30}, 40%, 30%)`;
  const svg = createPlaceholder(room.replace('.jpg', ''), color);
  fs.writeFileSync(path.join(imagesDir, room), svg);
});

console.log('Placeholder images created!');