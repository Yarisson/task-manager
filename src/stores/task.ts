import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export interface Task {
  id: string
  title: string
  description: string
  columnId: string
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>(JSON.parse(localStorage.getItem('tasks') || '[]'))

  watch(tasks, (newValue) => {
    localStorage.setItem('tasks', JSON.stringify(newValue))
  }, { deep: true })

  const getTasksByColumnId = (columnId: string) => {
    return computed(() => tasks.value.filter(task => task.columnId === columnId))
  }

  const addTask = (title: string, description: string, columnId: string) => {
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      description,
      columnId
    }
    tasks.value.push(newTask)
  }

  const moveTask = (taskId: string, newColumnId: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.columnId = newColumnId
    }
  }

  const editTask = (taskId: string, title: string, description: string, columnId?: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.title = title
      task.description = description
      if (columnId) {
        task.columnId = columnId
      }
    }
  }

  const clearAll = () => {
    tasks.value = []
  }

  return { tasks, getTasksByColumnId, addTask, moveTask, editTask, clearAll }
})