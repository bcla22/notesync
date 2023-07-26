import 'dotenv/config';
import { watchDirectoryForPatternChanges } from './lib/fileWatcher.js';
import { syncFileToGitRepo } from './lib/syncFileToGitRepo.js';
import { validateEnvironment } from './lib/validateEnvironment.js';

function main() {
  validateEnvironment();
  watchDirectoryForPatternChanges({
    directory: process.env.REPO_DIR,
    pattern: '**/*.{md,txt}',
    onDetectChange: async filePath => {
      await syncFileToGitRepo({
        localRepoDirectory: process.env.REPO_DIR,
        filePath,
      });
    }
  });
}

main();