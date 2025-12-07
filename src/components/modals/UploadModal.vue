<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal__title">Export Data</h2>
        <button class="modal-close" @click="$emit('close')">
          <CloseIcon />
        </button>
      </div>
      <p class="modal__text">Export all your boards, columns and tasks to JSON file</p>
      <div class="modal-actions">
        <button class="btn btn-primary" @click="exportData">Export JSON</button>
        <button class="btn-secondary" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDeskStore } from '@/stores/desks/desk';
import CloseIcon from '@/components/icons/CloseIcon.vue';

const emit = defineEmits<{
  close: []
}>()

const deskStore = useDeskStore();
const { desks } = storeToRefs(deskStore);

const exportData = () => {
  const exportData = Object.values(desks.value).map(desk => ({
    board: {
      id: desk.id,
      title: desk.name
    },
    columns: desk.columnOrder
      .map(columnId => desk.columns[columnId])
      .filter(column => column !== undefined)
      .map(column => ({
        color: column.color,
        items: column.taskOrder
          .map(taskId => column.tasks[taskId])
          .filter(task => task !== undefined)
          .map(task => ({
            status: {
              title: column.name,
              id: column.id
            },
            title: task.title,
            description: task.description,
            id: task.id
          })),
        status: {
          title: column.name,
          id: column.id
        }
      }))
  }));

  const jsonString = JSON.stringify(exportData);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `kanban_export_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  emit('close');
};
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

.modal__text {
  color: #6b7280;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
