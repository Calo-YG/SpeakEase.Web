<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1 class="title">欢迎使用 SpeakEase</h1>
      <p class="subtitle">这是一个语音识别和翻译应用</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>总用户数</h3>
          <div class="stat-value">{{ stats.userCount }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">💬</div>
        <div class="stat-content">
          <h3>总翻译次数</h3>
          <div class="stat-value">{{ stats.translateCount }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <h3>准确率</h3>
          <div class="stat-value">{{ stats.accuracy }}%</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <h3>平均响应时间</h3>
          <div class="stat-value">{{ stats.responseTime }}ms</div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h2>快捷操作</h2>
      <div class="action-grid">
        <div class="action-card" @click="startTranslate">
          <div class="action-icon">🎙️</div>
          <h3>开始翻译</h3>
          <p>点击开始新的翻译任务</p>
        </div>
        
        <div class="action-card" @click="viewHistory">
          <div class="action-icon">📊</div>
          <h3>查看历史</h3>
          <p>浏览历史翻译记录</p>
        </div>
        
        <div class="action-card" @click="openSettings">
          <div class="action-icon">⚙️</div>
          <h3>系统设置</h3>
          <p>调整系统配置</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const stats = ref({
  userCount: 0,
  translateCount: 0,
  accuracy: 0,
  responseTime: 0
});

// 模拟获取统计数据
onMounted(async () => {
  // 这里应该调用实际的 API
  stats.value = {
    userCount: 1234,
    translateCount: 56789,
    accuracy: 98.5,
    responseTime: 150
  };
});

function startTranslate() {
  router.push('/translate');
}

function viewHistory() {
  router.push('/history');
}

function openSettings() {
  router.push('/setting');
}
</script>

<style scoped>
.home-container {
  padding: 24px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 48px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 32px;
  width: 64px;
  height: 64px;
  background: #f3f4f6;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.quick-actions {
  margin-top: 48px;
}

.quick-actions h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e5e7eb;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-color: #1677ff;
}

.action-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.action-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.action-card p {
  font-size: 14px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .home-container {
    padding: 16px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style> 