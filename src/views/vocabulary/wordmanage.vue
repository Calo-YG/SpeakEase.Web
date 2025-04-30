<template>
  <div class="word-manage">
    <div class="header-section">
      <h2 class="section-title">单词管理</h2>
      <div class="actions">
        <a-input-search
          v-model:value="searchWord"
          placeholder="搜索单词"
          style="width: 250px"
          @search="handleSearch"
        />
        <a-button type="primary" @click="showAddWordModal = true">
          <template #icon><plus-outlined /></template>
          添加单词
        </a-button>
      </div>
    </div>

    <div class="main-content">
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="allWords" tab="所有单词">
          <a-table
            :dataSource="filteredWords"
            :columns="columns"
            :pagination="{ pageSize: 10 }"
            :loading="loading"
            rowKey="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'level'">
                <a-tag :color="getLevelColor(record.level)">{{ getLevelName(record.level) }}</a-tag>
              </template>
              <template v-if="column.key === 'mastered'">
                <a-switch
                  :checked="record.mastered"
                  @change="(checked: boolean) => toggleMastered(record, checked)"
                />
              </template>
              <template v-if="column.key === 'actions'">
                <div class="action-buttons">
                  <a-button type="text" @click="handleEditWord(record)">
                    <template #icon><edit-outlined /></template>
                  </a-button>
                  <a-button type="text" @click="handleViewExamples(record)">
                    <template #icon><align-left-outlined /></template>
                  </a-button>
                  <a-button type="text" danger @click="handleDeleteWord(record)">
                    <template #icon><delete-outlined /></template>
                  </a-button>
                </div>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="myWords" tab="我的单词本">
          <a-empty v-if="myWords.length === 0" description="您的单词本还没有单词" />
          <a-list v-else>
            <a-list-item v-for="word in myWords" :key="word.id">
              <a-list-item-meta>
                <template #title>
                  <div class="word-item-title">
                    <span class="word-text">{{ word.word }}</span>
                    <a-tag :color="getLevelColor(word.level)">{{ getLevelName(word.level) }}</a-tag>
                  </div>
                </template>
                <template #description>
                  <div class="word-item-description">
                    <div class="phonetic">/{{ word.phonetic }}/</div>
                    <div class="translations">
                      <span v-for="(translation, index) in word.translations" :key="index">
                        <span class="pos">{{ translation.pos }}</span>
                        <span class="meaning">{{ translation.meaning }}</span>
                        <a-divider type="vertical" v-if="index < word.translations.length - 1" />
                      </span>
                    </div>
                  </div>
                </template>
              </a-list-item-meta>
              <div class="word-item-actions">
                <a-button type="text" @click="handleEditWord(word)">
                  <template #icon><edit-outlined /></template>
                </a-button>
                <a-button type="text" @click="handleViewExamples(word)">
                  <template #icon><align-left-outlined /></template>
                </a-button>
                <a-button type="text" danger @click="handleRemoveFromMyWords(word)">
                  <template #icon><delete-outlined /></template>
                </a-button>
              </div>
            </a-list-item>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 添加单词对话框 -->
    <a-modal
      v-model:visible="showAddWordModal"
      title="添加单词"
      @ok="handleAddWord"
      @cancel="resetWordForm"
      :confirmLoading="submitting"
      width="650px"
    >
      <a-form :model="wordForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="单词" required>
              <a-input v-model:value="wordForm.word" placeholder="请输入单词" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="音标">
              <a-input v-model:value="wordForm.phonetic" placeholder="请输入音标" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="词性和释义" required>
          <div v-for="(translation, index) in wordForm.translations" :key="index" class="translation-item">
            <a-input 
              v-model:value="translation.pos" 
              placeholder="词性 (如: n./v./adj.)" 
              style="width: 120px; margin-right: 10px" 
            />
            <a-input 
              v-model:value="translation.meaning" 
              placeholder="释义" 
              style="width: calc(100% - 170px)" 
            />
            <a-button 
              type="text" 
              danger 
              @click="removeTranslation(index)" 
              style="margin-left: 10px"
            >
              <delete-outlined />
            </a-button>
          </div>
          <a-button type="dashed" block @click="addTranslation" style="margin-top: 10px">
            <plus-outlined /> 添加词性释义
          </a-button>
        </a-form-item>
        
        <a-form-item label="难度级别">
          <a-select v-model:value="wordForm.level">
            <a-select-option value="elementary">初级</a-select-option>
            <a-select-option value="intermediate">中级</a-select-option>
            <a-select-option value="advanced">高级</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 例句管理对话框 -->
    <a-modal
      v-model:visible="showExamplesModal"
      title="例句管理"
      @ok="saveExamples"
      @cancel="showExamplesModal = false"
      :confirmLoading="submitting"
      width="700px"
    >
      <div v-if="currentWord">
        <h3 class="examples-word-title">{{ currentWord.word }}</h3>
        
        <div v-for="(example, index) in examples" :key="index" class="example-item">
          <div class="example-header">
            <span class="example-index">例句 {{ index + 1 }}</span>
            <a-button type="text" danger @click="removeExample(index)">
              <delete-outlined />
            </a-button>
          </div>
          <a-form layout="vertical">
            <a-form-item label="英文例句">
              <a-textarea v-model:value="example.en" :rows="2" placeholder="请输入英文例句" />
            </a-form-item>
            <a-form-item label="中文翻译">
              <a-textarea v-model:value="example.cn" :rows="2" placeholder="请输入中文翻译" />
            </a-form-item>
          </a-form>
          <a-divider v-if="index < examples.length - 1" />
        </div>
        
        <a-button type="dashed" block @click="addExample" style="margin-top: 15px">
          <plus-outlined /> 添加例句
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AlignLeftOutlined
} from '@ant-design/icons-vue';

