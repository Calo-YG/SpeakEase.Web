<template>
  <div class="header-bar">
    <div class="header-left">
      <div class="menu-trigger" @click="$emit('toggle-sidebar')">
        <menu-fold-outlined v-if="!isCollapsed" class="icon" />
        <menu-unfold-outlined v-else class="icon" />
      </div>
      <div class="breadcrumb">
        <span class="current-page">{{ currentRoute }}</span>
      </div>
    </div>
    <div class="header-right">
      <div class="user-section">
        <div class="theme-switch" @click="toggleTheme">
          <bulb-outlined v-if="isDarkMode" class="icon" />
          <check-outlined v-else class="icon" />
        </div>
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
            <div class="menu-item" @click="navigateToProfile">
              <user-outlined class="menu-icon" />
              <span>个人中心</span>
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

        <a href="https://github.com/Calo-YG/SpeakEase" target="_blank" class="github-link">
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
import { ref, onMounted, computed, onUnmounted } from "vue";
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
  CheckOutlined,
  BulbOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons-vue';

defineProps<{
  isCollapsed: boolean
}>();

defineEmits<{
  (e: 'toggle-sidebar'): void
}>();

const router = useRouter();
const route = useRoute();
const visible = ref(false);
const open = ref(false);
const isDropdownOpen = ref(false);
const store = ref<UserState | null>(null);
const notificationCount = ref(5);
const defaultAvatar = '/src/assets/default-avatar.png';
const baseUrl = import.meta.env.VITE_API_BASE || '';
const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

const currentRoute = computed(() => {
  const path = route.path;
  return path === '/' ? '首页' : path.split('/')[1];
});

const avatarUrl = computed(() => {
  if (!store.value?.avatar) return defaultAvatar;
  return store.value.avatar.startsWith('http') ? store.value.avatar : `${baseUrl}${store.value.avatar}`;
});

onMounted(() => {
  store.value = TokenStorage.getUserInfo();
  initTheme();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-dropdown')) {
    isDropdownOpen.value = false;
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  isDarkMode.value = savedTheme === 'dark';
}

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  const newTheme = isDarkMode.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

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

function toggleDropdown(event: Event) {
  event.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
}

function showNotifications() {
  console.log('显示通知');
}

function navigateToProfile() {
  router.push('/index/profile');
  isDropdownOpen.value = false;
}
</script>

<style scoped>
.header-bar {
  height: 56px;
  padding: 0 16px;
  background: var(--header-bg);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(var(--border-color-rgb), 0.1);
  position: sticky;
  top: 0;
  z-index: 99;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background: var(--menu-item-hover);
  }
  
  .icon {
    font-size: 16px;
  }
}

.current-page {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
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

.theme-switch,
.notification-icon {
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    background: var(--menu-item-hover);
  }
}

.notification-icon .badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--error-color);
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.user-dropdown {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: var(--menu-item-hover);
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
  color: var(--text-color);
}

.dropdown-icon {
  font-size: 12px;
  color: var(--text-secondary);
  transition: transform 0.3s;
  
  &.rotate {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--component-bg);
  border-radius: 8px;
  box-shadow: 0 6px 16px var(--shadow-color);
  padding: 8px;
  min-width: 160px;
  animation: slideDown 0.3s ease;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  z-index: 1000;
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
    background: var(--menu-item-hover);
  }
}

.menu-icon {
  font-size: 16px;
  color: var(--text-secondary);
}

.divider {
  height: 1px;
  background: rgba(var(--border-color-rgb), 0.1);
  margin: 8px 0;
}

.icon {
  font-size: 18px;
  color: var(--text-secondary);
}

.github-link {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  transition: color 0.3s;
  
  &:hover {
    color: var(--primary-color);
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--modal-mask);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--component-bg);
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
  border-bottom: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color);
  }
}

.close-icon {
  font-size: 16px;
  color: var(--text-secondary);
  cursor: pointer;
  
  &:hover {
    color: var(--error-color);
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

@media (max-width: 992px) {
  .header-bar {
    padding: 0 16px;
  }
  
  .user-section {
    gap: 16px;
  }
  
  .current-page {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .header-bar {
    padding: 0 12px;
  }
  
  .menu-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .user-section {
    gap: 12px;
  }
  
  .username,
  .github-link {
    display: none;
  }
  
  .user-info {
    padding: 4px;
  }
  
  .dropdown-menu {
    right: -12px;
  }
  
  .notification-icon .badge {
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    font-size: 10px;
  }
}

@media (max-width: 576px) {
  .header-bar {
    padding: 0 8px;
  }
  
  .user-section {
    gap: 8px;
  }
  
  .current-page {
    font-size: 14px;
  }
  
  .theme-switch,
  .notification-icon {
    padding: 4px;
  }
  
  .icon {
    font-size: 16px;
  }
  
  .avatar {
    width: 28px;
    height: 28px;
  }
  
  .modal-content {
    width: 90%;
    margin: 0 16px;
  }
}
</style>
