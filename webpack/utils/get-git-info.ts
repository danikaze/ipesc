import { execSync } from 'child_process';

interface GitInfo {
  rev: string;
  shortRev: string;
}

export function getGitInfo(onError: string = ''): GitInfo {
  try {
    const rev = execSync('git rev-parse HEAD').toString().trim();
    const shortRev = execSync('git rev-parse --short HEAD').toString().trim();
    return {
      rev,
      shortRev,
    };
  } catch (e) {
    return {
      rev: onError,
      shortRev: onError,
    };
  }
}
