import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';

export function useCurrentChild() {
  const me = useQuery(api.users.getMe);
  const childStats = useQuery(api.users.getChildStats, me ? { childId: me._id } : 'skip');

  return {
    _id: me?._id ?? '',
    name: me?.name ?? '',
    avatar: me?.avatar ?? '🐱',
    age: me?.age ?? 0,
    tokenBalance: childStats?.tokenBalance ?? 0,
    currentStreak: childStats?.currentStreak ?? 0,
    isLoading: me === undefined || childStats === undefined,
  };
}
