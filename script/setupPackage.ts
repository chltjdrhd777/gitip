import fs from 'fs';
import path from 'path';

function main() {
  const cwd = process.cwd();

  const getSourcePath = (paths: string[]) => path.join(cwd, ...paths);
  const getDestPath = (paths: string[]) => path.join(cwd, 'dist', ...paths);

  const packageJsonFileName = 'package.json';
  const gitignoreFileName = '.gitignore';
  const readmeFileName = 'README.md';

  const pacakgeJsonSourcePath = getSourcePath([packageJsonFileName]);
  const pakcageJsonDestPath = getDestPath([packageJsonFileName]);
  const gitignoreSourcePath = getSourcePath([gitignoreFileName]);
  const gitignoreDestPath = getDestPath([gitignoreFileName]);
  const readmeSourcePath = getSourcePath([readmeFileName]);
  const readmeDestPath = getDestPath([readmeFileName]);

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

  // copy README.md into dist
  fs.copyFileSync(readmeSourcePath, readmeDestPath);
}

main();
