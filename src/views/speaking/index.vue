<template>
  <div class="speaking">
    <div class="header-section">
      <div class="level-selector">
        <button 
          v-for="level in levels" 
          :key="level.id"
          :class="{ active: currentLevel === level.id }"
          @click="setCurrentLevel(level.id)"
        >
          {{ level.name }}
        </button>
      </div>
      <div class="progress-info">
        <div class="progress-text">
          已完成: <span class="highlight">{{ completedCount }}</span> / {{ totalExercises }}
        </div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="exercise-card">
        <div class="exercise-header">
          <h2>{{ currentExercise.title }}</h2>
          <p>{{ currentExercise.description }}</p>
        </div>

        <div class="example-section" v-if="currentExercise.example">
          <div class="example-header">
            <h3>示范音频</h3>
            <button class="play-btn" @click="playExample">
              <sound-outlined />
              播放示范
            </button>
          </div>
          <div class="example-text">
            <div class="en-text">{{ currentExercise.example.text }}</div>
            <div class="phonetic">/{{ currentExercise.example.phonetic }}/</div>
          </div>
        </div>

        <div class="practice-section">
          <div class="practice-header">
            <h3>练习区域</h3>
            <div class="attempt-info">
              尝试次数: {{ attemptCount }}/3
            </div>
          </div>

          <div class="recording-area">
            <div class="waveform" ref="waveformRef"></div>
            
            <div class="recording-controls">
              <div class="timer" v-if="isRecording">
                {{ formatTime(recordingTime) }}
              </div>
              
              <button 
                class="record-btn"
                :class="{ recording: isRecording }"
                @click="toggleRecording"
              >
                <audio-outlined v-if="!isRecording" />
                <pause-outlined v-else />
                {{ isRecording ? '停止录音' : '开始录音' }}
              </button>
              
              <button 
                class="play-btn"
                v-if="hasRecording && !isRecording"
                @click="playRecording"
              >
                <caret-right-outlined />
                播放录音
              </button>
            </div>
          </div>

          <div class="result-area" v-if="showResult">
            <div class="score-card">
              <div class="score-header">
                <h4>评分结果</h4>
                <div class="score">{{ score }}分</div>
              </div>
              
              <div class="score-details">
                <div class="detail-item">
                  <div class="detail-label">发音准确度</div>
                  <div class="detail-value">{{ pronunciationScore }}%</div>
                  <div class="detail-bar">
                    <div 
                      class="progress"
                      :style="{ width: pronunciationScore + '%' }"
                      :class="getScoreClass(pronunciationScore)"
                    ></div>
                  </div>
                </div>
                
                <div class="detail-item">
                  <div class="detail-label">语调自然度</div>
                  <div class="detail-value">{{ intonationScore }}%</div>
                  <div class="detail-bar">
                    <div 
                      class="progress"
                      :style="{ width: intonationScore + '%' }"
                      :class="getScoreClass(intonationScore)"
                    ></div>
                  </div>
                </div>
                
                <div class="detail-item">
                  <div class="detail-label">流畅度</div>
                  <div class="detail-value">{{ fluencyScore }}%</div>
                  <div class="detail-bar">
                    <div 
                      class="progress"
                      :style="{ width: fluencyScore + '%' }"
                      :class="getScoreClass(fluencyScore)"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="feedback-section">
                <h4>改进建议</h4>
                <ul class="feedback-list">
                  <li v-for="(item, index) in feedback" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="exercise-actions">
          <button 
            class="retry-btn"
            v-if="showResult && attemptCount < 3"
            @click="retryExercise"
          >
            <redo-outlined />
            重新尝试
          </button>
          <button 
            class="next-btn"
            v-if="showResult && (attemptCount >= 3 || score >= 80)"
            @click="nextExercise"
          >
            <check-outlined />
            下一个练习
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  SoundOutlined,
  AudioOutlined,
  PauseOutlined,
  CaretRightOutlined,
  RedoOutlined,
  CheckOutlined,
} from '@ant-design/icons-vue';

interface Example {
  text: string;
  phonetic: string;
  audioUrl: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  example?: Example;
  targetText: string;
}

