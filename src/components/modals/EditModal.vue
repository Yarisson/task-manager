<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal__title">Update new board</h2>
        <button class="modal-close" @click="$emit('close')">
          <CloseIcon />
        </button>
      </div>
      <p>Are you sure you want to delete this board?</p>
      <form class="modal__form" @submit.prevent="updateBoard">
        <label class="modal__label" for="name">board name</label>
        <input class="modal__input" type="text" id="name" v-model="name" required>
        <button type="submit" class="btn btn-primary modal__button">Update</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDeskStore } from '@/stores/desk';
import { ref } from 'vue';
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

const { editDesk } = useDeskStore()

const name = ref(props.desk.name)

const updateBoard = () => {
  editDesk(props.desk.id, name.value.trim())
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

.modal__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal__button {
  align-self: flex-end;
}
</style>
