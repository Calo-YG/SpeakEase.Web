import { RouteRecordRaw } from "vue-router";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login", // 默认跳转到 login
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/login.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/register/register.vue"),
    meta: {
      title: "注册",
    },
  },
  {
    path: "/index",
    name: "首页",
    component: () => import("@/components/layout/index.vue"),
    meta: {
      title: "注册",
    },
  }
];
