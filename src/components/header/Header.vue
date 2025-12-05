<template>
  <header class="header">
    <h2 class="header__title">{{ activeDesk?.name }}</h2>
    <div class="header__buttons">
      <button v-if="deskList.length > 0" class="header__button" @click="openModalEdit = true" :disabled="!activeDesk">
        <EditIcon />
      </button>
      <button v-if="deskList.length > 0" class="header__button" @click="openModalDelete = true" :disabled="!activeDesk">
        <TrashIcon />
      </button>
      <button class="header__button" @click="openModalDownload = true">
        <DownloadIcon />
      </button>
      <button v-if="deskList.length > 0" class="header__button" @click="openModalUpload = true">
        <UploadIcon />
      </button>
    </div>
    <button class="btn btn-primary" @click="openTaskModal = true"
      :disabled="!activeDesk || deskColumns.length === 0">Add new task</button>
  </header>
  <DeleteModal v-if="openModalDelete && activeDesk" :desk="activeDesk" @close="openModalDelete = false" />
  <DownloadModal v-if="openModalDownload" @close="openModalDownload = false" />
  <EditModal v-if="openModalEdit && activeDesk" :desk="activeDesk" @close="openModalEdit = false" />
  <UploadModal v-if="openModalUpload" @close="openModalUpload = false" />
  <CreateTask v-if="openTaskModal && activeDesk" :columns="deskColumns" @close="openTaskModal = false" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import DownloadIcon from '@/components/icons/DownloadIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import UploadIcon from '@/components/icons/UploadIcon.vue';
import DeleteModal from '@/components/modals/DeleteModal.vue';
import DownloadModal from '@/components/modals/DownloadModal.vue';
import EditModal from '@/components/modals/EditModal.vue';
import UploadModal from '@/components/modals/UploadModal.vue';
import CreateTask from '@/components/modals/CreateTask.vue';
import { useDeskStore } from '@/stores/desk';
import { useColumnStore } from '@/stores/column';

const deskStore = useDeskStore();
const { deskList, activeDesk } = storeToRefs(deskStore);

const columnStore = useColumnStore();
const { columns } = storeToRefs(columnStore);

const deskColumns = computed(() => {
  if (!activeDesk.value) return [];
  return columns.value.filter(column => column.deskId === activeDesk.value!.id);
});

const openModalEdit = ref(false);
const openModalDelete = ref(false);
const openModalDownload = ref(false);
const openModalUpload = ref(false);
const openTaskModal = ref(false);
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 32px;
  background-color: var(--color-background-mute);
  border-bottom: 1px solid var(--color-border-light);
}

.header__title {
  color: var(--color-heading);
  font-size: 20px;
  font-weight: 600;
}

.header__buttons {
  display: flex;
  gap: 8px;
  margin-right: auto;
}

.header__button {
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}

header button:hover {
  background-color: var(--color-text);
}

header button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

header button svg {
  fill: var(--color-text);
  width: 16px;
  height: 16px;
}

header button:hover svg {
  fill: var(--color-background);
}
</style>
