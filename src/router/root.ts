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
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {
          title: "学习概览",
          requiresAuth: true,
        },
      },
      {
        path: "vocabulary",
        name: "Vocabulary",
        component: () => import("@/views/vocabulary/index.vue"),
        meta: {
          title: "词汇学习",
          requiresAuth: true,
        },
      },
      {
        path: "wordmanage",
        name: "WordManage",
        component: () => import("@/views/vocabulary/wordmanage.vue"),
        meta: {
          title: "单词管理",
          requiresAuth: true,
        },
      },
      {
        path: "listening",
        name: "Listening",
        component: () => import("@/views/listening/index.vue"),
        meta: {
          title: "听力训练",
          requiresAuth: true,
        },
      },
      {
        path: "speaking",
        name: "Speaking",
        component: () => import("@/views/speaking/index.vue"),
        meta: {
          title: "口语练习",
          requiresAuth: true,
        },
      },
      {
        path: "reading",
        name: "Reading",
        component: () => import("@/views/reading/index.vue"),
        meta: {
          title: "阅读理解",
          requiresAuth: true,
        },
      },
      {
        path: "practice",
        name: "Practice",
        component: () => import("@/views/practice/index.vue"),
        meta: {
          title: "每日练习",
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
        path: "progress",
        name: "Progress",
        component: () => import("@/views/progress/index.vue"),
        meta: {
          title: "学习进度",
          requiresAuth: true,
        },
      },
      {
        path: "community",
        name: "Community",
        component: () => import("@/views/community/index.vue"),
        meta: {
          title: "学习社区",
          requiresAuth: true,
        },
      },
      {
        path: "ai-assistant",
        name: "AIAssistant",
        component: () => import("@/views/ai-assistant/index.vue"),
        meta: {
          title: "AI学习助手",
          requiresAuth: true,
        },
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("@/views/settings/settings.vue"),
        meta: {
          title: "系统设置",
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
