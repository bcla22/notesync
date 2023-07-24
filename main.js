import 'dotenv/config';
import { validateEnvironment, watchDirectoryForPatternChanges } from './lib.js';

function main() {
  validateEnvironment();
  watchDirectoryForPatternChanges({
    directory: process.env.REPO_DIR,
    pattern: '**/*.txt',
  });
}

main();