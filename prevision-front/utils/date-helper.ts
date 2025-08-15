export function getCurrentDate(): Date {
  const now = new Date()
  const hour = now.getHours()

  // Si entre 14h et 00h (minuit) → demain
  // Si entre 00h et 10h → aujourd'hui
  if (hour >= 14 || hour < 0) {
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  } else if (hour >= 0 && hour < 10) {
    return now
  }

  return now
}

export function getWeeksInYear(year: number): number[] {
  const weeks: number[] = []
  const firstDay = new Date(year, 0, 1)
  const lastDay = new Date(year, 11, 31)

  // Trouver le premier dimanche de l'année
  const currentDate = new Date(firstDay)
  while (currentDate.getDay() !== 0) {
    currentDate.setDate(currentDate.getDate() - 1)
  }

  let weekNumber = 1
  while (currentDate <= lastDay) {
    weeks.push(weekNumber)
    currentDate.setDate(currentDate.getDate() + 7)
    weekNumber++
  }

  return weeks
}

export function getWeekDates(year: number, weekNumber: number): Date[] {
  const firstDay = new Date(year, 0, 1)

  // Trouver le premier dimanche de l'année
  const firstSunday = new Date(firstDay)
  while (firstSunday.getDay() !== 0) {
    firstSunday.setDate(firstSunday.getDate() - 1)
  }

  // Calculer le dimanche de la semaine demandée
  const targetSunday = new Date(firstSunday)
  targetSunday.setDate(targetSunday.getDate() + (weekNumber - 1) * 7)

  // Générer les 7 jours de la semaine
  const weekDates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(targetSunday)
    date.setDate(date.getDate() + i)
    weekDates.push(date)
  }

  return weekDates
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  })
}

export function getNext6WeeksSundays(): Date[] {
  const sundays: Date[] = []
  const today = new Date()

  // Trouver le prochain dimanche
  const nextSunday = new Date(today)
  const daysUntilSunday = (7 - today.getDay()) % 7
  nextSunday.setDate(today.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday))

  // Générer les 6 prochains dimanches
  for (let i = 0; i < 6; i++) {
    const sunday = new Date(nextSunday)
    sunday.setDate(nextSunday.getDate() + i * 7)
    sundays.push(sunday)
  }

  return sundays
}
