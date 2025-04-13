<template>
    <div class="sidebar">
      <div class="logo">🗣️ SpeakEase</div>
      <a-menu mode="inline" theme="dark" :selectedKeys="['home']">
        <a-menu-item key="home" @click="go('/')">首页</a-menu-item>
      </a-menu>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  const router = useRouter();
  const go = (path: string) => router.push(path);
  </script>
  
  <style scoped>
  .sidebar {
    width: 220px;
    background-color: #001529;
    color: white;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .logo {
    height: 64px;
    font-size: 20px;
    font-weight: bold;
    padding: 20px;
    color: white;
    text-align: center;
    border-bottom: 1px solid #222;
  }
  </style>
  