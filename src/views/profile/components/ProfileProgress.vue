<template>
  <div class="content-card">
    <div class="card-header">
      <h2>学习进度</h2>
    </div>
    <div class="card-body">
      <div class="progress-grid">
        <div class="progress-card vocabulary">
          <div class="progress-icon">
            <read-outlined />
          </div>
          <div class="progress-title">词汇学习</div>
          <div class="progress-value">{{ stats.wordCount }}<span class="unit">个</span></div>
          <a-progress 
            :percent="Math.min((stats.wordCount / 5000) * 100, 100)" 
            status="active" 
            :stroke-color="{ '0%': '#108ee9', '100%': '#87d068' }" 
          />
          <div class="progress-target">目标: 5000个</div>
        </div>
        
        <div class="progress-card listening">
          <div class="progress-icon">
            <sound-outlined />
          </div>
          <div class="progress-title">听力训练</div>
          <div class="progress-value">{{ stats.listeningHours }}<span class="unit">小时</span></div>
          <a-progress 
            :percent="Math.min((stats.listeningHours / 100) * 100, 100)" 
            status="active" 
            :stroke-color="{ '0%': '#52c41a', '100%': '#87d068' }" 
          />
          <div class="progress-target">目标: 100小时</div>
        </div>
        
        <div class="progress-card speaking">
          <div class="progress-icon">
            <audio-outlined />
          </div>
          <div class="progress-title">口语练习</div>
          <div class="progress-value">{{ stats.speakingCount }}<span class="unit">次</span></div>
          <a-progress 
            :percent="Math.min((stats.speakingCount / 200) * 100, 100)" 
            status="active" 
            :stroke-color="{ '0%': '#1890ff', '100%': '#36cfc9' }" 
          />
          <div class="progress-target">目标: 200次</div>
        </div>
        
        <div class="progress-card reading">
          <div class="progress-icon">
            <book-outlined />
          </div>
          <div class="progress-title">阅读文章</div>
          <div class="progress-value">{{ stats.readingCount }}<span class="unit">篇</span></div>
          <a-progress 
            :percent="Math.min((stats.readingCount / 100) * 100, 100)" 
            status="active" 
            :stroke-color="{ '0%': '#faad14', '100%': '#fa8c16' }" 
          />
          <div class="progress-target">目标: 100篇</div>
        </div>
      </div>

      <div class="activity-chart">
        <div class="chart-header">
          <h3>学习活跃度</h3>
          <div class="time-selector">
            <a-radio-group v-model:value="timeRangeModel" button-style="solid" size="small">
              <a-radio-button value="week">本周</a-radio-button>
              <a-radio-button value="month">本月</a-radio-button>
              <a-radio-button value="year">全年</a-radio-button>
            </a-radio-group>
          </div>
        </div>
        
        <div class="chart-placeholder">
          <div class="chart-bars">
            <div v-for="i in 7" :key="i" class="bar-container">
              <div class="bar" :style="{ height: `${30 + Math.random() * 70}%` }"></div>
              <div class="bar-label">{{ ['一', '二', '三', '四', '五', '六', '日'][i-1] }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  ReadOutlined, 
  SoundOutlined, 
  AudioOutlined, 
  BookOutlined 
} from '@ant-design/icons-vue';
import { defineProps } from 'vue';

const props = defineProps<{
  stats: {
    wordCount: number;
    listeningHours: number;
    speakingCount: number;
    readingCount: number;
  };
  timeRange: string;
}>();

// 计算属性，用于实现.sync修饰符功能
const timeRangeModel = computed({
  get: () => props.timeRange,
  set: (value) => {
    emit('update:timeRange', value);
  }
});

const emit = defineEmits<{
  (e: 'update:timeRange', value: string): void;
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

.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.progress-card {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.progress-icon {
  margin-bottom: 16px;
  color: #1890ff;
  font-size: 24px;
}

.progress-title {
  margin-bottom: 8px;
  font-weight: 500;
}

.progress-value {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}

.unit {
  font-size: 14px;
  color: #666;
  margin-left: 4px;
}

.progress-target {
  color: #666;
  font-size: 14px;
  margin-top: 8px;
}

.activity-chart {
  margin-top: 24px;
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.time-selector {
  display: flex;
}

.chart-placeholder {
  height: 200px;
  margin-top: 16px;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 180px;
}

.bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 4px;
}

.bar {
  width: 100%;
  background: linear-gradient(to top, #1890ff, #69c0ff);
  border-radius: 2px 2px 0 0;
  transition: height 0.3s;
}

.bar-label {
  margin-top: 8px;
  color: #666;
}

@media (max-width: 768px) {
  .content-card {
    padding: 16px;
  }
  
  .progress-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .time-selector {
    margin-top: 8px;
  }
}
</style> 