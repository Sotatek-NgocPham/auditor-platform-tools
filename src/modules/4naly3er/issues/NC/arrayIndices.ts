import { findAll } from 'solidity-ast/utils';
import {
  ASTIssue,
  InputType,
  Instance,
  IssueTypes,
} from '../../4naly3er.types';
import { instanceFromSRC } from '../../4naly3er.utils';

const issue: ASTIssue = {
  regexOrAST: 'AST',
  type: IssueTypes.NC,
  title:
    'Array indices should be referenced via `enum`s rather than via numeric literals',
  detector: (files: InputType): Instance[] => {
    const instances: Instance[] = [];

    for (const file of files) {
      if (!!file.ast) {
        for (const indexAccess of findAll('IndexAccess', file.ast)) {
          if (indexAccess.indexExpression?.nodeType === 'Literal') {
            instances.push(instanceFromSRC(file, indexAccess.src));
          }
        }
      }
    }
    return instances;
  },
};

export default issue;
