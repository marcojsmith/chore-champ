import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import { useAuth } from '@clerk/react'
import type { ReactNode } from 'react'

const convexUrl = import.meta.env.VITE_CONVEX_URL

const convex = new ConvexReactClient(convexUrl)

export function ConvexClerkProvider({ children }: { children: ReactNode }) {
  const auth = useAuth() as unknown as () => {
    isLoaded: boolean
    isSignedIn: boolean | undefined
    getToken: (options: { template?: string; skipCache?: boolean }) => Promise<string | null>
    orgId: string | undefined | null
    orgRole: string | undefined | null
    sessionClaims: Record<string, unknown> | undefined | null
  }
  return (
    <ConvexProviderWithClerk client={convex} useAuth={auth}>
      {children}
    </ConvexProviderWithClerk>
  )
}