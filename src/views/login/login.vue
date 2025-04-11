<template>
    <div class="login-card">
      <div class="column">
        <h1>登陆</h1>
        <p>SpeakEase 让说和表达更简单</p>
        <form>
          <div class="form-item">
            <input type="text" class="form-element" placeholder="用户名" />
          </div>
          <div class="form-item">
            <input type="password" class="form-element" placeholder="密码" />
          </div>
          <div class="form-item">
            <input type="password" class="form-element" placeholder="验证码" />
            <img :src="codeBase64">
          </div>
          <div class="flex">
            <button type="button" @click="handleLogin()">登 录</button>
            <a href="#">忘记密码，点我重置！</a>
          </div>
          <!-- <p style="margin-top: 3rem; margin-bottom: 1.5rem">第三方账号登入</p>
          <div class="social-buttons">
            <a href="#" class="wechat">
              <i class="bi bi-wechat"></i>
            </a>
            <a href="#" class="twitter">
              <i class="bi bi-twitter"></i>
            </a>
            <a href="#" class="github">
              <i class="bi bi-github"></i>
            </a>
          </div> -->
        </form>
      </div>
      <div class="column">
        <h2>自然选择号欢迎您登舰！</h2>
        <p>如果你没有账号，你想要现在注册一个吗？</p>
        <a href="#">注册</a>
      </div>
    </div>
    
</template>

<script lang="ts" setup>
import { ref ,onMounted} from "vue";
import { useRouter } from "vue-router";
import type {LoginRequest} from '@/api/auth/auth'
import {login,verify} from '@/api/auth/index'
import { notification } from 'ant-design-vue';
import { TokenStorage } from '@/utils/tokenStorage'


const router = useRouter();

const form = ref<LoginRequest>({
  code: "",
  password: "",
  uniqueId:"",
  userAccount:""
});
const codeBase64 = ref("")


onMounted(()=>{
    initVerify()
})

function handleLogin(){
   const formValue = form.value;

   if(!!formValue.password){
    openNotification("what arey you doing","请输入账号")
    return;
   }

   if(!!formValue.password){
    openNotification("what arey you doing","请输入密码")
    return;
   }

   if(!!formValue.code){
    openNotification("what arey you doing","请输入验证码")
    return;
   }

   login(form.value).then(res=>{
     TokenStorage.setToken(res)
   })
}

function initVerify(){
    verify("Login").then((res)=>{
      codeBase64.value = res.verificationCode
      form.value.uniqueId = res.uniqueId
      console.log(!!codeBase64.value)
    })
}

//通知提醒
function openNotification (title:string,message:string) {
  notification.open({
    message: title,
    description:message,
    duration: 1,
  });
};

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
  background: url("/src/assets/bg.webp") center;
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
  padding:  10px 30px;
  font-size: 18px;
  border-radius: 5px;
  transition: box-shadow 0.2s;
  outline: none;
  box-shadow: 0 0 0 2px #010101;
}

.login-card input[type="checkbox"] {
  accent-color: #010101;
  width: 16px;
  height: 16px;
}
.login-card form {
  margin-top: 3rem;
}
.login-card form > * {
  margin-top: 1rem;
}
.login-card form button {
  background-color: #010101;
  color: white;
  border: none;
  padding: 15px 80px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.2s;
}
.login-card form button:active {
  scale: 0.95;
  background-color: black;
}
.login-card form .form-check-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-left: 5px;
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
  width: 180px;
  height: 50px;
  border-radius: 10px;
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
</style>
