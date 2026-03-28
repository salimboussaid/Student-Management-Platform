import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface EducationClause {
  id: string
  code: string
  name: string
  creditPoints: number
  reporting: string // 'Exam', 'Pass', etc.
  semesters: number[]
}

export interface EducationPlan {
  id: string
  studentUuid: string
  programCode: string
  programName: string
  educationYear: string
  group: string
  clauses: EducationClause[]
}

export const useEducationPlanStore = defineStore(
  'educationPlan',
  () => {
    const plans = ref<EducationPlan[]>([])

    const commonClauses: EducationClause[] = [
      {
        id: crypto.randomUUID(),
        code: 'М.1.1',
        name: 'Цифровые компетенции в научной деятельности',
        creditPoints: 3,
        reporting: 'Pass',
        semesters: [1]
      },
      {
        id: crypto.randomUUID(),
        code: 'М.1.2',
        name: 'Системный анализ в программных проектах',
        creditPoints: 3,
        reporting: 'Exam',
        semesters: [1]
      },
      {
        id: crypto.randomUUID(),
        code: 'М.1.3',
        name: 'Математические методы и модели в управлении',
        creditPoints: 3,
        reporting: 'Exam',
        semesters: [1]
      },
      {
        id: crypto.randomUUID(),
        code: 'М.1.4',
        name: 'Информационный менеджмент',
        creditPoints: 3,
        reporting: 'Pass',
        semesters: [1]
      },
      {
        id: crypto.randomUUID(),
        code: 'М.1.5',
        name: 'Управление программными проектами',
        creditPoints: 6,
        reporting: 'Exam',
        semesters: [1]
      },
      {
        id: crypto.randomUUID(),
        code: 'М.1.7',
        name: 'Проектная деятельность',
        creditPoints: 12,
        reporting: 'Exam',
        semesters: [1, 2, 3]
      },
      {
        id: crypto.randomUUID(),
        code: 'М.1.10',
        name: 'Программная инженерия (продвинутый уровень)',
        creditPoints: 6,
        reporting: 'Exam',
        semesters: [1, 2]
      },
      {
        id: crypto.randomUUID(),
        code: 'М.1.12',
        name: 'Управление продуктом',
        creditPoints: 6,
        reporting: 'Exam',
        semesters: [2]
      }
    ]

    function createEducationPlan(payload: Omit<EducationPlan, 'id'>) {
      const newPlan: EducationPlan = {
        id: crypto.randomUUID(),
        ...payload
      }
      plans.value.push(newPlan)
      return newPlan
    }

    function getStudentEducationPlan(studentUuid: string) {
      return plans.value.find(p => p.studentUuid === studentUuid)
    }

    function getOrCreatePlan(studentUuid: string) {
      let plan = getStudentEducationPlan(studentUuid)
      if (!plan) {
        plan = createEducationPlan({
          studentUuid,
          programCode: '09.04.04',
          programName: 'Программная инженерия',
          educationYear: '2025/2026',
          group: 'РИМ-150970',
          clauses: commonClauses
        })
      }
      return plan
    }

    function addClauseToPlan(studentUuid: string, clause: EducationClause) {
      const plan = getStudentEducationPlan(studentUuid)
      if (plan) {
        plan.clauses.push(clause)
      }
    }

    function removeClauseFromPlan(studentUuid: string, clauseId: string) {
      const plan = getStudentEducationPlan(studentUuid)
      if (plan) {
        const index = plan.clauses.findIndex(c => c.id === clauseId)
        if (index !== -1) {
          plan.clauses.splice(index, 1)
        }
      }
    }

    return {
      plans,
      commonClauses,
      createEducationPlan,
      getStudentEducationPlan,
      getOrCreatePlan,
      addClauseToPlan,
      removeClauseFromPlan
    }
  },
  { persist: true }
)
