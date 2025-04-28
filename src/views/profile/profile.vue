<template>
  <div class="profile-container">
    <a-card title="个人中心">
      <a-form :model="userInfo" layout="vertical">
        <a-form-item label="用户名">
          <a-input v-model:value="userInfo.userName" disabled />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="userInfo.email" disabled />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="userInfo.phone" disabled />
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/store/user/userStore";

const userStore = useUserStore();
const userInfo = ref(userStore.userInfo);
</script>

<style scoped>
.profile-container {
  padding: 24px;
}
</style> 