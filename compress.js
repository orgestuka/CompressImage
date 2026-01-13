const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { glob } = require('glob');

const CONFIG = {
    quality: 80,
    effort: 6,
    smartSubsample: true,
    targetFormat: 'webp'
};

const OUTPUT_DIR_NAME = 'optimized';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(`
╔════════════════════════════════════════════════════╗
║             🖼️  High-Quality Compressor            ║
║  Drag and drop an IMAGE or FOLDER to start!        ║
╚════════════════════════════════════════════════════╝
`);

const prompt = () => {
    rl.question('\n📂 Drag image/folder here > ', async (input) => {
        let targetPath = input.trim().replace(/^['"]|['"]$/g, '').trim();
        targetPath = targetPath.replace(/\\ /g, ' ');

        if (!targetPath) {
            prompt();
            return;
        }

        if (!fs.existsSync(targetPath)) {
            console.error(`❌ Path not found: ${targetPath}`);
            prompt();
            return;
        }

        try {
            const stats = fs.statSync(targetPath);
            if (stats.isDirectory()) {
                await processDirectory(targetPath);
            } else if (stats.isFile()) {
                await processFile(targetPath);
            }
        } catch (err) {
            console.error(`❌ Error reading path:`, err);
        }

        prompt();
    });
};

async function processDirectory(dirPath) {
    console.log(`🔍 Scanning directory: ${dirPath}...`);
    const pattern = path.join(dirPath, '**/*.{jpg,jpeg,png,tiff,bmp}');

    const files = await glob(pattern.replace(/\\/g, '/'), { ignore: ['**/node_modules/**', `**/${OUTPUT_DIR_NAME}/**`] });

    if (files.length === 0) {
        console.log("⚠️  No images found in folder.");
        return;
    }

    console.log(`✨ Found ${files.length} images.`);
    for (const file of files) {
        await processFile(file);
    }
}

async function processFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.tiff', '.bmp'].includes(ext)) {
        console.log(`⏭️  Skipping non-image file: ${path.basename(filePath)}`);
        return;
    }

    const basename = path.basename(filePath, ext);
    const fileName = `${basename}.${CONFIG.targetFormat}`;

    const fileDir = path.dirname(filePath);
    const outputDir = path.join(fileDir, OUTPUT_DIR_NAME);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, fileName);

    try {
        const info = await sharp(filePath)
            .webp(CONFIG)
            .toFile(outputPath);

        const originalStats = fs.statSync(filePath);
        const originalSize = (originalStats.size / 1024).toFixed(2);
        const newSize = (info.size / 1024).toFixed(2);
        const reduction = (((originalStats.size - info.size) / originalStats.size) * 100).toFixed(1);

        console.log(`✅ ${path.basename(filePath)} \n   ${originalSize}KB ➡️  ${newSize}KB (-${reduction}%) \n   Saved to: ${OUTPUT_DIR_NAME}/${fileName}`);
    } catch (err) {
        console.error(`❌ Error processing ${path.basename(filePath)}:`, err);
    }
}

prompt();
