<template>
  <div class="container">
    <div class="register-card">
      <div class="column">
        <h1>注册</h1>
        <p>加入 SpeakEase，让表达更简单</p>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="userName">昵称</label>
            <input
              id="userName"
              v-model="form.userName"
              type="text"
              placeholder="请输入昵称"
              maxlength="20"
              :class="{ 'error': errors.userName }"
            />
            <span class="error-message" v-if="errors.userName">{{ errors.userName }}</span>
          </div>

          <div class="form-group">
            <label for="userAccount">用户名</label>
            <input
              id="userAccount"
              v-model="form.userAccount"
              type="text"
              placeholder="请输入用户名"
              maxlength="16"
              :class="{ 'error': errors.userAccount }"
            />
            <span class="error-message" v-if="errors.userAccount">{{ errors.userAccount }}</span>
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <div class="password-input">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                maxlength="20"
                :class="{ 'error': errors.password }"
              />
              <span class="toggle-password" @click="togglePassword">
                {{ showPassword ? '隐藏' : '显示' }}
              </span>
            </div>
            <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="请输入邮箱"
              maxlength="50"
              :class="{ 'error': errors.email }"
            />
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="verificationCode">验证码</label>
            <div class="captcha-wrapper">
              <input
                id="verificationCode"
                v-model="form.verificationCode"
                type="text"
                placeholder="请输入验证码"
                maxlength="4"
                :class="{ 'error': errors.verificationCode }"
              />
              <img
                :src="codeBase64"
                alt="验证码"
                class="captcha-image"
                @click="refreshCaptcha"
              />
            </div>
            <span class="error-message" v-if="errors.verificationCode">{{ errors.verificationCode }}</span>
          </div>

          <button type="submit" class="register-button" :disabled="loading">
            <span v-if="loading">注册中...</span>
            <span v-else>注册</span>
          </button>
        </form>
      </div>

      <div class="column">
        <h2>已有账号？</h2>
        <p>返回登录页面开始你的旅程</p>
        <button class="login-button" @click="goLogin">登录</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { verify } from "@/api/auth/index";
import { register } from "@/api/user/index";
import type { CreateUserRequest } from "@/api/user/user";

const router = useRouter();
const codeBase64 = ref("");
const loading = ref(false);
const showPassword = ref(false);

const form = ref<CreateUserRequest>({
  userName: "",
  userAccount: "",
  password: "",
  email: "",
  verificationCode: "",
  unquneId: "",
});

const errors = ref({
  userName: "",
  userAccount: "",
  password: "",
  email: "",
  verificationCode: "",
});

const validateForm = () => {
  let isValid = true;
  errors.value = {
    userName: "",
    userAccount: "",
    password: "",
    email: "",
    verificationCode: "",
  };

  // 验证昵称
  if (!form.value.userName) {
    errors.value.userName = "请输入昵称";
    isValid = false;
  } else if (form.value.userName.length < 2 || form.value.userName.length > 20) {
    errors.value.userName = "昵称长度应为 2-20 个字符";
    isValid = false;
  } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(form.value.userName)) {
    errors.value.userName = "昵称只能包含中文、字母、数字和下划线";
    isValid = false;
  }

  // 验证用户名
  if (!form.value.userAccount) {
    errors.value.userAccount = "请输入用户名";
    isValid = false;
  } else if (form.value.userAccount.length < 3 || form.value.userAccount.length > 16) {
    errors.value.userAccount = "用户名长度应为 3-16 个字符";
    isValid = false;
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.value.userAccount)) {
    errors.value.userAccount = "用户名只能包含字母、数字和下划线";
    isValid = false;
  }

  // 验证密码
  if (!form.value.password) {
    errors.value.password = "请输入密码";
    isValid = false;
  } else if (form.value.password.length < 6 || form.value.password.length > 20) {
    errors.value.password = "密码长度应为 6-20 个字符";
    isValid = false;
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/.test(form.value.password)) {
    errors.value.password = "密码必须包含大小写字母和数字";
    isValid = false;
  }

  // 验证邮箱
  if (!form.value.email) {
    errors.value.email = "请输入邮箱";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = "邮箱格式不正确";
    isValid = false;
  }

  // 验证验证码
  if (!form.value.verificationCode) {
    errors.value.verificationCode = "请输入验证码";
    isValid = false;
  } else if (form.value.verificationCode.length !== 4) {
    errors.value.verificationCode = "验证码应为 4 位字符";
    isValid = false;
  }

  return isValid;
};

async function handleRegister() {
  if (loading.value) return;
  
  if (!validateForm()) return;
  
  try {
    loading.value = true;
    await register(form.value);
    showNotification("success", "注册成功，请返回登录页面进行登录");
    router.push("/login");
  } catch (error: any) {
    console.error('注册失败:', error);
    showNotification("error", error.message || "注册失败，请重试");
    refreshCaptcha();
  } finally {
    loading.value = false;
  }
}

async function initVerify() {
  try {
    const res = await verify("Register");
    codeBase64.value = res.verificationCode;
    form.value.unquneId = res.uniqueId;
  } catch (error) {
    console.error('获取验证码失败:', error);
    showNotification("error", "获取验证码失败，请重试");
  }
}

function refreshCaptcha() {
  initVerify();
}

function showNotification(type: 'success' | 'error', message: string) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function goLogin() {
  router.push("/login");
}

onMounted(() => {
  initVerify();
});
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.register-card {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 1000px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

.column {
  padding: 3rem;
  
  &:first-child {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  &:last-child {
    background: url("/src/assets/bg.webp") center;
    background-size: cover;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    
    * {
      position: relative;
      z-index: 1;
    }
  }
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

.register-form {
  width: 100%;
  max-width: 400px;
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
  width: 100%;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  text-align: left;
}

input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #1890ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  
  &.error {
    border-color: #ff4d4f;
  }
}

.error-message {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 0.5rem;
  display: block;
}

.password-input {
  position: relative;
  
  .toggle-password {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #1890ff;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
  }
}

.captcha-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  
  input {
    flex: 1;
  }
  
  .captcha-image {
    height: 48px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
}

.register-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(45deg, #1890ff, #40a9ff);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.login-button {
  padding: 12px 30px;
  background: transparent;
  border: 2px solid white;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: white;
    color: #1890ff;
    transform: translateY(-2px);
  }
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  animation: slideIn 0.3s ease;
  
  &.success {
    background: #52c41a;
  }
  
  &.error {
    background: #ff4d4f;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 992px) {
  .register-card {
    grid-template-columns: 1fr;
    width: 90%;
    max-width: 500px;
  }
  
  .column:last-child {
    display: none;
  }
}
</style>
