<template>
  <div class="reading">
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
          已完成: <span class="highlight">{{ completedCount }}</span> / {{ totalArticles }}
        </div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="article-card">
        <div class="article-header">
          <h2>{{ currentArticle.title }}</h2>
          <div class="article-meta">
            <span class="difficulty">
              <read-outlined />
              {{ currentArticle.level }}
            </span>
            <span class="words-count">
              <file-text-outlined />
              {{ currentArticle.wordCount }} 词
            </span>
            <span class="time">
              <clock-circle-outlined />
              预计阅读时间 {{ Math.ceil(currentArticle.wordCount / 200) }} 分钟
            </span>
          </div>
        </div>

        <div class="article-tools">
          <div class="tool-buttons">
            <button 
              class="tool-btn"
              :class="{ active: showTranslation }"
              @click="toggleTranslation"
            >
              <translation-outlined />
              显示翻译
            </button>
            <button 
              class="tool-btn"
              :class="{ active: showPhonetic }"
              @click="togglePhonetic"
            >
              <sound-outlined />
              显示音标
            </button>
            <button 
              class="tool-btn"
              @click="toggleDictionary"
            >
              <book-outlined />
              词典
            </button>
          </div>
          <div class="font-controls">
            <button class="font-btn" @click="decreaseFontSize">
              <minus-outlined />
            </button>
            <span class="font-size">{{ fontSize }}px</span>
            <button class="font-btn" @click="increaseFontSize">
              <plus-outlined />
            </button>
          </div>
        </div>

        <div 
          class="article-content"
          :style="{ fontSize: fontSize + 'px' }"
        >
          <div 
            v-for="(paragraph, index) in currentArticle.content" 
            :key="index"
            class="paragraph"
          >
            <div class="en-text">
              <span 
                v-for="(word, wIndex) in paragraph.words" 
                :key="wIndex"
                class="word"
                :class="{ 
                  'new-word': word.isNew,
                  'selected': selectedWord === word
                }"
                @click="selectWord(word)"
              >
                {{ word.text }}
                <span 
                  class="phonetic" 
                  v-if="showPhonetic && word.isNew"
                >
                  /{{ word.phonetic }}/
                </span>
              </span>
            </div>
            <div 
              class="cn-text"
              v-if="showTranslation"
            >
              {{ paragraph.translation }}
            </div>
          </div>
        </div>
      </div>

      <div 
        class="dictionary-panel"
        v-if="showDictionaryPanel"
      >
        <div class="panel-header">
          <h3>词典</h3>
          <button class="close-btn" @click="toggleDictionary">
            <close-outlined />
          </button>
        </div>
        <div class="word-details" v-if="selectedWord">
          <div class="word-header">
            <div class="word-text">{{ selectedWord.text }}</div>
            <div class="word-phonetic">/{{ selectedWord.phonetic }}/</div>
            <button class="sound-btn" @click="playWordSound">
              <sound-outlined />
            </button>
          </div>
          <div class="definitions">
            <div 
              v-for="(def, index) in selectedWord.definitions" 
              :key="index"
              class="definition-item"
            >
              <span class="pos">{{ def.pos }}</span>
              <span class="meaning">{{ def.meaning }}</span>
            </div>
          </div>
          <div class="examples">
            <h4>例句</h4>
            <div 
              v-for="(example, index) in selectedWord.examples" 
              :key="index"
              class="example-item"
            >
              <div class="example-en">{{ example.en }}</div>
              <div class="example-cn">{{ example.cn }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="comprehension-section">
        <div class="section-header">
          <h3>理解测试</h3>
          <span class="score" v-if="showResults">
            得分: {{ score }}/{{ questions.length }}
          </span>
        </div>
        
        <div class="questions">
          <div 
            v-for="(question, index) in questions" 
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
            @click="nextArticle"
            v-else
          >
            下一篇文章
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ReadOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  TranslationOutlined,
  SoundOutlined,
  BookOutlined,
  MinusOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';

interface Word {
  text: string;
  isNew: boolean;
  phonetic: string;
  definitions: Array<{
    pos: string;
    meaning: string;
  }>;
  examples: Array<{
    en: string;
    cn: string;
  }>;
}

interface Paragraph {
  words: Word[];
  translation: string;
}

interface Article {
  id: string;
  title: string;
  level: string;
  wordCount: number;
  content: Paragraph[];
}

interface Question {
  text: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  correctAnswer: string;
}

const levels = [
  { id: 'elementary', name: '初级' },
  { id: 'intermediate', name: '中级' },
  { id: 'advanced', name: '高级' },
];

// 状态
const currentLevel = ref('elementary');
const showTranslation = ref(true);
const showPhonetic = ref(true);
const showDictionaryPanel = ref(false);
const fontSize = ref(16);
const selectedWord = ref<Word | null>(null);
const selectedAnswers = ref<string[]>([]);
const showResults = ref(false);
const score = ref(0);

// 模拟文章数据
const currentArticle = ref<Article>({
  id: '1',
  title: 'The Benefits of Learning a New Language',
  level: '中级',
  wordCount: 350,
  content: [
    {
      words: [
        {
          text: 'Learning',
          isNew: false,
          phonetic: 'ˈlɜːrnɪŋ',
          definitions: [
            { pos: 'n.', meaning: '学习；学问' },
            { pos: 'v.', meaning: '学习（learn的现在分词）' }
          ],
          examples: [
            {
              en: 'Learning a new language opens up new opportunities.',
              cn: '学习一门新语言会带来新的机会。'
            }
          ]
        },
        // 更多单词...
      ],
      translation: '学习一门新语言可以带来许多好处。'
    },
    // 更多段落...
  ]
});

// 模拟问题数据
const questions = ref<Question[]>([
  {
    text: 'What is the main benefit of learning a new language mentioned in the article?',
    options: [
      { id: 'a', text: 'Making more money' },
      { id: 'b', text: 'Meeting new people' },
      { id: 'c', text: 'Opening up new opportunities' },
    ],
    correctAnswer: 'c'
  },
  // 更多问题...
]);

// 计算属性
const completedCount = ref(5);
const totalArticles = ref(10);
const progressPercentage = computed(() => (completedCount.value / totalArticles.value) * 100);

// 方法
function setCurrentLevel(level: string) {
  currentLevel.value = level;
  // TODO: 加载对应级别的文章
}

function toggleTranslation() {
  showTranslation.value = !showTranslation.value;
}

function togglePhonetic() {
  showPhonetic.value = !showPhonetic.value;
}

function toggleDictionary() {
  showDictionaryPanel.value = !showDictionaryPanel.value;
}

function decreaseFontSize() {
  if (fontSize.value > 12) {
    fontSize.value -= 2;
  }
}

function increaseFontSize() {
  if (fontSize.value < 24) {
    fontSize.value += 2;
  }
}

function selectWord(word: Word) {
  selectedWord.value = word;
  showDictionaryPanel.value = true;
}

function playWordSound() {
  // TODO: 播放单词发音
  console.log('Playing pronunciation for:', selectedWord.value?.text);
}

function submitAnswers() {
  showResults.value = true;
  score.value = selectedAnswers.value.filter(
    (answer, index) => answer === questions.value[index].correctAnswer
  ).length;
}

function nextArticle() {
  // TODO: 加载下一篇文章
  showResults.value = false;
  selectedAnswers.value = [];
  selectedWord.value = null;
  showDictionaryPanel.value = false;
}
</script>

<style scoped>
.reading {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
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

.main-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

.article-card {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  .article-header {
    margin-bottom: 20px;
    
    h2 {
      font-size: 24px;
      color: var(--text-color);
      margin: 0 0 12px;
    }
    
    .article-meta {
      display: flex;
      gap: 16px;
      color: var(--text-secondary);
      font-size: 14px;
      
      span {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.article-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  .tool-buttons {
    display: flex;
    gap: 8px;
    
    .tool-btn {
      padding: 6px 12px;
      border-radius: 4px;
      border: 1px solid var(--border-color);
      background: var(--component-bg);
      color: var(--text-color);
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
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
  
  .font-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .font-btn {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid var(--border-color);
      background: var(--component-bg);
      color: var(--text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
    }
    
    .font-size {
      font-size: 13px;
      color: var(--text-secondary);
      min-width: 40px;
      text-align: center;
    }
  }
}

.article-content {
  .paragraph {
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .en-text {
      color: var(--text-color);
      line-height: 1.8;
      margin-bottom: 8px;
      
      .word {
        position: relative;
        cursor: pointer;
        
        &.new-word {
          color: var(--primary-color);
          font-weight: 500;
        }
        
        &.selected {
          background: rgba(var(--primary-color-rgb), 0.1);
          border-radius: 2px;
        }
        
        .phonetic {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--tooltip-bg);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          
          &::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 4px;
            border-style: solid;
            border-color: var(--tooltip-bg) transparent transparent;
          }
        }
      }
    }
    
    .cn-text {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  }
}

.dictionary-panel {
  background: var(--component-bg);
  border-radius: 12px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
  
  .panel-header {
    padding: 16px;
    border-bottom: 1px solid rgba(var(--border-color-rgb), 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      font-size: 16px;
      color: var(--text-color);
      margin: 0;
    }
    
    .close-btn {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: rgba(var(--border-color-rgb), 0.1);
        color: var(--text-color);
      }
    }
  }
  
  .word-details {
    padding: 16px;
    
    .word-header {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 16px;
      
      .word-text {
        font-size: 20px;
        color: var(--text-color);
        font-weight: 500;
      }
      
      .word-phonetic {
        font-size: 14px;
        color: var(--text-secondary);
      }
      
      .sound-btn {
        width: 24px;
        height: 24px;
        border-radius: 12px;
        border: none;
        background: rgba(var(--primary-color-rgb), 0.1);
        color: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          background: var(--primary-color);
          color: white;
        }
      }
    }
    
    .definitions {
      margin-bottom: 20px;
      
      .definition-item {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .pos {
          font-size: 14px;
          color: var(--primary-color);
          font-weight: 500;
        }
        
        .meaning {
          font-size: 14px;
          color: var(--text-color);
        }
      }
    }
    
    .examples {
      h4 {
        font-size: 14px;
        color: var(--text-color);
        margin: 0 0 12px;
      }
      
      .example-item {
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .example-en {
          font-size: 14px;
          color: var(--text-color);
          margin-bottom: 4px;
        }
        
        .example-cn {
          font-size: 13px;
          color: var(--text-secondary);
        }
      }
    }
  }
}

.comprehension-section {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      font-size: 18px;
      color: var(--text-color);
      margin: 0;
    }
    
    .score {
      font-size: 16px;
      color: var(--primary-color);
      font-weight: 500;
    }
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
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      
      &.submit-btn {
        background: var(--primary-color);
        color: white;
        
        &:hover {
          background: var(--primary-hover);
        }
      }
      
      &.next-btn {
        background: var(--success-color);
        color: white;
        
        &:hover {
          background: var(--success-hover);
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .dictionary-panel {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 12px 12px 0 0;
    max-height: 50vh;
    overflow-y: auto;
    z-index: 100;
    box-shadow: 0 -4px 12px var(--shadow-color);
  }
}

@media (max-width: 768px) {
  .reading {
    padding: 16px;
  }
  
  .article-card,
  .comprehension-section {
    padding: 16px;
  }
  
  .article-tools {
    flex-direction: column;
    gap: 12px;
    
    .tool-buttons {
      width: 100%;
      justify-content: space-between;
      
      .tool-btn {
        flex: 1;
      }
    }
  }
}
</style> 