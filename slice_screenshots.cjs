const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const inputDir = 'd:/Starving/Images/Menu';
const outputDir = 'd:/Starving/public/images/menu_crops';
fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter(f => f.startsWith('Screenshot') && f.endsWith('.png'));

async function run() {
    for (const file of files) {
        const filePath = path.join(inputDir, file);
        const img = await Jimp.read(filePath);
        
        // We know the images are lists of items. Each item is roughly 93-95 pixels tall.
        // Let's just slice the left 100x100 of the image from top to bottom every 94 pixels.
        const numItems = Math.round(img.height / 94);
        
        for (let i = 0; i < numItems; i++) {
            const y = Math.min(i * 94 + 10, img.height - 80);
            const cropped = img.clone().crop({ x: 15, y: y, w: 80, h: 80 });
            
            const baseName = path.basename(file, '.png');
            const outName = `${baseName}_${i + 1}.png`;
            await cropped.write(path.join(outputDir, outName));
        }
        console.log(`Sliced ${file} into ${numItems} images.`);
    }
}

run().catch(console.error);
