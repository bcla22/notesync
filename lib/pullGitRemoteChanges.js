import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node/index.cjs';

/**
 * Options for pulling from a Git reop
 * @typedef {Object} PullGitRemoteChangesOptions
 * @property {string} localRepoDirectory - Local directory path of the git repo
 * @property {string} branch - Branch to pull from
 * @returns {void}
 */

/**
 * Pull latest changes from git
 * @param {PullGitRemoteChangesOptions} options
 */
export async function pullGitRemoteChanges({ localRepoDirectory, filePath, branch = 'main' }) {
  console.assert(typeof localRepoDirectory === 'string', 'dir is not a string');
  console.assert(typeof filePath === 'string', 'filePath is not a string');
  console.log('Adding', filePath, 'to git repo ', localRepoDirectory, 'on branch', branch);

  const remoteUrl = await git.getConfig({ fs, dir: localRepoDirectory, path: 'remote.origin.url' });
  console.assert(typeof remoteUrl === 'string', 'git repo does not have a remote configured');
  console.assert(!String(remoteUrl).startsWith('git@'), 'git remote url should use http and not ssh');

  try {
    await git.pull({
      fs,
      http,
      dir: localRepoDirectory,
      ref: branch,
      singleBranch: true,
    })
  } catch (e) {
    console.log('Failed to pull changes from remote: ', e);
    return;
  }

  console.log('Successfully pulled changes from remote');
}
