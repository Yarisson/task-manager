import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export interface Column {
  id: string
  name: string
  deskId: string
  color: string
}

export const useColumnStore = defineStore('column', () => {
  const columns = ref<Column[]>(JSON.parse(localStorage.getItem('columns') || '[]'))

  watch(columns, (newValue) => {
    localStorage.setItem('columns', JSON.stringify(newValue))
  }, { deep: true })

  const getColumnsByDeskId = (deskId: string) => {
    return computed(() => columns.value.filter(column => column.deskId === deskId))
  }

  const addColumn = (name: string, deskId: string) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newColumn: Column = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      deskId,
      color: randomColor!
    }
    columns.value.push(newColumn)
    return newColumn.id
  }

  const clearAll = () => {
    columns.value = []
  }

  return { columns, getColumnsByDeskId, addColumn, clearAll }
})