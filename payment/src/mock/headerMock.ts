import peterAvatar from '../assets/peterparker.jpeg'
import type { HeaderUser } from '../types/header'

export const currentUserMock: HeaderUser = {
  name: 'Peter Parker',
  email: 'peterparker@company.com',
  role: 'Administration',
  avatar: peterAvatar,
  logoutRoute: '/logout',
}
