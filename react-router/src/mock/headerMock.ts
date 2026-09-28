import peterAvatar from '../assets/peterparker.jpeg'
import type { currentUser } from '../types/header'

export const currentUserMock: currentUser = {
  name: 'Peter Parker',
  email: 'peterparker@company.com',
  role: 'Administration',
  avatar: peterAvatar,
  logoutRoute: '/logout',
}
