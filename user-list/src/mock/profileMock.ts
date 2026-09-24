import peterAvatar from '../assets/peterparker.jpeg'
import type { UserProfile } from '../types/profile'

export const currentUser: UserProfile = {
  name: 'Peter Parker',
  userId: 'USR-4562',
  email: 'peterparker@company.com',
  avatar: peterAvatar,
  number: '+91 94867 88921',
  location: 'Tamil Nadu, India',
  country: 'India',
  state: 'Tamil Nadu',
  district: 'Coimbatore',
  pinCode: '',
  twoFactorEnabled: false,
  lastPasswordChange: '3 months ago',
}
