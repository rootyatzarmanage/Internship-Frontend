import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BadgeDollarSign,
  BookOpen,
  BriefcaseBusiness,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react'

export interface NavigationItem {
  label: string
  route: string
  icon: LucideIcon
}

export const mainNavigationItems: NavigationItem[] = [
  { label: 'Analytics', route: '/analytics', icon: Activity },
  { label: 'Workspace', route: '/workspace', icon: LayoutDashboard },
  { label: 'Resources', route: '/resources', icon: BriefcaseBusiness },
  { label: 'Payment', route: '/payment', icon: CreditCard },
  { label: 'Library', route: '/library', icon: BookOpen },
]

export const adminNavigationItems: NavigationItem[] = [
  { label: 'Subscription', route: '/subscription', icon: BadgeDollarSign },
  { label: 'App Security', route: '/app-security', icon: ShieldCheck },
  { label: 'Help & Docs', route: '/help-and-docs', icon: CircleHelp },
]
