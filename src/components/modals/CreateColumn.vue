<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal__title">Create New Column</h2>
        <button class="modal-close" @click="$emit('close')">
          <CloseIcon />
        </button>
      </div>
      <form class="modal__form" @submit.prevent="createColumn">
        <label for="name">Column name</label>
        <input type="text" id="name" v-model="name" required>
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
import { useColumnStore } from '@/stores/column';
import CloseIcon from '@/components/icons/CloseIcon.vue';

const props = defineProps<{
  deskId: string
}>()

const emit = defineEmits<{
  close: []
}>()

const name = ref('')
const { addColumn } = useColumnStore()

const createColumn = () => {
  if (name.value.trim()) {
    addColumn(name.value.trim(), props.deskId)
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
