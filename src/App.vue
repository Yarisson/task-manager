<script setup lang="ts">
import Sidebar from '@/components/sidebar/Sidebar.vue';
import Header from '@/components/header/Header.vue';
import BoardList from '@/components/board/BoardList.vue';
</script>

<template>
  <div class="app">
    <Sidebar />
    <main class="main">
      <Header />
      <BoardList />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  height: 100vh;
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
