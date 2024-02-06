import { IssueTypes, RegexIssue } from '../../4naly3er.types';

const issue: RegexIssue = {
  regexOrAST: 'Regex',
  type: IssueTypes.GAS,
  title: 'For Operations that will not overflow, you could use unchecked',
  regex:
    /([a-z,A-Z,0-9]*-)|([a-z,A-Z,0-9]*\+)|([a-z,A-Z,0-9]*\*)|([a-z,A-Z,0-9]*\/)/g,
};

export default issue;
