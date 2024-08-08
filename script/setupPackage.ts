import fs from 'fs';
import path from 'path';

function main() {
  const cwd = process.cwd();
  const pacakgeJsonSourcePath = path.join(cwd, 'package.json');
  const pakcageJsonDestPath = path.join(cwd, 'dist', 'package.json');
  const gitignoreSourcePath = path.join(cwd, '.gitignore');
  const gitignoreDestPath = path.join(cwd, 'dist', '.gitignore');

  const pacakgeJsonSource = fs.readFileSync(pacakgeJsonSourcePath, 'utf-8');
  const packageJsonObj = JSON.parse(pacakgeJsonSource);

  // clear scripts and devDependencies
  packageJsonObj.scripts = {};
  packageJsonObj.devDependencies = {};

  // adjust main
  if (packageJsonObj.main.startsWith('./dist/')) {
    packageJsonObj.main = packageJsonObj.main.replace('./dist/', '');
  }
  // adjust bin
  if (packageJsonObj.bin?.gitip?.startsWith('./dist/')) {
    packageJsonObj.bin = { ...packageJsonObj.bin, gitip: packageJsonObj.bin?.gitip?.replace('./dist/', '') };
  }

  // generate package.json into dist
  fs.writeFileSync(pakcageJsonDestPath, JSON.stringify(packageJsonObj, null, 2), 'utf-8');

  // copy .gitignore into dist
  fs.copyFileSync(gitignoreSourcePath, gitignoreDestPath);
}

main();
