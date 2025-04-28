<template>
<div class="container">
  <div class="login-card">
    <div class="column">
      <h1>登录</h1>
      <p>SpeakEase 让说和表达更简单</p>
      <form @submit.prevent="handleLogin" class="login-form">
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
          <label for="code">验证码</label>
          <div class="captcha-wrapper">
            <input
              id="code"
              v-model="form.code"
              type="text"
              placeholder="请输入验证码"
              maxlength="6"
              :class="{ 'error': errors.code }"
            />
            <img
              :src="codeBase64"
              alt="验证码"
              class="captcha-image"
              @click="refreshCaptcha"
            />
          </div>
          <span class="error-message" v-if="errors.code">{{ errors.code }}</span>
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading">登录中...</span>
          <span v-else>登录</span>
        </button>
      </form>
    </div>
    <div class="column">
      <h2>自然选择号欢迎您登舰！</h2>
      <p>如果你没有账号，你想要现在注册一个吗？</p>
      <button class="register-button" @click="goRegister">注册</button>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { LoginRequest } from "@/api/auth/auth";
import { login, verify } from "@/api/auth";
import { getUser } from "@/api/user";
import { useUserStore } from "@/store/user/userStore";
import type { UserState } from "@/store/user/user";

const router = useRouter();
const store = useUserStore();

const form = ref<LoginRequest>({
  code: "",
  password: "",
  uniqueId: "",
  userAccount: "",
});

const errors = ref({
  userAccount: "",
  password: "",
  code: "",
});

const codeBase64 = ref("");
const loading = ref(false);
const showPassword = ref(false);

const validateForm = () => {
  let isValid = true;
  errors.value = {
    userAccount: "",
    password: "",
    code: "",
  };

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

  // 验证验证码
  if (!form.value.code) {
    errors.value.code = "请输入验证码";
    isValid = false;
  } else if (form.value.code.length !== 6) {
    errors.value.code = "验证码长度应为 6 位";
    isValid = false;
  }

  return isValid;
};

async function handleLogin() {
  if (loading.value) return;
  
  if (!validateForm()) return;
  
  try {
    loading.value = true;
    const res = await login(form.value);
    store.setToken(res);
    
    const userRes = await getUser();
    const user: UserState = {
      avatar: userRes.avatar,
      email: userRes.email,
      phone: userRes.phone,
      userName: userRes.userName,
      userId: userRes.userId,
      isAuthenticated: true
    };
    
    store.setUserInfo(user);
    showNotification("success", "登录成功");
    router.push('/index');
  } catch (error: any) {
    console.error('登录失败:', error);
    showNotification("error", error.message || "登录失败，请重试");
    refreshCaptcha();
  } finally {
    loading.value = false;
  }
}

async function initVerify() {
  try {
    const res = await verify("Login");
    codeBase64.value = res.verificationCode;
    form.value.uniqueId = res.uniqueId;
  } catch (error) {
    console.error('获取验证码失败:', error);
    showNotification("error", "获取验证码失败，请重试");
  }
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

function refreshCaptcha() {
  initVerify();
}

function togglePassword() {
  showPassword.value = !showPassword.value;
}

const goRegister = () => {
  router.push("/register");
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
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

.login-form {
  width: 100%;
  max-width: 400px;
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

.login-button {
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

.register-button {
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
  .login-card {
    grid-template-columns: 1fr;
    width: 90%;
    max-width: 500px;
  }
  
  .column:last-child {
    display: none;
  }
}
</style>
