import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Desk } from './types'

export const useDeskStore = defineStore('desk', () => {
  const desks = ref<Record<string, Desk>>(JSON.parse(localStorage.getItem('desks') || '{}'))
  const activeDeskId = ref<string | null>(localStorage.getItem('activeDeskId') || null)

  const activeDesk = computed(() => activeDeskId.value ? desks.value[activeDeskId.value] : null)

  watch(desks, (newValue) => {
    localStorage.setItem('desks', JSON.stringify(newValue))
  }, { deep: true })

  watch(activeDeskId, (newValue) => {
    localStorage.setItem('activeDeskId', newValue || '')
  })

  const addDesk = (name: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 11)
    desks.value[id] = {
      id,
      name,
      columns: {},
      columnOrder: []
    }
    if (!activeDeskId.value) {
      activeDeskId.value = id
    }
    return id
  }

  const deleteDesk = (id: string) => {
    delete desks.value[id]
    if (activeDeskId.value === id) {
      activeDeskId.value = null
    }
  }

  const editDesk = (id: string, name: string) => {
    if (desks.value[id]) {
      desks.value[id].name = name
    }
  }

  const setActiveDesk = (id: string) => {
    activeDeskId.value = id
  }

  const addColumn = (deskId: string, name: string) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899']
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 11)
    const desk = desks.value[deskId]
    if (desk) {
      desk.columns[id] = {
        id,
        name,
        color: colors[Math.floor(Math.random() * colors.length)]!,
        tasks: {},
        taskOrder: []
      }
      desk.columnOrder.push(id)
    }
    return id
  }

  const addTask = (deskId: string, columnId: string, title: string, description: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 11)
    const column = desks.value[deskId]?.columns[columnId]
    if (column) {
      column.tasks[id] = { id, title, description }
      column.taskOrder.push(id)
    }
    return id
  }

  const moveTask = (deskId: string, taskId: string, fromColumnId: string, toColumnId: string) => {
    const fromColumn = desks.value[deskId]?.columns[fromColumnId]
    const toColumn = desks.value[deskId]?.columns[toColumnId]
    const task = fromColumn?.tasks[taskId]

    if (!fromColumn || !toColumn || !task) return

    delete fromColumn.tasks[taskId]
    fromColumn.taskOrder = fromColumn.taskOrder.filter(id => id !== taskId)
    toColumn.tasks[taskId] = task
    toColumn.taskOrder.push(taskId)
  }

  const editTask = (deskId: string, columnId: string, taskId: string, title: string, description: string) => {
    const task = desks.value[deskId]?.columns[columnId]?.tasks[taskId]
    if (task) {
      task.title = title
      task.description = description
    }
  }

  const clearAll = () => {
    desks.value = {}
    activeDeskId.value = null
  }

  return {
    desks,
    activeDeskId,
    activeDesk,
    addDesk,
    setActiveDesk,
    deleteDesk,
    editDesk,
    addColumn,
    addTask,
    moveTask,
    editTask,
    clearAll
  }
})
