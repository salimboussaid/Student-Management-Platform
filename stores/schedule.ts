import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface ScheduleClass {
  id: string
  studentUuid: string
  subject: string
  type: 'Lecture' | 'Laboratory' | 'Practical' | 'Seminar' | 'Online'
  teacher: string
  room: string
  dayOfWeek: number // 0-6 (Monday-Sunday)
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  semester: number
  classDate?: string // YYYY-MM-DD
}

export const useScheduleStore = defineStore(
  'schedule',
  () => {
    const classes = ref<ScheduleClass[]>([])

    const SUBJECT_POOL = [
      'Mathematics',
      'Physics',
      'Computer Science',
      'English',
      'Data Structures',
      'Web Development',
      'Algorithms',
      'Databases'
    ]

    const TEACHER_POOL = ['Dr. Karim', 'Prof. Amal', 'Dr. Nabil', 'Prof. Yasmine', 'Dr. Omar']
    const ROOM_POOL = ['A-101', 'B-204', 'C-309', 'Lab-2', 'Online']
    const TIME_SLOTS = [
      { startTime: '08:30', endTime: '10:00' },
      { startTime: '10:15', endTime: '11:45' },
      { startTime: '12:00', endTime: '13:30' },
      { startTime: '14:00', endTime: '15:30' },
      { startTime: '16:00', endTime: '17:30' }
    ] as const

    function toIsoDate(date: Date) {
      return date.toISOString().slice(0, 10)
    }

    function toDayOfWeek(date: Date) {
      // JS day: 0(Sun)-6(Sat), store expects 0(Mon)-6(Sun)
      return (date.getDay() + 6) % 7
    }

    function addScheduleClass(payload: Omit<ScheduleClass, 'id'>) {
      const newClass: ScheduleClass = {
        id: crypto.randomUUID(),
        ...payload
      }
      classes.value.push(newClass)
      return newClass
    }

    function updateScheduleClass(id: string, payload: Partial<Omit<ScheduleClass, 'id'>>) {
      const index = classes.value.findIndex(c => c.id === id)
      if (index === -1) return

      classes.value[index] = {
        ...classes.value[index],
        ...payload
      }
    }

    function deleteScheduleClass(id: string) {
      const index = classes.value.findIndex(c => c.id === id)
      if (index === -1) return

      classes.value.splice(index, 1)
    }

    function getStudentSchedule(studentUuid: string) {
      return classes.value.filter(c => c.studentUuid === studentUuid).sort((a, b) => {
        const aDate = a.classDate ? new Date(a.classDate).getTime() : Number.MAX_SAFE_INTEGER
        const bDate = b.classDate ? new Date(b.classDate).getTime() : Number.MAX_SAFE_INTEGER

        if (aDate !== bDate) return aDate - bDate
        if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek
        return a.startTime.localeCompare(b.startTime)
      })
    }

    function getScheduleByDay(studentUuid: string, dayOfWeek: number) {
      return classes.value
        .filter(c => c.studentUuid === studentUuid && c.dayOfWeek === dayOfWeek)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    }

    function createRandomScheduleForRange(
      studentUuid: string,
      startDateIso = '2026-03-01',
      endDateIso = '2026-04-15',
      semester = 2
    ) {
      const startDate = new Date(startDateIso)
      const endDate = new Date(endDateIso)

      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate > endDate) {
        return 0
      }

      // Keep old data and avoid duplicates in the range for same student.
      const existingKeys = new Set(
        classes.value
          .filter(c => c.studentUuid === studentUuid && c.classDate)
          .map(c => `${c.classDate}|${c.subject}|${c.startTime}`)
      )

      const recurringSubjects = SUBJECT_POOL.slice(0, 4)
      let created = 0

      for (let cursor = new Date(startDate); cursor <= endDate; cursor.setDate(cursor.getDate() + 1)) {
        const day = cursor.getDay()
        if (day === 0 || day === 6) {
          continue
        }

        const isoDate = toIsoDate(cursor)
        const classCount = Math.random() < 0.5 ? 3 : 4

        for (let i = 0; i < classCount; i += 1) {
          const slot = TIME_SLOTS[(i + day) % TIME_SLOTS.length]
          const subject = recurringSubjects[(i + day + cursor.getDate()) % recurringSubjects.length]
          const type: ScheduleClass['type'] = Math.random() < 0.35 ? 'Online' : (['Lecture', 'Laboratory', 'Practical', 'Seminar'][(i + day) % 4] as ScheduleClass['type'])
          const room = type === 'Online' ? 'Online' : ROOM_POOL[(i + cursor.getDate()) % (ROOM_POOL.length - 1)]
          const key = `${isoDate}|${subject}|${slot.startTime}`

          if (existingKeys.has(key)) {
            continue
          }

          classes.value.push({
            id: crypto.randomUUID(),
            studentUuid,
            subject,
            type,
            teacher: TEACHER_POOL[(i + cursor.getDate()) % TEACHER_POOL.length],
            room,
            dayOfWeek: toDayOfWeek(cursor),
            startTime: slot.startTime,
            endTime: slot.endTime,
            semester,
            classDate: isoDate
          })

          existingKeys.add(key)
          created += 1
        }
      }

      return created
    }

    return {
      classes,
      addScheduleClass,
      updateScheduleClass,
      deleteScheduleClass,
      getStudentSchedule,
      getScheduleByDay,
      createRandomScheduleForRange
    }
  },
  { persist: true }
)
