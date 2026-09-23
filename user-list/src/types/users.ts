export type UserStatus = 'Active' | 'Offline' | 'Deactive'

export interface User {
  id: string
  userId: number
  name: string
  email: string
  phone: string
  workspaceCount: number
  projects: number
  status: UserStatus
  verified: boolean
  lastLogin: string
  registered: string
}
