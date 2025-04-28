<template>
  <div class="vocabulary">
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
          已掌握: <span class="highlight">{{ masteredCount }}</span> / {{ totalWords }}
        </div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="word-section" v-if="!isReviewMode">
        <div class="word-card">
          <div class="word-header">
            <span class="word-index">#{{ currentWordIndex + 1 }}</span>
            <button class="sound-btn" @click="playPronunciation">
              <sound-outlined />
            </button>
          </div>
          <div class="word-content">
            <h2 class="word">{{ currentWord.word }}</h2>
            <div class="phonetic">/{{ currentWord.phonetic }}/</div>
            <div class="translations">
              <div v-for="(trans, index) in currentWord.translations" :key="index" class="translation-item">
                <span class="pos">{{ trans.pos }}</span>
                <span class="meaning">{{ trans.meaning }}</span>
              </div>
            </div>
            <div class="example" v-if="showExample">
              <div class="example-en">{{ currentWord.example.en }}</div>
              <div class="example-cn">{{ currentWord.example.cn }}</div>
            </div>
          </div>
          <div class="word-actions">
            <button class="action-btn example-btn" @click="toggleExample">
              <book-outlined />
              {{ showExample ? '隐藏例句' : '查看例句' }}
            </button>
            <button class="action-btn next-btn" @click="nextWord">
              <check-outlined />
              下一个
            </button>
          </div>
        </div>
      </div>

      <div class="review-section" v-else>
        <div class="review-card">
          <div class="review-progress">{{ reviewedCount }}/{{ reviewWords.length }}</div>
          <div class="review-word" v-if="!showAnswer">
            <h2>{{ currentReviewWord.word }}</h2>
            <button class="show-answer-btn" @click="showAnswer = true">
              显示答案
            </button>
          </div>
          <div class="review-answer" v-else>
            <div class="phonetic">/{{ currentReviewWord.phonetic }}/</div>
            <div class="translations">
              <div v-for="(trans, index) in currentReviewWord.translations" :key="index">
                <span class="pos">{{ trans.pos }}</span>
                <span class="meaning">{{ trans.meaning }}</span>
              </div>
            </div>
            <div class="review-actions">
              <button class="review-btn forget" @click="handleReview('forget')">
                忘记了
              </button>
              <button class="review-btn remember" @click="handleReview('remember')">
                记得
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mode-switcher">
      <button 
        class="mode-btn"
        :class="{ active: !isReviewMode }"
        @click="isReviewMode = false"
      >
        <read-outlined />
        学习模式
      </button>
      <button 
        class="mode-btn"
        :class="{ active: isReviewMode }"
        @click="startReview"
      >
        <sync-outlined />
        复习模式
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  SoundOutlined,
  BookOutlined,
  CheckOutlined,
  ReadOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';

interface Translation {
  pos: string;
  meaning: string;
}

interface Example {
  en: string;
  cn: string;
}

interface Word {
  word: string;
  phonetic: string;
  translations: Translation[];
  example: Example;
  mastered: boolean;
}

// 词汇等级
const levels = [
  { id: 'elementary', name: '初级' },
  { id: 'intermediate', name: '中级' },
  { id: 'advanced', name: '高级' },
];

const currentLevel = ref('elementary');
const currentWordIndex = ref(0);
const showExample = ref(false);
const isReviewMode = ref(false);
const showAnswer = ref(false);
const reviewedCount = ref(0);

// 模拟单词数据
const words = ref<Word[]>([
  {
    word: 'appreciate',
    phonetic: 'əˈpriːʃieɪt',
    translations: [
      { pos: 'v.', meaning: '感激；欣赏；理解；领会' },
      { pos: 'v.', meaning: '增值；升值' },
    ],
    example: {
      en: 'I really appreciate your help.',
      cn: '我真的很感激你的帮助。',
    },
    mastered: false,
  },
  // 更多单词...
]);

const reviewWords = ref<Word[]>([]);

// 计算属性
const masteredCount = computed(() => words.value.filter(w => w.mastered).length);
const totalWords = computed(() => words.value.length);
const progressPercentage = computed(() => (masteredCount.value / totalWords.value) * 100);
const currentWord = computed(() => words.value[currentWordIndex.value]);
const currentReviewWord = computed(() => reviewWords.value[reviewedCount.value]);

