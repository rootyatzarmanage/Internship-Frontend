import peterAvatar from '../assets/peterparker.jpeg'
import type { CurrentUser } from '../types/header'

export const currentUserMock: CurrentUser = {
  name: 'Peter Parker',
  email: 'peterparker@company.com',
  role: 'Administration',
  avatar: peterAvatar,
}
