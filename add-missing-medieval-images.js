const fs = require('fs');

// Read room data
const roomsData = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf-8'));

// Find White Lady and Owl rooms
const medievalSection = roomsData.sections.medieval;
const whiteRoom = medievalSection.rooms.find(r => r.id === 'dame-blanche');
const owlRoom = medievalSection.rooms.find(r => r.id === 'chouette');

// Add more appropriate images
if (whiteRoom) {
  // Add medieval tower images to White Lady
  whiteRoom.images.push(
    'rooms/fullres/general-hebergement-medieval-au-chateau.webp',
    'rooms/hebergement-medieval-au-chateau-p.webp'.replace('-p.webp', '.webp') // Try non-thumbnail version
  );
  // Remove duplicates
  whiteRoom.images = [...new Set(whiteRoom.images)];
  console.log(`✅ White Lady now has ${whiteRoom.images.length} images`);
}

if (owlRoom) {
  // Add medieval tower images to Owl
  owlRoom.images.push(
    'rooms/fullres/general-chambre-chateau-medieval.webp',
    'rooms/medieval-bedroom-chateau-p.webp'.replace('-p.webp', '.webp'), // Try non-thumbnail version
    'rooms/chambre-medievale-au-chateau-p.webp'.replace('-p.webp', '.webp') // Try non-thumbnail version
  );
  // Remove duplicates
  owlRoom.images = [...new Set(owlRoom.images)];
  console.log(`✅ Owl now has ${owlRoom.images.length} images`);
}

// Also ensure other rooms have enough variety
// Add more images for rooms with only 2-3 images
const roomsNeedingMoreImages = [
  { id: 'petit-conde', section: 'renaissance' },
  { id: 'saint-andre-ii', section: 'renaissance' },
  { id: 'saint-andre-iii', section: 'renaissance' },
  { id: 'charlotte-de-montmorency', section: 'renaissance' },
  { id: 'sahara', section: 'oriental' },
  { id: 'levant', section: 'oriental' },
  { id: 'petit-duc', section: 'medieval' }
];

roomsNeedingMoreImages.forEach(({ id, section }) => {
  const room = roomsData.sections[section].rooms.find(r => r.id === id);
  if (room && room.images.length < 4) {
    console.log(`\n🔍 Looking for more images for ${room.name.en} (currently ${room.images.length})...`);
    
    // Add backup general renaissance images for renaissance rooms
    if (section === 'renaissance') {
      const backupImages = [
        'rooms/fullres/general-renaissance-bedroom.webp',
        'rooms/fullres/general-salle-de-bain-renaissance.webp',
        'rooms/fullres/general-renaissance-bathroom-in-the-chateau.webp'
      ];
      
      // Add one backup image if room has very few
      if (room.images.length < 3 && !room.images.some(img => img.includes('general-renaissance'))) {
        const imageToAdd = backupImages.find(img => !room.images.includes(img));
        if (imageToAdd) {
          room.images.push(imageToAdd);
          console.log(`  ✅ Added: ${imageToAdd}`);
        }
      }
    }
  }
});

// Save updated data
fs.writeFileSync('./data/rooms.json', JSON.stringify(roomsData, null, 2));

console.log('\n✅ Medieval image additions complete!');

// Show final counts
console.log('\n📸 Updated image counts:\n');
Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    if (room.images.length < 4) {
      console.log(`${room.images.length < 3 ? '⚠️' : '📸'} ${room.name.en}: ${room.images.length} images`);
    }
  });
});