// 方法
function setCurrentLevel(level: string) {
  currentLevel.value = level;
  // TODO: 根据级别加载对应的单词列表
}

function playPronunciation() {
  // TODO: 实现发音功能
  console.log('Playing pronunciation for:', currentWord.value.word);
}

function toggleExample() {
  showExample.value = !showExample.value;
}

function nextWord() {
  if (currentWordIndex.value < words.value.length - 1) {
    currentWordIndex.value++;
    showExample.value = false;
  }
}

function startReview() {
  isReviewMode.value = true;
  reviewedCount.value = 0;
  showAnswer.value = false;
  // TODO: 获取需要复习的单词列表
  reviewWords.value = words.value.filter(w => !w.mastered);
}

function handleReview(result: 'remember' | 'forget') {
  if (result === 'remember') {
    // TODO: 更新单词掌握状态
    const wordIndex = words.value.findIndex(w => w.word === currentReviewWord.value.word);
    if (wordIndex !== -1) {
      words.value[wordIndex].mastered = true;
    }
  }

  showAnswer.value = false;
  reviewedCount.value++;

  if (reviewedCount.value >= reviewWords.value.length) {
    isReviewMode.value = false;
    // TODO: 显示复习完成的统计信息
  }
}
</script>

<style scoped>
.vocabulary {
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

.word-card {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  .word-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .word-index {
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .sound-btn {
      width: 36px;
      height: 36px;
      border-radius: 18px;
      border: none;
      background: rgba(var(--primary-color-rgb), 0.1);
      color: var(--primary-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      
      &:hover {
        background: var(--primary-color);
        color: white;
      }
    }
  }
  
  .word-content {
    .word {
      font-size: 32px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 8px;
    }
    
    .phonetic {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 20px;
    }
    
    .translations {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
      
      .translation-item {
        display: flex;
        align-items: baseline;
        gap: 8px;
        
        .pos {
          font-size: 14px;
          color: var(--primary-color);
          font-weight: 500;
        }
        
        .meaning {
          font-size: 15px;
          color: var(--text-color);
        }
      }
    }
    
    .example {
      background: rgba(var(--primary-color-rgb), 0.05);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      
      .example-en {
        font-size: 15px;
        color: var(--text-color);
        margin-bottom: 8px;
      }
      
      .example-cn {
        font-size: 14px;
        color: var(--text-secondary);
      }
    }
  }
  
  .word-actions {
    display: flex;
    gap: 12px;
    
    .action-btn {
      flex: 1;
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
      
      &.example-btn {
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
}

.review-card {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  text-align: center;
  
  .review-progress {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }
  
  .review-word {
    h2 {
      font-size: 36px;
      color: var(--text-color);
      margin: 0 0 24px;
    }
    
    .show-answer-btn {
      padding: 12px 24px;
      border-radius: 6px;
      border: none;
      background: var(--primary-color);
      color: white;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: var(--primary-hover);
      }
    }
  }
  
  .review-answer {
    .phonetic {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }
    
    .translations {
      margin-bottom: 24px;
      
      div {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 8px;
        margin-bottom: 8px;
        
        .pos {
          font-size: 14px;
          color: var(--primary-color);
          font-weight: 500;
        }
        
        .meaning {
          font-size: 15px;
          color: var(--text-color);
        }
      }
    }
    
    .review-actions {
      display: flex;
      gap: 12px;
      
      .review-btn {
        flex: 1;
        height: 40px;
        border-radius: 6px;
        border: none;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;
        
        &.forget {
          background: rgba(var(--error-color-rgb), 0.1);
          color: var(--error-color);
          
          &:hover {
            background: rgba(var(--error-color-rgb), 0.2);
          }
        }
        
        &.remember {
          background: rgba(var(--success-color-rgb), 0.1);
          color: var(--success-color);
          
          &:hover {
            background: rgba(var(--success-color-rgb), 0.2);
          }
        }
      }
    }
  }
}

.mode-switcher {
  display: flex;
  gap: 12px;
  
  .mode-btn {
    flex: 1;
    height: 44px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--component-bg);
    color: var(--text-color);
    font-size: 14px;
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

@media (max-width: 768px) {
  .vocabulary {
    padding: 16px;
  }
  
  .word-card,
  .review-card {
    padding: 16px;
  }
  
  .word-content {
    .word {
      font-size: 28px;
    }
  }
  
  .review-word h2 {
    font-size: 32px;
  }
}
</style> 