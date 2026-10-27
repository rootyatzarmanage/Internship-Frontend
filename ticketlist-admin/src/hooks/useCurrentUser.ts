import { useCallback, useEffect, useState } from 'react'
import { getCurrentUser, logout } from '../api/authApi'
import type { UserProfile } from '../types/header'

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setUser(await getCurrentUser())
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load current user'))
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const signOut = useCallback(async () => {
    try {
      await logout()
    } finally {
      window.location.href = '/login'
    }
  }, [])

  return { user, isLoading, error, signOut, refetch: load }
}