const levels = [
  { id: 'elementary', name: '初级' },
  { id: 'intermediate', name: '中级' },
  { id: 'advanced', name: '高级' },
];

// 状态
const currentLevel = ref('elementary');
const isRecording = ref(false);
const recordingTime = ref(0);
const hasRecording = ref(false);
const showResult = ref(false);
const attemptCount = ref(0);
const waveformRef = ref<HTMLElement | null>(null);

// 评分数据
const score = ref(0);
const pronunciationScore = ref(0);
const intonationScore = ref(0);
const fluencyScore = ref(0);
const feedback = ref<string[]>([]);

// 模拟练习数据
const currentExercise = ref<Exercise>({
  id: '1',
  title: '日常对话练习',
  description: '练习如何用英语表达日常需求',
  example: {
    text: 'I would like to order a cup of coffee, please.',
    phonetic: 'aɪ wʊd laɪk tu ˈɔːrdər ə kʌp əv ˈkɒfi pliːz',
    audioUrl: '/audio/example-1.mp3'
  },
  targetText: 'I would like to order a cup of coffee, please.'
});

// 计算属性
const completedCount = ref(5);
const totalExercises = ref(10);
const progressPercentage = computed(() => (completedCount.value / totalExercises.value) * 100);

// 定时器
let recordingTimer: number | null = null;

// 方法
function setCurrentLevel(level: string) {
  currentLevel.value = level;
  // TODO: 加载对应级别的练习
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function playExample() {
  // TODO: 播放示范音频
  console.log('Playing example audio:', currentExercise.value.example?.audioUrl);
}

function toggleRecording() {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  isRecording.value = true;
  recordingTime.value = 0;
  recordingTimer = window.setInterval(() => {
    recordingTime.value++;
  }, 1000);
  // TODO: 实现录音功能
}

function stopRecording() {
  isRecording.value = false;
  if (recordingTimer) {
    clearInterval(recordingTimer);
    recordingTimer = null;
  }
  hasRecording.value = true;
  // TODO: 停止录音并进行评分
  evaluateRecording();
}

function playRecording() {
  // TODO: 播放录音
  console.log('Playing recorded audio');
}

function evaluateRecording() {
  // 模拟评分过程
  showResult.value = true;
  attemptCount.value++;
  
  // 模拟评分结果
  score.value = Math.floor(Math.random() * 30) + 70; // 70-100
  pronunciationScore.value = Math.floor(Math.random() * 40) + 60; // 60-100
  intonationScore.value = Math.floor(Math.random() * 40) + 60; // 60-100
  fluencyScore.value = Math.floor(Math.random() * 40) + 60; // 60-100
  
  // 模拟反馈
  feedback.value = [
    '注意 "would" 的发音，需要更清晰地发出 /wʊd/ 音',
    '句子语调可以更自然一些，避免过于平淡',
    '在 "coffee" 和 "please" 之间的停顿可以稍微短一些'
  ];
}

function getScoreClass(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
}

function retryExercise() {
  showResult.value = false;
  hasRecording.value = false;
}

function nextExercise() {
  // TODO: 加载下一个练习
  showResult.value = false;
  hasRecording.value = false;
  attemptCount.value = 0;
}

// 生命周期钩子
onMounted(() => {
  // TODO: 初始化波形图
});

onUnmounted(() => {
  if (recordingTimer) {
    clearInterval(recordingTimer);
  }
});
</script>

<style scoped>
.speaking {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.level-selector {
  display: flex;
  gap: 12px;
  
  button {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    background: var(--component-bg);
    color: var(--text-color);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    
    &.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }
  }
}

.progress-info {
  background: var(--component-bg);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  .progress-text {
    font-size: 14px;
    color: var(--text-color);
    margin-bottom: 8px;
    
    .highlight {
      color: var(--primary-color);
      font-weight: 500;
    }
  }
  
  .progress-bar {
    height: 6px;
    background: var(--border-secondary);
    border-radius: 3px;
    overflow: hidden;
    
    .progress {
      height: 100%;
      background: var(--primary-color);
      border-radius: 3px;
      transition: width 0.3s ease;
    }
  }
}

.exercise-card {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  .exercise-header {
    margin-bottom: 24px;
    
    h2 {
      font-size: 20px;
      color: var(--text-color);
      margin: 0 0 8px;
    }
    
    p {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
    }
  }
}

.example-section {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(var(--primary-color-rgb), 0.05);
  border-radius: 8px;
  
  .example-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    h3 {
      font-size: 16px;
      color: var(--text-color);
      margin: 0;
    }
    
    .play-btn {
      padding: 6px 12px;
      border-radius: 4px;
      border: none;
      background: var(--primary-color);
      color: white;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s;
      
      &:hover {
        background: var(--primary-hover);
      }
    }
  }
  
  .example-text {
    .en-text {
      font-size: 15px;
      color: var(--text-color);
      margin-bottom: 4px;
    }
    
    .phonetic {
      font-size: 14px;
      color: var(--text-secondary);
    }
  }
}

