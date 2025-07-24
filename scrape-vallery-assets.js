const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Base URL for the château website
const BASE_URL = 'https://www.chateaudevallery.com';

// All assets to download
const ASSETS_TO_DOWNLOAD = {
  pdfs: [
    {
      url: 'https://www.chateaudevallery.com/pdf/chambres-du-chateau.pdf',
      filename: 'rooms-interactive-plan.pdf',
      description: 'Interactive room plan'
    },
    {
      url: 'https://www.chateaudevallery.com/pdf/chateau-de-vallery-brochure.pdf',
      filename: 'chateau-complete-brochure.pdf',
      description: 'Complete château brochure'
    }
  ],
  rooms: {
    // Suite Nuptiale (Pigeonnier)
    'suite-nuptiale': [
      'https://www.chateaudevallery.com/details-chambres-chateau/suite-nuptiale-pigeonnier/dovecote-bridal-suite-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/suite-nuptiale-pigeonnier/suite-nuptiale-pigeonnier-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/suite-nuptiale-pigeonnier/suite-nuptiale-pigeonnier-2.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/suite-nuptiale-pigeonnier/suite-nuptiale-pigeonnier-3.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/suite-nuptiale-pigeonnier/suite-nuptiale-pigeonnier-4.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/suite-nuptiale-pigeonnier/suite-nuptiale-pigeonnier-5.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/suite-nuptiale-pigeonnier/suite-nuptiale-pigeonnier-6.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/suite-nuptiale-pigeonnier/suite-nuptiale-pigeonnier-7.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/suite-nuptiale-pigeonnier/suite-nuptiale-pigeonnier-8.webp'
    ],
    // Renaissance Rooms
    'grand-conde': [
      'https://www.chateaudevallery.com/details-chambres-chateau/grand-conde-preparatifs-mariee/chambre-renaissance-grand-conde-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/grand-conde-preparatifs-mariee/grand-conde-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/grand-conde-preparatifs-mariee/grand-conde-2.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/grand-conde-preparatifs-mariee/grand-conde-3.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/grand-conde-preparatifs-mariee/grand-conde-4.webp'
    ],
    'petit-conde': [
      'https://www.chateaudevallery.com/details-chambres-chateau/petit-conde/petit-conde-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/petit-conde/petit-conde-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/petit-conde/petit-conde-2.webp'
    ],
    'henri-iv': [
      'https://www.chateaudevallery.com/details-chambres-chateau/henri-iv/henri-iv-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/henri-iv/henri-iv-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/henri-iv/henri-iv-2.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/henri-iv/henri-iv-3.webp'
    ],
    'louis-xiii': [
      'https://www.chateaudevallery.com/details-chambres-chateau/louis-xiii/louis-xiii-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/louis-xiii/louis-xiii-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/louis-xiii/louis-xiii-2.webp'
    ],
    'charlotte-de-montmorency': [
      'https://www.chateaudevallery.com/details-chambres-chateau/charlotte-de-montmorency/charlotte-de-montmorency-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/charlotte-de-montmorency/charlotte-de-montmorency-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/charlotte-de-montmorency/charlotte-de-montmorency-2.webp'
    ],
    'pierre-lescot': [
      'https://www.chateaudevallery.com/details-chambres-chateau/pierre-lescot/pierre-lescot-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/pierre-lescot/pierre-lescot-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/pierre-lescot/pierre-lescot-2.webp'
    ],
    // Oriental Rooms
    'loft-suite': [
      'https://www.chateaudevallery.com/details-chambres-chateau/loft-oriental/bridal-oriental-suite-wedding-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/loft-oriental/loft-oriental-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/loft-oriental/loft-oriental-2.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/loft-oriental/loft-oriental-3.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/loft-oriental/loft-oriental-4.webp'
    ],
    'sahara': [
      'https://www.chateaudevallery.com/details-chambres-chateau/sahara/sahara-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/sahara/sahara-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/sahara/sahara-2.webp'
    ],
    'levant': [
      'https://www.chateaudevallery.com/details-chambres-chateau/levant/levant-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/levant/levant-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/levant/levant-2.webp'
    ],
    // Palm Grove Rooms
    'nirvana': [
      'https://www.chateaudevallery.com/details-chambres-chateau/nirvana-palm-grove/chambre-de-la-palmeraie-du-chateau-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/nirvana-palm-grove/nirvana-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/nirvana-palm-grove/nirvana-2.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/nirvana-palm-grove/nirvana-3.webp'
    ],
    'darjeeling': [
      'https://www.chateaudevallery.com/details-chambres-chateau/darjeeling-palm-grove/darjeeling-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/darjeeling-palm-grove/darjeeling-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/darjeeling-palm-grove/darjeeling-2.webp'
    ],
    'samsara': [
      'https://www.chateaudevallery.com/details-chambres-chateau/samsara-palm-grove/samsara-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/samsara-palm-grove/samsara-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/samsara-palm-grove/samsara-2.webp'
    ],
    'figuier': [
      'https://www.chateaudevallery.com/details-chambres-chateau/figuier-fig-tree/figuier-fig-tree-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/figuier-fig-tree/figuier-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/figuier-fig-tree/figuier-2.webp'
    ],
    // Medieval Rooms
    'chouette': [
      'https://www.chateaudevallery.com/details-chambres-chateau/chouette/chouette-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/chouette/chouette-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/chouette/chouette-2.webp'
    ],
    'dame-blanche': [
      'https://www.chateaudevallery.com/details-chambres-chateau/dame-blanche/dame-blanche-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/dame-blanche/dame-blanche-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/dame-blanche/dame-blanche-2.webp'
    ],
    'petit-duc': [
      'https://www.chateaudevallery.com/details-chambres-chateau/petit-duc-medieval-accommodation/petit-duc-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/petit-duc-medieval-accommodation/petit-duc-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/petit-duc-medieval-accommodation/petit-duc-2.webp'
    ],
    'grand-duc': [
      'https://www.chateaudevallery.com/details-chambres-chateau/grand-duc-medieval-accommodation/chambre-grand-duc-chateau-medieval-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/grand-duc-medieval-accommodation/grand-duc-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/grand-duc-medieval-accommodation/grand-duc-2.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/grand-duc-medieval-accommodation/grand-duc-3.webp'
    ],
    // Ferme de la Grille Rooms
    'saint-andre-i': [
      'https://www.chateaudevallery.com/details-chambres-chateau/saint-andre-i/saint-andre-i-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/saint-andre-i/saint-andre-i-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/saint-andre-i/saint-andre-i-2.webp'
    ],
    'saint-andre-ii': [
      'https://www.chateaudevallery.com/details-chambres-chateau/saint-andre-ii/saint-andre-ii-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/saint-andre-ii/saint-andre-ii-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/saint-andre-ii/saint-andre-ii-2.webp'
    ],
    'saint-andre-iii': [
      'https://www.chateaudevallery.com/details-chambres-chateau/saint-andre-iii/saint-andre-iii-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/saint-andre-iii/saint-andre-iii-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/saint-andre-iii/saint-andre-iii-2.webp'
    ],
    'fauconnier': [
      'https://www.chateaudevallery.com/details-chambres-chateau/fauconnier/fauconnier-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/fauconnier/fauconnier-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/fauconnier/fauconnier-2.webp'
    ],
    'epis': [
      'https://www.chateaudevallery.com/details-chambres-chateau/epis-ear-of-wheat/epis-ear-of-wheat-p.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/epis-ear-of-wheat/epis-1.webp',
      'https://www.chateaudevallery.com/details-chambres-chateau/epis-ear-of-wheat/epis-2.webp'
    ]
  },
  general: [
    'https://www.chateaudevallery.com/images/logotype.webp',
    'https://www.chateaudevallery.com/images/chateau-general-view.webp',
    'https://www.chateaudevallery.com/images/palm-grove-overview.webp',
    'https://www.chateaudevallery.com/images/medieval-tower.webp'
  ]
};

