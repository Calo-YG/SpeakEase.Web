<template>
  <div class="progress-container">
    <h1>学习进度追踪</h1>
    
    <div class="progress-overview">
      <div class="progress-card">
        <h3>总体进度</h3>
        <div class="progress-circle">
          <el-progress type="dashboard" :percentage="overallProgress" />
        </div>
      </div>
      
      <div class="progress-stats">
        <div class="stat-card">
          <h4>已学习天数</h4>
          <p>{{ learningDays }}</p>
        </div>
        <div class="stat-card">
          <h4>完成课程</h4>
          <p>{{ completedCourses }}</p>
        </div>
        <div class="stat-card">
          <h4>掌握词汇</h4>
          <p>{{ masteredWords }}</p>
        </div>
      </div>
    </div>

    <div class="progress-details">
      <h2>详细进度</h2>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="听力" name="listening">
          <el-progress :percentage="listeningProgress" />
        </el-tab-pane>
        <el-tab-pane label="口语" name="speaking">
          <el-progress :percentage="speakingProgress" />
        </el-tab-pane>
        <el-tab-pane label="阅读" name="reading">
          <el-progress :percentage="readingProgress" />
        </el-tab-pane>
        <el-tab-pane label="词汇" name="vocabulary">
          <el-progress :percentage="vocabularyProgress" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="learning-calendar">
      <h2>学习日历</h2>
      <el-calendar v-model="currentDate">
        <template #dateCell="{ data }">
          <div class="calendar-cell">
            <span>{{ data.day.split('-').slice(2).join('') }}</span>
            <div v-if="isLearningDay(data.day)" class="learning-dot"></div>
          </div>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const overallProgress = ref(75)
const learningDays = ref(30)
const completedCourses = ref(12)
const masteredWords = ref(500)

const activeTab = ref('listening')
const currentDate = ref(new Date())

const listeningProgress = ref(80)
const speakingProgress = ref(65)
const readingProgress = ref(70)
const vocabularyProgress = ref(85)

const isLearningDay = (day: string) => {
  // 这里可以根据实际数据判断是否是学习日
  return Math.random() > 0.5
}
</script>

<style scoped>
.progress-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.progress-overview {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-bottom: 30px;
}

.progress-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h4 {
  margin: 0;
  color: #666;
}

.stat-card p {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0 0;
  color: #409EFF;
}

.progress-details {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.learning-calendar {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.calendar-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.learning-dot {
  width: 6px;
  height: 6px;
  background-color: #409EFF;
  border-radius: 50%;
  margin-top: 4px;
}
</style> 