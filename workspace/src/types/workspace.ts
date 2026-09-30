export type Role = 'OWNER' | 'MEMBER'
export type RoleFilter = 'all' | Role
export type ProjectFilter = 'all' | 'one' | 'multiple'
export type SortOption = 'default' | 'name-asc' | 'name-desc' | 'projects-high' | 'projects-low'
export type TabLabel = 'All Workspaces' | 'My Workspace' | 'Shared'
export type MemberRole = 'ADMIN' | 'MEMBER'

export interface Project {
  id: number
  name: string
  description: string
  date: string
  image: string
}

export interface Workspace {
  id: number
  name: string
  description: string
  role: Role
  projects: Project[]
}

export interface FilterState {
  roleFilter: RoleFilter
  projectFilter: ProjectFilter
  sortBy: SortOption
}

export type WorkspaceUpdate = Pick<Workspace, 'name' | 'description'>
export type ProjectUpdate = Pick<Project, 'name' | 'description'>

export interface WorkspaceHandlers {
  onEditWorkspace: (workspaceId: number, patch: WorkspaceUpdate) => void
  onDeleteWorkspace: (workspaceId: number) => void
  onEditProject: (workspaceId: number, projectId: number, patch: ProjectUpdate) => void
  onDeleteProject: (workspaceId: number, projectId: number) => void
}

export type ProjectType = 'PIM' | 'AIM'

export interface Project {
  id: number
  name: string
  description: string
  date: string
  image: string
  type: ProjectType
}

export type NewProject = Pick<Project, 'name' | 'description' | 'type'>

export interface WorkspaceHandlers {
  onEditWorkspace: (workspaceId: number, patch: WorkspaceUpdate) => void
  onDeleteWorkspace: (workspaceId: number) => void
  onAddProject: (workspaceId: number, project: NewProject) => void
  onEditProject: (workspaceId: number, projectId: number, patch: ProjectUpdate) => void
  onDeleteProject: (workspaceId: number, projectId: number) => void
}

export interface TeamMember {
  id: number
  name: string
  email: string
  role: MemberRole
  isCurrentUser?: boolean
}
