// ─── Types ────────────────────────────────────────────────────────────────────

export type ChoreStatus =
  | 'scheduled'
  | 'due'
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'overdue'
  | 'expired';

export type RewardRequestStatus = 'pending' | 'approved' | 'rejected';

export type Child = {
  id: string;
  name: string;
  age: number;
  avatar: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
};

export type ChoreTemplate = {
  id: string;
  title: string;
  description: string;
  category: string;
  recurrence: 'once' | 'daily' | 'weekly' | 'monthly';
  isRequired: boolean;
  approvalMode: 'auto' | 'manual';
  photoProofRequired: boolean;
  baseTokens: number;
  earlyCompletionBonus: boolean;
  earlyBonusValue: number;
  streakBonus: boolean;
  streakBonusValue: number;
  assignedChildIds: string[];
  isActive: boolean;
  dueTime: string;
};

export type ChoreOccurrence = {
  id: string;
  choreTemplateId: string;
  choreTitle: string;
  childId: string;
  childName: string;
  status: ChoreStatus;
  dueDate: string;
  completedAt?: string;
  tokensEarned?: number;
  photoUrl?: string;
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  tokenCost: number;
  category: string;
  isActive: boolean;
  imageEmoji?: string;
  eligibleChildIds: string[];
  stockQuantity?: number;
};

export type RewardRequest = {
  id: string;
  rewardId: string;
  rewardTitle: string;
  childId: string;
  childName: string;
  status: RewardRequestStatus;
  requestedAt: string;
  tokenCost: number;
};

export type TokenSummary = {
  childId: string;
  available: number;
  reserved: number;
  totalEarned: number;
  totalSpent: number;
  earnedThisWeek: number;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: 'chore_completed' | 'chore_approved' | 'reward_requested' | 'reward_approved' | 'reminder';
};

export type ChartPoint = { label: string; value: number; value2?: number };

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const children: Child[] = [
  { id: 'child1', name: 'Emma', age: 10, avatar: '👧', currentStreak: 5, longestStreak: 12, completionRate: 87 },
  { id: 'child2', name: 'Liam', age: 8, avatar: '👦', currentStreak: 2, longestStreak: 7, completionRate: 65 },
  { id: 'child3', name: 'Sofia', age: 12, avatar: '🧒', currentStreak: 9, longestStreak: 9, completionRate: 92 },
];

export const choreCategories = [
  'Bedroom', 'Kitchen', 'Bathroom', 'Living Room', 'Outdoor', 'Laundry', 'Pet Care', 'School', 'Other',
];

export const rewardCategories = [
  'Entertainment', 'Screen Time', 'Privileges', 'Outings', 'Food', 'Toys & Games', 'Other',
];

export const choreTemplates: ChoreTemplate[] = [
  { id: 'chore1', title: 'Make Your Bed', description: 'Straighten sheets and pillows.', category: 'Bedroom', recurrence: 'daily', isRequired: true, approvalMode: 'auto', photoProofRequired: false, baseTokens: 5, earlyCompletionBonus: true, earlyBonusValue: 2, streakBonus: true, streakBonusValue: 3, assignedChildIds: ['child1', 'child2'], isActive: true, dueTime: '17:00' },
  { id: 'chore2', title: 'Load Dishwasher', description: 'Rinse and load all dishes after dinner.', category: 'Kitchen', recurrence: 'daily', isRequired: true, approvalMode: 'manual', photoProofRequired: false, baseTokens: 8, earlyCompletionBonus: false, earlyBonusValue: 0, streakBonus: true, streakBonusValue: 3, assignedChildIds: ['child3'], isActive: true, dueTime: '20:00' },
  { id: 'chore3', title: 'Vacuum Living Room', description: 'Vacuum carpets and rugs.', category: 'Living Room', recurrence: 'weekly', isRequired: false, approvalMode: 'manual', photoProofRequired: true, baseTokens: 15, earlyCompletionBonus: true, earlyBonusValue: 5, streakBonus: false, streakBonusValue: 0, assignedChildIds: ['child1'], isActive: true, dueTime: '17:00' },
  { id: 'chore4', title: 'Feed the Dog', description: 'Morning and evening feeding.', category: 'Pet Care', recurrence: 'daily', isRequired: true, approvalMode: 'auto', photoProofRequired: false, baseTokens: 6, earlyCompletionBonus: false, earlyBonusValue: 0, streakBonus: true, streakBonusValue: 2, assignedChildIds: ['child2', 'child3'], isActive: true, dueTime: '17:00' },
  { id: 'chore5', title: 'Take Out Trash', description: 'Take trash bins to the curb on collection day.', category: 'Outdoor', recurrence: 'weekly', isRequired: true, approvalMode: 'auto', photoProofRequired: false, baseTokens: 10, earlyCompletionBonus: false, earlyBonusValue: 0, streakBonus: false, streakBonusValue: 0, assignedChildIds: ['child1', 'child3'], isActive: false, dueTime: '08:00' },
];

