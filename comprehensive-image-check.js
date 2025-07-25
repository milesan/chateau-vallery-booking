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
        resolve({ success: false, status: response.statusCode });
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      resolve({ success: false, error: err.message });
    });
  });
}

// Main function to check every room page
async function checkEveryRoomMethodically() {
  console.log('🔍 COMPREHENSIVE ROOM IMAGE CHECK\n');
  
  // First, get the main accommodation pages
  const mainPages = [
    'https://www.chateaudevallery.com/EN/chateau-and-estate/bedrooms-accommodation/french-chateau-with-bedrooms.php',
    'https://www.chateaudevallery.com/FR/chateau-et-domaine/chambres-hebergements/chambres-et-suites-du-domaine.php'
  ];
  
  const allRoomUrls = new Set();
  const roomImageMap = new Map();
  
  // Step 1: Get all room detail page URLs
  console.log('📖 Step 1: Finding all room detail pages...\n');
  
  for (const url of mainPages) {
    const html = await fetchHTML(url);
    
    // Find all room detail links
    const roomLinkRegex = /href="([^"]+details-chambres[^"]+)"/gi;
    let match;
    
    while ((match = roomLinkRegex.exec(html)) !== null) {
      let roomUrl = match[1];
      if (!roomUrl.startsWith('http')) {
        if (roomUrl.startsWith('/')) {
          roomUrl = `https://www.chateaudevallery.com${roomUrl}`;
        } else if (roomUrl.startsWith('../')) {
          roomUrl = roomUrl.replace(/^\.\.\//, 'https://www.chateaudevallery.com/');
        }
      }
      allRoomUrls.add(roomUrl);
    }
  }
  
  console.log(`Found ${allRoomUrls.size} room detail pages\n`);
  
  // Step 2: Visit each room page and extract images
  console.log('📸 Step 2: Extracting images from each room page...\n');
  
  for (const roomUrl of allRoomUrls) {
    console.log(`\n🏰 Checking: ${roomUrl}`);
    const html = await fetchHTML(roomUrl);
    
    // Extract room name from URL or title
    const roomName = roomUrl.match(/\/([^\/]+)\/[^\/]+$/)?.[1] || 'unknown';
    console.log(`   Room: ${roomName}`);
    
    // Extract ALL images from the page
    const images = new Set();
    
    // 1. Regular img tags
    const imgRegex = /<img[^>]+src="([^"]+)"/gi;
    while ((match = imgRegex.exec(html)) !== null) {
      images.add(match[1]);
    }
    
    // 2. Fancybox/lightbox links
    const fancyboxRegex = /<a[^>]+href="([^"]+\.(jpg|jpeg|png|webp))"[^>]*(?:class="[^"]*fancybox|data-fancybox)/gi;
    while ((match = fancyboxRegex.exec(html)) !== null) {
      images.add(match[1]);
    }
    
    // 3. Background images
    const bgRegex = /background-image:\s*url\(['"]?([^'")]+)['"]?\)/gi;
    while ((match = bgRegex.exec(html)) !== null) {
      images.add(match[1]);
    }
    
    // 4. Data attributes
    const dataRegex = /data-(?:src|original|large|full)="([^"]+\.(jpg|jpeg|png|webp))"/gi;
    while ((match = dataRegex.exec(html)) !== null) {
      images.add(match[1]);
    }
    
    // Process and filter images
    const roomImages = [];
    for (let img of images) {
      // Skip icons, logos, etc.
      if (img.includes('logo') || img.includes('icon') || img.includes('flag')) continue;
      
      // Convert to absolute URL
      if (!img.startsWith('http')) {
        if (img.startsWith('/')) {
          img = `https://www.chateaudevallery.com${img}`;
        } else if (img.startsWith('../')) {
          const levels = (img.match(/\.\.\//g) || []).length;
          const cleanImg = img.replace(/\.\.\//g, '');
          if (levels >= 3) {
            img = `https://www.chateaudevallery.com/${cleanImg}`;
          } else {
            img = `https://www.chateaudevallery.com/EN/${cleanImg}`;
          }
        }
      }
      
      // Skip thumbnails
      if (img.includes('-p.webp') || img.includes('-p.jpg') || img.includes('_thumb')) {
        // Try to get full res version
        const fullRes = img.replace('-p.webp', '.webp').replace('-p.jpg', '.jpg');
        roomImages.push(fullRes);
      } else {
        roomImages.push(img);
      }
    }
    
    console.log(`   Found ${roomImages.length} images`);
    roomImageMap.set(roomName, roomImages);
  }
  
  // Step 3: Download all missing images
  console.log('\n\n📥 Step 3: Downloading all high-res images...\n');
  
  const downloadDir = './public/images/rooms/fullres';
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  
  let totalDownloaded = 0;
  let totalSkipped = 0;
  
  for (const [roomName, images] of roomImageMap) {
    console.log(`\n🏰 ${roomName}:`);
    
    for (const imageUrl of images) {
      const filename = path.basename(imageUrl);
      const filepath = path.join(downloadDir, `${roomName}-${filename}`);
      
      // Skip if already downloaded
      if (fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath);
        if (stats.size > 10000) { // Skip if larger than 10KB
          totalSkipped++;
          continue;
        }
      }
      
      const result = await downloadFile(imageUrl, filepath);
      if (result.success && result.size > 10000) {
        totalDownloaded++;
      } else {
        // Try without -p suffix if failed
        if (filename.includes('-p.')) {
          const altUrl = imageUrl.replace('-p.webp', '.webp').replace('-p.jpg', '.jpg');
          const altFilepath = filepath.replace('-p.webp', '.webp').replace('-p.jpg', '.jpg');
          console.log(`   Trying alt: ${path.basename(altUrl)}`);
          const altResult = await downloadFile(altUrl, altFilepath);
          if (altResult.success && altResult.size > 10000) {
            totalDownloaded++;
            fs.unlink(filepath, () => {}); // Remove failed thumbnail
          }
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Comprehensive check complete!`);
  console.log(`📊 Downloaded: ${totalDownloaded} new images`);
  console.log(`📊 Skipped: ${totalSkipped} existing images`);
  console.log(`📊 Total rooms checked: ${roomImageMap.size}`);
  console.log('='.repeat(60));
  
  // Step 4: Create mapping file
  const mapping = {};
  for (const [roomName, images] of roomImageMap) {
    mapping[roomName] = images.map(url => path.basename(url));
  }
  
  fs.writeFileSync('./room-image-mapping.json', JSON.stringify(mapping, null, 2));
  console.log('\n💾 Saved room-image-mapping.json for reference');
}

// Run the comprehensive check
checkEveryRoomMethodically().catch(console.error);