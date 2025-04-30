<template>
  <div class="content-card">
    <div class="card-header">
      <h2>安全设置</h2>
    </div>
    <div class="card-body">
      <div class="security-section">
        <div class="security-item">
          <div class="security-info">
            <div class="security-title">
              <lock-outlined class="security-icon" />
              账户密码
            </div>
            <div class="security-desc">定期修改密码可以提高账户安全性</div>
          </div>
          <a-button type="primary" @click="$emit('showPasswordModal')">修改密码</a-button>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <div class="security-title">
              <mobile-outlined class="security-icon" />
              手机绑定
            </div>
            <div class="security-desc">绑定手机可以提高账户安全性，方便找回密码</div>
          </div>
          <a-button>绑定手机</a-button>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <div class="security-title">
              <safety-outlined class="security-icon" />
              登录设备管理
            </div>
            <div class="security-desc">查看并管理您的登录设备</div>
          </div>
          <a-button>查看设备</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  LockOutlined, 
  MobileOutlined, 
  SafetyOutlined 
} from '@ant-design/icons-vue';
import { defineEmits } from 'vue';

const emit = defineEmits<{
  (e: 'showPasswordModal'): void;
}>();
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

.security-section {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.security-item:last-child {
  border-bottom: none;
}

.security-info {
  flex: 1;
  margin-right: 16px;
}

.security-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.security-icon {
  margin-right: 8px;
  color: #1890ff;
}

.security-desc {
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .content-card {
    padding: 16px;
  }
  
  .security-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .security-info {
    margin-right: 0;
    margin-bottom: 16px;
    width: 100%;
  }
}
</style> 