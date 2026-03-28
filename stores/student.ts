import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Student {
  uuid: string
  name: string
  email: string
  grade: string
  active: boolean
}

export interface StudentHistoryItem {
  id: string
  action: 'create' | 'update' | 'delete'
  studentName: string
  studentUuid: string
  at: string
  by: string
}

export const useStudentStore = defineStore(
  'student',
  () => {
    const students = ref<Student[]>([])
    const history = ref<StudentHistoryItem[]>([])

    function addHistory(
      action: StudentHistoryItem['action'],
      studentName: string,
      studentUuid: string,
      by = 'Administrator'
    ) {
      history.value.unshift({
        id: crypto.randomUUID(),
        action,
        studentName,
        studentUuid,
        at: new Date().toISOString(),
        by
      })
    }

    function createStudent(payload: Omit<Student, 'uuid'> & { uuid?: string }) {
      const createdStudent: Student = {
        uuid: payload.uuid ?? crypto.randomUUID(),
        name: payload.name,
        email: payload.email,
        grade: payload.grade,
        active: payload.active
      }

      students.value.push(createdStudent)
      addHistory('create', createdStudent.name, createdStudent.uuid)
    }

    function updateStudent(updatedStudent: Student) {
      const index = students.value.findIndex((student) => student.uuid === updatedStudent.uuid)
      if (index === -1) {
        return
      }

      students.value[index] = updatedStudent
      addHistory('update', updatedStudent.name, updatedStudent.uuid)
    }

    function deleteStudent(uuid: string) {
      const index = students.value.findIndex((student) => student.uuid === uuid)
      if (index === -1) {
        return
      }

      const studentName = students.value[index].name

      students.value.splice(index, 1)
      addHistory('delete', studentName, uuid)
    }

    function setStudentActive(uuid: string, active: boolean) {
      const index = students.value.findIndex((student) => student.uuid === uuid)
      if (index === -1) {
        return
      }

      students.value[index].active = active
      addHistory('update', students.value[index].name, uuid)
    }

    return {
      students,
      history,
      createStudent,
      updateStudent,
      deleteStudent,
      setStudentActive
    }
  },
  {
    persist: true
  }
)
