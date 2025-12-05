<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal__title">Create New Task</h2>
        <button class="modal-close" @click="$emit('close')">
          <CloseIcon />
        </button>
      </div>
      <form class="modal__form" @submit.prevent="createTask">
        <label for="title">Task title</label>
        <input type="text" id="title" v-model="title" required>

        <label for="description">Description</label>
        <textarea id="description" v-model="description" rows="3"></textarea>

        <label for="column">Column</label>
        <select id="column" v-model="selectedColumnId" required>
          <option value="">Select column</option>
          <option v-for="column in columns" :key="column.id" :value="column.id">
            {{ column.name }}
          </option>
        </select>

        <div class="modal-actions">
          <button type="submit" class="btn btn-primary">Create</button>
          <button type="button" class="btn-secondary" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '@/stores/task';
import type { Column } from '@/stores/column';
import CloseIcon from '@/components/icons/CloseIcon.vue';

defineProps<{
  columns: Column[]
}>()

const emit = defineEmits<{
  close: []
}>()

const title = ref('')
const description = ref('')
const selectedColumnId = ref('')

const { addTask } = useTaskStore()

const createTask = () => {
  if (title.value.trim() && selectedColumnId.value) {
    addTask(title.value.trim(), description.value.trim(), selectedColumnId.value)
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-modal-bg);
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
}

.modal__title {
  font-size: 18px;
  font-weight: 600;
}

.modal__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
