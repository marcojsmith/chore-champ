import { children, tokenSummaries } from '@/mocks/data';
import type { Child } from '@/types';

/**
 * Returns the currently logged-in child with computed tokenBalance.
 * Prototype: always returns first child.
 * Production: derive childId from Clerk user identity + Convex lookup.
 */
export function useCurrentChild(): Child {
  const child = children[0];
  const summary = tokenSummaries.find(s => s.childId === child.id) ?? tokenSummaries[0];
  return { ...child, tokenBalance: summary.available };
}
