# Image Compressor 🖼️

A dead simple, drag-and-drop tool to squeeze your images into high-quality WebP files.

I built this because I needed a fast way to compress assets for the web without uploading them to a third-party service or installing heavy GUI apps. It uses `sharp` under the hood, so it's incredibly fast and the quality is top-tier.

## Features
- **Drag & Drop**: Just drag your image — or an entire folder — into the terminal.
- **Deep Scanning**: Recursively finds every image in nested folders.
- **Smart Compression**: Converts to WebP (Quality: 80) with smart subsampling. expect ~80-95% size reduction with virtually no visual loss.
- **Non-Destructive**: Saves optimized versions in a neat `optimized` subfolder next to your originals.

## Usage

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run it**
   ```bash
   node compress.js
   ```

3. **Drag and drop**
   When prompted, just drag your file or folder into the terminal window and hit Enter.

## Tech
- **Node.js**
- **Sharp** (libvips)
- **Glob**

Enjoy! 🚀
# CompressImage
