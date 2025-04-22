// User Investment Profile Types
// User Investment Profile Types (English only)
export type RiskTolerance = 'Conservative' | 'Moderate' | 'Aggressive';
export type InvestmentGoal = 'Growth' | 'Income' | 'Savings';
export type TimeHorizon = 'Short-term (1-3 years)' | 'Medium-term (3-10 years)' | 'Long-term (10+ years)';

export interface UserInvestmentProfile {
  age: number;
  riskTolerance: RiskTolerance;
  investmentGoal: InvestmentGoal;
  timeHorizon: TimeHorizon;
  yearsInvesting: number;
}

