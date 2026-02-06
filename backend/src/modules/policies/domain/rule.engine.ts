import { BusinessRule, RuleError } from './rules/business-rule.base.js';

export class RuleEngine {
  constructor(private rules: BusinessRule[]) {}

  execute(policy: any): RuleError[] {
    const errors: RuleError[] = [];
    
    for (const rule of this.rules) {
      const error = rule.validate(policy);
      if (error) {
        errors.push(error);
      }
    }
    
    return errors;
  }
}