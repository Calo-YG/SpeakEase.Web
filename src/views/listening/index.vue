<template>
  <div class="listening">
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
      <div class="player-section">
        <div class="audio-card">
          <div class="audio-info">
            <h3>{{ currentExercise.title }}</h3>
            <p>{{ currentExercise.description }}</p>
          </div>
          
          <div class="audio-controls">
            <div class="time-info">
              <span>{{ formatTime(currentTime) }}</span>
              <span>/</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
            
            <div class="progress-bar" @click="seek">
              <div class="progress" :style="{ width: playProgress + '%' }"></div>
            </div>
            
            <div class="control-buttons">
              <button class="control-btn" @click="skipBackward">
                <backward-outlined />
              </button>
              <button class="play-btn" @click="togglePlay">
                <pause-outlined v-if="isPlaying" />
                <caret-right-outlined v-else />
              </button>
              <button class="control-btn" @click="skipForward">
                <forward-outlined />
              </button>
              <button 
                class="control-btn" 
                :class="{ active: showTranscript }"
                @click="toggleTranscript"
              >
                <file-text-outlined />
              </button>
              <div class="volume-control">
                <button class="control-btn" @click="toggleMute">
                  <sound-outlined v-if="!isMuted" />
                  <sound-outlined v-else />
                </button>
                <div class="volume-slider">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    v-model="volume" 
                    @input="updateVolume"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="transcript-card" v-if="showTranscript">
          <div class="transcript-content">
            <div 
              v-for="(line, index) in currentExercise.transcript" 
              :key="index"
              class="transcript-line"
              :class="{ active: currentLineIndex === index }"
            >
              <div class="line-time">{{ formatTime(line.startTime) }}</div>
              <div class="line-text">
                <div class="en-text">{{ line.en }}</div>
                <div class="cn-text" v-if="showTranslation">{{ line.cn }}</div>
              </div>
            </div>
          </div>
          <div class="transcript-actions">
            <button 
              class="action-btn"
              :class="{ active: showTranslation }"
              @click="toggleTranslation"
            >
              <translation-outlined />
              显示翻译
            </button>
            <button 
              class="action-btn"
              @click="toggleAutoScroll"
            >
              <align-center-outlined />
              自动滚动
            </button>
          </div>
        </div>
      </div>

      <div class="exercise-section" v-if="currentExercise.questions.length > 0">
        <div class="question-card">
          <h3>理解检测</h3>
          <div class="questions">
            <div 
              v-for="(question, index) in currentExercise.questions" 
              :key="index"
              class="question-item"
            >
              <div class="question-text">{{ index + 1 }}. {{ question.text }}</div>
              <div class="options">
                <label 
                  v-for="option in question.options" 
                  :key="option.id"
                  class="option-item"
                  :class="{ 
                    selected: selectedAnswers[index] === option.id,
                    correct: showResults && option.id === question.correctAnswer,
                    wrong: showResults && selectedAnswers[index] === option.id && option.id !== question.correctAnswer
                  }"
                >
                  <input 
                    type="radio" 
                    :name="'question-' + index"
                    :value="option.id"
                    v-model="selectedAnswers[index]"
                    :disabled="showResults"
                  >
                  <span class="option-text">{{ option.text }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="question-actions">
            <button 
              class="submit-btn" 
              @click="submitAnswers"
              v-if="!showResults"
            >
              提交答案
            </button>
            <button 
              class="next-btn" 
              @click="nextExercise"
              v-else
            >
              下一个练习
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  BackwardOutlined,
  ForwardOutlined,
  PauseOutlined,
  CaretRightOutlined,
  SoundOutlined,
  FileTextOutlined,
  TranslationOutlined,
  AlignCenterOutlined,
} from '@ant-design/icons-vue';

interface TranscriptLine {
  startTime: number;
  en: string;
  cn: string;
}

interface Question {
  text: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  correctAnswer: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  transcript: TranscriptLine[];
  questions: Question[];
}

const levels = [
  { id: 'elementary', name: '初级' },
  { id: 'intermediate', name: '中级' },
  { id: 'advanced', name: '高级' },
];

// 状态
const currentLevel = ref('elementary');
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(100);
const isMuted = ref(false);
const showTranscript = ref(true);
const showTranslation = ref(true);
const currentLineIndex = ref(0);
const selectedAnswers = ref<string[]>([]);
const showResults = ref(false);

// 模拟练习数据
const currentExercise = ref<Exercise>({
  id: '1',
  title: '日常对话 - 在咖啡店',
  description: '学习如何在咖啡店点餐和进行简单对话',
  audioUrl: '/audio/coffee-shop.mp3',
  transcript: [
    {
      startTime: 0,
      en: 'Hi, what can I get for you today?',
      cn: '你好，请问需要点什么？'
    },
    {
      startTime: 3,
      en: 'I\'d like a medium latte, please.',
      cn: '我要一杯中杯拿铁，谢谢。'
    },
    // 更多对话内容...
  ],
  questions: [
    {
      text: 'What did the customer order?',
      options: [
        { id: 'a', text: 'A small cappuccino' },
        { id: 'b', text: 'A medium latte' },
        { id: 'c', text: 'A large americano' },
      ],
      correctAnswer: 'b'
    },
    // 更多问题...
  ]
});

// 计算属性
const completedCount = ref(5);
const totalExercises = ref(10);
const progressPercentage = computed(() => (completedCount.value / totalExercises.value) * 100);
const playProgress = computed(() => (currentTime.value / duration.value) * 100 || 0);

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

