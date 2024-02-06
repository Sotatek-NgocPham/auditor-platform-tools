import { IssueTypes, RegexIssue } from '../../4naly3er.types';

const issue: RegexIssue = {
  regexOrAST: 'Regex',
  type: IssueTypes.L,
  title: 'Unsafe ERC20 operation(s)',
  regex: /\.transfer\(|\.transferFrom\(|\.approve\(/g,
};

export default issue;
