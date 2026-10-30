export type TicketStatus = 'Unassigned' | 'Escalation Pending' | 'Needs Super Admin' | 'In Progress' | 'Resolved' | 'Closed'
export type TicketTab = 'All' | 'Unassigned' | 'Escalation Queue' | 'In Progress' | 'Resolved/Closed'
export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low'

export type AdminTicket = {
  id: string
  subject: string
  user: string
  category: string
  priority: TicketPriority
  level: string
  assignedTo: string
  status: TicketStatus
  sla: string
  created: string
  createdAt: string
}

export const ticketStatuses: TicketStatus[] = ['Unassigned', 'Escalation Pending', 'Needs Super Admin', 'In Progress', 'Resolved', 'Closed']
export const ticketTabs: TicketTab[] = ['All', 'Unassigned', 'Escalation Queue', 'In Progress', 'Resolved/Closed']
export const priorities: TicketPriority[] = ['Critical', 'High', 'Medium', 'Low']
export const categories = ['Login & Access', 'Payment & Billing', 'Workspace', 'PIM Project', 'AIM Project', 'Library', 'App Permission', 'Performance']
export const ticketLevels = ['Support Team', 'Basic Technical', 'Lead Technical']

export const adminTickets: AdminTicket[] = [
  { id: 'TKT-1048', subject: 'Unable to access the project dashboard', user: 'Alex James', category: 'Login & Access', priority: 'High', level: '', assignedTo: 'Unassigned', status: 'Unassigned', sla: '1h 24m', created: 'Oct 30, 2026', createdAt: '2026-10-30' },
  { id: 'TKT-1047', subject: 'Invoice payment is showing as pending', user: 'John Parker', category: 'Payment & Billing', priority: 'Critical', level: 'Support Team', assignedTo: 'Unassigned', status: 'Escalation Pending', sla: 'Overdue 32m', created: 'Oct 30, 2026', createdAt: '2026-10-30' },
  { id: 'TKT-1046', subject: 'Workspace invitation email not received', user: 'Andrew Watt', category: 'Workspace', priority: 'Medium', level: 'Support Team', assignedTo: 'Karthik Raj', status: 'Unassigned' as TicketStatus, sla: '3h 10m', created: 'Oct 29, 2026', createdAt: '2026-10-29' },
  { id: 'TKT-1045', subject: 'Need help restoring archived library items', user: 'Caroline Parker', category: 'Library', priority: 'Low', level: 'Support Team', assignedTo: 'Divya S', status: 'Resolved', sla: 'Met', created: 'Oct 29, 2026', createdAt: '2026-10-29' },
  { id: 'TKT-1044', subject: 'Performance drops when exporting large reports', user: 'Martin James', category: 'Performance', priority: 'High', level: 'Lead Technical', assignedTo: 'Suresh Babu', status: 'In Progress', sla: '42m left', created: 'Oct 28, 2026', createdAt: '2026-10-28' },
  { id: 'TKT-1043', subject: 'Report generation times out', user: 'Helen Killer', category: 'Performance', priority: 'Critical', level: 'Lead Technical', assignedTo: 'Unassigned', status: 'Needs Super Admin', sla: 'Overdue', created: 'Oct 28, 2026', createdAt: '2026-10-28' },
  { id: 'TKT-1042', subject: 'Two factor authentication reset request', user: 'Maya Shah', category: 'Login & Access', priority: 'Critical', level: 'Basic Technical', assignedTo: 'Rahul Dev', status: 'Unassigned' as TicketStatus, sla: '18m left', created: 'Oct 27, 2026', createdAt: '2026-10-27' },
  { id: 'TKT-1041', subject: 'PIM project data is not synchronizing', user: 'Rohan Mehta', category: 'PIM Project', priority: 'High', level: 'Lead Technical', assignedTo: 'Anita Verma', status: 'In Progress', sla: '2h 06m', created: 'Oct 27, 2026', createdAt: '2026-10-27' },
  { id: 'TKT-1040', subject: 'Permission error when adding a new teammate', user: 'Nina Thomas', category: 'App Permission', priority: 'Medium', level: 'Basic Technical', assignedTo: 'Arun Kumar', status: 'Closed', sla: 'Met', created: 'Oct 26, 2026', createdAt: '2026-10-26' },
  { id: 'TKT-1039', subject: 'Library files not loading', user: 'Vikram Rao', category: 'Library', priority: 'High', level: 'Support Team', assignedTo: 'Unassigned', status: 'Escalation Pending', sla: 'Overdue 14m', created: 'Oct 26, 2026', createdAt: '2026-10-26' },
  { id: 'TKT-1038', subject: 'Password reset link has expired', user: 'Emma Wilson', category: 'Login & Access', priority: 'Low', level: 'Support Team', assignedTo: 'Priya Nair', status: 'Unassigned', sla: 'Met', created: 'Oct 25, 2026', createdAt: '2026-10-25' },
  { id: 'TKT-1037', subject: 'Request to change subscription billing cycle', user: 'Noah Martin', category: 'Payment & Billing', priority: 'Medium', level: 'Support Team', assignedTo: 'Divya S', status: 'In Progress', sla: '5h 02m', created: 'Oct 24, 2026', createdAt: '2026-10-24' },
]

export const supportLevels = [
  { id: 1, name: 'Support Team', description: 'Normal support team', sla: 4 },
  { id: 2, name: 'Basic Technical', description: 'Basic technical knowledge', sla: 8 },
  { id: 3, name: 'Lead Technical', description: 'Advanced technical support', sla: 12 },
]

export const supportMembers = [
  { id: 'm1', name: 'Priya Nair', level: 'Support Team' },
  { id: 'm2', name: 'Karthik Raj', level: 'Support Team' },
  { id: 'm3', name: 'Divya S', level: 'Support Team' },
  { id: 'm4', name: 'Arun Kumar', level: 'Basic Technical' },
  { id: 'm5', name: 'Meena Iyer', level: 'Basic Technical' },
  { id: 'm6', name: 'Rahul Dev', level: 'Basic Technical' },
  { id: 'm7', name: 'Suresh Babu', level: 'Lead Technical' },
  { id: 'm8', name: 'Anita Verma', level: 'Lead Technical' },
]
