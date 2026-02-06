export interface RuleError {
  code: string;
  field: string;
  message: string;
}

export abstract class BusinessRule {
  abstract validate(policy: any): RuleError | null;
}