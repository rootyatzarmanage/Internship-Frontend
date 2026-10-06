import { mulberry32 } from './mockData'

export type ActivityType = 'Projects' | 'Meetings' | 'Workspaces'

export type DailyActivity = {
  date: Date
  counts: Record<ActivityType, number>
}

export function buildDailyActivity(weeks = 26): DailyActivity[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const start = new Date(today)
  start.setDate(today.getDate() - today.getDay() - (weeks - 1) * 7)

  const rand = mulberry32(42)
  const days: DailyActivity[] = []

  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const isWeekday = d.getDay() !== 0 && d.getDay() !== 6
    const max = isWeekday ? 4 : 2

    days.push({
      date: new Date(d),
      counts: {
        Projects: Math.floor(rand() * max),
        Meetings: Math.floor(rand() * max),
        Workspaces: Math.floor(rand() * max),
      },
    })
  }

  return days
}