.practice-section {
  .practice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h3 {
      font-size: 16px;
      color: var(--text-color);
      margin: 0;
    }
    
    .attempt-info {
      font-size: 14px;
      color: var(--text-secondary);
    }
  }
}

.recording-area {
  background: rgba(var(--border-color-rgb), 0.05);
  border-radius: 8px;
  padding: 20px;
  
  .waveform {
    height: 100px;
    background: var(--component-bg);
    border-radius: 6px;
    margin-bottom: 16px;
  }
  
  .recording-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    
    .timer {
      font-size: 14px;
      color: var(--text-secondary);
      min-width: 48px;
    }
    
    .record-btn {
      padding: 8px 20px;
      border-radius: 6px;
      border: none;
      background: var(--primary-color);
      color: white;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s;
      
      &:hover {
        background: var(--primary-hover);
      }
      
      &.recording {
        background: var(--error-color);
        animation: pulse 2s infinite;
        
        &:hover {
          background: var(--error-hover);
        }
      }
    }
    
    .play-btn {
      padding: 8px 20px;
      border-radius: 6px;
      border: none;
      background: rgba(var(--primary-color-rgb), 0.1);
      color: var(--primary-color);
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s;
      
      &:hover {
        background: rgba(var(--primary-color-rgb), 0.2);
      }
    }
  }
}

.score-card {
  background: var(--component-bg);
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
  
  .score-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h4 {
      font-size: 16px;
      color: var(--text-color);
      margin: 0;
    }
    
    .score {
      font-size: 24px;
      font-weight: 600;
      color: var(--primary-color);
    }
  }
  
  .score-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
    
    .detail-item {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: center;
      
      .detail-label {
        font-size: 14px;
        color: var(--text-color);
      }
      
      .detail-value {
        font-size: 14px;
        color: var(--text-secondary);
        text-align: right;
      }
      
      .detail-bar {
        grid-column: 1 / -1;
        height: 6px;
        background: var(--border-secondary);
        border-radius: 3px;
        overflow: hidden;
        
        .progress {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
          
          &.excellent {
            background: var(--success-color);
          }
          
          &.good {
            background: var(--primary-color);
          }
          
          &.fair {
            background: var(--warning-color);
          }
          
          &.poor {
            background: var(--error-color);
          }
        }
      }
    }
  }
  
  .feedback-section {
    h4 {
      font-size: 16px;
      color: var(--text-color);
      margin: 0 0 12px;
    }
    
    .feedback-list {
      margin: 0;
      padding-left: 20px;
      
      li {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

.exercise-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  
  button {
    min-width: 120px;
    height: 40px;
    border-radius: 6px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.3s;
    
    &.retry-btn {
      background: rgba(var(--primary-color-rgb), 0.1);
      color: var(--primary-color);
      
      &:hover {
        background: rgba(var(--primary-color-rgb), 0.2);
      }
    }
    
    &.next-btn {
      background: var(--primary-color);
      color: white;
      
      &:hover {
        background: var(--primary-hover);
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .speaking {
    padding: 16px;
  }
  
  .exercise-card {
    padding: 16px;
  }
  
  .recording-controls {
    flex-direction: column;
    gap: 12px;
    
    button {
      width: 100%;
    }
  }
}
</style> 