export const choreOccurrences: ChoreOccurrence[] = [
  // Pending approval (caregiver view)
  { id: 'occ1', choreTemplateId: 'chore1', choreTitle: 'Make Your Bed', childId: 'child1', childName: 'Emma', status: 'pending_approval', dueDate: '2024-12-15T17:00:00Z', completedAt: '2024-12-15T08:30:00Z', tokensEarned: 7 },
  { id: 'occ2', choreTemplateId: 'chore2', choreTitle: 'Load Dishwasher', childId: 'child3', childName: 'Sofia', status: 'pending_approval', dueDate: '2024-12-15T20:00:00Z', completedAt: '2024-12-15T19:45:00Z' },
  { id: 'occ3', choreTemplateId: 'chore3', choreTitle: 'Vacuum Living Room', childId: 'child1', childName: 'Emma', status: 'pending_approval', dueDate: '2024-12-15T17:00:00Z', completedAt: '2024-12-15T14:00:00Z' },
  { id: 'occ4', choreTemplateId: 'chore4', choreTitle: 'Feed the Dog', childId: 'child2', childName: 'Liam', status: 'pending_approval', dueDate: '2024-12-15T17:00:00Z', completedAt: '2024-12-15T16:00:00Z' },
  { id: 'occ5', choreTemplateId: 'chore4', choreTitle: 'Feed the Dog', childId: 'child3', childName: 'Sofia', status: 'pending_approval', dueDate: '2024-12-15T17:00:00Z', completedAt: '2024-12-15T15:30:00Z' },
  // Approved history
  { id: 'occ6', choreTemplateId: 'chore1', choreTitle: 'Make Your Bed', childId: 'child1', childName: 'Emma', status: 'approved', dueDate: '2024-12-14T17:00:00Z', completedAt: '2024-12-14T07:45:00Z', tokensEarned: 5 },
  { id: 'occ8', choreTemplateId: 'chore2', choreTitle: 'Load Dishwasher', childId: 'child3', childName: 'Sofia', status: 'approved', dueDate: '2024-12-14T20:00:00Z', completedAt: '2024-12-14T19:30:00Z', tokensEarned: 11 },
  // Overdue
  { id: 'occ7', choreTemplateId: 'chore1', choreTitle: 'Make Your Bed', childId: 'child2', childName: 'Liam', status: 'overdue', dueDate: '2024-12-14T17:00:00Z' },
  // Due today (child1)
  { id: 'occ9', choreTemplateId: 'chore1', choreTitle: 'Make Your Bed', childId: 'child1', childName: 'Emma', status: 'due', dueDate: '2024-12-16T17:00:00Z' },
  { id: 'occ11', choreTemplateId: 'chore3', choreTitle: 'Vacuum Living Room', childId: 'child1', childName: 'Emma', status: 'overdue', dueDate: '2024-12-15T17:00:00Z' },
  // Due today (child2)
  { id: 'occ10', choreTemplateId: 'chore4', choreTitle: 'Feed the Dog', childId: 'child2', childName: 'Liam', status: 'due', dueDate: '2024-12-16T17:00:00Z' },
  // Scheduled upcoming (child1)
  { id: 'occ12', choreTemplateId: 'chore1', choreTitle: 'Make Your Bed', childId: 'child1', childName: 'Emma', status: 'scheduled', dueDate: '2024-12-17T17:00:00Z' },
];

export const rewards: Reward[] = [
  { id: 'reward1', title: 'Movie Night Pick', description: 'Choose the movie for family movie night.', tokenCost: 20, category: 'Entertainment', isActive: true, imageEmoji: '🎬', eligibleChildIds: ['child1', 'child2', 'child3'] },
  { id: 'reward2', title: 'Extra Screen Time', description: '30 extra minutes of screen time.', tokenCost: 15, category: 'Screen Time', isActive: true, imageEmoji: '📱', eligibleChildIds: ['child1', 'child2', 'child3'] },
  { id: 'reward3', title: 'Stay Up Late', description: 'Stay up 1 hour past bedtime.', tokenCost: 30, category: 'Privileges', isActive: true, imageEmoji: '🌙', eligibleChildIds: ['child1', 'child2', 'child3'] },
  { id: 'reward4', title: 'Ice Cream Trip', description: 'Family trip to the ice cream shop.', tokenCost: 50, category: 'Outings', isActive: true, imageEmoji: '🍦', eligibleChildIds: ['child1', 'child2', 'child3'] },
  { id: 'reward5', title: 'Skip One Chore', description: 'Skip any one chore of your choice.', tokenCost: 25, category: 'Privileges', isActive: true, imageEmoji: '🎯', eligibleChildIds: ['child1', 'child3'] },
];

