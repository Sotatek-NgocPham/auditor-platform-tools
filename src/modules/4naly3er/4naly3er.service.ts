import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import { gitUrlToSsh, recursiveExploration } from './4naly3er.utils';
import { InputType, IssueTypes } from './4naly3er.types';
import compileAndBuildAST from './4naly3er.compile';
import path from 'node:path';
import analyze from './4naly3er.analyze';
import issues from './issues';
import { simpleGit } from 'simple-git';
import { rimrafSync } from 'rimraf';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

@Injectable()
export class _4naly3erService {
  private readonly logger = new Logger(_4naly3erService.name);

  /**
   * @param basePath Path were the contracts lies
   * @param scopeFile .txt file containing the contest scope
   * @param githubLink github url to generate links to code
   * @param out where to save the report
   * @param scope optional text containing the .sol files in scope. Replaces `scopeFile`
   */
  async generateReport(
    basePath: string,
    scopeFile: string | null,
    githubLink: string | null,
    scope?: string,
    out?: string,
  ) {
    let result = '# Report\n\n';
    let fileNames: string[] = [];

    if (!!scopeFile || !!scope) {
      // Scope is specified in a .txt file or is passed in a string
      const content =
        scope ??
        fs.readFileSync(scopeFile as string, { encoding: 'utf8', flag: 'r' });
      for (const word of [...content.matchAll(/[a-zA-Z\/\.\-\_0-9]+/g)].map(
        (r) => r[0],
      )) {
        if (word.endsWith('.sol') && fs.existsSync(`${basePath}${word}`)) {
          fileNames.push(word);
        }
      }
      if (fileNames.length === 0) throw Error('Scope is empty');
    } else {
      // Scope is not specified: exploration of the folder
      fileNames = recursiveExploration(basePath);
    }

    // console.log('Scope: ', fileNames);

    // Uncomment next lines to have the list of analyzed files in the report

    result += '## Files analyzed\n\n';
    fileNames.forEach((fileName) => {
      result += ` - ${fileName}\n`;
    });

    // Read file contents and build AST
    const files: InputType = [];
    const asts = await compileAndBuildAST(basePath, fileNames);
    fileNames.forEach((fileName, index) => {
      files.push({
        content: fs.readFileSync(path.join(basePath, fileName), {
          encoding: 'utf8',
          flag: 'r',
        }),
        name: fileName,
        ast: asts[index],
      });
    });

    for (const t of Object.values(IssueTypes)) {
      result += analyze(
        files,
        issues.filter((i) => i.type === t),
        !!githubLink ? githubLink : undefined,
      );
    }

    if (!out) {
      return result;
    }
    fs.writeFileSync(out, result);
  }

  async analyze(github: string, scope?: string) {
    const [gitSsh, gitUser, gitProject] = gitUrlToSsh(github);
    const projectPath = path.join(
      __dirname,
      'github-projects',
      gitUser,
      gitProject,
    );

    if (!gitSsh || !projectPath) {
      console.error('Github url is not valid');
      return;
    }

    try {
      await simpleGit().clone(gitSsh, projectPath);
      this.logger.log(
        `Repository ${gitUser}/${gitProject} cloned successfully!`,
      );
    } catch (error) {
      console.error(
        `Error cloning repository ${gitUser}/${gitProject}:`,
        error,
      );
      return;
    }

    const npmInstallCommand = 'npm install';
    try {
      const { stdout, stderr } = await exec(npmInstallCommand, {
        cwd: projectPath,
      });
      this.logger.log(`stdout: ${stdout}`);
      this.logger.error(`stderr: ${stderr}`);
    } catch (error: any) {
      this.logger.error(`Error: ${error.message}`);
      return;
    }
    const result = await this.generateReport(projectPath, ``, github, scope);

    rimrafSync(projectPath);
    this.logger.log(`Remove ${gitUser}/${gitProject} folder successfully`);

    return result;
  }
}
