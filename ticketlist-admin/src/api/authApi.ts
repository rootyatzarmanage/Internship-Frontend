import { apiRequest } from './client'
import type { UserProfile } from '../types/header'

export function getCurrentUser() {
  return apiRequest<UserProfile>('/auth/me')
}

export function logout() {
  return apiRequest<null>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({}),
  })
}
