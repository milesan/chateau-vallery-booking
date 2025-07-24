const fs = require('fs');
const path = require('path');

// Read room data
const roomsData = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf-8'));

// Define accurate room-to-image mappings based on image analysis
const accurateImageMappings = {
  // PIGEONNIER
  'suite-nuptiale': {
    mustInclude: ['pigeonnier', 'nuptiale', 'dovecote'],
    mustExclude: ['renaissance', 'medieval', 'oriental', 'palm'],
    specificImages: [
      'pigeonnier-chambre-de-la-suite-pigeonnier.webp',
      'pigeonnier-escalier-du-pigeonnier-vallery.webp',
      'pigeonnier-le-pigeonnier-du-chateau.webp',
      'suite-nuptiale-hebergements-chateau-suite-nuptiale.webp',
      'suite-nuptiale-suite-nuptiale-chateau.webp',
      'suite-nuptiale-suite-nuptiale-du-pigeonnier.webp',
      'general-dovecote-bridal-suite.webp',
      'general-mezzanine-de-la-chambre.webp'
    ]
  },

  // RENAISSANCE WING
  'grand-conde': {
    mustInclude: ['grand-conde'],
    mustExclude: ['petit-conde'],
    specificImages: [
      'grand-conde-accommodation-grand-conde.webp',
      'grand-conde-chambre-renaissance-grand-conde.webp',
      'grand-conde-grand-conde-bath.webp',
      'grand-conde-grand-conde-bedroom-chateau-renaissance.webp'
    ]
  },
  
  'petit-conde': {
    mustInclude: ['petit-conde'],
    mustExclude: ['grand-conde'],
    specificImages: [
      'petit-conde-petit-conde-renaissance-bedroom.webp'
    ]
  },
  
  'louis-xiii': {
    mustInclude: ['louis-xiii', 'louis-13'],
    mustExclude: ['henri', 'conde'],
    specificImages: [
      'louis-xiii-louis-XIII-bedroom-chateau.webp'
    ]
  },
  
  'henri-iv': {
    mustInclude: ['henri-iv', 'henri-4'],
    mustExclude: ['louis', 'conde'],
    specificImages: [
      'henri-iv-Henri-IV-accommodation.webp',
      'henri-iv-chambre-henri-IV-combles.webp',
      'henri-iv-henri-IV-bathroom.webp'
    ]
  },
  
  'charlotte-de-montmorency': {
    mustInclude: ['charlotte', 'montmorency', 'bridal'],
    mustExclude: ['nuptiale', 'pigeonnier'],
    specificImages: [
      'general-bridal-suite-castle.webp',
      'general-bathroom-bridal-suite.webp'
    ]
  },
  
  'pierre-lescot': {
    mustInclude: ['pierre-lescot', 'lescot'],
    mustExclude: [],
    specificImages: [
      'pierre-lescot-bride-in-pierre-lescot-room.webp',
      'pierre-lescot-chambre-pierre-lescot.webp'
    ]
  },
  
  'fauconnier': {
    mustInclude: ['fauconnier', 'falconer'],
    mustExclude: [],
    specificImages: [
      'fauconnier-chambre-fauconnier-renaissance.webp',
      'fauconnier-fauconnier-bathroom.webp',
      'fauconnier-fauconnier-bedroom.webp',
      'fauconnier-salle-de-bain-fauconnier.webp'
    ]
  },
  
  'epis': {
    mustInclude: ['epi', 'epis'],
    mustExclude: ['epicerie'],
    specificImages: [
      'general-epi-bedroom.webp',
      'general-castle-wedding-accommodation.webp'
    ]
  },
  
  'saint-andre-i': {
    mustInclude: ['saint-andre-i', 'st-andre-i', 'andre-1'],
    mustExclude: ['andre-ii', 'andre-iii', 'andre-2', 'andre-3'],
    specificImages: [
      'general-french-chateau-room.webp',
      'st-andre-st-andre-I-wedding-accommodation.webp'
    ]
  },
  
  'saint-andre-ii': {
    mustInclude: ['saint-andre-ii', 'st-andre-ii', 'andre-2', '2-beds', '2-lits'],
    mustExclude: ['andre-i', 'andre-iii', 'andre-1', 'andre-3'],
    specificImages: [
      'saint-andre-chambre-saint-andre-II.webp',
      'general-2-beds-renaissance-wedding-room.webp'
    ]
  },
  
  'saint-andre-iii': {
    mustInclude: ['saint-andre-iii', 'st-andre-iii', 'andre-3'],
    mustExclude: ['andre-i', 'andre-ii', 'andre-1', 'andre-2'],
    specificImages: [
      'general-2-lits-simples-chambre-renaissance.webp',
      'saint-andre-beds-of-saint-andre-3.webp'
    ]
  },
  
  'lierre-i': {
    mustInclude: ['lierre-i', 'lierre-1', 'ivy-i', 'ivy-1'],
    mustExclude: ['lierre-ii', 'lierre-2'],
    specificImages: [
      'general-chambre-lierre-I-mariage-chateau.webp',
      'general-lierre-I-bedroom-for-weddings.webp',
      'general-lierre-1-detail.webp'
    ]
  },
  
  'lierre-ii': {
    mustInclude: ['lierre-ii', 'lierre-2', 'ivy-ii', 'ivy-2'],
    mustExclude: ['lierre-i', 'lierre-1'],
    specificImages: [
      'general-chambre-lierre-II-renaissance.webp',
      'general-chambre-lierre-II.webp',
      'general-lierre-II-hebergement-mariage.webp'
    ]
  },
  
  'biche': {
    mustInclude: ['biche', 'doe'],
    mustExclude: [],
    specificImages: [
      'general-biche-accommodation.webp',
      'general-chambre-renaissance-biche.webp'
    ]
  },
  
  'tulipe': {
    mustInclude: ['tulipe', 'tulip'],
    mustExclude: [],
    specificImages: [
      'general-chambre-tulipe-chateau-renaissance.webp',
      'general-tulipe-french-castle-bedroom.webp',
      'general-tulipe-renaissance-room-chateau.webp',
      'general-detail-chambre-tulipe.webp',
      'general-tulipe-room-detail.webp'
    ]
  },
  
  'restauration': {
    mustInclude: ['restauration', 'restoration'],
    mustExclude: [],
    specificImages: [
      'general-chambre-restauration-chateau.webp',
      'general-restauration-renaissance-bedroom.webp'
    ]
  },

  // ORIENTAL SPACE
  'loft-suite': {
    mustInclude: ['loft', 'oriental'],
    mustExclude: ['palm', 'sahara', 'levant'],
    specificImages: [
      'loft-chambre-loft.webp',
      'loft-loft-appartement-oriental-chateau.webp',
      'loft-loft-bathroom.webp'
    ]
  },
  
  'sahara': {
    mustInclude: ['sahara', 'oriental'],
    mustExclude: ['loft', 'levant', 'palm'],
    specificImages: [
      'oriental-salle-bain-oriental-sahara.webp'
    ]
  },
  
  'levant': {
    mustInclude: ['levant', 'oriental'],
    mustExclude: ['loft', 'sahara', 'palm'],
    specificImages: [
      'oriental-levant-oriental-bedroom-wedding.webp'
    ]
  },

  // PALM GROVE
  'nirvana': {
    mustInclude: ['nirvana', 'palm', 'palmeraie'],
    mustExclude: ['darjeeling', 'samsara', 'figuier'],
    specificImages: [
      'nirvana-nirvana-bath-chateau-palm-grove.webp',
      'nirvana-nirvana-palm-grove-bedroom.webp',
      'nirvana-salle-de-bain-nirvana.webp',
      'general-palm-grove-in-a-chateau.webp'
    ]
  },
  
  'darjeeling': {
    mustInclude: ['darjeeling', 'palm', 'palmeraie'],
    mustExclude: ['nirvana', 'samsara', 'figuier'],
    specificImages: [
      'darjeeling-darjeeling-chambre-palmeraie.webp',
      'darjeeling-darjeeling-suite-chateau.webp',
      'general-palm-grove-room-at-the-chateau.webp'
    ]
  },
  
  'samsara': {
    mustInclude: ['samsara', 'palm', 'palmeraie'],
    mustExclude: ['nirvana', 'darjeeling', 'figuier'],
    specificImages: [
      'palmgrove-samsara-bedroom-palmgrove-chateau.webp',
      'samsara-chambre-samsara.webp',
      'samsara-samsara-bath.webp'
    ]
  },
  
  'figuier': {
    mustInclude: ['figuier', 'fig'],
    mustExclude: ['nirvana', 'darjeeling', 'samsara'],
    specificImages: [
      'figuier-figuier-accommodation.webp',
      'figuier-maisonnette-figuier-au-chateau.webp',
      'figuier-salle-de-bain-figuier.webp',
      'figuier-salon-hebergement-figuier.webp'
    ]
  },

  // MEDIEVAL TOWER
  'grand-duc': {
    mustInclude: ['grand-duc', 'grand-duke', 'handicap', 'accessible'],
    mustExclude: ['petit-duc'],
    specificImages: [
      'grand-duc-chambre-grand-duc-chateau-medieval.webp',
      'grand-duc-salle-de-bain-grand-duc.webp',
      'general-chambre-handicape-chateau.webp',
      'general-chambre-accessible-handicape-chateau.webp',
      'general-medieval-chateau-bath.webp'
    ]
  },
  
  'petit-duc': {
    mustInclude: ['petit-duc', 'petit-duke', 'handicap', 'accessible'],
    mustExclude: ['grand-duc'],
    specificImages: [
      'petit-duc-medieval-petit-duc-room.webp',
      'general-medieval-accommodation-bathroom.webp'
    ]
  },
  
  'dame-blanche': {
    mustInclude: ['dame-blanche', 'white-lady', 'medieval'],
    mustExclude: ['duc', 'chouette', 'owl'],
    specificImages: [
      'general-chambre-medievale-pour-mariage.webp'
    ]
  },
  
  'chouette': {
    mustInclude: ['chouette', 'owl', 'medieval'],
    mustExclude: ['duc', 'dame', 'blanche'],
    specificImages: [
      'general-medieval-bedroom-chateau.webp'
    ]
  }
};

