import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export interface Desk {
  id: string
  name: string
}

export const useDeskStore = defineStore('desk', () => {
  const deskList = ref<Desk[]>(JSON.parse(localStorage.getItem('deskList') || '[]'))
  const activeDesk = ref<Desk | null>(JSON.parse(localStorage.getItem('activeDesk') || 'null'))

  watch(deskList, (newValue) => {
    localStorage.setItem('deskList', JSON.stringify(newValue))
  }, { deep: true })

  watch(activeDesk, (newValue) => {
    localStorage.setItem('activeDesk', JSON.stringify(newValue))
  })

  const addDesk = (name: string) => {
    const newDesk: Desk = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
    }
    deskList.value.push(newDesk)
    if (!activeDesk.value) {
      activeDesk.value = newDesk
    }
    return newDesk.id
  }

  const deleteDesk = (id: string) => {
    deskList.value = deskList.value.filter((item) => item.id !== id)
    if (activeDesk.value?.id === id) {
      activeDesk.value = null
    }
  }

  const editDesk = (id: string, name: string) => {
    const desk = deskList.value.find((item) => item.id === id)
    if (desk) {
      desk.name = name
    }
  }

  const setActiveDesk = (desk: Desk) => {
    activeDesk.value = desk
  }

  const clearAll = () => {
    deskList.value = []
    activeDesk.value = null
  }

  return { deskList, activeDesk, addDesk, setActiveDesk, deleteDesk, editDesk, clearAll }
})
