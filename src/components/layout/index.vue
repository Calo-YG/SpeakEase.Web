<template>
  <div class="layout-container">
    <Sidebar v-model="isCollapsed" />
    <div class="main-container" :class="{ 'sidebar-collapsed': isCollapsed }">
      <Header :is-collapsed="isCollapsed" @toggle-sidebar="toggleSidebar" />
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
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

// 配置 NProgress
NProgress.configure({ 
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
});

const router = useRouter();
const isCollapsed = ref(false);

// 处理窗口大小变化
function handleResize() {
  if (window.innerWidth <= 768) {
    isCollapsed.value = true;
  }
}

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

// 注册路由钩子
const removeRouterGuard = router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  removeRouterGuard();
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.layout-container {
  display: flex;
  min-height: 100vh;
  background: var(--bg-color);
  position: relative;
  overflow-x: hidden;
  width: 100%;
}

.layout-container::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    var(--primary-bg) 0%, 
    var(--component-bg) 50%, 
    var(--border-secondary) 100%
  );
  width: 60%;
  height: 100%;
  clip-path: polygon(0 100%, 0 0, 100% 0, 70% 100%);
  z-index: -1;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 240px;
  transition: margin-left 0.3s ease;
  position: relative;
  min-height: 100vh;
}

.main-container.sidebar-collapsed {
  margin-left: 64px;
}

.main-container > .main-header {
  height: 64px;
  background-color: var(--component-bg);
  box-shadow: 0 2px 8px rgba(var(--shadow-color-rgb), 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.main-content {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  position: relative;
}

.content-wrapper {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 24px;
  min-height: calc(100vh - 96px);
  box-shadow: 0 2px 8px var(--shadow-color);
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
}

/* 自定义 NProgress 样式 */
:global(#nprogress .bar) {
  background: var(--primary-color) !important;
  height: 3px;
}

:global(#nprogress .peg) {
  box-shadow: 0 0 10px var(--primary-color), 0 0 5px var(--primary-color);
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
  background: var(--border-color);
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 20px;
  }
  
  .main-content {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    padding: 16px;
  }
  
  .main-content {
    padding: 8px;
  }
}

@media (max-width: 768px) {
  .main-container {
    margin-left: 0;
  }
  
  .main-container.sidebar-collapsed {
    margin-left: 0;
  }
  
  .main-content {
    padding: 8px;
  }
  
  .content-wrapper {
    padding: 12px;
    border-radius: 8px;
    min-height: calc(100vh - 80px);
  }
}

@media (max-width: 576px) {
  .main-content {
    padding: 4px;
  }
  
  .content-wrapper {
    padding: 8px;
    border-radius: 4px;
  }
}
</style>
