import { exec } from 'child_process';

export function checkBranchExistence(branchName: string) {
  return new Promise((resolve, reject) => {
    exec(`git show-ref --verify --quiet refs/heads/${branchName}`, (error) => {
      if (error && error.code === 1) {
        resolve(false);
      } else if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}