export const rewardRequests: RewardRequest[] = [
  { id: 'req1', rewardId: 'reward1', rewardTitle: 'Movie Night Pick', childId: 'child1', childName: 'Emma', status: 'pending', requestedAt: '2024-12-15T10:00:00Z', tokenCost: 20 },
  { id: 'req2', rewardId: 'reward2', rewardTitle: 'Extra Screen Time', childId: 'child2', childName: 'Liam', status: 'pending', requestedAt: '2024-12-15T11:00:00Z', tokenCost: 15 },
  { id: 'req3', rewardId: 'reward3', rewardTitle: 'Stay Up Late', childId: 'child3', childName: 'Sofia', status: 'approved', requestedAt: '2024-12-14T09:00:00Z', tokenCost: 30 },
  { id: 'req4', rewardId: 'reward4', rewardTitle: 'Ice Cream Trip', childId: 'child1', childName: 'Emma', status: 'approved', requestedAt: '2024-12-10T14:00:00Z', tokenCost: 50 },
];

export const tokenSummaries: TokenSummary[] = [
  { childId: 'child1', available: 85, reserved: 20, totalEarned: 230, totalSpent: 125, earnedThisWeek: 42 },
  { childId: 'child2', available: 45, reserved: 15, totalEarned: 120, totalSpent: 60, earnedThisWeek: 18 },
  { childId: 'child3', available: 120, reserved: 30, totalEarned: 310, totalSpent: 160, earnedThisWeek: 65 },
];

export const notifications: Notification[] = [
  { id: 'n1', userId: 'cg1', title: 'Chore Completed', body: 'Emma completed "Make Your Bed"', read: false, createdAt: '2024-12-15T08:30:00Z', type: 'chore_completed' },
  { id: 'n2', userId: 'cg1', title: 'Reward Requested', body: 'Liam wants Extra Screen Time (15 tokens)', read: false, createdAt: '2024-12-15T11:00:00Z', type: 'reward_requested' },
  { id: 'n3', userId: 'cg1', title: 'Reward Requested', body: 'Emma wants Movie Night Pick (20 tokens)', read: true, createdAt: '2024-12-15T10:00:00Z', type: 'reward_requested' },
  { id: 'n4', userId: 'child1', title: 'Chore Approved!', body: 'Your "Make Your Bed" was approved! +5 tokens', read: false, createdAt: '2024-12-14T18:00:00Z', type: 'chore_approved' },
  { id: 'n5', userId: 'child2', title: 'Reminder', body: '"Feed the Dog" is due in 1 hour', read: false, createdAt: '2024-12-15T16:00:00Z', type: 'reminder' },
  { id: 'n6', userId: 'child3', title: 'Reward Approved!', body: '"Stay Up Late" was approved!', read: true, createdAt: '2024-12-14T12:00:00Z', type: 'reward_approved' },
];

export const household = {
  name: 'The Johnson Family',
  caregivers: [
    { id: 'cg1', name: 'Sarah Johnson', avatar: '👩' },
    { id: 'cg2', name: 'Mike Johnson', avatar: '👨' },
  ],
  children,
};

// ─── Chart / Analytics Data ───────────────────────────────────────────────────

export const weeklyCompletionData: ChartPoint[] = [
  { label: 'Mon', value: 8, value2: 10 },
  { label: 'Tue', value: 9, value2: 10 },
  { label: 'Wed', value: 7, value2: 10 },
  { label: 'Thu', value: 10, value2: 10 },
  { label: 'Fri', value: 6, value2: 10 },
  { label: 'Sat', value: 8, value2: 9 },
  { label: 'Sun', value: 5, value2: 9 },
];

export const monthlyTokenData: ChartPoint[] = [
  { label: 'Jul', value: 180 },
  { label: 'Aug', value: 220 },
  { label: 'Sep', value: 195 },
  { label: 'Oct', value: 260 },
  { label: 'Nov', value: 240 },
  { label: 'Dec', value: 125 },
];

export const completionBreakdown: { label: string; value: number }[] = [
  { label: 'Completed', value: 68 },
  { label: 'Approved', value: 14 },
  { label: 'Overdue', value: 10 },
  { label: 'Pending', value: 8 },
];

export const dashboardMetrics = {
  choresDueToday: 8,
  choresCompletedToday: 5,
  overdueChores: 2,
  pendingApprovals: choreOccurrences.filter(o => o.status === 'pending_approval').length,
  pendingRewardRequests: rewardRequests.filter(r => r.status === 'pending').length,
};
