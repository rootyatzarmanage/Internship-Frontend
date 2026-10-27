export interface HeaderUser {
  name: string
  email: string
  role: string
  avatar: string
  logoutRoute: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  company_name: string | null
  job_title: string | null
  phone: string | null
  avatar_url: string | null
  timezone: string
  platform_role: string
  platform_permissions: string[]
  is_active: boolean
  is_onboarded: boolean
  is_default_onboarding: boolean
  email_verified: boolean
  created_at: string
}
