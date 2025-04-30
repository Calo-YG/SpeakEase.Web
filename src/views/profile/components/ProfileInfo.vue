<template>
  <div class="content-card">
    <div class="card-header">
      <h2>基本资料</h2>
    </div>
    <div class="card-body">
      <div class="info-section">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">用户名</div>
            <div class="info-value">{{ userInfo.userName }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">邮箱</div>
            <div class="info-value">{{ userInfo.email }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">手机号</div>
            <div class="info-value">{{ userInfo.phone || '未设置' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">性别</div>
            <div class="info-value">{{ genderText }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">生日</div>
            <div class="info-value">{{ formattedBirthday }}</div>
          </div>
        </div>
      </div>

      <div class="divider">
        <span>编辑个人资料</span>
      </div>

      <div class="form-section">
        <a-form :model="formState" layout="vertical">
          <a-form-item label="个人简介">
            <a-textarea 
              v-model:value="formState.bio" 
              :rows="3" 
              placeholder="写点什么介绍一下自己吧..." 
              :maxlength="200" 
              show-count 
            />
          </a-form-item>
          <a-form-item label="性别">
            <a-radio-group v-model:value="formState.gender" button-style="solid">
              <a-radio-button value="male">男</a-radio-button>
              <a-radio-button value="female">女</a-radio-button>
              <a-radio-button value="other">其他</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="生日">
            <a-date-picker 
              v-model:value="formState.birthday" 
              format="YYYY-MM-DD" 
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleUpdate">保存修改</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import { defineProps, defineEmits } from 'vue';
import type { UserResponse, UserSettingResponse } from '@/api/user/user';

const props = defineProps<{
  userInfo: UserResponse;
  userSettings: UserSettingResponse;
  formState: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: 'updateProfile'): void;
}>();

// 计算属性
const genderText = computed(() => {
  const gender = props.userSettings.gender;
  if (gender === 'male') return '男';
  if (gender === 'female') return '女';
  if (gender === 'other') return '其他';
  return '未设置';
});

const formattedBirthday = computed(() => {
  if (!props.userSettings.birthday) return '未设置';
  return dayjs(props.userSettings.birthday).format('YYYY-MM-DD');
});

// 方法
const handleUpdate = () => {
  emit('updateProfile');
};
</script>

<style scoped>
.content-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-height: 500px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.info-section {
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
}

.info-label {
  color: #666;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
}

.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
  height: 1px;
  background: #f0f0f0;
}

.divider span {
  position: relative;
  top: -10px;
  background: #fff;
  padding: 0 16px;
  color: #666;
  font-size: 14px;
}

.form-section {
  margin-top: 24px;
}

@media (max-width: 768px) {
  .content-card {
    padding: 16px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style> 