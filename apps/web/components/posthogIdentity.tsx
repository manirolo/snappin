'use client'

import { useUser } from '@clerk/nextjs'
import posthog from 'posthog-js'
import { useEffect } from 'react'

function afterIdle(cb: () => void, timeout = 4000) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(cb, { timeout });
  } else {
    setTimeout(cb, timeout);
  }
}

export default function PostHogIdentify() {
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn && user) {
      afterIdle(() => {
        posthog.identify(user.id, {
          email: user.emailAddresses[0]?.emailAddress,
          name: user.fullName,
        })
      })
    } else {
      posthog.reset()  // ✅ clears identity on sign-out
    }
  }, [isLoaded, isSignedIn, user])

  return null
}