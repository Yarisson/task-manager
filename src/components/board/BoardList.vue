<template>
  <div class="board-list">
    <div v-if="!activeDesk" class="no-desk">
      <p>Select a board to start</p>
    </div>
    <div v-else class="columns">
      <div v-for="column in deskColumns" :key="column.id" class="column">
        <h3 class="column-header">
          <span class="column-dot" :style="{ backgroundColor: column?.color }"></span>
          {{ column?.name }}
        </h3>
        <draggable :model-value="getTasksByColumn(column.id)"
          @update:model-value="(newTasks: Task[]) => updateColumnTasks(column.id, newTasks)" group="tasks" item-key="id"
          class="tasks">
          <template #item="{ element }">
            <div class="task" @click="openEditTask(element, column.id)">
              <h4>{{ element.title }}</h4>
              <p v-if="element.description">{{ element.description }}</p>
            </div>
          </template>
        </draggable>
      </div>
      <button class="add-column-button" @click="openModal = true">
        + New Column
      </button>
    </div>
  </div>
  <CreateColumn v-if="openModal && activeDeskId" :deskId="activeDeskId" @close="openModal = false" />
  <EditTask v-if="editTaskModal && selectedTask && activeDeskId" :task="selectedTask" :columnId="selectedColumnId" :deskId="activeDeskId" :columns="deskColumns" @close="closeEditTask" />

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';
import type { Task, Column } from '@/stores/desks/types';
import { useDeskStore } from '@/stores/desks/desk';
import CreateColumn from '@/components/modals/CreateColumn.vue';
import EditTask from '@/components/modals/EditTask.vue';

const openModal = ref(false);
const editTaskModal = ref(false);
const selectedTask = ref<Task | null>(null);
const selectedColumnId = ref<string>('');

const deskStore = useDeskStore();
const { activeDesk, activeDeskId } = storeToRefs(deskStore);
const { moveTask } = deskStore;

const deskColumns = computed(() => {
  const desk = activeDesk.value;
  if (!desk || !desk.columnOrder) return [];

  return desk.columnOrder
    .map(id => desk.columns[id])
    .filter((col): col is Column => col !== undefined);
});

const getTasksByColumn = (columnId: string) => {
  if (!activeDesk.value) return [];
  const column = activeDesk.value.columns[columnId];
  return column ? column.taskOrder.map(id => column.tasks[id]) : [];
};

const updateColumnTasks = (columnId: string, newTasks: Task[]) => {
  if (!activeDeskId.value) return;

  newTasks.forEach((task) => {
    const currentColumn = Object.values(activeDesk.value!.columns).find(col =>
      col.tasks[task.id]
    );

    if (currentColumn && currentColumn.id !== columnId) {
      moveTask(activeDeskId.value!, task.id, currentColumn.id, columnId);
    }
  });
};

const openEditTask = (task: Task, columnId: string) => {
  selectedTask.value = task;
  selectedColumnId.value = columnId;
  editTaskModal.value = true;
};

const closeEditTask = () => {
  editTaskModal.value = false;
  selectedTask.value = null;
  selectedColumnId.value = '';
};

</script>

<style scoped>
.board-list {
  flex: 1;
  padding: 24px;
  background-color: var(--color-background);
  overflow: hidden;
}

.empty-board {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}

.new-column-button {
  width: 400px;
  height: 100%;
  background-color: var(--color-background-mute);
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
}

.no-desk {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.no-desk p {
  color: var(--color-text);
  font-size: 18px;
}

.new-column-button:hover {
  background-color: var(--color-border);
}

.columns {
  display: flex;
  gap: 16px;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.column {
  width: 280px;
  flex-shrink: 0;
  background-color: var(--color-background-mute);
  border-radius: 8px;
  padding: 16px;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-heading);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: var(--color-background);
  border-radius: 6px;
}

.column-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.add-column-button {
  width: 280px;
  flex-shrink: 0;
  height: 100%;
  padding: 16px;
  background-color: var(--color-background-mute);
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
}

.add-column-button:hover {
  background-color: var(--color-border);
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.task {
  background-color: var(--color-background);
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid var(--color-border);
  cursor: grab;
  transition: transform 0.2s;
}

.task:hover {
  transform: translateY(-2px);
}

.task:active {
  cursor: grabbing;
}

.tasks {
  min-height: 100px;
}

.task h4 {
  color: var(--color-heading);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.task p {
  color: var(--color-text);
  font-size: 12px;
  margin: 0;
}
</style>
