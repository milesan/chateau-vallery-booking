const fs = require('fs');
const path = require('path');

// Read the room data
const roomsData = require('./data/rooms.json');

// Enhanced image mapping with additional photos
const enhancedImageMapping = {
  'suite-nuptiale': [
    'suite-nuptiale-1.webp',
    'suite-nuptiale-2.webp', 
    'suite-nuptiale-3.webp',
    'suite-nuptiale-4.webp',
    'additional-2.webp' // Pigeonnier additional
  ],
  'grand-conde': [
    'grand-conde-1.webp',
    'grand-conde-2.webp',
    'additional-1.webp' // Renaissance additional
  ],
  'henri-iv': [
    'henri-iv-1.webp',
    'henri-iv-2.webp'
  ],
  'louis-xiii': [
    'louis-xiii-1.webp',
    'additional-1.webp'
  ],
  'loft-suite': [
    'loft-suite-1.webp',
    'loft-suite-2.webp',
    'loft-suite-3.webp',
    'additional-3.webp' // Oriental additional
  ],
  'sahara': [
    'sahara-1.webp',
    'additional-3.webp'
  ],
  'levant': [
    'levant-1.webp',
    'additional-3.webp'
  ],
  'nirvana': [
    'nirvana-1.webp',
    'nirvana-2.webp',
    'additional-4.webp' // Palmeraie additional
  ],
  'darjeeling': [
    'darjeeling-1.webp',
    'additional-4.webp'
  ],
  'grand-duc': [
    'grand-duc-1.webp',
    'grand-duc-2.webp',
    'additional-5.webp' // Medieval additional
  ],
  'dame-blanche': [
    'dame-blanche-1.webp',
    'additional-5.webp'
  ],
  'chouette': [
    'chouette-1.webp',
    'additional-5.webp'
  ],
  // For rooms without specific photos, use section defaults
  'petit-conde': ['grand-conde-2.webp', 'additional-1.webp'],
  'epis': ['additional-1.webp', 'grand-conde-1.webp'],
  'fauconnier': ['additional-1.webp'],
  'saint-andre-i': ['additional-1.webp'],
  'saint-andre-ii': ['additional-1.webp'],
  'saint-andre-iii': ['additional-1.webp'],
  'charlotte-de-montmorency': ['grand-conde-1.webp', 'additional-1.webp'],
  'pierre-lescot': ['additional-1.webp'],
  'samsara': ['nirvana-2.webp', 'additional-4.webp'],
  'figuier': ['nirvana-1.webp', 'additional-4.webp'],
  'petit-duc': ['grand-duc-2.webp', 'additional-5.webp']
};

// Update each room with all available images
Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    if (enhancedImageMapping[room.id]) {
      room.images = enhancedImageMapping[room.id].map(img => `rooms/${img}`);
    } else {
      // Fallback to section default
      const sectionDefaults = {
        'renaissance': ['additional-1.webp'],
        'oriental': ['additional-3.webp'],
        'palmeraie': ['additional-4.webp'],
        'medieval': ['additional-5.webp']
      };
      const defaultImg = sectionDefaults[section.id] || 'grand-conde-1.webp';
      room.images = [`rooms/${defaultImg}`];
    }
  });
});

// Write the updated data
fs.writeFileSync(
  path.join(__dirname, 'data', 'rooms.json'),
  JSON.stringify(roomsData, null, 2)
);

console.log('Room images updated with complete gallery!');