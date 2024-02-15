import { Issue } from '../4naly3er.types';
import { recursiveExploration } from '../4naly3er.utils';
import * as path from 'path';

const fileNames = recursiveExploration(__dirname + '/', '.js');

const issues: Issue[] = [];
for (let file of fileNames) {
  file = path.join(__dirname, file);
  if (file !== __filename) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    issues.push(require(file).default);
  }
}

export default issues;
