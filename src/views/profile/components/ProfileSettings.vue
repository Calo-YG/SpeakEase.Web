<template>
  <div class="content-card">
    <div class="card-header">
      <h2>账户设置</h2>
    </div>
    <div class="card-body">
      <div class="settings-section">
        <h3 class="section-title">
          <picture-outlined class="section-icon" />
          个性化设置
        </h3>
        
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">个人主页背景图</div>
              <div class="setting-desc">设置个人资料页顶部的背景图片</div>
            </div>
            <div class="background-uploader">
              <a-upload
                name="backgroundImage"
                :show-upload-list="false"
                :customRequest="handleBackgroundUpload"
                :before-upload="beforeBackgroundUpload"
              >
                <div class="background-preview">
                  <img v-if="backgroundPreview" :src="backgroundPreview" alt="背景预览" />
                  <div v-else class="upload-placeholder">
                    <upload-outlined />
                    <span>点击上传背景图</span>
                  </div>
                </div>
                <a-button class="upload-btn" type="primary">
                  <upload-outlined />
                  更换背景图
                </a-button>
              </a-upload>
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <h3 class="section-title">
          <notification-outlined class="section-icon" />
          通知设置
        </h3>
        
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">接收邮件更新</div>
              <div class="setting-desc">接收学习提醒、新功能介绍等邮件通知</div>
            </div>
            <a-switch 
              v-model:checked="formState.receiveEmailUpdates" 
              @change="(val: boolean) => handleChange('receiveEmailUpdates', val)" 
            />
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">接收系统通知</div>
              <div class="setting-desc">在系统内接收学习提醒和其他重要通知</div>
            </div>
            <a-switch 
              v-model:checked="formState.receiveNotifications" 
              @change="(val: boolean) => handleChange('receiveNotifications', val)" 
            />
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">接收推送通知</div>
              <div class="setting-desc">在浏览器接收实时推送通知</div>
            </div>
            <a-switch 
              v-model:checked="formState.receivePushNotifications" 
              @change="(val: boolean) => handleChange('receivePushNotifications', val)" 
            />
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <h3 class="section-title">
          <eye-outlined class="section-icon" />
          隐私设置
        </h3>
        
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">允许接收私信</div>
              <div class="setting-desc">允许其他用户向您发送私信</div>
            </div>
            <a-switch 
              v-model:checked="formState.allowMessages" 
              @change="(val: boolean) => handleChange('allowMessages', val)" 
            />
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">个人资料公开</div>
              <div class="setting-desc">允许其他用户查看您的个人资料</div>
            </div>
            <a-switch 
              v-model:checked="formState.isProfilePublic" 
              @change="(val: boolean) => handleChange('isProfilePublic', val)" 
            />
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">展示学习进度</div>
              <div class="setting-desc">在个人主页展示您的学习进度</div>
            </div>
            <a-switch 
              v-model:checked="formState.showLearningProgress" 
              @change="(val: boolean) => handleChange('showLearningProgress', val)" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  NotificationOutlined, 
  EyeOutlined,
  PictureOutlined,
  UploadOutlined
} from '@ant-design/icons-vue';
import { defineProps, defineEmits } from 'vue';
import { notification } from 'ant-design-vue';

const props = defineProps<{
  formState: Record<string, any>;
  backgroundImage?: string;
}>();

const emit = defineEmits<{
  (e: 'settingChange', key: string, value: boolean): void;
  (e: 'backgroundUpload', file: File): void;
}>();

const backgroundPreview = ref(props.backgroundImage || '');

const handleChange = (key: string, value: boolean) => {
  emit('settingChange', key, value);
};

const beforeBackgroundUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    notification.error({
      message: '上传失败',
      description: '只能上传图片文件!',
      duration: 2
    });
    return false;
  }
  
  if (!isLt2M) {
    notification.error({
      message: '上传失败',
      description: '图片必须小于2MB!',
      duration: 2
    });
    return false;
  }
  
  return isImage && isLt2M;
};

const handleBackgroundUpload = (options: { file: File }) => {
  if (beforeBackgroundUpload(options.file)) {
    // 创建本地预览
    const reader = new FileReader();
    reader.onload = (e) => {
      backgroundPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(options.file);
    
    // 触发上传事件
    emit('backgroundUpload', options.file);
  }
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

.settings-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  color: #1890ff;
}

.section-icon {
  margin-right: 8px;
  font-size: 18px;
}

.settings-list {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
  margin-right: 16px;
}

.setting-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.setting-desc {
  color: #666;
  font-size: 14px;
}

.background-uploader {
  margin-top: 12px;
  width: 100%;
}

.background-preview {
  width: 100%;
  height: 120px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  border: 1px dashed #d9d9d9;
}

.background-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-placeholder .anticon {
  font-size: 24px;
  margin-bottom: 8px;
}

.upload-btn {
  width: 100%;
}

@media (max-width: 768px) {
  .content-card {
    padding: 16px;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .setting-info {
    margin-right: 0;
    margin-bottom: 8px;
    width: 100%;
  }
}
</style> 