// Function to download a file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else {
        fs.unlink(filepath, () => {}); // Delete the file on error
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Create directories if they don't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Main function to download all assets
async function downloadAllAssets() {
  console.log('Starting Château de Vallery asset download...\n');

  // Ensure directories exist
  ensureDirectoryExists('./public/pdfs');
  ensureDirectoryExists('./public/images/rooms');
  ensureDirectoryExists('./public/images/general');

  let totalDownloaded = 0;
  let totalFailed = 0;

  // Download PDFs
  console.log('📄 Downloading PDFs...');
  for (const pdf of ASSETS_TO_DOWNLOAD.pdfs) {
    try {
      await downloadFile(pdf.url, `./public/pdfs/${pdf.filename}`);
      totalDownloaded++;
    } catch (error) {
      console.error(`✗ Failed to download ${pdf.filename}: ${error.message}`);
      totalFailed++;
    }
  }

  // Download room images
  console.log('\n🏛️  Downloading room images...');
  for (const [roomName, images] of Object.entries(ASSETS_TO_DOWNLOAD.rooms)) {
    console.log(`\n📸 ${roomName}:`);
    let imageIndex = 1;
    
    for (const imageUrl of images) {
      const extension = path.extname(imageUrl) || '.webp';
      const filename = `${roomName}-${imageIndex}${extension}`;
      
      try {
        await downloadFile(imageUrl, `./public/images/rooms/${filename}`);
        totalDownloaded++;
      } catch (error) {
        console.error(`✗ Failed to download ${filename}: ${error.message}`);
        totalFailed++;
      }
      
      imageIndex++;
    }
  }

  // Download general images
  console.log('\n🖼️  Downloading general images...');
  for (const imageUrl of ASSETS_TO_DOWNLOAD.general) {
    const filename = path.basename(imageUrl);
    
    try {
      await downloadFile(imageUrl, `./public/images/general/${filename}`);
      totalDownloaded++;
    } catch (error) {
      console.error(`✗ Failed to download ${filename}: ${error.message}`);
      totalFailed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Download complete!`);
  console.log(`📊 Total files downloaded: ${totalDownloaded}`);
  console.log(`❌ Total files failed: ${totalFailed}`);
  console.log('='.repeat(50));
}

// Run the download
downloadAllAssets().catch(console.error);