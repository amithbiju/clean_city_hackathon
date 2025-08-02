export interface User {
  id: string;
  name: string;
  email: string;
  greenPoints: number;
  role: 'user' | 'admin';
  avatar?: string;
  joinedAt: string;
}

export interface Dustbin {
  id: string;
  latitude: number;
  longitude: number;
  status: 'empty' | 'filled';
  lastUpdated: string;
  updatedBy?: string;
  address: string;
}

export interface WasteReport {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  address: string;
  beforeImage: string;
  afterImage?: string;
  status: 'pending' | 'self_cleaned' | 'submitted_to_authority' | 'completed';
  reportedAt: string;
  completedAt?: string;
  description: string;
  cleanupType: 'self_clean' | 'submit_to_authority';
  pointsAwarded: number;
}

export interface CleanupDrive {
  id: string;
  communityName: string;
  userId: string;
  latitude: number;
  longitude: number;
  address: string;
  beforeImage: string;
  afterImage?: string;
  status: 'adopted' | 'completed' | 'approved';
  adoptedAt: string;
  completedAt?: string;
  approvedAt?: string;
  pointsAwarded: number;
  description: string;
}

export interface PartnerStore {
  id: string;
  name: string;
  logo: string;
  category: string;
  offers: Offer[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  validUntil: string;
  image: string;
}

export interface PointTransaction {
  id: string;
  userId: string;
  points: number;
  type: 'earned' | 'redeemed';
  description: string;
  timestamp: string;
  relatedId?: string;
}