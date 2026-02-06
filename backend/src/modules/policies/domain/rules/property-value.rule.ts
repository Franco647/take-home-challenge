import { BusinessRule, RuleError } from './business-rule.base.js';

export class PropertyMinInsuredValueRule extends BusinessRule {
  validate(row: any): RuleError | null {
    if (row.policy_type === 'Property' && parseFloat(row.insured_value_usd) < 5000) {
      return {
        field: 'insured_value_usd',
        code: 'PROPERTY_VALUE_TOO_LOW',
        message: 'El valor asegurado para Propiedad debe ser mayor o igual a 5000 USD'
      };
    }
    return null;
  }
}