// components/PostHogIdentify.tsx
'use client'

import { useUser } from '@clerk/nextjs'
import posthog from 'posthog-js'
import { useEffect } from 'react'

export default function PostHogIdentify() {
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      posthog.identify(user.id, {
        email: user?.emailAddresses[0]?.emailAddress,
        name: user.fullName,
      })
    }
  }, [isLoaded, isSignedIn, user])

  return null
}