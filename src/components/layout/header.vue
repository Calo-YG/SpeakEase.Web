<template>
    <div class="header-bar">
      <div class="user-section">
        <a-dropdown>
          <div class="user-dropdown-trigger">
            <a-avatar :src="store?.avatar" />
             <span class="username">{{ store?.userName }}</span>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="profile" @click="setModal1Visible()">
                👤 个人信息
              </a-menu-item>
              <a-menu-item key="password" @click="goTo('/reset')">
                🛠 修改密码
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="logout">
                🔓 退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a href="https://github.com/your-repo" target="_blank" class="github-link">
          GitHub
        </a>
      </div>
    </div>

    <profile v-if="visible" />
  </template>
  
  <script setup lang="ts">
  import {ref,onMounted} from "vue"
  import { useRouter } from "vue-router";
  import { TokenStorage} from "@/utils/tokenStorage"
  import type { UserState } from "@/store/user/user"
  import profile from "@/components/user/profile.vue"
  
  const router = useRouter();
  const visible = ref(false)
  const store = ref<UserState | null>({
    userId: null,
    userName: "",
    email: "",
    phone: "",
    avatar: "",
    token: "",
    refreshToken: ""
  })

  onMounted(()=>{
    store.value = TokenStorage.getUserInfo()
  })

  function setModal1Visible(){
    visible.value = !visible.value
  }
  

  function logout() {
    localStorage.clear();
    router.push("/login");
  }
  
  function goTo(path: string) {
    router.push(path);
  }
  </script>
  
  <style scoped>
  .header-bar {
    height: 64px;
    padding: 0 24px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
  }
  
  .user-section {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .user-dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  
  .username {
    font-weight: 500;
  }
  
  .github-link {
    color: #1677ff;
    text-decoration: none;
    font-size: 14px;
    transition: 0.3s;
  }
  
  .github-link:hover {
    text-decoration: underline;
  }

  .profile{
    position: absolute;
    top: 0px;   /* 距父元素顶部 20px */
    right: 30px; /* 距父元素右侧 30px */
    background-color: #4caf50;
    padding: 10px;
  }
  </style>
  