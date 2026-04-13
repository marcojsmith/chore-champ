// Extended Child type used in child-facing pages (includes computed tokenBalance)
export type Child = {
  id: string;
  name: string;
  age: number;
  avatar: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  tokenBalance: number;
};
