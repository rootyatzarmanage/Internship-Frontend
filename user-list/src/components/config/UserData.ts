export type UserStatus = 'Active' | 'Offline' | 'Deactive'

export type User = {
  /** Unique row key. `userId` is what the UI shows and can repeat, as in the design. */
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

export const userListData: User[] = [
  { id: 'u1', userId: 93482, name: 'Alex James', email: 'alexjames@company.com', phone: '+91 78393 37943', workspaceCount: 13, projects: 26, status: 'Active', verified: true, lastLogin: '28 Jun 2026', registered: '31 Jan 2022' },
  { id: 'u2', userId: 23422, name: 'John Parker', email: 'johnparker@company.com', phone: '+91 89934 43458', workspaceCount: 20, projects: 40, status: 'Offline', verified: true, lastLogin: '13 Jun 2026', registered: '05 Apr 2025' },
  { id: 'u3', userId: 23421, name: 'Andrew Watt', email: 'andrewwatt@company.com', phone: '+91 79934 80345', workspaceCount: 13, projects: 24, status: 'Offline', verified: false, lastLogin: '21 Aug 2026', registered: '21 Mar 2024' },
  { id: 'u4', userId: 23422, name: 'Caroline Parker', email: 'carolineparker@company.com', phone: '+91 84394 85840', workspaceCount: 34, projects: 68, status: 'Deactive', verified: true, lastLogin: '28 Jun 2026', registered: '03 Sept 2019' },
  { id: 'u5', userId: 46315, name: 'Martin James', email: 'martinjames@company.com', phone: '+91 83953 90545', workspaceCount: 32, projects: 60, status: 'Active', verified: true, lastLogin: '09 Oct 2025', registered: '18 Oct 2017' },
  { id: 'u6', userId: 45378, name: 'Helen Killer', email: 'helenkiller@company.com', phone: '+91 84300 85398', workspaceCount: 7, projects: 12, status: 'Active', verified: false, lastLogin: '19 Feb 2026', registered: '14 Mar 2024' },
  { id: 'u7', userId: 45378, name: 'Taylor Penny', email: 'taylorp@company.com', phone: '+91 84300 85398', workspaceCount: 7, projects: 12, status: 'Active', verified: false, lastLogin: '28 Jun 2026', registered: '14 Mar 2024' },
  { id: 'u8', userId: 45378, name: 'Helen Killer', email: 'helenkiller@company.com', phone: '+91 84300 85398', workspaceCount: 7, projects: 12, status: 'Active', verified: false, lastLogin: '28 Jun 2026', registered: '14 Mar 2024' },
]