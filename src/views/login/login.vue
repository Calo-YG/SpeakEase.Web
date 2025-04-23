<template>
<div class="container">
  <div class="login-card">
    <div class="column">
      <h1>登陆</h1>
      <p>SpeakEase 让说和表达更简单</p>
      <a-form
        :model="form"
        :rules="rules"
        ref="formRef"
        layout="vertical"
        @finish="handleLogin()"
      >
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="form.userAccount"
            placeholder="请输入用户名"
            has-feedback 
            validate-status="warning"
          />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="form.password"
            placeholder="请输入密码"
            has-feedback 
            validate-status="warning"
          />
        </a-form-item>

        <a-form-item label="验证码" name="captcha">
          <div class="captcha-wrapper">
            <a-input v-model:value="form.code" placeholder="请输入验证码"  has-feedback validate-status="warning"/>
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
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="column">
      <h2>自然选择号欢迎您登舰！</h2>
      <p>如果你没有账号，你想要现在注册一个吗？</p>
      <a href="#" @click="goRegister()">注册</a>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { LoginRequest } from "@/api/auth/auth";
import { login, verify } from "@/api/auth/index";
import { notification } from "ant-design-vue";
import { getUser} from "@/api/user/index"
import { useUserStore} from "@/store/user/userStore"
import type {UserState} from "@/store/user/user"

const router = useRouter();
const form = ref<LoginRequest>({
  code: "",
  password: "",
  uniqueId: "",
  userAccount: "",
});
const store = useUserStore()

const formRef = ref();
const codeBase64 = ref("");
const loading = ref(false);

const rules = {
  userAccount: [
    { required: true, message: "请输入用户名"},
    { min: 3, max: 16, message: "用户名长度应为 3-16 个字符"},
  ],
  password: [
    { required: true, message: "请输入密码"},
    { min: 6, max: 20, message: "密码长度应为 6-20 个字符"},
  ],
  code: [
    { required: true, message: "请输入验证码"},
  ],
};

onMounted(() => {
  initVerify();
});

function handleLogin() {
  loading.value = true;
  formRef.value
    .validate()
    .then(() => {
      login(form.value)
        .then(async (res) => {
          store.setToken(res)
          router.push('/index')
          openNotification("success", "登录成功");
          var useRes = await getUser()
          const user:UserState = {
              avatar:useRes.avatar,
              email:useRes.email,
              phone:useRes.phone,
              userName:useRes.userName,
              userId:useRes.userId,
              isAuthenticated:true
             }

        })
        .finally(() => {
          loading.value = false;
        });
    })
    .finally(() => {
      loading.value = false;
    });
}

function initVerify() {
  verify("Login").then((res) => {
    codeBase64.value = res.verificationCode;
    form.value.uniqueId = res.uniqueId;
  });
}

//通知提醒
function openNotification(title: string, message: string) {
  notification['success']({
    message: title,
    description: message,
    duration: 1,
  });
}

function refreshCaptcha() {
  initVerify();
}
const goReset = () => {
  router.push("/reset"); // 确保你有这个路由
};

const goRegister = () => {
  router.push("/register");
};
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
}
body:after {
  content: "";
  position: fixed;
  inset: 0;
  background-color: #010101;
  width: 60%;
  height: 100vh;
  clip-path: polygon(0 100%, 0 0, 100% 0, 70% 100%);
  z-index: -1;
}

.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  /* 如果希望容器全屏居中，请设置高度 */
  height: 100vh;
}


.login-card {
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 10px 50px -30px black;
  width: 1200px;
  border-radius: 30px;
  overflow: hidden;
  display: grid;
  grid-template-columns: auto auto;
}
.login-card a {
  text-decoration: none;
  color: #010101;
}
.login-card .column {
  padding: 4rem;
}
.login-card .column:last-child {
  background: url("/src//assets//bg.webp") center;
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
}
.login-card .column:last-child:after {
  content: "";
  position: absolute;
  background: linear-gradient(90deg, white, rgba(255, 255, 255, 0.1333333333));
  inset: 0;
}
.login-card .column:last-child * {
  z-index: 1;
}
.login-card .column:last-child a {
  display: inline-block;
  padding: 12px 30px;
  font-size: 16px;
  border: 2px solid #010101;
  color: black;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3;
  font-weight: 600;
}
.login-card .column:last-child a:hover {
  background-color: #010101;
  color: white;
}
.login-card .column:last-child {
  text-align: center;
}
.login-card h1 {
  margin-bottom: 15px;
}
.login-card .form-element {
  width: 100%;
  border: none;
  background-color: white;
  padding: 20px 30px;
  font-size: 18px;
  border-radius: 50px;
  transition: box-shadow 0.2s;
  outline: none;
  box-shadow: 0 0 0 2px #010101;
}

.login-card input {
  padding: 10px 16px !important;
  font-size: 16px;
}

// 验证码容器样式（验证码和输入框在一行）
.captcha-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

// 验证码图片样式（可根据实际视觉调整）
.captcha-image {
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

// 登录按钮居中
.login-card .ant-form-item:last-of-type {
  display: flex;
  justify-content: center;
}

.login-card input:focus {
  box-shadow: 0 0 0 2px #01010133;
  transition: box-shadow 0.2s ease;
}

.login-card form {
  margin-top: 3rem;
}
.login-card form > * {
  margin-top: 1rem;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.social-buttons {
  display: flex;
  gap: 1rem;
}
.social-buttons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  font-size: 22px;
  color: white;
  background-color: green;
}
.social-buttons a.wechat {
  background-color: #06ca5c;
}
.social-buttons a.twitter {
  background-color: #55acee;
}
.social-buttons a.github {
  background-color: #111;
}
.social-buttons a:hover {
  scale: 0.95;
}

::v-deep(.ant-input-password) input {
  padding: 10px 16px !important;
  font-size: 16px;
}

@media (max-width: 992px) {
  .login-card {
    display: block;
    width: 500px;
    text-align: center;
  }
  .login-card .column:last-child {
    display: none;
  }
  .flex {
    flex-direction: column;
    gap: 1rem;
  }
  .social-buttons {
    justify-content: center;
  }
}

// 登录按钮美化
::v-deep(.ant-btn-primary) {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  width: 220px;
}



</style>
