import { IssueTypes, RegexIssue } from '../../4naly3er.types';

const issue: RegexIssue = {
  regexOrAST: 'Regex',
  type: IssueTypes.L,
  title: 'Unspecific compiler version pragma',
  regex: /pragma solidity (\\^|>)[0-9\.]*/g,
};

export default issue;