// 定义单词相关接口
interface Translation {
  pos: string;
  meaning: string;
}

interface Example {
  en: string;
  cn: string;
}

interface Word {
  id: string;
  word: string;
  phonetic: string;
  translations: Translation[];
  examples: Example[];
  level: 'elementary' | 'intermediate' | 'advanced';
  mastered: boolean;
  isInMyWords: boolean;
}

// 状态变量
const loading = ref(false);
const submitting = ref(false);
const activeTab = ref('allWords');
const searchWord = ref('');
const showAddWordModal = ref(false);
const showExamplesModal = ref(false);
const currentWord = ref<Word | null>(null);
const isEditing = ref(false);
const examples = ref<Example[]>([]);

// 单词表单
const wordForm = reactive<Omit<Word, 'id' | 'examples' | 'mastered' | 'isInMyWords'> & { id?: string }>({
  word: '',
  phonetic: '',
  translations: [{ pos: '', meaning: '' }],
  level: 'elementary',
});

// 表格列定义
const columns = [
  {
    title: '单词',
    dataIndex: 'word',
    key: 'word',
  },
  {
    title: '音标',
    dataIndex: 'phonetic',
    key: 'phonetic',
  },
  {
    title: '释义',
    dataIndex: 'translations',
    key: 'translations',
    ellipsis: true,
    width: 300,
    customRender: ({ text }: { text: Translation[] }) => {
      return text.map(t => `${t.pos} ${t.meaning}`).join('; ');
    }
  },
  {
    title: '难度',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: '已掌握',
    dataIndex: 'mastered',
    key: 'mastered',
  },
  {
    title: '操作',
    key: 'actions',
  }
];

// 模拟数据
const words = ref<Word[]>([
  {
    id: '1',
    word: 'appreciate',
    phonetic: 'əˈpriːʃieɪt',
    translations: [
      { pos: 'v.', meaning: '感激；欣赏；理解；领会' },
      { pos: 'v.', meaning: '增值；升值' },
    ],
    examples: [
      {
        en: 'I really appreciate your help.',
        cn: '我真的很感激你的帮助。',
      },
      {
        en: 'The value of the house has appreciated considerably.',
        cn: '这所房子的价值已经大幅增值。',
      }
    ],
    level: 'intermediate',
    mastered: false,
    isInMyWords: true,
  },
  {
    id: '2',
    word: 'consider',
    phonetic: 'kənˈsɪdər',
    translations: [
      { pos: 'v.', meaning: '考虑；思考；认为；将...看作' },
    ],
    examples: [
      {
        en: 'You should consider all the options before making a decision.',
        cn: '做决定之前你应该考虑所有选项。',
      }
    ],
    level: 'elementary',
    mastered: true,
    isInMyWords: true,
  },
  {
    id: '3',
    word: 'eloquent',
    phonetic: 'ˈeləkwənt',
    translations: [
      { pos: 'adj.', meaning: '雄辩的；有说服力的；善于表达的' },
    ],
    examples: [
      {
        en: 'She gave an eloquent speech about human rights.',
        cn: '她发表了一篇关于人权的雄辩演讲。',
      }
    ],
    level: 'advanced',
    mastered: false,
    isInMyWords: false,
  }
]);

// 计算属性
const filteredWords = computed(() => {
  if (!searchWord.value) return words.value;
  return words.value.filter(word => 
    word.word.toLowerCase().includes(searchWord.value.toLowerCase())
  );
});

const myWords = computed(() => {
  return words.value.filter(word => word.isInMyWords);
});

// 方法
function getLevelColor(level: string) {
  const colorMap: Record<string, string> = {
    elementary: 'green',
    intermediate: 'blue',
    advanced: 'purple'
  };
  return colorMap[level] || 'default';
}

function getLevelName(level: string) {
  const nameMap: Record<string, string> = {
    elementary: '初级',
    intermediate: '中级',
    advanced: '高级'
  };
  return nameMap[level] || level;
}

