import { RouteRecordRaw } from "vue-router";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login", // 默认跳转到 login
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/login.vue"),
    meta: {
      title: "登录",
      requiresAuth: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/register/register.vue"),
    meta: {
      title: "注册",
      requiresAuth: false,
    },
  },
  {
    path: "/index",
    name: "Index",
    component: () => import("@/components/layout/index.vue"),
    meta: {
      title: "首页",
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/home/home.vue"),
        meta: {
          title: "首页",
          requiresAuth: true,
        },
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/profile.vue"),
        meta: {
          title: "个人中心",
          requiresAuth: true,
        },
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("@/views/settings/settings.vue"),
        meta: {
          title: "设置",
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/error/404.vue"),
    meta: {
      title: "404",
      requiresAuth: false,
    },
  },
];
