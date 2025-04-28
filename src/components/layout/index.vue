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
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { onMounted, onUnmounted } from 'vue';
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

// 注册路由钩子
const removeRouterGuard = router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

onUnmounted(() => {
  removeRouterGuard(); // 清理路由守卫
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
  background: linear-gradient(135deg, #f6f8fc 0%, #e9f0f8 50%, #dce7f3 100%);
  position: relative;
  overflow: hidden;
  width: 100%;
}

.layout-container::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(22, 119, 255, 0.05) 100%);
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
  margin-left: 240px;
  transition: margin-left 0.3s;
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
  padding: 12px;
  background-color: transparent;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.content-wrapper {
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-height: calc(100vh - 88px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 自定义 NProgress 样式 */
:global(#nprogress .bar) {
  background: #1677ff !important;
  height: 3px;
}

:global(#nprogress .peg) {
  box-shadow: 0 0 10px #1677ff, 0 0 5px #1677ff;
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
  background: rgba(22, 119, 255, 0.2);
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

/* 响应式布局 */
@media (max-width: 1600px) {
  .content-wrapper {
    max-width: 1200px;
  }
}

@media (max-width: 1200px) {
  .content-wrapper {
    max-width: 960px;
  }
}

@media (max-width: 992px) {
  .main-container {
    margin-left: 80px;
  }
  
  .main-content {
    padding: 8px;
  }
  
  .content-wrapper {
    padding: 16px;
    border-radius: 8px;
  }
}

@media (max-width: 768px) {
  .main-container {
    margin-left: 0;
  }
  
  .main-content {
    padding: 4px;
  }
  
  .content-wrapper {
    padding: 12px;
    border-radius: 6px;
  }
}
</style>
