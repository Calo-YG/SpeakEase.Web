<template>
  <div class="header-bar">
    <div class="header-left">
      <div class="breadcrumb">
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>{{ currentRoute }}</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>
    <div class="header-right">
      <div class="user-section">
        <a-tooltip title="查看通知">
          <a-badge :count="5" class="notification-badge">
            <bell-outlined class="icon" />
          </a-badge>
        </a-tooltip>
        
        <a-dropdown>
          <div class="user-dropdown-trigger">
            <a-avatar :src="store?.avatar" :size="32" />
            <span class="username">{{ store?.userName }}</span>
            <down-outlined class="dropdown-icon" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="profile" @click="setModal1Visible">
                <template #icon><user-outlined /></template>
                个人信息
              </a-menu-item>
              <a-menu-item key="password" @click="openModal">
                <template #icon><key-outlined /></template>
                修改密码
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="logout">
                <template #icon><logout-outlined /></template>
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-tooltip title="访问 GitHub">
          <a
            href="https://github.com/your-repo"
            target="_blank"
            class="github-link"
          >
            <github-outlined class="icon" />
          </a>
        </a-tooltip>
      </div>
    </div>
  </div>

  <profile v-if="visible" />
  <a-modal
    v-model:open="open"
    title="修改密码"
    :footer="null"
    :width="400"
    :maskClosable="false"
  >
    <reset v-model:isOpen="open" />
  </a-modal>
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
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const visible = ref(false);
const open = ref(false);
const store = ref<UserState | null>(null);

const currentRoute = computed(() => {
  const path = route.path;
  return path === '/' ? '首页' : path.split('/')[1];
});

onMounted(() => {
  store.value = TokenStorage.getUserInfo();
});

function setModal1Visible() {
  visible.value = !visible.value;
}

function logout() {
  TokenStorage.clear();
  router.push("/login");
}

function openModal() {
  open.value = true;
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

.breadcrumb {
  font-size: 14px;
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

.notification-badge {
  cursor: pointer;
}

.user-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.user-dropdown-trigger:hover {
  background: rgba(0, 0, 0, 0.04);
}

.username {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.dropdown-icon {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.icon {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
  transition: color 0.3s;
}

.icon:hover {
  color: #1677ff;
}

.github-link {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.65);
  transition: color 0.3s;
}

.github-link:hover {
  color: #1677ff;
}

:deep(.ant-dropdown-menu) {
  padding: 4px;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

:deep(.ant-dropdown-menu-item) {
  padding: 8px 12px;
  border-radius: 4px;
}

:deep(.ant-dropdown-menu-item:hover) {
  background: rgba(0, 0, 0, 0.04);
}

:deep(.ant-dropdown-menu-item .anticon) {
  margin-right: 8px;
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
}
</style>
