<template>
  <div>
    <a-row class="login-row" justify="center">
      <!-- 左侧：背景图片展示（大屏显示，小屏隐藏） -->
      <a-col :xs="0" :sm="0" :md="14" :lg="16" class="login-image-column">
        <div class="image-container">
          <a-image
            src="/src/assets/bg.webp"
            alt="登录背景"
            class="login-background"
          />
        </div>
      </a-col>

      <!-- 右侧：登录表单 -->
      <a-col :xs="24" :sm="24" :md="10" :lg="8" class="login-form-column">
        <a-card class="login-card" bordered>
          <div class="login-title">欢迎登录</div>
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
              />
            </a-form-item>

            <a-form-item label="密码" name="password">
              <a-input-password
                v-model:value="form.password"
                placeholder="请输入密码"
              />
            </a-form-item>

            <a-form-item label="验证码" name="captcha">
              <div class="captcha-wrapper">
                <a-input v-model:value="form.code" placeholder="请输入验证码" />
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
              <a-button
                type="primary"
                html-type="submit"
                block
                :loading="loading"
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { LoginRequest } from "@/api/auth/auth";
import { login, verify } from "@/api/auth/index";
import { notification } from "ant-design-vue";
import { TokenStorage } from "@/utils/tokenStorage";

const router = useRouter();
const form = ref<LoginRequest>({
  code: "",
  password: "",
  uniqueId: "",
  userAccount: "",
});

const formRef = ref();
const codeBase64 = ref("");
const loading = ref(false);

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 16, message: "用户名长度应为 3-16 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应为 6-20 个字符", trigger: "blur" },
  ],
  captcha: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { len: 4, message: "验证码应为 4 位字符", trigger: "blur" },
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
        .then((res) => {
          TokenStorage.setToken(res);
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
  notification.open({
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
/* 基础布局和响应式样式 */
.login-wrapper {
  /* 使用背景图片和渐变叠加效果 */
  background:
    linear-gradient(135deg, rgba(102, 126, 234, 0.6), rgba(118, 75, 162, 0.6)),
    url("/src//assets//bg.webp");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
}

.login-row {
  width: 100%;
  height: 100%;
  max-width: 1200px;
}

.login-image-column {
  height: 100%;
}

.image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.login-background {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.login-form-column {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 32px;
  background-color: #fff;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}

.captcha-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.captcha-image {
  cursor: pointer;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

/* 深色模式样式，通过 prefers-color-scheme 媒体查询自动生效 */
@media (prefers-color-scheme: dark) {
  .login-wrapper {
    background: linear-gradient(to right, #1c1c1e, #2c2c2e);
  }
  .login-card {
    background-color: #2c2c2e;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    color: #f0f0f0;
  }
  .login-title {
    color: #ffffff;
  }
  /* 针对 Ant Design 组件，部分边框和输入框可能需要细调 */
  .captcha-image {
    border: 1px solid #444;
  }
  /* 如果需要，也可以调整 a-input 和 a-button 的颜色 */
}
</style>
