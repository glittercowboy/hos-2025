// This script optimizes images for web delivery
// To use: npm install sharp && node optimize-images.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imageDir = path.join(__dirname, 'images');
const outputDir = path.join(__dirname, 'images-optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all image files
const imageFiles = fs.readdirSync(imageDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
});

// Process each image
async function processImages() {
  console.log(`Found ${imageFiles.length} images to process...`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(imageDir, file);
    const fileExt = path.extname(file);
    const fileName = path.basename(file, fileExt);
    const outputPath = path.join(outputDir, `${fileName}.webp`);
    
    try {
      // Convert to WebP format with quality optimization
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      console.log(`Optimized: ${file} -> ${fileName}.webp`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  console.log('Image optimization complete!');
  console.log('Replace image references in your CSS and HTML with the optimized versions.');
}

processImages(); 