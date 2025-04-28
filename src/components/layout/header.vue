<template>
  <div class="header-bar">
    <div class="header-left">
      <div class="breadcrumb">
        <span class="current-page">{{ currentRoute }}</span>
      </div>
    </div>
    <div class="header-right">
      <div class="user-section">
        <div class="notification-icon" @click="showNotifications">
          <span class="badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
          <bell-outlined class="icon" />
        </div>
        
        <div class="user-dropdown" @click="toggleDropdown">
          <div class="user-info">
            <img :src="avatarUrl" class="avatar" />
            <span class="username">{{ store?.userName }}</span>
            <down-outlined class="dropdown-icon" :class="{ 'rotate': isDropdownOpen }" />
          </div>
          
          <div class="dropdown-menu" v-if="isDropdownOpen">
            <div class="menu-item" @click="setModal1Visible">
              <user-outlined class="menu-icon" />
              <span>个人信息</span>
            </div>
            <div class="menu-item" @click="openModal">
              <key-outlined class="menu-icon" />
              <span>修改密码</span>
            </div>
            <div class="divider"></div>
            <div class="menu-item" @click="logout">
              <logout-outlined class="menu-icon" />
              <span>退出登录</span>
            </div>
          </div>
        </div>

        <a href="https://github.com/your-repo" target="_blank" class="github-link">
          <github-outlined class="icon" />
        </a>
      </div>
    </div>
  </div>

  <profile v-if="visible" />
  <div class="modal" v-if="open">
    <div class="modal-content">
      <div class="modal-header">
        <h3>修改密码</h3>
        <close-outlined class="close-icon" @click="closeModal" />
      </div>
      <reset v-model:isOpen="open" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { TokenStorage } from "@/utils/tokenStorage";
import type { UserState } from "@/store/user/user";
import profile from "@/components/user/profile.vue";
import reset from "@/components/user/reset.vue";
import {
  UserOutlined,
  KeyOutlined,
  LogoutOutlined,
  BellOutlined,
  DownOutlined,
  GithubOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const visible = ref(false);
const open = ref(false);
const isDropdownOpen = ref(false);
const store = ref<UserState | null>(null);
const notificationCount = ref(5);
const defaultAvatar = '/src/assets/default-avatar.png';
const baseUrl = import.meta.env.VITE_API_BASE || '';

const currentRoute = computed(() => {
  const path = route.path;
  return path === '/' ? '首页' : path.split('/')[1];
});

// 处理头像 URL
const avatarUrl = computed(() => {
  if (!store.value?.avatar) return defaultAvatar;
  
  // 检查是否是完整的 URL
  if (store.value.avatar.startsWith('http://') || store.value.avatar.startsWith('https://')) {
    return store.value.avatar;
  }
  
  // 如果不是完整 URL，拼接基础路径
  return `${baseUrl}${store.value.avatar}`;
});

onMounted(() => {
  store.value = TokenStorage.getUserInfo();
});

function setModal1Visible() {
  visible.value = !visible.value;
  isDropdownOpen.value = false;
}

function logout() {
  TokenStorage.clear();
  router.push("/login");
}

function openModal() {
  open.value = true;
  isDropdownOpen.value = false;
}

function closeModal() {
  open.value = false;
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function showNotifications() {
  // 实现通知功能
  console.log('显示通知');
}
</script>

<style scoped>
.header-bar {
  height: 64px;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
}

.current-page {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.notification-icon {
  position: relative;
  cursor: pointer;
  
  .badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #ff4d4f;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 20px;
    text-align: center;
  }
}

.user-dropdown {
  position: relative;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-weight: 500;
  color: #1a1a1a;
}

.dropdown-icon {
  font-size: 12px;
  color: #666;
  transition: transform 0.3s;
  
  &.rotate {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 8px;
  min-width: 160px;
  margin-top: 8px;
  animation: slideDown 0.3s ease;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.menu-icon {
  font-size: 16px;
  color: #666;
}

.divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 8px 0;
}

.icon {
  font-size: 18px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: #1677ff;
  }
}

.github-link {
  display: flex;
  align-items: center;
  color: #666;
  transition: color 0.3s;
  
  &:hover {
    color: #1677ff;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
}

.close-icon {
  font-size: 16px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    color: #ff4d4f;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .header-bar {
    padding: 0 16px;
  }
  
  .user-section {
    gap: 16px;
  }
  
  .username {
    display: none;
  }
  
  .dropdown-menu {
    right: -100%;
  }
}
</style>
