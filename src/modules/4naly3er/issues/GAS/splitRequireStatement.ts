import { IssueTypes, RegexIssue } from '../../4naly3er.types';

const issue: RegexIssue = {
  regexOrAST: 'Regex',
  type: IssueTypes.GAS,
  title: 'Splitting require() statements that use && saves gas',
  regex: /require\(.*&&.*\);/g,
};

export default issue;
