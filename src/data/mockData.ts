import { User, Dustbin, WasteReport, CleanupDrive, PartnerStore, PointTransaction } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    greenPoints: 450,
    role: 'user',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    greenPoints: 650,
    role: 'user',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@cleancity.com',
    greenPoints: 0,
    role: 'admin',
    joinedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockDustbins: Dustbin[] = [
  {
    id: '1',
    latitude: 8.5241,
    longitude: 76.9366,
    status: 'empty',
    lastUpdated: '2024-01-25T10:00:00Z',
    updatedBy: '1',
    address: 'Secretariat, Thiruvananthapuram, Kerala'
  },
  {
    id: '2',
    latitude: 8.5074,
    longitude: 76.9570,
    status: 'filled',
    lastUpdated: '2024-01-25T09:30:00Z',
    updatedBy: '2',
    address: 'Technopark, Thiruvananthapuram, Kerala'
  },
  {
    id: '3',
    latitude: 8.5167,
    longitude: 76.9558,
    status: 'empty',
    lastUpdated: '2024-01-25T11:15:00Z',
    updatedBy: '1',
    address: 'Palayam, Thiruvananthapuram, Kerala'
  },
  {
    id: '4',
    latitude: 8.4855,
    longitude: 76.9492,
    status: 'filled',
    lastUpdated: '2024-01-25T08:45:00Z',
    updatedBy: '2',
    address: 'Kovalam Beach, Thiruvananthapuram, Kerala'
  },
  {
    id: '5',
    latitude: 8.5380,
    longitude: 76.9210,
    status: 'empty',
    lastUpdated: '2024-01-25T12:30:00Z',
    updatedBy: '1',
    address: 'Vellayani Lake, Thiruvananthapuram, Kerala'
  },
  {
    id: '6',
    latitude: 8.5622,
    longitude: 76.8820,
    status: 'filled',
    lastUpdated: '2024-01-25T07:20:00Z',
    updatedBy: '2',
    address: 'Neyyattinkara, Thiruvananthapuram, Kerala'
  }
];

export const mockWasteReports: WasteReport[] = [
  {
    id: '1',
    userId: '1',
    latitude: 8.5241,
    longitude: 76.9366,
    address: 'MG Road, Thiruvananthapuram, Kerala',
    beforeImage: 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=400',
    afterImage: 'https://images.pexels.com/photos/761297/pexels-photo-761297.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'self_cleaned',
    reportedAt: '2024-01-24T14:30:00Z',
    completedAt: '2024-01-24T16:00:00Z',
    description: 'Plastic bottles and food containers scattered near bus stop',
    cleanupType: 'self_clean',
    pointsAwarded: 50
  },
  {
    id: '2',
    userId: '2',
    latitude: 8.5074,
    longitude: 76.9570,
    address: 'Kazhakuttom, Thiruvananthapuram, Kerala',
    beforeImage: 'https://images.pexels.com/photos/9324547/pexels-photo-9324547.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'submitted_to_authority',
    reportedAt: '2024-01-25T09:00:00Z',
    description: 'Large pile of construction debris near IT park',
    cleanupType: 'submit_to_authority',
    pointsAwarded: 30
  }
];

export const mockCleanupDrives: CleanupDrive[] = [
  {
    id: '1',
    communityName: 'Green Warriors Trivandrum',
    userId: '1',
    latitude: 8.4855,
    longitude: 76.9492,
    address: 'Kovalam Beach, Thiruvananthapuram, Kerala',
    beforeImage: 'https://images.pexels.com/photos/9324663/pexels-photo-9324663.jpeg?auto=compress&cs=tinysrgb&w=400',
    afterImage: 'https://images.pexels.com/photos/5591564/pexels-photo-5591564.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'completed',
    adoptedAt: '2024-01-20T10:00:00Z',
    completedAt: '2024-01-22T16:00:00Z',
    approvedAt: '2024-01-23T09:00:00Z',
    pointsAwarded: 100,
    description: 'Beach cleanup drive with 25 volunteers from local community'
  },
  {
    id: '2',
    communityName: 'EcoFriends Kerala',
    userId: '2',
    latitude: 8.5380,
    longitude: 76.9210,
    address: 'Vellayani Lake, Thiruvananthapuram, Kerala',
    beforeImage: 'https://images.pexels.com/photos/7656732/pexels-photo-7656732.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'adopted',
    adoptedAt: '2024-01-25T08:00:00Z',
    pointsAwarded: 0,
    description: 'Weekend cleanup drive planned for lake area'
  }
];

export const mockPartnerStores: PartnerStore[] = [
  {
    id: '1',
    name: 'EcoMart',
    logo: '🛒',
    category: 'Grocery',
    offers: [
      {
        id: '1',
        title: '10% Off Organic Products',
        description: 'Get 10% discount on all organic products',
        pointsRequired: 100,
        validUntil: '2024-12-31',
        image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: '2',
        title: 'Free Reusable Bag',
        description: 'Get a free eco-friendly reusable shopping bag',
        pointsRequired: 50,
        validUntil: '2024-12-31',
        image: 'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ]
  },
  {
    id: '2',
    name: 'Green Cafe',
    logo: '☕',
    category: 'Food & Beverage',
    offers: [
      {
        id: '3',
        title: 'Free Coffee',
        description: 'Complimentary coffee for eco warriors',
        pointsRequired: 75,
        validUntil: '2024-12-31',
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ]
  }
];

export const mockPointTransactions: PointTransaction[] = [
  {
    id: '1',
    userId: '1',
    points: 50,
    type: 'earned',
    description: 'Self-cleaned waste area',
    timestamp: '2024-01-24T16:00:00Z',
    relatedId: '1'
  },
  {
    id: '2',
    userId: '1',
    points: 10,
    type: 'earned',
    description: 'Updated dustbin status',
    timestamp: '2024-01-25T10:00:00Z'
  },
  {
    id: '3',
    userId: '1',
    points: -50,
    type: 'redeemed',
    description: 'Redeemed: Free Reusable Bag at EcoMart',
    timestamp: '2024-01-25T12:00:00Z'
  }
];