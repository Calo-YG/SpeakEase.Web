<template>
  <div class="layout-container">
    <Sidebar />
    <div class="main-container">
      <Header />
      <div class="main-content">
        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
  width: 100%;
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
  overflow: hidden;
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

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  min-height: calc(100vh - 112px);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
    border-radius: 12px;
  }
  
  .main-content {
    padding: 16px;
  }
}
</style>
