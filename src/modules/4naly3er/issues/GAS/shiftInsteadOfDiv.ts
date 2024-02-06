import { IssueTypes, RegexIssue } from '../../4naly3er.types';

const issue: RegexIssue = {
  regexOrAST: 'Regex',
  type: IssueTypes.GAS,
  title: 'Use shift Right/Left instead of division/multiplication if possible',
  regex: /\n[^\/\n]*\/[^\/]?[248]+/g,
  startLineModifier: 1,
};

export default issue;
