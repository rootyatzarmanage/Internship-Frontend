export interface Project {
  name: string
  projectType: string
  description: string
  location: string
  latitude: number
  longitude: number
  status: string
  createdDate: string
  workspace: string
  owner: string
  membersCount: number
}

export type ProjectChangeField = keyof Project
