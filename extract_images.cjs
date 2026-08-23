const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

// Extract menuData info using regex
const menuDataContent = fs.readFileSync('src/data/menuData.js', 'utf8');
const items = [];
const regex = /id:\s*'([^']+)',[^}]+image:\s*'([^']+)',[^}]+imagePosition:\s*'([^']+)'/g;
let match;
while ((match = regex.exec(menuDataContent)) !== null) {
    items.push({
        id: match[1],
        image: match[2],
        offsetY: Math.abs(parseInt(match[3].split(' ')[1].replace('px', ''))) || 0
    });
}

async function run() {
    const publicDir = 'public/images/menu';
    fs.mkdirSync(publicDir, { recursive: true });

    // Group by screenshot
    const byImage = {};
    for (const item of items) {
        if (!byImage[item.image]) byImage[item.image] = [];
        byImage[item.image].push(item);
    }

    for (const [imgPath, mappedItems] of Object.entries(byImage)) {
        const fullPath = path.join('D:/Starving', imgPath.replace('/images/', 'Images/'));
        console.log('Processing', fullPath);
        if (!fs.existsSync(fullPath)) {
            console.error('File not found:', fullPath);
            continue;
        }

        const img = await Jimp.read(fullPath);
        
        // Find boxes
        const boxes = [];
        let inBox = false;
        let startY = 0;
        for (let y = 0; y < img.height; y++) {
            const color = img.getPixelColor(40, y);
            // Shift manually, Jimp is ABGR or RGBA
            // Let's just check the brightness
            const r = (color >>> 24) & 255;
            const g = (color >>> 16) & 255;
            const b = (color >>> 8) & 255;
            const isLight = r > 200 && g > 200 && b > 200;
            
            if (isLight && !inBox) {
                inBox = true;
                startY = y;
            } else if (!isLight && inBox) {
                if (y - startY > 40) {
                    boxes.push({ y: startY, h: y - startY });
                }
                inBox = false;
            }
        }
        
        console.log(`Found ${boxes.length} boxes in ${path.basename(imgPath)}`);
        
        // Match items to boxes based on their offsetY
        // Since we know the offsets are just rough estimates, 
        // we can sort the items by offsetY and sort the boxes by Y,
        // but wait! Some boxes might not be used (e.g. variants).
        // Let's just assign each item to the box that minimizes the difference
        // between (box index / total boxes) and (offsetY / maxOffsetY).
        // Actually, just find the box whose center is closest to offsetY.
        // Wait, if offsetY was based on a height of ~500...
        
        for (const item of mappedItems) {
            // Find closest box
            // We know the approximate distance between items is img.height / total_items.
            // If the original developer used CSS sprite, offsetY is likely roughly proportional to Y.
            let closestBox = boxes[0];
            let minDiff = Infinity;
            
            // The original offsets were like 0, 180, 360, 540, 720.
            // Let's scale offsetY to the image height.
            // Actually, the original height of the container in the Sprite was likely exactly the screenshot height!
            // Let's just use offsetY directly as a rough Y.
            for (const box of boxes) {
                const diff = Math.abs(box.y - item.offsetY);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestBox = box;
                }
            }
            
            if (closestBox) {
                console.log(`  Mapping ${item.id} (offset ${item.offsetY}) to box at Y=${closestBox.y}`);
                const cropped = img.clone().crop({ x: 15, y: closestBox.y, w: 80, h: Math.min(80, closestBox.h) });
                const outPath = path.join(publicDir, `${item.id}.png`);
                await cropped.write(outPath);
            }
        }
    }
}

run().catch(console.error);
