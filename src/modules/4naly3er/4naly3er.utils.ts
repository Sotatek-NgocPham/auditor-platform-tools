import { InputType, Instance } from './4naly3er.types';
import * as fs from 'fs';
import { findAll } from 'solidity-ast/utils';
import { ContractDefinition } from 'solidity-ast';
import { exec } from 'child_process';
import * as path from 'node:path';

/**
 * @notice Returns the line corresponding to a character index in a file
 */
export const lineFromIndex = (file: string, index: number) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  return 1 + [...file?.slice(0, index).matchAll(/\n/g)!].length;
};

/**
 * @notice Builds an instance for the report from a file and a src
 * @param src Must be in format xx:xx:xx
 */
export const instanceFromSRC = (
  file: InputType[0],
  start: string,
  end?: string,
): Instance => {
  return {
    fileName: file.name,
    fileContent: file.content,
    line: lineFromIndex(file.content, parseInt(start.split(':')[0])),
    endLine: !!end
      ? lineFromIndex(file.content, parseInt(end.split(':')[0]))
      : undefined,
  };
};

/**
 * @notice Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
export async function sh(cmd: string) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

/**
 * @notice Returns all file contained in a folder
 * @dev Works with a queue, could be done with a recursive function
 */
export const recursiveExploration = (
  basePath: string,
  extension = '.sol',
): string[] => {
  const fileNames = [];
  const directoryQueue = [''];
  while (directoryQueue.length > 0) {
    const dir = directoryQueue.pop();
    const tempFileNames = fs.readdirSync(path.join(basePath, dir));
    for (let fileName of tempFileNames) {
      fileName = `${dir}${fileName}`;
      if (fileName === 'node_modules') {
        continue;
      }
      if (fileName.endsWith(extension)) {
        fileNames.push(fileName);
      } else if (fs.statSync(path.join(basePath, fileName)).isDirectory()) {
        directoryQueue.push(fileName + '/');
      }
    }
  }
  return fileNames;
};

/**
 * @notice Extract files extending a given contract
 */
export const topLevelFiles = (
  contractId: number,
  files: InputType,
): InputType => {
  const res: InputType = [];
  for (const file of files) {
    if (!!file.ast) {
      for (const contract of findAll('ContractDefinition', file.ast)) {
        if (
          contract?.contractKind === 'contract' &&
          contract?.linearizedBaseContracts?.includes(contractId) &&
          contract?.id !== contractId
        ) {
          if (!res?.includes(file)) {
            res.push(file);
            continue;
          }
        }
      }
    }
  }
  return res;
};

/**
 * @notice Extracts storage variables from a contract
 */
export const getStorageVariable = (contract: ContractDefinition): string[] => {
  /** Build list of storage variables */
  let storageVariables = [...findAll('VariableDeclaration', contract)]
    .filter(
      (e) =>
        (e.storageLocation === 'default' || e.storageLocation === 'storage') &&
        e.mutability === 'mutable',
    )
    .map((e) => e.name);
  /** Remove function variables */
  for (const func of findAll('FunctionDefinition', contract)) {
    const funcVariables = [...findAll('VariableDeclaration', func)].map(
      (e) => e.name,
    );
    storageVariables = storageVariables.filter(
      (e) => !funcVariables.includes(e),
    );
  }
  /** Remove event variables */
  for (const func of findAll('EventDefinition', contract)) {
    const funcVariables = [...findAll('VariableDeclaration', func)].map(
      (e) => e.name,
    );
    storageVariables = storageVariables.filter(
      (e) => !funcVariables.includes(e),
    );
  }
  /** Remove error variables */
  for (const func of findAll('ErrorDefinition', contract)) {
    const funcVariables = [...findAll('VariableDeclaration', func)].map(
      (e) => e.name,
    );
    storageVariables = storageVariables.filter(
      (e) => !funcVariables.includes(e),
    );
  }
  return storageVariables;
};

export const gitUrlToSsh = (url: string) => {
  const regex =
    /^(https?:\/\/)?github\.com\/([a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+)(\/?)$/;

  const match = url.match(regex);
  if (match && match.length === 4) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, protocol, repoPath, trailingSlash] = match;

    const formattedRepoPath = repoPath.endsWith('/')
      ? repoPath.slice(0, -1)
      : repoPath;
    const [username, projectName] = formattedRepoPath.split('/');

    return [`git@github.com:${formattedRepoPath}.git`, username, projectName];
  } else {
    return [];
  }
};
