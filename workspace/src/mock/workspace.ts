import image from '../assets/img.png'
import type { Project, ProjectType, TabLabel, Workspace, TeamMember } from '../types/workspace'

const project = (
  id: number,
  name: string,
  description: string,
  date: string,
  type: ProjectType = 'PIM'
): Project => ({
  id,
  name,
  description,
  date,
  image,
  type,
})

export const defaultProjectImage = image

export const tabLabelsMock: TabLabel[] = ['All Workspaces', 'My Workspace', 'Shared']

export const myWorkspacesMock: Workspace[] = [
  {
    id: 1,
    name: 'Design Team',
    description: 'Branding, web and mobile design work',
    role: 'OWNER',
    projects: [
      project(1, 'Website Redesign', 'Company website redesign project...', '18 Sep 2026'),
      project(2, 'Brand Identity', 'New branding and visual identity...', '02 Aug 2026'),
      project(3, 'Mobile App UI', 'Mobile application interface...', '21 Jul 2026'),
    ],
  },
  {
    id: 2,
    name: 'Engineering',
    description: 'Internal platforms and dashboards',
    role: 'OWNER',
    projects: [
      project(4, 'Project Management App', 'Internal project management platform...', '12 Jun 2026'),
      project(5, 'Analytics Dashboard', 'Real-time analytics dashboard...', '28 May 2026'),
    ],
  },
  {
    id: 3,
    name: 'Marketing',
    description: 'Campaigns and outreach',
    role: 'OWNER',
    projects: [project(6, 'Campaign Manager', 'Marketing campaign management...', '09 Apr 2026')],
  },
]

export const sharedWorkspacesMock: Workspace[] = [
  {
    id: 4,
    name: 'Product Team',
    description: 'Roadmap planning and customer insights',
    role: 'MEMBER',
    projects: [
      project(7, 'Product Roadmap', 'Q4 product planning and roadmap...', '15 Sep 2026'),
      project(8, 'Customer Feedback', 'Customer feedback and insights...', '30 Aug 2026'),
    ],
  },
]

export const currentMemberMock: TeamMember = {
  id: 1,
  name: 'Peter',
  email: 'peterparker@gmail.com',
  role: 'ADMIN',
  isCurrentUser: true,
}