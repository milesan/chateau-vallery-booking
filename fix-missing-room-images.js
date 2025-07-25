const fs = require('fs');

// Read room data
const roomsData = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf-8'));

// Get all available images
const allImages = fs.readdirSync('./public/images/rooms/fullres');

console.log('🔍 Fixing missing room images...\n');

// Fix Saint André III - it has images with "saint-andre-3" or "beds-of-saint-andre-3"
const saintAndre3 = roomsData.sections.renaissance.rooms.find(r => r.id === 'saint-andre-iii');
if (saintAndre3) {
  saintAndre3.images = allImages
    .filter(img => img.includes('saint-andre-3') || img.includes('beds-of-saint-andre-3') || 
                   img.includes('2-lits-simples'))
    .map(img => `rooms/fullres/${img}`);
  console.log(`✅ Saint André III: ${saintAndre3.images.length} images`);
}

// Fix Charlotte de Montmorency - she has images with "charlotte" or "montmorency" or "mariee-dans-la-suite"
const charlotte = roomsData.sections.renaissance.rooms.find(r => r.id === 'charlotte-de-montmorency');
if (charlotte) {
  charlotte.images = allImages
    .filter(img => img.includes('charlotte') || img.includes('montmorency') || 
                   img.includes('mariee-dans-la-suite') || img.includes('warthog') ||
                   img.includes('entrance-to-the-suite'))
    .map(img => `rooms/fullres/${img}`);
  
  // Also add the bridal suite images that were originally assigned to her
  const bridalImages = ['bridal-suite-castle.webp', 'bathroom-bridal-suite.webp', 'suite-nuptiale-chateau.webp']
    .filter(img => allImages.includes(img) && !img.includes('pigeonnier'))
    .map(img => `rooms/fullres/${img}`);
  
  charlotte.images = [...charlotte.images, ...bridalImages];
  console.log(`✅ Charlotte de Montmorency: ${charlotte.images.length} images`);
}

// Fix White Lady - dame-blanche images
const whiteLady = roomsData.sections.medieval.rooms.find(r => r.id === 'dame-blanche');
if (whiteLady) {
  whiteLady.images = allImages
    .filter(img => img.includes('dame-blanche') || img.includes('white-lady') ||
                   (img.includes('medieval') && img.includes('mariage')) ||
                   img.includes('hebergement-medieval'))
    .map(img => `rooms/fullres/${img}`);
  console.log(`✅ White Lady: ${whiteLady.images.length} images`);
}

// Fix Owl - chouette images
const owl = roomsData.sections.medieval.rooms.find(r => r.id === 'chouette');
if (owl) {
  owl.images = allImages
    .filter(img => img.includes('chouette') || img.includes('owl') ||
                   (img.includes('medieval-bedroom') && !img.includes('grand-duc')))
    .map(img => `rooms/fullres/${img}`);
  console.log(`✅ Owl: ${owl.images.length} images`);
}

// Also ensure no duplicates and proper sorting
Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    if (room.images) {
      // Remove duplicates
      room.images = [...new Set(room.images)];
      
      // Sort: fullres first, then by name
      room.images.sort((a, b) => {
        const aIsFullres = a.includes('fullres');
        const bIsFullres = b.includes('fullres');
        if (aIsFullres && !bIsFullres) return -1;
        if (!aIsFullres && bIsFullres) return 1;
        return a.localeCompare(b);
      });
    }
  });
});

// Save updated data
fs.writeFileSync('./data/rooms.json', JSON.stringify(roomsData, null, 2));

console.log('\n✅ Fixed missing room images!');

// Show final count
console.log('\n📸 All rooms now have images:\n');
let roomsWithoutImages = 0;
Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    const count = room.images ? room.images.length : 0;
    if (count === 0) {
      console.log(`❌ ${room.name.en}: NO IMAGES`);
      roomsWithoutImages++;
    } else if (count < 3) {
      console.log(`⚠️  ${room.name.en}: ${count} images`);
    }
  });
});

console.log(`\n${roomsWithoutImages === 0 ? '✅ All rooms have images!' : `❌ ${roomsWithoutImages} rooms still missing images`}`);