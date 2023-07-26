
import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node/index.cjs';
import { hostname } from 'os';

/**
 * Options for pushing to a Git reop
 * @typedef {Object} SyncFileToGitRepoOptions
 * @property {string} localRepoDirectory - Local directory path of the git repo
 * @property {string} filePath - Relative file path in repo to sync
 * @property {string} branch - Branch to push to
 * @returns {void}
 */

/**
 * Sync a file to a git repo
 * @param {SyncFileToGitRepoOptions} options
 */
export async function syncFileToGitRepo({ localRepoDirectory, filePath, branch = 'main' }) {
  console.assert(typeof localRepoDirectory === 'string', 'dir is not a string');
  console.assert(typeof filePath === 'string', 'filePath is not a string');
  console.assert(typeof branch === 'string', 'branch is not a string');

  const remoteUrl = await git.getConfig({ fs, dir: localRepoDirectory, path: 'remote.origin.url' });
  console.assert(typeof remoteUrl === 'string', 'git repo does not have a remote configured');
  console.assert(!String(remoteUrl).startsWith('git@'), 'git remote url should use http and not ssh');

  const commitAuthor = `notesync:${hostname()}`;

  try {
    await git.add({
      fs,
      dir: localRepoDirectory,
      filepath: filePath,
    });
  } catch (e) {
    console.log('Failed to stage changes: ', e);
    return;
  }

  try {
    await git.commit({
      fs,
      dir: localRepoDirectory,
      author: {
        name: commitAuthor,
        email: String(process.env.GIT_EMAIL)
      },
      message: `Synced ${filePath} from ${hostname()}`,
    });
  } catch (e) {
    console.log('Failed to commit changes: ', e);
    return;
  }

  try {
    await git.push({
      fs,
      http,
      dir: localRepoDirectory,
      remote: 'origin',
      ref: branch,
      onAuth: () => ({
        username: String(process.env.GIT_TOKEN),
        password: String(process.env.GIT_TOKEN),
      }),
    });
  } catch (e) {
    console.log('Failed to push changes: ', e);
    return;
  }

  console.log(`Synced ${filePath} to ${remoteUrl} (branch: ${branch})`);
}
