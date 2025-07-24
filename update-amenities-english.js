const fs = require('fs');
const path = require('path');

// Read the room data
const roomsData = require('./data/rooms.json');

// Translation map for amenities
const translations = {
  "Baignoire monolithe en pierre": "Monolithic stone bathtub",
  "Vue astronomique": "Astronomical view",
  "Design unique": "Unique design",
  "Chauffage": "Heating",
  "Vue jardin": "Garden view",
  "Mobilier d'époque": "Period furniture",
  "Décor Renaissance": "Renaissance decor",
  "Salon privé": "Private lounge",
  "Cheminée": "Fireplace",
  "Vue château": "Castle view",
  "Vue cour": "Courtyard view",
  "Poutres apparentes": "Exposed beams",
  "Antichambre": "Anteroom",
  "Cheminée monumentale": "Monumental fireplace",
  "Tapisseries": "Tapestries",
  "Architecture Renaissance": "Renaissance architecture",
  "Boudoir": "Boudoir",
  "Vue parc": "Park view",
  "Décor romantique": "Romantic decor",
  "Salon spacieux": "Spacious lounge",
  "Décoration orientale": "Oriental decoration",
  "Espace détente": "Relaxation area",
  "Vue panoramique": "Panoramic view",
  "Décor berbère": "Berber decor",
  "Tapis artisanaux": "Handcrafted carpets",
  "Ambiance tamisée": "Soft lighting",
  "Mosaïques": "Mosaics",
  "Arches mauresque": "Moorish arches",
  "Parfums d'Orient": "Oriental fragrances",
  "Terrasse privée": "Private terrace",
  "Vue palmeraie": "Palm grove view",
  "Décor zen": "Zen decor",
  "Tissus indiens": "Indian fabrics",
  "Mobilier colonial": "Colonial furniture",
  "Atmosphère sereine": "Serene atmosphere",
  "Décor asiatique": "Asian decor",
  "Jardin privatif": "Private garden",
  "Poutres anciennes": "Ancient beams",
  "Charme rustique": "Rustic charm",
  "Accès PMR": "Wheelchair access",
  "Pierre apparente": "Exposed stone",
  "Voûtes anciennes": "Ancient vaults",
  "Murs en pierre": "Stone walls",
  "Atmosphère authentique": "Authentic atmosphere",
  "Vue tour": "Tower view",
  "Histoire légendaire": "Legendary history",
  "Nid douillet": "Cozy nest",
  "Calme absolu": "Absolute tranquility"
};

// Update amenities and bed descriptions
Object.values(roomsData.sections).forEach(section => {
  section.rooms.forEach(room => {
    // Translate amenities
    if (room.features.amenities) {
      room.features.amenities = room.features.amenities.map(amenity => 
        translations[amenity] || amenity
      );
    }
    
    // Translate bed descriptions
    if (room.features.beds) {
      room.features.beds = room.features.beds
        .replace('1 lit circulaire (2.10m)', '1 circular bed (2.10m)')
        .replace('1 lit king size', '1 king size bed')
        .replace('1 lit double', '1 double bed')
        .replace('2 lits simples', '2 single beds')
        .replace('+ canapés-lits', '+ sofa beds');
    }
    
    // Translate level descriptions
    if (room.level) {
      const levelTranslations = {
        "Premier étage": "First floor",
        "Deuxième étage": "Second floor",
        "Entresol": "Mezzanine",
        "Combles": "Attic"
      };
      room.level = levelTranslations[room.level] || room.level;
    }
  });
});

// Write the updated data
fs.writeFileSync(
  path.join(__dirname, 'data', 'rooms.json'),
  JSON.stringify(roomsData, null, 2)
);

console.log('Amenities translated to English!');