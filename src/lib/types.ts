export type TeamMember = {
  name: string
  handle: string
}

export type Project = {
  productName: string
  oneLiner: string
  description: string
  state: string
  track: string
  bannerUrl: string
  logoUrl: string
  twitter?: string
  website?: string
  telegram?: string
  documentation?: string
  wallet?: string
  community?: string
  team: TeamMember[]
}


export type User = {
  uuid: string;
  walletAddress: string;
  role: "USER";
  createdAt: Date
}

type ProductDataRole = "PENDING" | "DECLINED" | "PUBLISHED";

export type ProductData = {
  uuid: string;
  id: string;
  name: string;
  bDescription: string;
  description: string;
  logoURI: string;
  state: string;
  track: string;
  walletAddress: string;
  twitterURL?: string;
  telegramURL?: string;
  websiteURL?: string;
  status: ProductDataRole;
  documentationURL: string;
  bannerURI: string;
  teamMembers: Array<ProductTeamMembers>;
  milestones?: Array<ProductMilestones>;
  achievements?: Array<ProductAchievements>;
}

export type ProductTeamMembers = { 
  name: string; 
  xHandle: string 
}

export type ProductMilestones = { 
  title: string; 
  description: string;
  startDate: string;
  endDate: string; 
}

export type ProductAchievements = {
  description: string;
}

export interface UserApiResponse {
  status: boolean;
  data: User;
}

export interface ProductApiResponse {
  status: boolean;
  data: ProductData;
}