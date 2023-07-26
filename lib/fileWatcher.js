
import chokidar from 'chokidar';
import { isAsyncFunction } from './utils.js';

/**
 * Options for watching a directory for changes
 * @typedef {Object} WatchDirectoryForPatternChangesOptions
 * @property {string} directory - Directory to watch
 * @property {string} pattern - Glob pattern to watch
 * @property {(filepath: string) => void} onDetectChange - Callback to run when a change is detected
 */

/**
 * Watch a directory for changes to a pattern
 * @param {WatchDirectoryForPatternChangesOptions} options
 * @returns {void}
 */
export function watchDirectoryForPatternChanges({ directory, pattern, onDetectChange }) {
  console.assert(typeof directory === 'string', 'directory is not a string');
  console.assert(typeof pattern === 'string', 'pattern is not a string');
  console.assert(typeof onDetectChange === 'function', 'onDetectChange is not a function');

  if (!onDetectChange) {
    onDetectChange = (filePath) => console.log('Detected change to', filePath, 'but no callback was provided');
  }

  const watcher = chokidar.watch(pattern, {
    cwd: directory,
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
    interval: 2000, // milliseconds
  });

  console.log(`Watching ${directory} for changes to ${pattern}\n`);

  watcher.on('all', (_, filePath) => onDetectChange(filePath));
}