function togglePlay() {
  isPlaying.value = !isPlaying.value;
  // TODO: 实现音频播放/暂停
}

function seek(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  currentTime.value = duration.value * percent;
  // TODO: 实现音频跳转
}

function skipBackward() {
  currentTime.value = Math.max(0, currentTime.value - 5);
  // TODO: 实现音频回退
}

function skipForward() {
  currentTime.value = Math.min(duration.value, currentTime.value + 5);
  // TODO: 实现音频前进
}

function toggleTranscript() {
  showTranscript.value = !showTranscript.value;
}

function toggleMute() {
  isMuted.value = !isMuted.value;
  // TODO: 实现音频静音
}

function updateVolume() {
  // TODO: 实现音量调节
}

function toggleTranslation() {
  showTranslation.value = !showTranslation.value;
}

function toggleAutoScroll() {
  // TODO: 实现字幕自动滚动
}

function submitAnswers() {
  showResults.value = true;
  // TODO: 提交答案并显示结果
}

function nextExercise() {
  // TODO: 加载下一个练习
  showResults.value = false;
  selectedAnswers.value = [];
}
</script>

<style scoped>
.listening {
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

.audio-card {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  .audio-info {
    margin-bottom: 20px;
    
    h3 {
      font-size: 18px;
      color: var(--text-color);
      margin: 0 0 8px;
    }
    
    p {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
    }
  }
  
  .audio-controls {
    .time-info {
      display: flex;
      justify-content: center;
      gap: 4px;
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    
    .progress-bar {
      height: 6px;
      background: var(--border-secondary);
      border-radius: 3px;
      cursor: pointer;
      margin-bottom: 16px;
      
      .progress {
        height: 100%;
        background: var(--primary-color);
        border-radius: 3px;
        transition: width 0.1s linear;
      }
    }
    
    .control-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      
      .control-btn {
        width: 36px;
        height: 36px;
        border-radius: 18px;
        border: none;
        background: rgba(var(--primary-color-rgb), 0.1);
        color: var(--text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        
        &:hover {
          background: rgba(var(--primary-color-rgb), 0.2);
        }
        
        &.active {
          background: var(--primary-color);
          color: white;
        }
      }
      
      .play-btn {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        
        &:hover {
          background: var(--primary-hover);
        }
      }
      
      .volume-control {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .volume-slider {
          width: 80px;
          
          input[type="range"] {
            width: 100%;
            height: 4px;
            -webkit-appearance: none;
            background: var(--border-secondary);
            border-radius: 2px;
            outline: none;
            
            &::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: var(--primary-color);
              cursor: pointer;
              transition: all 0.3s;
              
              &:hover {
                transform: scale(1.2);
              }
            }
          }
        }
      }
    }
  }
}

.transcript-card {
  background: var(--component-bg);
  border-radius: 12px;
  margin-top: 16px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  display: flex;
  flex-direction: column;
  
  .transcript-content {
    padding: 16px;
    max-height: 300px;
    overflow-y: auto;
    
    .transcript-line {
      display: flex;
      gap: 12px;
      padding: 8px;
      border-radius: 6px;
      transition: all 0.3s;
      
      &.active {
        background: rgba(var(--primary-color-rgb), 0.1);
      }
      
      .line-time {
        font-size: 12px;
        color: var(--text-secondary);
        min-width: 40px;
      }
      
      .line-text {
        flex: 1;
        
        .en-text {
          font-size: 14px;
          color: var(--text-color);
          margin-bottom: 4px;
        }
        
        .cn-text {
          font-size: 13px;
          color: var(--text-secondary);
        }
      }
    }
  }
  
  .transcript-actions {
    display: flex;
    gap: 12px;
    padding: 12px;
    border-top: 1px solid rgba(var(--border-color-rgb), 0.1);
    
    .action-btn {
      flex: 1;
      height: 36px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      background: var(--component-bg);
      color: var(--text-color);
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
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
}

.question-card {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  h3 {
    font-size: 18px;
    color: var(--text-color);
    margin: 0 0 20px;
  }
  
  .questions {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .question-item {
    .question-text {
      font-size: 15px;
      color: var(--text-color);
      margin-bottom: 12px;
    }
    
    .options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .option-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.3s;
      
      input[type="radio"] {
        width: 16px;
        height: 16px;
        margin: 0;
      }
      
      .option-text {
        font-size: 14px;
        color: var(--text-color);
      }
      
      &:hover {
        border-color: var(--primary-color);
      }
      
      &.selected {
        background: rgba(var(--primary-color-rgb), 0.1);
        border-color: var(--primary-color);
      }
      
      &.correct {
        background: rgba(var(--success-color-rgb), 0.1);
        border-color: var(--success-color);
      }
      
      &.wrong {
        background: rgba(var(--error-color-rgb), 0.1);
        border-color: var(--error-color);
      }
    }
  }
  
  .question-actions {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    
    button {
      min-width: 120px;
      height: 40px;
      border-radius: 6px;
      border: none;
      background: var(--primary-color);
      color: white;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: var(--primary-hover);
      }
      
      &.submit-btn {
        background: var(--primary-color);
      }
      
      &.next-btn {
        background: var(--success-color);
        
        &:hover {
          background: var(--success-hover);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .listening {
    padding: 16px;
  }
  
  .audio-card,
  .transcript-card,
  .question-card {
    padding: 16px;
  }
  
  .control-buttons {
    .volume-control {
      display: none;
    }
  }
}
</style> 