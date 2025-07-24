const fs = require('fs');
const path = require('path');

// Read room data
const roomsData = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf-8'));

// Get all fullres images
const fullresDir = './public/images/rooms/fullres';
const fullresImages = fs.readdirSync(fullresDir);

// Create a detailed mapping of keywords to room IDs
const roomMappings = {
  // Specific room mappings based on image content
  'lierre': [], // These seem to be additional rooms not in our current data
  'biche': [], // Another room not in our data
  'tulipe': [], // Another room not in our data
  '2-beds|2-lits': ['saint-andre-ii', 'epis'], // Rooms with 2 single beds
  'handicape|accessible': ['grand-duc', 'petit-duc'], // Accessible rooms
  'bridal|nuptiale': ['suite-nuptiale', 'charlotte-de-montmorency'], // Bridal suites
  'medieval|medievale': ['grand-duc', 'petit-duc', 'dame-blanche', 'chouette'], // Medieval rooms
  'palmeraie|palm-grove': ['nirvana', 'darjeeling', 'samsara', 'figuier'], // Palm grove rooms
  'renaissance': ['grand-conde', 'petit-conde', 'louis-xiii', 'epis', 'fauconnier', 'saint-andre-i', 'saint-andre-ii', 'saint-andre-iii', 'charlotte-de-montmorency', 'henri-iv', 'pierre-lescot'], // Renaissance rooms
  'attic|combles|mansarde': ['fauconnier', 'pierre-lescot', 'epis'], // Attic rooms
};

// Analyze general- images and suggest reassignments
console.log('🔍 Analyzing general- prefixed images...\n');

const generalImages = fullresImages.filter(img => img.startsWith('general-'));
const reassignments = {};

generalImages.forEach(image => {
  const imageLower = image.toLowerCase();
  const suggestions = [];
  
  // Check each mapping pattern
  for (const [pattern, roomIds] of Object.entries(roomMappings)) {
    const patterns = pattern.split('|');
    if (patterns.some(p => imageLower.includes(p)) && roomIds.length > 0) {
      suggestions.push(...roomIds);
    }
  }
  
  // Remove duplicates
  const uniqueSuggestions = [...new Set(suggestions)];
  
  if (uniqueSuggestions.length > 0) {
    reassignments[image] = uniqueSuggestions;
    console.log(`📸 ${image}`);
    console.log(`   Suggested rooms: ${uniqueSuggestions.join(', ')}`);
    console.log('');
  }
});

// Check for rooms with very few images that might benefit from general images
console.log('\n📊 Rooms with few images that might need more:\n');

Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    const imageCount = room.images ? room.images.length : 0;
    if (imageCount < 5) {
      console.log(`❗ ${room.name.en} (${room.id}): Only ${imageCount} images`);
      
      // Suggest general images based on room characteristics
      const suggestions = [];
      
      if (room.features.accessibility) {
        suggestions.push(...generalImages.filter(img => img.includes('handicap') || img.includes('accessible')));
      }
      
      if (room.id.includes('saint-andre')) {
        suggestions.push(...generalImages.filter(img => img.includes('st-andre') || img.includes('saint-andre')));
      }
      
      if (section.id === 'medieval') {
        suggestions.push(...generalImages.filter(img => img.includes('medieval') || img.includes('medievale')));
      }
      
      if (section.id === 'palmeraie') {
        suggestions.push(...generalImages.filter(img => img.includes('palm') || img.includes('palmeraie')));
      }
      
      if (suggestions.length > 0) {
        console.log(`   Could add: ${suggestions.slice(0, 3).join(', ')}${suggestions.length > 3 ? '...' : ''}`);
      }
      console.log('');
    }
  });
});

// Create a mapping of specific image corrections
const specificCorrections = {
  // Images that are clearly for specific rooms based on their names
  'general-chambre-handicape-chateau.webp': ['grand-duc', 'petit-duc'],
  'general-chambre-accessible-handicape-chateau.webp': ['grand-duc', 'petit-duc'],
  'general-medieval-bedroom-chateau.webp': ['dame-blanche', 'chouette'],
  'general-chambre-medievale-pour-mariage.webp': ['dame-blanche'],
  'general-medieval-chateau-bath.webp': ['grand-duc', 'petit-duc'],
  'general-medieval-accommodation-bathroom.webp': ['grand-duc', 'petit-duc'],
  'general-chambre-de-la-palmeraie-du-chateau.webp': ['nirvana', 'darjeeling'],
  'general-palm-grove-in-a-chateau.webp': ['nirvana'],
  'general-palm-grove-room-at-the-chateau.webp': ['darjeeling'],
  'general-bridal-suite-castle.webp': ['charlotte-de-montmorency'],
  'general-bathroom-bridal-suite.webp': ['charlotte-de-montmorency'],
  'general-renaissance-bedroom.webp': ['henri-iv', 'louis-xiii'],
  'general-attic-renaissance-room-guests.webp': ['pierre-lescot'],
  'general-chambre-renaissance-combles-du-chateau.webp': ['fauconnier', 'pierre-lescot'],
  'general-2-beds-renaissance-wedding-room.webp': ['saint-andre-ii'],
  'general-2-lits-simples-chambre-renaissance.webp': ['saint-andre-iii'],
  'general-french-chateau-room.webp': ['saint-andre-i'],
  'general-castle-wedding-accommodation.webp': ['epis'],
  'general-chambre-du-chateau-renaissance.webp': ['epis'],
  'general-epi-bedroom.webp': ['epis'],
  'general-dovecote-bridal-suite.webp': ['suite-nuptiale'],
  'general-mezzanine-de-la-chambre.webp': ['suite-nuptiale'],
};

console.log('\n✅ Specific image corrections to apply:\n');
for (const [image, rooms] of Object.entries(specificCorrections)) {
  console.log(`${image} → ${rooms.join(', ')}`);
}

// Save corrections to a file
fs.writeFileSync('./image-corrections.json', JSON.stringify(specificCorrections, null, 2));
console.log('\n💾 Saved corrections to image-corrections.json');