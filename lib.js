
import git from 'isomorphic-git'
import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import { hostname } from 'os'


/**
 * Ensure envs are set before running
 * @returns {void}
 */
export function validateEnvironment() {
  const requiredEnvs = ['GIT_REPO', 'GIT_USERNAME', 'GIT_EMAIL', 'GIT_TOKEN', 'REPO_DIR'];
  const missingEnvs = [];

  requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
      missingEnvs.push(env);
    }
  });

  if (missingEnvs.length) {
    console.log('Required envs are missing, please add them to your .env:');
    missingEnvs.forEach((env) => {
      console.log('  -', env);
    });
    process.exit(1);
  }
}

/**
 * Options for pushing to a git repo
 * @typedef {{ directory: string, filepath: string; branch?: string; }} AddCommitAndPushOptions
 */

/**
 * Sync a file to a git repo
 * @param {AddCommitAndPushOptions} options
 */
export async function addCommitAndPush({ directory, filepath, branch = 'main' }) {
  console.assert(typeof directory === 'string', 'dir is not a string');
  console.assert(typeof filepath === 'string', 'filepath is not a string');
  console.log('Adding', filepath, 'to git repo ', directory, 'on branch', branch);

  filepath = filepath.trim();

  await git.add({ fs, directory, filepath });
  // await git.commit({
  //   fs,
  //   dir: directory,
  //   author: {
  //     username: process.env.GIT_USERNAME,
  //     email: process.env.GIT_EMAIL,
  //   },
  //   message: `Synced notes from ${hostname()}`
  // });
  // await git.push({
  //   fs,
  //   dir: directory,
  //   remote: 'origin',
  //   ref: branch,
  //   token: process.env.GIT_TOKEN,
  // });
}

/**
 * Options for watching a directory for changes
 * @typedef {{ directory: string, pattern: string }} WatchDirectoryForPatternChangesOptions
 */

/**
 * Watch a directory for changes to a pattern
 * @param {WatchDirectoryForPatternChangesOptions} options - Directory and glob pattern to watch
 * @returns {void}
 */
export function watchDirectoryForPatternChanges({ directory, pattern }) {
  console.assert(typeof directory === 'string', 'directory is not a string');
  console.assert(typeof pattern === 'string', 'pattern is not a string');

  const watcher = chokidar.watch(pattern, {
    cwd: directory,
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  console.log('Watching', directory, 'for changes to', pattern)

  watcher.on('add', async (filepath) => {
    console.log('adding ', filepath)
    await addCommitAndPush({ directory, filepath });
  });

  watcher.on('change', async (filepath) => {
    console.log('changing ', filepath)
    await addCommitAndPush({ directory, filepath });
  });

  watcher.on('unlink', async (filepath) => {
    console.log('removing ', filepath)
    await addCommitAndPush({ directory, filepath });
  });
}