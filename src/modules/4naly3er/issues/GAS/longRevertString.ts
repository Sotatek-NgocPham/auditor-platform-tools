import { IssueTypes, RegexIssue } from '../../4naly3er.types';

const issue: RegexIssue = {
  regexOrAST: 'Regex',
  type: IssueTypes.GAS,
  title: 'Long revert strings',
  regex: /(revert|require)\(.*,?.(\"|\').{33,}(\"|\')\)/g,
};

export default issue;
