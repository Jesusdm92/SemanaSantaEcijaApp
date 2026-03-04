const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const inputPath = path.join(__dirname, '../assets/icon.jpg');
const outputPath = path.join(__dirname, '../assets/icon-optimized.png'); // Icons should be PNG for best quality/transparency support usually, even if source was jpg.

async function optimize() {
    try {
        console.log(`Loading image from: ${inputPath}`);
        if (!fs.existsSync(inputPath)) {
            console.error('Input file does not exist!');
            process.exit(1);
        }

        const image = await loadImage(inputPath);
        console.log(`Original size: ${image.width}x${image.height}`);

        // Standard high-res icon size for stores/devices is usually 1024x1024
        const size = 1024;
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');

        // Draw image resized
        ctx.drawImage(image, 0, 0, size, size);

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        console.log(`Image optimized (1024x1024) and saved to ${outputPath}`);
    } catch (error) {
        console.error('Error optimizing image:', error);
        process.exit(1);
    }
}

optimize();
