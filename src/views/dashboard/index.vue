<template>
  <div class="dashboard">
    <div class="stats-section">
      <div class="stat-card">
        <h3>今日学习时长</h3>
        <div class="stat-value">120<span>分钟</span></div>
        <div class="stat-progress">
          <div class="progress-bar" :style="{ width: '80%' }"></div>
        </div>
        <div class="stat-target">目标: 150分钟</div>
      </div>
      
      <div class="stat-card">
        <h3>已掌握单词</h3>
        <div class="stat-value">2,358<span>个</span></div>
        <div class="stat-progress">
          <div class="progress-bar" :style="{ width: '60%' }"></div>
        </div>
        <div class="stat-target">目标: 4,000个</div>
      </div>
      
      <div class="stat-card">
        <h3>连续打卡</h3>
        <div class="stat-value">7<span>天</span></div>
        <div class="stat-progress">
          <div class="progress-bar" :style="{ width: '70%' }"></div>
        </div>
        <div class="stat-target">目标: 10天</div>
      </div>
    </div>

    <div class="recent-section">
      <div class="section-header">
        <h2>最近学习</h2>
        <a class="view-all">查看全部</a>
      </div>
      <div class="recent-list">
        <div class="recent-item" v-for="item in recentActivities" :key="item.id">
          <div class="item-icon" :class="item.type">
            <component :is="item.icon" />
          </div>
          <div class="item-content">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-desc">{{ item.description }}</div>
          </div>
          <div class="item-time">{{ item.time }}</div>
        </div>
      </div>
    </div>

    <div class="tasks-section">
      <div class="section-header">
        <h2>今日任务</h2>
        <span class="task-progress">4/6</span>
      </div>
      <div class="task-list">
        <div class="task-item" v-for="task in dailyTasks" :key="task.id" :class="{ completed: task.completed }">
          <div class="task-checkbox">
            <check-outlined v-if="task.completed" />
          </div>
          <div class="task-content">
            <div class="task-title">{{ task.title }}</div>
            <div class="task-desc">{{ task.description }}</div>
          </div>
          <div class="task-action">
            <button v-if="!task.completed">开始</button>
            <span v-else class="completed-text">已完成</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  CheckOutlined,
  ReadOutlined,
  SoundOutlined,
  AudioOutlined,
  BookOutlined,
} from '@ant-design/icons-vue';

const recentActivities = ref([
  {
    id: 1,
    type: 'vocabulary',
    icon: ReadOutlined,
    title: '词汇学习',
    description: '完成了20个新单词的学习',
    time: '10分钟前'
  },
  {
    id: 2,
    type: 'listening',
    icon: SoundOutlined,
    title: '听力训练',
    description: '完成了一篇短文听力练习',
    time: '30分钟前'
  },
  {
    id: 3,
    type: 'speaking',
    icon: AudioOutlined,
    title: '口语练习',
    description: '进行了15分钟的口语训练',
    time: '1小时前'
  },
  {
    id: 4,
    type: 'reading',
    icon: BookOutlined,
    title: '阅读理解',
    description: '阅读了一篇B1级别的文章',
    time: '2小时前'
  },
]);

const dailyTasks = ref([
  {
    id: 1,
    title: '学习新单词',
    description: '学习20个新单词',
    completed: true
  },
  {
    id: 2,
    title: '听力练习',
    description: '完成一篇短文听力',
    completed: true
  },
  {
    id: 3,
    title: '口语训练',
    description: '进行15分钟口语练习',
    completed: true
  },
  {
    id: 4,
    title: '阅读理解',
    description: '阅读一篇B1级别文章',
    completed: true
  },
  {
    id: 5,
    title: '复习单词',
    description: '复习昨天学习的单词',
    completed: false
  },
  {
    id: 6,
    title: '每日测试',
    description: '完成今日词汇测试',
    completed: false
  },
]);
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.stat-card {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow-color);
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  h3 {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: 600;
    color: var(--text-color);
    margin: 12px 0;
    
    span {
      font-size: 14px;
      margin-left: 4px;
      color: var(--text-secondary);
    }
  }
  
  .stat-progress {
    height: 4px;
    background: var(--border-secondary);
    border-radius: 2px;
    margin: 12px 0;
    
    .progress-bar {
      height: 100%;
      background: var(--primary-color);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
  }
  
  .stat-target {
    font-size: 12px;
    color: var(--text-secondary);
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h2 {
    margin: 0;
    font-size: 18px;
    color: var(--text-color);
  }
  
  .view-all {
    color: var(--primary-color);
    font-size: 14px;
    cursor: pointer;
  }
  
  .task-progress {
    font-size: 14px;
    color: var(--text-secondary);
  }
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: var(--component-bg);
  border-radius: 8px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  .item-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    
    &.vocabulary {
      background: rgba(var(--primary-color-rgb), 0.1);
      color: var(--primary-color);
    }
    
    &.listening {
      background: rgba(var(--success-color-rgb), 0.1);
      color: var(--success-color);
    }
    
    &.speaking {
      background: rgba(var(--warning-color-rgb), 0.1);
      color: var(--warning-color);
    }
    
    &.reading {
      background: rgba(var(--info-color-rgb), 0.1);
      color: var(--info-color);
    }
  }
  
  .item-content {
    flex: 1;
    
    .item-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-color);
    }
    
    .item-desc {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 4px;
    }
  }
  
  .item-time {
    font-size: 12px;
    color: var(--text-secondary);
  }
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: var(--component-bg);
  border-radius: 8px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  &.completed {
    opacity: 0.7;
  }
  
  .task-checkbox {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    
    .completed & {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
    }
  }
  
  .task-content {
    flex: 1;
    
    .task-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-color);
    }
    
    .task-desc {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 4px;
    }
  }
  
  .task-action {
    button {
      padding: 6px 16px;
      border-radius: 4px;
      border: none;
      background: var(--primary-color);
      color: white;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: var(--primary-hover);
      }
    }
    
    .completed-text {
      font-size: 13px;
      color: var(--success-color);
    }
  }
}

@media (max-width: 768px) {
  .stats-section {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .recent-item,
  .task-item {
    padding: 10px;
  }
}
</style> 