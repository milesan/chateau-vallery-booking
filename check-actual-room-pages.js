const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to fetch HTML
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

// Function to download file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 10000) {
        console.log(`⏭️  Skipping existing: ${path.basename(filepath)}`);
        return resolve({ success: true, skipped: true });
      }
    }
    
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(filepath);
          console.log(`✓ Downloaded: ${path.basename(filepath)} (${Math.round(stats.size/1024)}KB)`);
          resolve({ success: true, size: stats.size });
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        console.log(`❌ Failed (${response.statusCode}): ${path.basename(filepath)}`);
        resolve({ success: false, status: response.statusCode });
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      console.log(`❌ Error: ${err.message}`);
      resolve({ success: false, error: err.message });
    });
  });
}

async function checkAllRoomImages() {
  console.log('🔍 CHECKING ALL ROOM IMAGES FROM CHÂTEAU WEBSITE\n');
  
  // First, let's get the main page to extract room links
  const mainUrl = 'https://www.chateaudevallery.com/EN/chateau-and-estate/bedrooms-accommodation/french-chateau-with-bedrooms.php';
  console.log('📖 Fetching main page...\n');
  
  const html = await fetchHTML(mainUrl);
  
  // Extract all images from the main page and room detail links
  const allImages = new Set();
  
  // 1. Get all images from img tags
  const imgRegex = /<img[^>]+src="([^"]+)"/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    allImages.add(match[1]);
  }
  
  // 2. Get all images from fancybox links
  const fancyboxRegex = /<a[^>]+href="([^"]+\.(jpg|jpeg|png|webp))"[^>]*(?:class="[^"]*fancybox|data-fancybox)/gi;
  while ((match = fancyboxRegex.exec(html)) !== null) {
    allImages.add(match[1]);
  }
  
  // 3. Get images from style attributes
  const styleRegex = /url\(["']?([^"')]+\.(?:jpg|jpeg|png|webp))["']?\)/gi;
  while ((match = styleRegex.exec(html)) !== null) {
    allImages.add(match[1]);
  }
  
  // 4. Get room detail page links
  const roomDetailRegex = /<a[^>]+href="([^"]+details-chambres[^"]+\.php)"/gi;
  const roomDetailUrls = new Set();
  while ((match = roomDetailRegex.exec(html)) !== null) {
    let url = match[1];
    if (!url.startsWith('http')) {
      if (url.startsWith('/')) {
        url = `https://www.chateaudevallery.com${url}`;
      } else if (url.startsWith('../')) {
        url = url.replace(/^\.\.\//, 'https://www.chateaudevallery.com/');
      }
    }
    roomDetailUrls.add(url);
  }
  
  console.log(`Found ${allImages.size} images on main page`);
  console.log(`Found ${roomDetailUrls.size} room detail pages\n`);
  
  // Visit each room detail page
  for (const roomUrl of roomDetailUrls) {
    console.log(`\n📄 Checking: ${roomUrl}`);
    try {
      const roomHtml = await fetchHTML(roomUrl);
      
      // Extract images from room page
      let roomImageCount = 0;
      
      // All image patterns
      const patterns = [
        /<img[^>]+src="([^"]+)"/gi,
        /<a[^>]+href="([^"]+\.(jpg|jpeg|png|webp))"/gi,
        /url\(["']?([^"')]+\.(?:jpg|jpeg|png|webp))["']?\)/gi,
        /data-(?:src|original|large)="([^"]+\.(jpg|jpeg|png|webp))"/gi
      ];
      
      for (const pattern of patterns) {
        let m;
        while ((m = pattern.exec(roomHtml)) !== null) {
          allImages.add(m[1]);
          roomImageCount++;
        }
      }
      
      console.log(`   Found ${roomImageCount} images`);
    } catch (err) {
      console.log(`   Error: ${err.message}`);
    }
  }
  
  // Process all found images
  console.log(`\n\n📊 Total unique images found: ${allImages.size}\n`);
  
  // Create download directory
  const downloadDir = './public/images/rooms/fullres';
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  
  // Convert relative URLs to absolute and download
  console.log('📥 Downloading high-resolution images...\n');
  
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  
  for (let imageUrl of allImages) {
    // Skip non-room images
    if (imageUrl.includes('logo') || imageUrl.includes('icon') || imageUrl.includes('flag')) continue;
    
    // Convert to absolute URL
    if (!imageUrl.startsWith('http')) {
      if (imageUrl.startsWith('/')) {
        imageUrl = `https://www.chateaudevallery.com${imageUrl}`;
      } else if (imageUrl.startsWith('../')) {
        const levels = (imageUrl.match(/\.\.\//g) || []).length;
        const cleanUrl = imageUrl.replace(/\.\.\//g, '');
        if (levels >= 3) {
          imageUrl = `https://www.chateaudevallery.com/${cleanUrl}`;
        } else if (levels === 2) {
          imageUrl = `https://www.chateaudevallery.com/EN/${cleanUrl}`;
        } else {
          imageUrl = `https://www.chateaudevallery.com/EN/chateau-and-estate/${cleanUrl}`;
        }
      }
    }
    
    // Extract filename
    const filename = path.basename(imageUrl);
    
    // Skip if it's a thumbnail
    if (filename.includes('-p.webp') || filename.includes('-p.jpg')) {
      // Try full resolution version
      const fullResUrl = imageUrl.replace('-p.webp', '.webp').replace('-p.jpg', '.jpg');
      const fullResFilename = filename.replace('-p.webp', '.webp').replace('-p.jpg', '.jpg');
      const filepath = path.join(downloadDir, fullResFilename);
      
      const result = await downloadFile(fullResUrl, filepath);
      if (result.success) {
        if (result.skipped) skipped++;
        else downloaded++;
      } else {
        failed++;
      }
    } else {
      // Download as is
      const filepath = path.join(downloadDir, filename);
      const result = await downloadFile(imageUrl, filepath);
      if (result.success) {
        if (result.skipped) skipped++;
        else downloaded++;
      } else {
        failed++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Check complete!');
  console.log(`📊 Downloaded: ${downloaded} new images`);
  console.log(`📊 Skipped: ${skipped} existing images`);
  console.log(`📊 Failed: ${failed} images`);
  console.log('='.repeat(60));
  
  // Now update room data with all available images
  console.log('\n🔄 Updating room data with all images...\n');
  
  // Get all downloaded images
  const allDownloadedImages = fs.readdirSync(downloadDir);
  console.log(`Found ${allDownloadedImages.length} images in fullres directory`);
  
  // Read current room data
  const roomsData = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf-8'));
  
  // Create comprehensive mapping
  const roomImageMapping = {
    'suite-nuptiale': ['pigeonnier', 'nuptiale', 'dovecote', 'bridal-suite'],
    'grand-conde': ['grand-conde'],
    'petit-conde': ['petit-conde'],
    'louis-xiii': ['louis-xiii', 'louis-13'],
    'henri-iv': ['henri-iv', 'henri-4'],
    'charlotte-de-montmorency': ['charlotte', 'montmorency'],
    'pierre-lescot': ['pierre-lescot', 'lescot'],
    'fauconnier': ['fauconnier', 'falconer'],
    'epis': ['epi', 'epis'],
    'saint-andre-i': ['saint-andre-i', 'st-andre-i', 'st-andre-1'],
    'saint-andre-ii': ['saint-andre-ii', 'st-andre-ii', 'st-andre-2'],
    'saint-andre-iii': ['saint-andre-iii', 'st-andre-iii', 'st-andre-3'],
    'lierre-i': ['lierre-i', 'lierre-1', 'ivy-i'],
    'lierre-ii': ['lierre-ii', 'lierre-2', 'ivy-ii'],
    'biche': ['biche', 'doe'],
    'tulipe': ['tulipe', 'tulip'],
    'restauration': ['restauration', 'restoration'],
    'loft-suite': ['loft', 'oriental-loft'],
    'sahara': ['sahara'],
    'levant': ['levant'],
    'nirvana': ['nirvana'],
    'darjeeling': ['darjeeling'],
    'samsara': ['samsara'],
    'figuier': ['figuier', 'fig'],
    'grand-duc': ['grand-duc', 'grand-duke'],
    'petit-duc': ['petit-duc', 'petit-duke'],
    'dame-blanche': ['dame-blanche', 'white-lady'],
    'chouette': ['chouette', 'owl']
  };
  
  // Update each room with its images
  let totalUpdated = 0;
  
  Object.values(roomsData.sections).forEach(section => {
    section.rooms.forEach(room => {
      const patterns = roomImageMapping[room.id] || [];
      const roomImages = [];
      
      // Find all images that match this room
      allDownloadedImages.forEach(filename => {
        const filenameLower = filename.toLowerCase();
        if (patterns.some(pattern => filenameLower.includes(pattern))) {
          roomImages.push(`rooms/fullres/${filename}`);
        }
      });
      
      // Update room images if we found any
      if (roomImages.length > 0) {
        room.images = roomImages;
        totalUpdated++;
        console.log(`✅ ${room.name.en}: ${roomImages.length} images`);
      } else {
        console.log(`⚠️  ${room.name.en}: No images found`);
      }
    });
  });
  
  // Save updated room data
  fs.writeFileSync('./data/rooms.json', JSON.stringify(roomsData, null, 2));
  
  console.log(`\n✅ Updated ${totalUpdated} rooms with images`);
}

// Run the check
checkAllRoomImages().catch(console.error);