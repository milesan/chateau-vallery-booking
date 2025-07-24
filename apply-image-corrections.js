const fs = require('fs');

// Read room data and corrections
const roomsData = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf-8'));
const corrections = JSON.parse(fs.readFileSync('./image-corrections.json', 'utf-8'));

// Apply corrections
let totalUpdates = 0;
let totalImagesAdded = 0;

Object.entries(corrections).forEach(([imageName, roomIds]) => {
  const imagePath = `rooms/fullres/${imageName}`;
  
  roomIds.forEach(roomId => {
    // Find the room
    Object.values(roomsData.sections).forEach(section => {
      const room = section.rooms.find(r => r.id === roomId);
      if (room) {
        // Initialize images array if needed
        if (!room.images) room.images = [];
        
        // Check if image already exists
        if (!room.images.includes(imagePath)) {
          // Insert fullres images after other fullres images but before regular images
          const fullresIndex = room.images.findIndex(img => !img.includes('fullres'));
          if (fullresIndex === -1) {
            room.images.push(imagePath);
          } else {
            room.images.splice(fullresIndex, 0, imagePath);
          }
          
          console.log(`✅ Added ${imageName} to ${room.name.en}`);
          totalImagesAdded++;
        }
      }
    });
  });
});

// Also remove images that don't match the room
// For example, remove oriental images from non-oriental rooms
Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    if (!room.images) return;
    
    const originalCount = room.images.length;
    
    // Filter out mismatched images
    room.images = room.images.filter(image => {
      const imageLower = image.toLowerCase();
      
      // Check for obvious mismatches
      if (section.id !== 'oriental' && (imageLower.includes('oriental') || imageLower.includes('loft'))) {
        console.log(`❌ Removing ${image} from ${room.name.en} (oriental mismatch)`);
        return false;
      }
      
      if (section.id !== 'palmeraie' && (imageLower.includes('palm') || imageLower.includes('palmeraie'))) {
        console.log(`❌ Removing ${image} from ${room.name.en} (palm grove mismatch)`);
        return false;
      }
      
      if (section.id !== 'medieval' && imageLower.includes('medieval')) {
        console.log(`❌ Removing ${image} from ${room.name.en} (medieval mismatch)`);
        return false;
      }
      
      // Check for specific room mismatches
      const roomSpecificTerms = {
        'grand-conde': ['grand-conde'],
        'petit-conde': ['petit-conde'],
        'louis-xiii': ['louis-xiii', 'louis-13'],
        'henri-iv': ['henri-iv', 'henri-4'],
        'charlotte-de-montmorency': ['charlotte', 'montmorency'],
        'fauconnier': ['fauconnier', 'falconer'],
        'pierre-lescot': ['pierre-lescot', 'lescot'],
        'suite-nuptiale': ['nuptiale', 'pigeonnier', 'dovecote'],
        'sahara': ['sahara'],
        'levant': ['levant'],
        'nirvana': ['nirvana'],
        'darjeeling': ['darjeeling'],
        'samsara': ['samsara'],
        'figuier': ['figuier', 'fig-tree'],
        'grand-duc': ['grand-duc', 'grand-duke'],
        'petit-duc': ['petit-duc', 'petit-duke'],
        'dame-blanche': ['dame-blanche', 'white-lady'],
        'chouette': ['chouette', 'owl']
      };
      
      // If image contains another room's specific term, it's likely misplaced
      for (const [otherId, terms] of Object.entries(roomSpecificTerms)) {
        if (otherId !== room.id && terms.some(term => imageLower.includes(term))) {
          console.log(`❌ Removing ${image} from ${room.name.en} (belongs to ${otherId})`);
          return false;
        }
      }
      
      return true;
    });
    
    if (room.images.length < originalCount) {
      totalUpdates++;
    }
  });
});

// Save updated room data
fs.writeFileSync('./data/rooms.json', JSON.stringify(roomsData, null, 2));

console.log('\n' + '='.repeat(60));
console.log(`✅ Image corrections applied!`);
console.log(`📊 Added ${totalImagesAdded} images to rooms`);
console.log(`📊 Cleaned up mismatched images from ${totalUpdates} rooms`);
console.log('='.repeat(60));

// Show final image counts
console.log('\n📸 Final image count per room:\n');
Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    const imageCount = room.images ? room.images.length : 0;
    const marker = imageCount < 3 ? '❗' : '✅';
    console.log(`${marker} ${room.name.en}: ${imageCount} images`);
  });
});