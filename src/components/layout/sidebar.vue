<template>
  <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="logo-section">
      <div class="logo-icon">🗣️</div>
      <h1 class="title" v-if="!isCollapsed">SpeakEase</h1>
    </div>

    <div class="menu-section">
      <div 
        v-for="item in menuItems" 
        :key="item.key"
        class="menu-item"
        :class="{ 'active': currentRoute === item.key }"
        @click="handleMenuClick(item)"
      >
        <component :is="item.icon" class="menu-icon" />
        <span class="menu-text" v-if="!isCollapsed">{{ item.label }}</span>
        <div class="menu-tooltip" v-if="isCollapsed">{{ item.label }}</div>
      </div>
    </div>

    <div class="collapse-btn" @click="toggleCollapse">
      <menu-fold-outlined v-if="!isCollapsed" class="collapse-icon" />
      <menu-unfold-outlined v-else class="collapse-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  HomeOutlined,
  UserOutlined,
  MessageOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const isCollapsed = ref(false);

const currentRoute = computed(() => {
  return route.path.split('/')[1] || 'home';
});

const menuItems = [
  { key: 'home', label: '首页', icon: HomeOutlined },
  { key: 'user', label: '用户管理', icon: UserOutlined },
  { key: 'message', label: '消息中心', icon: MessageOutlined },
  { key: 'setting', label: '系统设置', icon: SettingOutlined },
];

function handleMenuClick(item: any) {
  router.push(`/${item.key}`);
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar.collapsed {
  width: 80px;
}

.logo-section {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.logo-icon {
  font-size: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-section {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.menu-item {
  height: 48px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  
  &.active {
    background: rgba(22, 119, 255, 0.1);
    
    .menu-icon {
      color: #1677ff;
    }
    
    .menu-text {
      color: #1677ff;
      font-weight: 500;
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #1677ff;
      border-radius: 0 2px 2px 0;
    }
  }
}

.menu-icon {
  font-size: 18px;
  color: #666;
  flex-shrink: 0;
}

.menu-text {
  font-size: 14px;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 1000;
  
  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 4px;
    border-style: solid;
    border-color: transparent rgba(0, 0, 0, 0.75) transparent transparent;
  }
}

.menu-item:hover .menu-tooltip {
  opacity: 1;
  visibility: visible;
  left: calc(100% + 8px);
}

.collapse-btn {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.collapse-icon {
  font-size: 16px;
  color: #666;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.collapsed {
    transform: translateX(0);
  }
  
  .menu-text {
    display: none;
  }
  
  .menu-tooltip {
    display: none;
  }
}
</style>
  