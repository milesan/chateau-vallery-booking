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
        const totalSize = parseInt(response.headers['content-length'], 10);
        let downloadedSize = 0;
        
        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          if (totalSize) {
            const percent = Math.round((downloadedSize / totalSize) * 100);
            process.stdout.write(`\r  Downloading: ${percent}% (${Math.round(downloadedSize/1024)}KB)`);
          }
        });
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(filepath);
          const sizeKB = Math.round(stats.size / 1024);
          console.log(`\n✓ Downloaded: ${path.basename(filepath)} (${sizeKB}KB)`);
          resolve({ success: true, size: sizeKB });
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

// Extract all image URLs from HTML, including from JavaScript
function extractAllImageUrls(html) {
  const imageUrls = new Set();
  
  // 1. Standard img tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    imageUrls.add(match[1]);
  }
  
  // 2. Links that point to images (especially fancybox galleries)
  const linkRegex = /<a[^>]+href=["']([^"']+\.(jpg|jpeg|png|webp|gif))["']/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    imageUrls.add(match[1]);
  }
  
  // 3. Background images in style attributes
  const styleRegex = /style=["'][^"']*background(?:-image)?:\s*url\(["']?([^"')]+)["']?\)[^"']*["']/gi;
  while ((match = styleRegex.exec(html)) !== null) {
    imageUrls.add(match[1]);
  }
  
  // 4. Data attributes (lazy loading)
  const dataRegex = /data-(?:src|original|full|large)=["']([^"']+\.(jpg|jpeg|png|webp|gif))["']/gi;
  while ((match = dataRegex.exec(html)) !== null) {
    imageUrls.add(match[1]);
  }
  
  // 5. JavaScript arrays and objects containing image paths
  const jsImageRegex = /["']([^"']+\/(?:images|photos|pictures|gallery)[^"']+\.(jpg|jpeg|png|webp|gif))["']/gi;
  while ((match = jsImageRegex.exec(html)) !== null) {
    imageUrls.add(match[1]);
  }
  
  // 6. Fancybox specific patterns
  const fancyboxRegex = /href=["']([^"']+)["'][^>]*class=["'][^"']*fancybox/gi;
  while ((match = fancyboxRegex.exec(html)) !== null) {
    if (match[1].match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      imageUrls.add(match[1]);
    }
  }
  
  return Array.from(imageUrls);
}

// Process URLs to get absolute paths
function processUrls(urls, baseUrl) {
  return urls.map(url => {
    // Clean up the URL
    url = url.replace(/^\.\.\//, '');
    
    // If it's already absolute, return as is
    if (url.startsWith('http')) {
      return url;
    }
    
    // Handle different relative path formats
    if (url.startsWith('/')) {
      return `https://www.chateaudevallery.com${url}`;
    } else if (url.startsWith('../')) {
      // Count how many levels up
      const levels = (url.match(/\.\.\//g) || []).length;
      const cleanUrl = url.replace(/\.\.\//g, '');
      
      // For the bedrooms page, we're at /EN/chateau-and-estate/bedrooms-accommodation/
      // So ../../../ would go to root
      if (levels >= 3) {
        return `https://www.chateaudevallery.com/${cleanUrl}`;
      } else if (levels === 2) {
        return `https://www.chateaudevallery.com/EN/${cleanUrl}`;
      } else {
        return `https://www.chateaudevallery.com/EN/chateau-and-estate/${cleanUrl}`;
      }
    } else {
      // Relative to current directory
      return `https://www.chateaudevallery.com/EN/chateau-and-estate/bedrooms-accommodation/${url}`;
    }
  });
}

// Main scraping function
async function scrapeAllHighResImages() {
  console.log('🏰 Comprehensive Château de Vallery Image Scraper\n');
  
  // Ensure directories exist
  const dirs = [
    './public/images/rooms/fullres',
    './public/images/rooms/gallery',
    './public/images/rooms/details'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Fetch both French and English versions to get all images
  const urls = [
    'https://www.chateaudevallery.com/EN/chateau-and-estate/bedrooms-accommodation/french-chateau-with-bedrooms.php',
    'https://www.chateaudevallery.com/FR/chateau-et-domaine/chambres-hebergements/chambres-et-suites-du-domaine.php'
  ];
  
  let allImageUrls = new Set();
  
  for (const url of urls) {
    console.log(`📖 Fetching: ${url}\n`);
    const html = await fetchHTML(url);
    
    // Extract all image URLs
    const imageUrls = extractAllImageUrls(html);
    const processedUrls = processUrls(imageUrls, url);
    
    processedUrls.forEach(url => allImageUrls.add(url));
    
    console.log(`Found ${imageUrls.length} images on this page\n`);
  }
  
  console.log(`📊 Total unique images found: ${allImageUrls.size}\n`);
  
  // Filter and categorize images
  const roomImages = [];
  const thumbnails = [];
  
  allImageUrls.forEach(url => {
    if (url.includes('/chambres/') || url.includes('/bedrooms/') || 
        url.includes('room') || url.includes('suite') || url.includes('chambre')) {
      
      // Check if it's a thumbnail
      if (url.includes('-m/') || url.includes('-p.') || url.includes('_thumb')) {
        thumbnails.push(url);
      } else {
        roomImages.push(url);
      }
    }
  });
  
  console.log(`🏛️ Room images: ${roomImages.length}`);
  console.log(`🖼️ Thumbnails: ${thumbnails.length}\n`);
  
  // Download all room images
  console.log('📥 Downloading high-resolution room images...\n');
  
  let successCount = 0;
  let failedCount = 0;
  
  for (const imageUrl of roomImages) {
    const filename = path.basename(imageUrl);
    const roomName = extractRoomName(filename);
    const filepath = `./public/images/rooms/fullres/${roomName}-${filename}`;
    
    console.log(`\n📸 ${filename}`);
    const result = await downloadFile(imageUrl, filepath);
    
    if (result.success && result.size > 50) {
      successCount++;
    } else {
      failedCount++;
      fs.unlink(filepath, () => {});
    }
  }
  
  // Try to get high-res versions of thumbnails
  console.log('\n\n🔄 Attempting to find high-res versions of thumbnails...\n');
  
  for (const thumbUrl of thumbnails) {
    // Try various patterns to get full-size version
    const possibleFullUrls = [
      thumbUrl.replace('-m/', '/'),
      thumbUrl.replace('-p.webp', '.webp'),
      thumbUrl.replace('-p.jpg', '.jpg'),
      thumbUrl.replace('_thumb', ''),
      thumbUrl.replace('/thumbnails/', '/'),
      thumbUrl.replace('/small/', '/large/'),
      thumbUrl.replace('/images-m/', '/images/')
    ];
    
    for (const fullUrl of possibleFullUrls) {
      if (fullUrl !== thumbUrl) {
        const filename = path.basename(fullUrl);
        const roomName = extractRoomName(filename);
        const filepath = `./public/images/rooms/fullres/${roomName}-${filename}`;
        
        if (!fs.existsSync(filepath)) {
          console.log(`\n🔍 Trying: ${filename}`);
          const result = await downloadFile(fullUrl, filepath);
          
          if (result.success && result.size > 50) {
            successCount++;
            break;
          } else {
            fs.unlink(filepath, () => {});
          }
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Download complete!`);
  console.log(`📊 Successfully downloaded: ${successCount} high-res images`);
  console.log(`❌ Failed downloads: ${failedCount}`);
  console.log('='.repeat(60));
  
  // List all downloaded files
  const downloadedFiles = fs.readdirSync('./public/images/rooms/fullres');
  console.log(`\n📁 Downloaded files (${downloadedFiles.length} total):\n`);
  
  downloadedFiles.forEach(file => {
    const stats = fs.statSync(`./public/images/rooms/fullres/${file}`);
    const sizeKB = Math.round(stats.size / 1024);
    if (sizeKB > 100) {
      console.log(`  ✓ ${file} (${sizeKB}KB)`);
    }
  });
}

// Extract room name from filename
function extractRoomName(filename) {
  const patterns = [
    /suite-nuptiale|pigeonnier/i,
    /grand-conde/i,
    /petit-conde/i,
    /henri-iv/i,
    /louis-xiii/i,
    /charlotte.*montmorency/i,
    /pierre-lescot/i,
    /loft|oriental/i,
    /sahara/i,
    /levant/i,
    /nirvana|palm.*grove/i,
    /darjeeling/i,
    /samsara/i,
    /figuier|fig.*tree/i,
    /chouette|owl/i,
    /dame.*blanche|white.*lady/i,
    /petit-duc/i,
    /grand-duc/i,
    /saint-andre|st-andre/i,
    /fauconnier|falconer/i,
    /epis/i
  ];
  
  for (const pattern of patterns) {
    if (pattern.test(filename)) {
      return filename.match(pattern)[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
  }
  
  return 'general';
}

// Run the scraper
scrapeAllHighResImages().catch(console.error);