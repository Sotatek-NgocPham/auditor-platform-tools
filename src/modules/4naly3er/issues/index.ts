import { Issue } from '../4naly3er.types';
import { recursiveExploration } from '../4naly3er.utils';
import path from 'path';

const fileNames = recursiveExploration(__dirname + '/', '.ts');

const issues: Issue[] = [];
for (let file of fileNames) {
  file = path.join(__dirname, file);
  if (file !== __filename) {
    issues.push(require(file).default);
  }
}

export default issues;
