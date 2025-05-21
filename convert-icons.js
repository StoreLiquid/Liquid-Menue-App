const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceDir = path.join(__dirname, 'public', 'icons');
const destDir = path.join(__dirname, 'public', 'icons');

// Ensure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function convertToPng() {
  try {
    // Define conversion tasks with source SVG, sizes, and output filenames
    const conversionTasks = [
      {
        source: 'app-icon.svg',
        sizes: [192, 512],
        outputTemplate: 'app-icon-{size}.png'
      },
      {
        source: 'logo-rund.svg',
        sizes: [192, 512],
        outputTemplate: 'logo-rund-{size}.png'
      },
      {
        source: 'smartphone-icon.svg',
        sizes: [192, 512],
        outputTemplate: 'smartphone-icon-{size}.png'
      },
      {
        source: 'smartphone-icon-512.svg',
        sizes: [512],
        outputTemplate: 'smartphone-icon-512.png'
      },
      {
        source: 'tablet-icon.svg',
        sizes: [512, 1024],
        outputTemplate: 'tablet-icon-{size}.png'
      },
      {
        source: 'tablet-icon-1024.svg',
        sizes: [1024],
        outputTemplate: 'tablet-icon-1024.png'
      }
    ];

    // Process each conversion task
    for (const task of conversionTasks) {
      const sourcePath = path.join(sourceDir, task.source);
      if (fs.existsSync(sourcePath)) {
        for (const size of task.sizes) {
          const outputFilename = task.outputTemplate.replace('{size}', size);
          await sharp(sourcePath)
            .resize(size, size)
            .toFile(path.join(destDir, outputFilename));
          console.log(`Converted: ${outputFilename}`);
        }
      } else {
        console.log(`Source file not found: ${task.source}`);
      }
    }

    console.log('All icons successfully converted!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

convertToPng(); 