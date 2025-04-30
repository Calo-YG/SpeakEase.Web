<template>
  <div class="profile-hero">
    <div class="hero-background" :style="backgroundStyle"></div>
    <div class="hero-content">
      <div class="avatar-section">
        <a-upload
          name="avatar"
          :show-upload-list="false"
          :customRequest="handleAvatarUpload"
          :before-upload="handleBeforeAvatarUpload"
        >
          <div class="avatar-container">
            <a-avatar 
              :src="userInfo.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userInfo.userName" 
              :size="120" 
            />
            <div class="avatar-overlay">
              <camera-outlined />
            </div>
          </div>
        </a-upload>
      </div>
      <div class="user-info">
        <h1 class="user-name">{{ userInfo.userName }}</h1>
        <p class="user-bio">{{ userSettings.bio || '这个人很懒，还没有填写个人简介~' }}</p>
        <div class="user-stats">
          <div class="stat-item">
            <div class="stat-value">{{ stats.wordCount }}</div>
            <div class="stat-label">已学单词</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.listeningHours }}</div>
            <div class="stat-label">听力训练(小时)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.speakingCount }}</div>
            <div class="stat-label">口语练习(次)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.readingCount }}</div>
            <div class="stat-label">阅读文章(篇)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CameraOutlined } from '@ant-design/icons-vue';
import { defineProps, defineEmits } from 'vue';
import type { UserResponse, UserSettingResponse } from '@/api/user/user';

const props = defineProps<{
  userInfo: UserResponse;
  userSettings: UserSettingResponse;
  stats: {
    wordCount: number;
    listeningHours: number;
    speakingCount: number;
    readingCount: number;
  };
  backgroundImage?: string;
}>();

const emit = defineEmits<{
  (e: 'avatarUpload', file: { file: File }): void;
  (e: 'beforeAvatarUpload', file: File): boolean;
}>();

const backgroundStyle = computed(() => {
  if (props.backgroundImage) {
    return {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 1
    };
  }
  return {
    background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
    opacity: 0.8
  };
});

const handleAvatarUpload = (options: { file: File }) => {
  emit('avatarUpload', options);
};

const handleBeforeAvatarUpload = (file: File) => {
  return emit('beforeAvatarUpload', file);
};
</script>

<style scoped>
.profile-hero {
  margin-bottom: 24px;
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  z-index: 0;
}

.hero-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-section {
  margin-bottom: 24px;
}

.avatar-container {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.user-name {
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.user-bio {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 16px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  background: rgba(255, 255, 255, 0.2);
  padding: 16px;
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
}

.stat-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

@media (max-width: 768px) {
  .user-stats {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .stat-item {
    width: calc(50% - 16px);
  }
}
</style> 