function handleSearch(value: string) {
  searchWord.value = value;
}

function toggleMastered(word: Word, checked: boolean) {
  word.mastered = checked;
  message.success(`已${checked ? '标记' : '取消标记'}：${word.word} 为已掌握`);
}

function addTranslation() {
  wordForm.translations.push({ pos: '', meaning: '' });
}

function removeTranslation(index: number) {
  wordForm.translations.splice(index, 1);
  if (wordForm.translations.length === 0) {
    addTranslation();
  }
}

function resetWordForm() {
  wordForm.word = '';
  wordForm.phonetic = '';
  wordForm.translations = [{ pos: '', meaning: '' }];
  wordForm.level = 'elementary';
  isEditing.value = false;
  delete wordForm.id;
}

function handleAddWord() {
  // 验证表单
  if (!wordForm.word.trim()) {
    message.error('请输入单词');
    return;
  }
  
  if (wordForm.translations.some(t => !t.pos.trim() || !t.meaning.trim())) {
    message.error('请填写完整的词性和释义');
    return;
  }
  
  submitting.value = true;
  
  // 模拟API请求延迟
  setTimeout(() => {
    if (isEditing.value && wordForm.id) {
      // 更新现有单词
      const index = words.value.findIndex(w => w.id === wordForm.id);
      if (index !== -1) {
        const updated = {
          ...words.value[index],
          word: wordForm.word,
          phonetic: wordForm.phonetic,
          translations: [...wordForm.translations],
          level: wordForm.level,
        };
        words.value.splice(index, 1, updated);
        message.success('单词已更新');
      }
    } else {
      // 添加新单词
      const newWord: Word = {
        id: Date.now().toString(),
        word: wordForm.word,
        phonetic: wordForm.phonetic,
        translations: [...wordForm.translations],
        examples: [],
        level: wordForm.level,
        mastered: false,
        isInMyWords: true,
      };
      words.value.unshift(newWord);
      message.success('单词已添加');
    }
    
    submitting.value = false;
    showAddWordModal.value = false;
    resetWordForm();
  }, 500);
}

function handleEditWord(word: Word) {
  isEditing.value = true;
  wordForm.id = word.id;
  wordForm.word = word.word;
  wordForm.phonetic = word.phonetic;
  wordForm.translations = [...word.translations];
  wordForm.level = word.level;
  showAddWordModal.value = true;
}

function handleDeleteWord(word: Word) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除单词 "${word.word}" 吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      const index = words.value.findIndex(w => w.id === word.id);
      if (index !== -1) {
        words.value.splice(index, 1);
        message.success('单词已删除');
      }
    },
  });
}

function handleRemoveFromMyWords(word: Word) {
  Modal.confirm({
    title: '确认移除',
    content: `确定要从单词本中移除 "${word.word}" 吗？`,
    okText: '移除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      word.isInMyWords = false;
      message.success('单词已从单词本中移除');
    },
  });
}

function handleViewExamples(word: Word) {
  currentWord.value = word;
  examples.value = [...(word.examples || [])];
  if (examples.value.length === 0) {
    addExample();
  }
  showExamplesModal.value = true;
}

function addExample() {
  examples.value.push({ en: '', cn: '' });
}

function removeExample(index: number) {
  examples.value.splice(index, 1);
}

function saveExamples() {
  if (!currentWord.value) return;
  
  // 验证例句
  const invalidExamples = examples.value.filter(e => !e.en.trim() || !e.cn.trim());
  if (invalidExamples.length > 0) {
    message.error('请填写完整的例句和翻译');
    return;
  }
  
  submitting.value = true;
  
  // 模拟API请求延迟
  setTimeout(() => {
    const index = words.value.findIndex(w => w.id === currentWord.value?.id);
    if (index !== -1) {
      words.value[index].examples = [...examples.value];
      message.success('例句已保存');
    }
    
    submitting.value = false;
    showExamplesModal.value = false;
  }, 500);
}

// 生命周期钩子
onMounted(() => {
  // 此处可以加载单词数据
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style scoped>
.word-manage {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  margin: 0;
  font-size: 24px;
  color: var(--text-color);
}

.actions {
  display: flex;
  gap: 12px;
}

.main-content {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.word-item-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.word-text {
  font-size: 16px;
  font-weight: 500;
}

.word-item-description {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.phonetic {
  color: var(--text-secondary);
  font-size: 14px;
}

.translations {
  color: var(--text-color);
}

.pos {
  color: var(--primary-color);
  margin-right: 4px;
}

.word-item-actions {
  display: flex;
  gap: 8px;
}

.translation-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.examples-word-title {
  margin-bottom: 20px;
  font-size: 18px;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}

.example-item {
  margin-bottom: 15px;
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.example-index {
  font-weight: 500;
  color: var(--text-color);
}
</style> 