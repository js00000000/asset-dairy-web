// Unified User type for the entire app
import type { UserInvestmentProfile } from './user-investment-profile-types';
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  username: string;
  investmentProfile?: UserInvestmentProfile;
}
