const fs = require('fs');
const path = require('path');

// Read room data
const roomsData = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf-8'));

// Get all images from fullres directory
const fullresDir = './public/images/rooms/fullres';
const fullresImages = fs.readdirSync(fullresDir);

console.log(`📊 Found ${fullresImages.length} high-resolution images\n`);

// Create a mapping of room IDs to their full-res images
const roomImageMap = new Map();

// Initialize map with existing room IDs
Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    roomImageMap.set(room.id, []);
  });
});

// Categorize images by room
fullresImages.forEach(filename => {
  // Skip non-image files
  if (!filename.match(/\.(jpg|jpeg|png|webp|gif)$/i)) return;
  
  // Extract room identifier from filename
  const roomPatterns = [
    { pattern: /suite.?nuptiale|pigeonnier/i, id: 'suite-nuptiale' },
    { pattern: /grand.?conde/i, id: 'grand-conde' },
    { pattern: /petit.?conde/i, id: 'petit-conde' },
    { pattern: /henri.?iv/i, id: 'henri-iv' },
    { pattern: /louis.?xiii/i, id: 'louis-xiii' },
    { pattern: /charlotte.*montmorency/i, id: 'charlotte-de-montmorency' },
    { pattern: /pierre.?lescot/i, id: 'pierre-lescot' },
    { pattern: /loft|oriental.*loft/i, id: 'loft-suite' },
    { pattern: /sahara/i, id: 'sahara' },
    { pattern: /levant/i, id: 'levant' },
    { pattern: /nirvana/i, id: 'nirvana' },
    { pattern: /darjeeling/i, id: 'darjeeling' },
    { pattern: /samsara/i, id: 'samsara' },
    { pattern: /figuier|fig.?tree/i, id: 'figuier' },
    { pattern: /chouette|owl/i, id: 'chouette' },
    { pattern: /dame.?blanche|white.?lady/i, id: 'dame-blanche' },
    { pattern: /petit.?duc/i, id: 'petit-duc' },
    { pattern: /grand.?duc/i, id: 'grand-duc' },
    { pattern: /saint.?andre.?i(?!i)/i, id: 'saint-andre-i' },
    { pattern: /saint.?andre.?ii(?!i)/i, id: 'saint-andre-ii' },
    { pattern: /saint.?andre.?iii/i, id: 'saint-andre-iii' },
    { pattern: /fauconnier|falconer/i, id: 'fauconnier' },
    { pattern: /epis?(?!\.)/i, id: 'epis' }
  ];
  
  for (const { pattern, id } of roomPatterns) {
    if (pattern.test(filename)) {
      if (roomImageMap.has(id)) {
        roomImageMap.get(id).push(filename);
      }
      break;
    }
  }
});

// Update room data with new images
let totalUpdated = 0;
let totalNewImages = 0;

Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    const newImages = roomImageMap.get(room.id) || [];
    
    if (newImages.length > 0) {
      // Keep existing images but add new ones
      const existingImages = new Set(room.images || []);
      const imagesToAdd = [];
      
      // Add full-res images
      newImages.forEach(img => {
        const imagePath = `rooms/fullres/${img}`;
        if (!existingImages.has(imagePath)) {
          imagesToAdd.push(imagePath);
        }
      });
      
      if (imagesToAdd.length > 0) {
        // Combine existing and new images
        room.images = [...(room.images || []), ...imagesToAdd];
        
        // Sort images to put main images first
        room.images.sort((a, b) => {
          // Prioritize images without -p suffix
          const aIsThumb = a.includes('-p.');
          const bIsThumb = b.includes('-p.');
          if (aIsThumb && !bIsThumb) return 1;
          if (!aIsThumb && bIsThumb) return -1;
          
          // Then prioritize fullres directory
          const aIsFullres = a.includes('fullres');
          const bIsFullres = b.includes('fullres');
          if (!aIsFullres && bIsFullres) return 1;
          if (aIsFullres && !bIsFullres) return -1;
          
          return 0;
        });
        
        // Remove duplicates while preserving order
        room.images = [...new Set(room.images)];
        
        console.log(`✅ ${room.name.en || room.name.fr}: Added ${imagesToAdd.length} new images (total: ${room.images.length})`);
        totalUpdated++;
        totalNewImages += imagesToAdd.length;
      }
    }
  });
});

// Save updated room data
fs.writeFileSync('./data/rooms.json', JSON.stringify(roomsData, null, 2));

console.log('\n' + '='.repeat(50));
console.log(`✅ Integration complete!`);
console.log(`📊 Updated ${totalUpdated} rooms with ${totalNewImages} new images`);
console.log('='.repeat(50));

// Show image count per room
console.log('\n📸 Images per room:\n');
Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    const imageCount = room.images ? room.images.length : 0;
    if (imageCount > 0) {
      console.log(`  ${room.name.en || room.name.fr}: ${imageCount} images`);
    }
  });
});