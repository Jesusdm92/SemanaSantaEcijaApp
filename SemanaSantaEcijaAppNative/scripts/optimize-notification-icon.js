const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const inputPath = path.join(__dirname, '../assets/images/notificacion.png');
const outputPath = path.join(__dirname, '../assets/notification-icon.png');

async function optimize() {
    try {
        console.log(`Loading image from: ${inputPath}`);
        if (!fs.existsSync(inputPath)) {
            console.error('Input file does not exist!');
            process.exit(1);
        }

        const image = await loadImage(inputPath);
        console.log(`Original size: ${image.width}x${image.height}`);

        const size = 96; // 96x96 is standard for xxhdpi
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');

        // Draw image resized
        ctx.drawImage(image, 0, 0, size, size);

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        console.log(`Image optimized (96x96) and saved to ${outputPath}`);
    } catch (error) {
        console.error('Error optimizing image:', error);
        process.exit(1);
    }
}

optimize();