// Function to check if a filename matches a room
function doesImageBelongToRoom(imagePath, roomId) {
  const filename = path.basename(imagePath).toLowerCase();
  const mapping = accurateImageMappings[roomId];
  
  if (!mapping) return false;
  
  // Check specific images first
  if (mapping.specificImages && mapping.specificImages.some(img => filename.includes(img))) {
    return true;
  }
  
  // Check must include patterns
  const hasRequired = mapping.mustInclude.some(pattern => filename.includes(pattern));
  
  // Check must exclude patterns
  const hasExcluded = mapping.mustExclude.some(pattern => filename.includes(pattern));
  
  return hasRequired && !hasExcluded;
}

// Function to check if image is a thumbnail
function isThumbnail(imagePath) {
  const filename = path.basename(imagePath);
  return filename.includes('-p.') || filename.includes('-m/') || filename.includes('_thumb');
}

// Process all rooms
let totalFixed = 0;
let thumbnailsRemoved = 0;
let wrongImagesRemoved = 0;

Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    if (!room.images) {
      room.images = [];
      return;
    }
    
    const originalCount = room.images.length;
    const validImages = [];
    
    // First pass: remove thumbnails and wrong images
    room.images.forEach(imagePath => {
      // Skip thumbnails
      if (isThumbnail(imagePath)) {
        console.log(`❌ Removing thumbnail from ${room.name.en}: ${path.basename(imagePath)}`);
        thumbnailsRemoved++;
        return;
      }
      
      // Check if image belongs to this room
      const belongsToRoom = doesImageBelongToRoom(imagePath, room.id);
      
      // Also check if it belongs to another room more specifically
      let belongsElsewhere = false;
      Object.keys(accurateImageMappings).forEach(otherId => {
        if (otherId !== room.id) {
          const otherMapping = accurateImageMappings[otherId];
          const filename = path.basename(imagePath).toLowerCase();
          if (otherMapping.specificImages && 
              otherMapping.specificImages.some(img => filename === img || filename === 'fullres/' + img)) {
            belongsElsewhere = true;
          }
        }
      });
      
      if (!belongsToRoom || belongsElsewhere) {
        console.log(`❌ Removing wrong image from ${room.name.en}: ${path.basename(imagePath)}`);
        wrongImagesRemoved++;
        return;
      }
      
      validImages.push(imagePath);
    });
    
    // Second pass: add correct images from mapping
    const mapping = accurateImageMappings[room.id];
    if (mapping && mapping.specificImages) {
      mapping.specificImages.forEach(imageName => {
        // Check both fullres and regular paths
        const fullresPath = `rooms/fullres/${imageName}`;
        const regularPath = `rooms/${imageName}`;
        
        if (!validImages.some(img => img.includes(imageName))) {
          // Prefer fullres version
          if (fs.existsSync(`./public/images/${fullresPath}`)) {
            validImages.push(fullresPath);
            console.log(`✅ Adding correct image to ${room.name.en}: ${imageName}`);
          } else if (fs.existsSync(`./public/images/${regularPath}`)) {
            validImages.push(regularPath);
            console.log(`✅ Adding correct image to ${room.name.en}: ${imageName}`);
          }
        }
      });
    }
    
    // Sort images: fullres first, then others
    validImages.sort((a, b) => {
      const aIsFullres = a.includes('fullres');
      const bIsFullres = b.includes('fullres');
      if (aIsFullres && !bIsFullres) return -1;
      if (!aIsFullres && bIsFullres) return 1;
      return 0;
    });
    
    // Remove duplicates
    room.images = [...new Set(validImages)];
    
    if (room.images.length !== originalCount) {
      totalFixed++;
    }
    
    // Warn if room has very few images
    if (room.images.length < 2) {
      console.log(`⚠️  ${room.name.en} only has ${room.images.length} images!`);
    }
  });
});

// Save updated data
fs.writeFileSync('./data/rooms.json', JSON.stringify(roomsData, null, 2));

console.log('\n' + '='.repeat(60));
console.log('✅ Image verification and fixes complete!');
console.log(`📊 Rooms fixed: ${totalFixed}`);
console.log(`🖼️ Thumbnails removed: ${thumbnailsRemoved}`);
console.log(`❌ Wrong images removed: ${wrongImagesRemoved}`);
console.log('='.repeat(60));

// Show final image count per room
console.log('\n📸 Final verified image count per room:\n');
Object.values(roomsData.sections).forEach(section => {
  console.log(`\n${section.name.en}:`);
  section.rooms.forEach(room => {
    const imageCount = room.images ? room.images.length : 0;
    const status = imageCount >= 2 ? '✅' : '⚠️';
    console.log(`  ${status} ${room.name.en}: ${imageCount} images`);
    if (room.images) {
      room.images.slice(0, 3).forEach(img => {
        console.log(`     - ${path.basename(img)}`);
      });
      if (room.images.length > 3) {
        console.log(`     ... and ${room.images.length - 3} more`);
      }
    }
  });
});