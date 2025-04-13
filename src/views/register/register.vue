<template>
  <div class="login-card">
    <div class="column">
      <h1>注册</h1>
      <p>加入 SpeakEase，让表达更简单</p>
      <a-form
        :model="form"
        :rules="rules"
        ref="formRef"
        layout="vertical"
        @finish="handleRegister"
      >
        <a-form-item label="昵称" name="userName">
          <a-input v-model:value="form.userName" placeholder="请输入昵称" />
        </a-form-item>

        <a-form-item label="用户名" name="userAccount">
          <a-input
            v-model:value="form.userAccount"
            placeholder="请输入用户名"
          />
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="form.password"
            placeholder="请输入密码"
          />
        </a-form-item>

        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="form.email" placeholder="请输入邮箱" />
        </a-form-item>

        <a-form-item label="验证码" name="verificationCode">
          <div class="captcha-wrapper">
            <a-input
              v-model:value="form.verificationCode"
              placeholder="请输入验证码"
            />
            <a-image
              :src="codeBase64"
              alt="验证码"
              width="100"
              height="32"
              class="captcha-image"
              @click="refreshCaptcha"
              preview="false"
            />
          </div>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="loading">
            注册
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="column">
      <h2>已有账号？</h2>
      <p>返回登录页面开始你的旅程</p>
      <a @click="goLogin">登录</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { notification } from "ant-design-vue";
import { verify } from "@/api/auth/index";
import { register } from "@/api/user/index";
import type { CreateUserRequest } from "@/api/user/user";

const router = useRouter();
const formRef = ref();
const codeBase64 = ref("");
const loading = ref(false);

const form = ref<CreateUserRequest>({
  userName: "",
  userAccount: "",
  password: "",
  email: "",
  verificationCode: "",
  unquneId: "",
});

const rules = {
  userName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  userAccount: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 16, message: "用户名长度应为 3-16 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应为 6-20 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
  verificationCode: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { len: 4, message: "验证码应为 4 位字符", trigger: "blur" },
  ],
};

onMounted(() => {
  initVerify();
});

function handleRegister() {
  loading.value = true;
  formRef.value
    .validate()
    .then(() => {
      register(form.value)
        .then(() => {
          openNotification("注册成功", "请返回登录页面进行登录");
          router.push("/login");
        })
        .finally(() => (loading.value = false));
    })
    .finally(() => (loading.value = false));
}

function initVerify() {
  verify("Register").then((res) => {
    codeBase64.value = res.verificationCode;
    form.value.unquneId = res.uniqueId;
  });
}

function refreshCaptcha() {
  initVerify();
}

function openNotification(title: string, message: string) {
  notification.open({
    message: title,
    description: message,
    duration: 2,
  });
}

function goLogin() {
  router.push("/login");
}
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
  background-color: #f2f2f2;
}

.login-card {
  background-color: #fff;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 1100px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  transition: all 0.3s ease;
}

.login-card .column {
  padding: 3rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-card .column:first-child {
  background-color: #fff;
}

.login-card .column:last-child {
  background: url("/src/assets/bg.webp") center center/cover no-repeat;
  position: relative;
  color: #000;
  text-align: center;
}

.login-card .column:last-child:after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(2px);
  z-index: 0;
}

.login-card .column:last-child > * {
  position: relative;
  z-index: 1;
}

.login-card h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.login-card h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.login-card p {
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #666;
}

.login-card a {
  display: inline-block;
  padding: 10px 26px;
  border: 2px solid #111;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #111;
  text-decoration: none;
  cursor: pointer;
}

.login-card a:hover {
  background-color: #111;
  color: white;
}

a-button[block] {
  height: 48px;
  font-size: 16px;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.captcha-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ant-input,
.ant-input-password,
.ant-input-affix-wrapper {
  height: 44px;
  border-radius: 12px !important;
  font-size: 15px;
}

.ant-form-item {
  margin-bottom: 20px;
}

@media (max-width: 992px) {
  .login-card {
    display: block;
    width: 90%;
    margin: auto;
  }
  .login-card .column:last-child {
    display: none;
  }
}
</style>
