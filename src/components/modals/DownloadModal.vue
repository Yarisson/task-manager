<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal__title">Import Data</h2>
        <button class="modal-close" @click="$emit('close')">
          <CloseIcon />
        </button>
      </div>
      <p class="modal__text">Import boards, columns and tasks from JSON file</p>
      <input type="file" ref="fileInput" accept=".json" @change="handleFileSelect" style="display: none">
      <div class="modal-actions">
        <button class="btn btn-primary" @click="selectFile">Select JSON File</button>
        <button class="btn-secondary" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDeskStore } from '@/stores/desks/desk';
import CloseIcon from '@/components/icons/CloseIcon.vue';

const emit = defineEmits<{
  close: []
}>()

const fileInput = ref<HTMLInputElement>();

const deskStore = useDeskStore();
const { addDesk, addColumn, addTask, clearAll } = deskStore;

const selectFile = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        importData(jsonData);
        emit('close');
      } catch {
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  }
};

interface ImportItem {
  title: string
  description: string
}

interface ImportColumn {
  status: { title: string }
  items: ImportItem[]
}

interface ImportBoard {
  board: { title: string }
  columns: ImportColumn[]
}

const importData = (data: ImportBoard[]) => {
  clearAll()

  data.forEach(boardData => {
    const deskId = addDesk(boardData.board.title);

    boardData.columns.forEach((columnData) => {
      if (columnData.status.title !== '+ New Column') {
        const columnId = addColumn(deskId, columnData.status.title);

        columnData.items.forEach((item) => {
          addTask(deskId, columnId, item.title, item.description);
        });
      }
    });
  });
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
