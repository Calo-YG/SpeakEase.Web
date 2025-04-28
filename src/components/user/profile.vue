<template>
  <div class="user-profile">
    <div class="profile-card">
      <!-- 用户头像 -->
      <a-avatar :src="user.avatar" size="large" />

      <!-- 用户昵称 -->
      <p><strong>用户名称：</strong>{{ user.userName }}</p>

      <!-- 用户邮箱和手机号 -->
      <p><strong>邮箱：</strong>{{ user.email }}</p>
      <p><strong>手机号：</strong>{{ user.phone }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getUser } from "@/api/user";
import type { UserResponse } from "@/api/user/user";

const baseurl = import.meta.env.VITE_API_BASE;
const user = ref<UserResponse>({
  avatar: "",
  email: "",
  phone: "",
  userId: null,
  userName: "",
});

onMounted(() => {
  getUser().then((res) => {
    user.value = res;
    user.value.avatar = getAvatar(res.avatar)
  });
});

function getAvatar(url: string): string {
  const exists = url.includes("http://") || url.includes("https://");

  return exists ? url : baseurl+"/"+url
}
</script>

<style scoped>
.user-profile {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.profile-card {
  width: 400px;
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.profile-card h2 {
  margin: 16px 0;
  font-size: 24px;
  color: #333;
}

.profile-card p {
  margin: 8px 0;
  font-size: 16px;
  color: #666;
}

.actions {
  margin-top: 24px;
  display: flex;
  justify-content: space-around;
}
</style>
