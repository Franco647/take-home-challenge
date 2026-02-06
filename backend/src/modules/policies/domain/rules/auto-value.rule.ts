import { BusinessRule, RuleError } from './business-rule.base.js';

export class AutoMinInsuredValueRule extends BusinessRule {
  validate(row: any): RuleError | null {
    if (row.policy_type === 'Auto' && parseFloat(row.insured_value_usd) < 10000) {
      return {
        field: 'insured_value_usd',
        code: 'AUTO_VALUE_TOO_LOW',
        message: 'El valor asegurado para Autos debe ser mayor o igual a 10000 USD'
      };
    }
    return null;
  }
}