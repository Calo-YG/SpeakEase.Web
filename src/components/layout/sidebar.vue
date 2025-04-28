<template>
  <div 
    class="sidebar" 
    :class="{ 'collapsed': modelValue }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="logo-section">
      <div class="logo-icon">🗣️</div>
      <h1 class="title" v-if="!modelValue">SpeakEase</h1>
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
        <span class="menu-text" v-if="!modelValue">{{ item.label }}</span>
        <div class="menu-tooltip" v-if="modelValue">{{ item.label }}</div>
      </div>
    </div>

    <div class="collapse-btn" @click="toggleCollapse">
      <menu-fold-outlined v-if="!modelValue" class="collapse-icon" />
      <menu-unfold-outlined v-else class="collapse-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  HomeOutlined,
  ReadOutlined,
  SoundOutlined,
  AudioOutlined,
  BookOutlined,
  CalendarOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons-vue';

const props = defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const router = useRouter();
const route = useRoute();
let touchStartX = 0;
let touchEndX = 0;

const currentRoute = computed(() => {
  return route.path.split('/')[2] || '';
});

const menuItems = [
  { 
    key: '', 
    label: '学习概览', 
    icon: HomeOutlined,
    route: '/index'
  },
  { 
    key: 'vocabulary', 
    label: '词汇学习', 
    icon: ReadOutlined,
    route: '/index/vocabulary'
  },
  { 
    key: 'listening', 
    label: '听力训练', 
    icon: SoundOutlined,
    route: '/index/listening'
  },
  { 
    key: 'speaking', 
    label: '口语练习', 
    icon: AudioOutlined,
    route: '/index/speaking'
  },
  { 
    key: 'reading', 
    label: '阅读理解', 
    icon: BookOutlined,
    route: '/index/reading'
  },
  { 
    key: 'practice', 
    label: '每日练习', 
    icon: CalendarOutlined,
    route: '/index/practice'
  },
  { 
    key: 'settings', 
    label: '系统设置', 
    icon: SettingOutlined,
    route: '/index/settings'
  },
];

function handleMenuClick(item: any) {
  router.push(item.route);
  if (window.innerWidth <= 768) {
    emit('update:modelValue', true);
  }
}

function toggleCollapse() {
  emit('update:modelValue', !props.modelValue);
}

function handleTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX;
}

function handleTouchMove(e: TouchEvent) {
  touchEndX = e.touches[0].clientX;
}

function handleTouchEnd() {
  const swipeDistance = touchEndX - touchStartX;
  if (Math.abs(swipeDistance) > 50) {
    if (swipeDistance < 0) {
      emit('update:modelValue', true);
    } else {
      emit('update:modelValue', false);
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background: var(--component-bg);
  backdrop-filter: blur(8px);
  border-right: 1px solid rgba(var(--border-color-rgb), 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar.collapsed {
  width: 48px;
}

.logo-section {
  height: 48px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid rgba(var(--border-color-rgb), 0.1);
}

.logo-icon {
  font-size: 18px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-section {
  flex: 1;
  padding: 2px 0;
  overflow-y: auto;
}

.menu-item {
  height: 36px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    background: var(--menu-item-hover);
  }
  
  &.active {
    background: var(--menu-item-active);
    
    .menu-icon {
      color: var(--primary-color);
    }
    
    .menu-text {
      color: var(--primary-color);
      font-weight: 500;
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--primary-color);
      border-radius: 0 1px 1px 0;
    }
  }
}

.menu-icon {
  font-size: 15px;
  color: var(--text-secondary);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-text {
  font-size: 13px;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.menu-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: var(--tooltip-bg);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
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
    border-color: transparent var(--tooltip-bg) transparent transparent;
  }
}

.menu-item:hover .menu-tooltip {
  opacity: 1;
  visibility: visible;
  left: calc(100% + 8px);
}

.collapse-btn {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(var(--border-color-rgb), 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.collapse-icon {
  font-size: 13px;
  color: var(--text-secondary);
  transition: transform 0.3s;
}

.sidebar.collapsed {
  width: 48px;
  
  .logo-section {
    padding: 0;
    justify-content: center;
  }
  
  .menu-item {
    padding: 0;
    justify-content: center;
    
    .menu-icon {
      width: 100%;
      height: 100%;
    }
  }
  
  .menu-text {
    display: none;
  }
  
  .title {
    display: none;
  }
  
  .collapse-btn {
    padding: 0;
  }
  
  .collapse-icon {
    transform: rotate(180deg);
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.collapsed {
    transform: translateX(-100%);
  }
  
  .sidebar:not(.collapsed) {
    transform: translateX(0);
    box-shadow: 4px 0 8px var(--shadow-color);
  }
  
  .menu-tooltip {
    display: none;
  }
}
</style>
  