import { ref } from 'vue'
import { defineStore } from 'pinia'

export type GradeAchievement = 'Test' | 'Pass' | 'Good' | 'Excellent' | 'Failed'

export interface Discipline {
  id: string
  code: string
  name: string
  creditPoints: number
  semester: number
}

export interface StudentGrade {
  id: string
  studentUuid: string
  disciplineId: string
  discipline: string
  totalPoints: number
  maxPoints: number
  achievement: GradeAchievement
  semester: number
  date: string
}

export const useGradesStore = defineStore(
  'grades',
  () => {
    const disciplines = ref<Discipline[]>([
      {
        id: crypto.randomUUID(),
        code: 'М.1.4',
        name: 'Информационный менеджмент',
        creditPoints: 3,
        semester: 1
      },
      {
        id: crypto.randomUUID(),
        code: 'М.1.5',
        name: 'Управление программными проектами',
        creditPoints: 6,
        semester: 1
      },
      {
        id: crypto.randomUUID(),
        code: 'М.1.3',
        name: 'Математические методы и модели в управлении',
        creditPoints: 3,
        semester: 1
      },
      {
        id: crypto.randomUUID(),
        code: 'М.1.10',
        name: 'Программная инженерия (продвинутый уровень)',
        creditPoints: 6,
        semester: 1
      }
    ])

    const grades = ref<StudentGrade[]>([])

    function getAchievementFromPoints(points: number, maxPoints: number): GradeAchievement {
      const percentage = (points / maxPoints) * 100
      if (percentage < 50) return 'Failed'
      if (percentage < 70) return 'Test'
      if (percentage < 85) return 'Good'
      if (percentage < 95) return 'Excellent'
      return 'Excellent'
    }

    function addGrade(payload: Omit<StudentGrade, 'id' | 'achievement'>) {
      const achievement = getAchievementFromPoints(payload.totalPoints, payload.maxPoints)

      const newGrade: StudentGrade = {
        id: crypto.randomUUID(),
        ...payload,
        achievement
      }
      grades.value.push(newGrade)
      return newGrade
    }

    function updateGrade(id: string, payload: Partial<Omit<StudentGrade, 'id' | 'achievement'>>) {
      const index = grades.value.findIndex(g => g.id === id)
      if (index === -1) return

      const updated = { ...grades.value[index], ...payload }
      updated.achievement = getAchievementFromPoints(updated.totalPoints, updated.maxPoints)
      grades.value[index] = updated
    }

    function deleteGrade(id: string) {
      const index = grades.value.findIndex(g => g.id === id)
      if (index === -1) return

      grades.value.splice(index, 1)
    }

    function getStudentGrades(studentUuid: string) {
      return grades.value.filter(g => g.studentUuid === studentUuid).sort((a, b) => {
        if (a.semester !== b.semester) return b.semester - a.semester
        return b.date.localeCompare(a.date)
      })
    }

    function getStudentGradesBySemester(studentUuid: string, semester: number) {
      return grades.value.filter(g => g.studentUuid === studentUuid && g.semester === semester)
    }

    function getStudentAverageGrade(studentUuid: string): number {
      const studentGrades = getStudentGrades(studentUuid)
      if (studentGrades.length === 0) return 0
      const total = studentGrades.reduce((sum, g) => sum + (g.totalPoints / g.maxPoints) * 100, 0)
      return Math.round(total / studentGrades.length)
    }

    return {
      disciplines,
      grades,
      addGrade,
      updateGrade,
      deleteGrade,
      getStudentGrades,
      getStudentGradesBySemester,
      getStudentAverageGrade
    }
  },
  { persist: true }
)
