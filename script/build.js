const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

execSync('tsc && tsc-alias');

const jsFilePath = './dist/index.js';
const shebang = '#!/usr/bin/env node\n';
const jsContent = fs.readFileSync(jsFilePath, 'utf-8');
fs.writeFileSync(jsFilePath, shebang + jsContent);

fs.chmodSync(jsFilePath, '755');

// json 복사
const srcDir = './src/lib/Spinner';
const distDir = './dist/lib/Spinner';

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach((file) => {
  const srcFile = path.join(srcDir, file);
  const distFile = path.join(distDir, file);
  fs.copyFileSync(srcFile, distFile);
});
