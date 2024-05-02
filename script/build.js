const { execSync } = require('child_process');
const fs = require('fs');

execSync('tsc && tsc-alias');

const jsFilePath = './dist/index.js';
const shebang = '#!/usr/bin/env node\n';
const jsContent = fs.readFileSync(jsFilePath, 'utf-8');
fs.writeFileSync(jsFilePath, shebang + jsContent);

fs.chmodSync(jsFilePath, '755');
