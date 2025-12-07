<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal__title">Confirm</h2>
        <button class="modal-close" @click="$emit('close')">
          <CloseIcon />
        </button>
      </div>
      <p class="modal__text">Are you sure you want to delete this board?</p>
      <h3>{{ props.desk.name }}</h3>
      <button class="btn btn-primary modal__button" @click="deleteBoard">Delete board</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDeskStore } from '@/stores/desks/desk';
import CloseIcon from '@/components/icons/CloseIcon.vue';

const props = defineProps<{
  desk: {
    name: string
    id: string
  },
}>()

const emit = defineEmits<{
  close: []
}>()

const { deleteDesk } = useDeskStore()

const deleteBoard = () => {
  deleteDesk(props.desk.id)
  emit('close')
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--color-modal-bg);
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
}

.modal__title {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
}

.modal__text {
  color: #6b7280;
}

.modal__button {
  align-self: flex-end;
}
</style>
