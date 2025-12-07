<template>
  <section class="sidebar">
    <h1 class="sidebar__main-title">
      <AnaliticsIcon size="24" /><span>kanban</span>
    </h1>
    <div class="sidebar__list">
      <h3 class="sidebar__title">All boards ({{ deskList.length }})</h3>
      <button v-for="desk in deskList" :key="desk.id" class="sidebar__item"
        :class="{ 'sidebar__item--active': activeDeskId === desk.id }" @click="setActiveDesk(desk.id)">
        <TableIcon />
        <span>{{ desk.name }}</span>
      </button>
      <button class="btn sidebar-list__button" @click="openModal = true">
        <TableIcon />
        + Create new board
      </button>
    </div>
    <div class="theme-toggle">
      <SunIcon />
      <input type="checkbox" id="theme" v-model="isDark" @change="toggleTheme">
      <label for="theme" class="theme-switch"></label>
      <MoonIcon />
    </div>
  </section>
  <CreateDesk v-if="openModal" @close="openModal = false" />
</template>

<script setup lang="ts">
defineOptions({ name: 'AppSidebar' });

import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import CreateDesk from '@/components/modals/CreateDesk.vue';
import { useDeskStore } from '@/stores/desks/desk';
import TableIcon from '@/components/icons/TableIcon.vue';
import AnaliticsIcon from '@/components/icons/AnaliticsIcon.vue';
import SunIcon from '@/components/icons/SunIcon.vue';
import MoonIcon from '@/components/icons/MoonIcon.vue';

const openModal = ref(false);
const deskStore = useDeskStore();
const { desks, activeDeskId } = storeToRefs(deskStore);
const { setActiveDesk } = deskStore;

const deskList = computed(() => Object.values(desks.value));

const isDark = ref(false);

document.documentElement.setAttribute('data-theme', 'light');

const toggleTheme = () => {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 32px;
  min-width: 260px;
  height: 100%;
  background-color: var(--color-background-mute);
  border-right: 1px solid var(--color-border-light);
}

.sidebar__main-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  color: var(--color-heading);
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.sidebar__main-title svg {
  fill: var(--color-heading);
}

.sidebar__title {
  color: var(--color-heading);
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
}

.sidebar__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-list__button {
  color: var(--color-text);
}

.sidebar-list__button svg {
  fill: var(--color-heading);
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;
  font-family: inherit;
}

.sidebar__item:hover {
  background-color: var(--color-border);
}

.sidebar__item span {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}

.sidebar__item svg {
  fill: var(--color-text);
  width: 16px;
  height: 16px;
}

.sidebar__item.sidebar__item--active {
  background-color: var(--color-primary);
}

.sidebar__item.sidebar__item--active span {
  color: white;
}

.sidebar__item.sidebar__item--active svg {
  fill: white;
}

.task-list__button {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}

.theme-toggle {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-toggle input[type="checkbox"] {
  display: none;
}

.theme-switch {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: var(--color-switch);
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.theme-switch::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.theme-toggle input[type="checkbox"]:checked+.theme-switch {
  background-color: var(--color-primary);
}

.theme-toggle input[type="checkbox"]:checked+.theme-switch::before {
  transform: translateX(20px);
}

.theme-toggle svg {
  fill: var(--color-text);
  width: 16px;
  height: 16px;
}
</style>
