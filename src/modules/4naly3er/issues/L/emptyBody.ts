import { IssueTypes, RegexIssue } from '../../4naly3er.types';

const issue: RegexIssue = {
  regexOrAST: 'Regex',
  type: IssueTypes.L,
  title: 'Empty Function Body - Consider commenting why',
  regex: /(\{\})|(\{ \})/g,
};

export default issue;
