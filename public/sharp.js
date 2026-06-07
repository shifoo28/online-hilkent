import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./public/optimize";
const outputDir = "./public/images/hero";

fs.readdirSync(inputDir).forEach((file) => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file.replace(/\.[^.]+$/, ".webp"));

  sharp(inputPath)
    .resize(512, 512, { fit:"inside"}) // normalize to square
    .toFormat("webp", { quality: 80 })
    .toFile(outputPath)
    .then(() => console.log(`✅ Optimized: ${file}`))
    .catch((err) => console.error(`❌ Error: ${file}`, err));
});
