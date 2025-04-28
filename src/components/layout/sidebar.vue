<template>
  <div class="sidebar">
    <div class="logo-container">
      <div class="logo">
        <span class="logo-icon">🗣️</span>
        <span class="logo-text">SpeakEase</span>
      </div>
    </div>
    <div class="menu-container">
      <a-menu
        mode="inline"
        theme="dark"
        :selectedKeys="[currentRoute]"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </div>
    <div class="sidebar-footer">
      <div class="version">Version 1.0.0</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue";
import { useRouter, useRoute } from "vue-router";
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();

const currentRoute = computed(() => route.path);

const menuItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '首页',
  },
  {
    key: '/profile',
    icon: () => h(UserOutlined),
    label: '个人中心',
  },
  {
    key: '/settings',
    icon: () => h(SettingOutlined),
    label: '设置',
  },
];

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key);
};
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.logo-container {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  background: linear-gradient(90deg, #fff 0%, #a8a8a8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.menu-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.menu-container::-webkit-scrollbar {
  width: 4px;
}

.menu-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.version {
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
}

:deep(.ant-menu) {
  background: transparent;
}

:deep(.ant-menu-item) {
  margin: 4px 0;
  border-radius: 8px;
  margin: 4px 12px;
}

:deep(.ant-menu-item-selected) {
  background: rgba(255, 255, 255, 0.1) !important;
}

:deep(.ant-menu-item:hover) {
  background: rgba(255, 255, 255, 0.05);
}

:deep(.ant-menu-item .anticon) {
  font-size: 16px;
}
</style>
  