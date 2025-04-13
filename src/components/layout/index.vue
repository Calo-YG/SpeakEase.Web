<template>
  <div class="layout-container">
    <Sidebar />
    <div class="main-container">
      <Header />
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/layout/header.vue";
import Sidebar from "@/components/layout/sidebar.vue";
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.layout-container {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
  position: relative;
  overflow: hidden;
  width:100%;
}

.layout-container::after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: #010101;
  width: 60%;
  height: 100%;
  clip-path: polygon(0 100%, 0 0, 100% 0, 70% 100%);
  z-index: -1;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  z-index: 1;
  background-color: transparent;
}

.main-container > .main-header {
  height: 64px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* router-view 包裹层，可增强内容的卡片感 */
.main-content > * {
  width: 100%;
  max-width: 1200px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

</style>
