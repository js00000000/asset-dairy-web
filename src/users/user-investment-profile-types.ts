// User Investment Profile Types
// Max acceptable short-term loss as a percentage (e.g., 20 for 20%)
export type MaxAcceptableShortTermLossPercentage = number;
// Expected annualized rate of return as a percentage (e.g., 8 for 8%)
export type ExpectedAnnualizedRateOfReturn = number;
export type TimeHorizon = 'Short-term (1-3 years)' | 'Medium-term (3-10 years)' | 'Long-term (10+ years)';

export interface UserInvestmentProfile {
  age: number;
  maxAcceptableShortTermLossPercentage: MaxAcceptableShortTermLossPercentage;
  expectedAnnualizedRateOfReturn: ExpectedAnnualizedRateOfReturn;
  timeHorizon: TimeHorizon;
  yearsInvesting: number;
}

