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
  title: 'Functions not used internally could be marked external',
  detector: (files: InputType): Instance[] => {
    const instances: Instance[] = [];

    for (const file of files) {
      if (!!file.ast) {
        for (const node of findAll('FunctionDefinition', file.ast)) {
          if (
            node.visibility === 'public' &&
            !node.virtual &&
            node.name !== ''
          ) {
            const functionName = node.name;
            let usedInternally = false;
            for (const functionCall of findAll('FunctionCall', file.ast)) {
              if (
                functionCall.expression.nodeType === 'Identifier' &&
                functionCall.expression.name === functionName
              ) {
                usedInternally = true;
              }
            }
            if (!usedInternally) {
              instances.push(instanceFromSRC(file, node.src));
            }
          }
        }
      }
    }
    return instances;
  },
};

export default issue;
