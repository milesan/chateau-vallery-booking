const fs = require('fs');

// Read current room data
const roomsData = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf-8'));

// Add missing Renaissance rooms
const missingRooms = [
  {
    "id": "lierre-i",
    "name": {
      "fr": "Lierre I",
      "en": "Ivy I"
    },
    "description": {
      "fr": "Première chambre de la suite Lierre",
      "en": "First room of the Ivy suite"
    },
    "features": {
      "beds": "1 double bed",
      "capacity": 2,
      "bathroom": "private",
      "amenities": [
        "Heating",
        "Garden view"
      ]
    },
    "price": 180,
    "level": "Second floor",
    "available": true,
    "images": [
      "rooms/fullres/general-chambre-lierre-I-mariage-chateau.webp",
      "rooms/fullres/general-lierre-I-bedroom-for-weddings.webp",
      "rooms/fullres/general-lierre-1-detail.webp",
      "rooms/fullres/general-suite-aux-lierre.webp",
      "rooms/fullres/general-salle-de-bain-renaissance-lierre.webp"
    ]
  },
  {
    "id": "lierre-ii",
    "name": {
      "fr": "Lierre II",
      "en": "Ivy II"
    },
    "description": {
      "fr": "Deuxième chambre de la suite Lierre",
      "en": "Second room of the Ivy suite"
    },
    "features": {
      "beds": "2 single beds",
      "capacity": 2,
      "bathroom": "shared",
      "amenities": [
        "Heating",
        "Ivy-covered walls"
      ]
    },
    "price": 160,
    "level": "Second floor",
    "available": true,
    "images": [
      "rooms/fullres/general-chambre-lierre-II-renaissance.webp",
      "rooms/fullres/general-chambre-lierre-II.webp",
      "rooms/fullres/general-lierre-II-hebergement-mariage.webp",
      "rooms/fullres/general-chambre-chateau-renaissance-lierre.webp"
    ]
  },
  {
    "id": "biche",
    "name": {
      "fr": "Biche",
      "en": "Doe"
    },
    "description": {
      "fr": "Chambre élégante avec décor animalier",
      "en": "Elegant room with wildlife decor"
    },
    "features": {
      "beds": "1 double bed",
      "capacity": 2,
      "bathroom": "private",
      "amenities": [
        "Heating",
        "Nature-themed decor"
      ]
    },
    "price": 190,
    "level": "First floor",
    "available": true,
    "images": [
      "rooms/fullres/general-biche-accommodation.webp",
      "rooms/fullres/general-chambre-renaissance-biche.webp"
    ]
  },
  {
    "id": "tulipe",
    "name": {
      "fr": "Tulipe",
      "en": "Tulip"
    },
    "description": {
      "fr": "Chambre romantique aux motifs floraux",
      "en": "Romantic room with floral motifs"
    },
    "features": {
      "beds": "1 king size bed",
      "capacity": 2,
      "bathroom": "private",
      "amenities": [
        "Heating",
        "Floral decoration",
        "Garden view"
      ]
    },
    "price": 210,
    "level": "First floor",
    "available": true,
    "images": [
      "rooms/fullres/general-chambre-tulipe-chateau-renaissance.webp",
      "rooms/fullres/general-tulipe-french-castle-bedroom.webp",
      "rooms/fullres/general-tulipe-renaissance-room-chateau.webp",
      "rooms/fullres/general-detail-chambre-tulipe.webp",
      "rooms/fullres/general-tulipe-room-detail.webp"
    ]
  },
  {
    "id": "restauration",
    "name": {
      "fr": "Restauration",
      "en": "Restoration"
    },
    "description": {
      "fr": "Chambre récemment restaurée avec charme d'époque",
      "en": "Recently restored room with period charm"
    },
    "features": {
      "beds": "1 double bed",
      "capacity": 2,
      "bathroom": "private",
      "amenities": [
        "Heating",
        "Restored features",
        "Modern comfort"
      ]
    },
    "price": 200,
    "level": "Third floor",
    "available": true,
    "images": [
      "rooms/fullres/general-chambre-restauration-chateau.webp",
      "rooms/fullres/general-restauration-renaissance-bedroom.webp"
    ]
  }
];

// Add the missing rooms to the Renaissance section
roomsData.sections.renaissance.rooms.push(...missingRooms);

// Update the Renaissance section description
roomsData.sections.renaissance.description = {
  "fr": "16 chambres réparties sur 4 niveaux dans l'aile historique",
  "en": "16 rooms spread across 4 levels in the historic wing"
};

// Save the updated data
fs.writeFileSync('./data/rooms.json', JSON.stringify(roomsData, null, 2));

console.log('✅ Added 5 missing Renaissance rooms:');
console.log('   - Lierre I (Ivy I)');
console.log('   - Lierre II (Ivy II)');
console.log('   - Biche (Doe)');
console.log('   - Tulipe (Tulip)');
console.log('   - Restauration (Restoration)');
console.log('\n📊 Total rooms now: 28');
console.log('   Renaissance Wing: 16 rooms (was 11)');