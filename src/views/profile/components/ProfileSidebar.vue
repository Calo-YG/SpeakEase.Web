<template>
  <div class="sidebar">
    <div class="profile-menu">
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'info' }"
        @click="handleTabChange('info')"
      >
        <user-outlined class="menu-icon" />
        <span>基本资料</span>
      </div>
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'progress' }"
        @click="handleTabChange('progress')"
      >
        <bar-chart-outlined class="menu-icon" />
        <span>学习进度</span>
      </div>
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'calendar' }"
        @click="handleTabChange('calendar')"
      >
        <calendar-outlined class="menu-icon" />
        <span>学习日历</span>
      </div>
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'settings' }"
        @click="handleTabChange('settings')"
      >
        <setting-outlined class="menu-icon" />
        <span>账户设置</span>
      </div>
      <div 
        class="menu-item" 
        :class="{ active: activeTab === 'security' }"
        @click="handleTabChange('security')"
      >
        <safety-outlined class="menu-icon" />
        <span>安全设置</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  UserOutlined, 
  BarChartOutlined, 
  CalendarOutlined, 
  SettingOutlined, 
  SafetyOutlined 
} from '@ant-design/icons-vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  activeTab: string;
}>();

const emit = defineEmits<{
  (e: 'update:active-tab', value: string): void;
}>();

const handleTabChange = (tab: string) => {
  emit('update:active-tab', tab);
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-right: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.profile-menu {
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.menu-item:hover {
  background: #f0f2f5;
}

.menu-item.active {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 500;
}

.menu-icon {
  margin-right: 8px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    margin-right: 0;
    margin-bottom: 16px;
    padding: 16px;
  }
  
  .profile-menu {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .menu-item {
    width: calc(50% - 8px);
  }
}
</style> 