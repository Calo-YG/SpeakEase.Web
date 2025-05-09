<template>
  <div class="ai-assistant-container">
    <h1>AI学习助手</h1>

    <div class="assistant-content">
      <div class="features-section">
        <h2>智能学习助手功能</h2>
        <div class="feature-cards">
          <div class="feature-card" @click="selectFeature('conversation')">
            <el-icon :size="32"><ChatLineRound /></el-icon>
            <h3>智能对话</h3>
            <p>与AI进行自然语言对话，解答语言学习问题</p>
          </div>
          <div class="feature-card" @click="selectFeature('writing')">
            <el-icon :size="32"><Edit /></el-icon>
            <h3>写作助手</h3>
            <p>提供写作建议、语法检查和改进建议</p>
          </div>
          <div class="feature-card" @click="selectFeature('pronunciation')">
            <el-icon :size="32"><Microphone /></el-icon>
            <h3>发音评估</h3>
            <p>识别发音问题并给予改进建议</p>
          </div>
          <div class="feature-card" @click="selectFeature('vocabulary')">
            <el-icon :size="32"><Collection /></el-icon>
            <h3>词汇扩展</h3>
            <p>根据学习进度推荐适合的生词和练习</p>
          </div>
          <div class="feature-card" @click="selectFeature('translation')">
            <el-icon :size="32"><Position /></el-icon>
            <h3>智能翻译</h3>
            <p>提供语境化翻译和例句解释</p>
          </div>
          <div class="feature-card" @click="selectFeature('personalized')">
            <el-icon :size="32"><User /></el-icon>
            <h3>个性化学习</h3>
            <p>根据学习风格和进度量身定制学习计划</p>
          </div>
        </div>
      </div>

      <div class="assistant-interface">
        <div class="interface-header">
          <h2>{{ getFeatureTitle(currentFeature) }}</h2>
          <div class="header-actions">
            <el-button type="primary" plain @click="clearMessages">清空对话</el-button>
          </div>
        </div>

        <div class="chat-container" ref="chatContainer">
          <div v-if="messages.length === 0" class="empty-chat">
            <el-icon :size="64"><ChatDotRound /></el-icon>
            <p>{{ getFeatureWelcomeMessage(currentFeature) }}</p>
          </div>

          <div v-else class="message-list">
            <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
              <el-avatar :size="40" :src="message.role === 'user' ? userAvatar : aiAvatar" />
              <div class="message-content">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
                <div class="message-time">{{ message.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="input-area">
          <el-input
            v-model="userInput"
            placeholder="输入消息..."
            type="textarea"
            :rows="2"
            :disabled="isProcessing"
            @keydown.enter.prevent="sendMessage"
          />
          <div class="input-actions">
            <el-button v-if="currentFeature === 'pronunciation'" icon="el-icon-microphone" circle></el-button>
            <el-button 
              type="primary" 
              :disabled="isProcessing || !userInput.trim()" 
              @click="sendMessage"
            >
              发送
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ChatLineRound, ChatDotRound, Edit, Microphone, Collection, Position, User } from '@element-plus/icons-vue'

// 当前选择的功能
const currentFeature = ref('conversation')

// 用户输入
const userInput = ref('')

// 头像
const userAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
const aiAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 处理状态
const isProcessing = ref(false)

// 聊天容器引用
const chatContainer = ref<HTMLElement | null>(null)

// 聊天消息
const messages = ref<Array<{role: string, content: string, time: string}>>([])

// 根据当前功能获取标题
const getFeatureTitle = (feature: string) => {
  const titles: {[key: string]: string} = {
    conversation: '智能对话',
    writing: '写作助手',
    pronunciation: '发音评估',
    vocabulary: '词汇扩展',
    translation: '智能翻译',
    personalized: '个性化学习'
  }
  return titles[feature] || '智能对话'
}

// 获取功能欢迎消息
const getFeatureWelcomeMessage = (feature: string) => {
  const messages: {[key: string]: string} = {
    conversation: '你好！我是你的AI语言学习助手，你可以问我任何语言学习相关的问题。',
    writing: '请输入你想要检查或改进的文本，我会为你提供写作建议。',
    pronunciation: '点击麦克风按钮开始录音，我会评估你的发音并给出改进建议。',
    vocabulary: '我可以根据你的学习进度推荐适合的词汇学习内容。',
    translation: '请输入你想要翻译的文本，我会提供语境化翻译和解释。',
    personalized: '我可以根据你的学习风格和进度，为你制定个性化的学习计划。'
  }
  return messages[feature] || '你好！我是你的AI语言学习助手。'
}

// 选择功能
const selectFeature = (feature: string) => {
  currentFeature.value = feature
  clearMessages()
}

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() || isProcessing.value) return

  const userMessage = userInput.value
  userInput.value = ''
  
  // 添加用户消息
  addMessage('user', userMessage)

  // 模拟处理
  isProcessing.value = true
  
  setTimeout(() => {
    // 模拟AI回复
    const aiResponses: {[key: string]: string} = {
      conversation: `这是一个很好的问题！在语言学习中，坚持练习和实际应用是最重要的。我建议你每天安排固定时间学习，并寻找机会使用所学语言。`,
      writing: `你的写作整体不错，但有几处可以改进：\n1. 第一段的表达可以更加简洁\n2. 第二段有一处语法错误\n3. 建议使用更多连接词使文章更流畅`,
      pronunciation: `你的发音整体流畅度不错，但有几个音素需要注意：\n- "th"的发音需要将舌尖放在上下齿之间\n- 注意单词重音位置的变化`,
      vocabulary: `根据你的学习进度，我推荐以下单词进行学习：\n- arbitrary (adj.) 任意的，武断的\n- concise (adj.) 简明的，简洁的\n- delegate (v.) 委派，授权`,
      translation: `原文：The early bird catches the worm.\n翻译：早起的鸟儿有虫吃。\n这是一个英语谚语，意思是早行动的人会得到好处，强调行动迅速的重要性。`,
      personalized: `根据你的学习数据，我为你制定了以下学习计划：\n1. 每天15分钟词汇学习\n2. 每周3次口语练习，每次20分钟\n3. 每周精读一篇文章，重点分析语法结构`
    }
    
    addMessage('assistant', aiResponses[currentFeature.value] || aiResponses.conversation)
    isProcessing.value = false
  }, 1000)
}

// 添加消息
const addMessage = (role: string, content: string) => {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  messages.value.push({
    role,
    content,
    time
  })
  
  // 滚动到底部
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 清空消息
const clearMessages = () => {
  messages.value = []
}

// 格式化消息（处理换行等）
const formatMessage = (content: string) => {
  return content.replace(/\n/g, '<br>')
}
</script>

<style scoped>
.ai-assistant-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.assistant-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  margin-top: 20px;
}

.features-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.feature-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-top: 20px;
}

.feature-card {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  margin: 10px 0 5px;
  color: #333;
}

.feature-card p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.assistant-interface {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 600px;
}

.interface-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.empty-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
}

.empty-chat p {
  margin-top: 15px;
  text-align: center;
  max-width: 400px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  gap: 10px;
  max-width: 80%;
}

.message.assistant {
  align-self: flex-start;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-content {
  background: #f5f7fa;
  padding: 10px 15px;
  border-radius: 12px;
}

.message.user .message-content {
  background: #ecf5ff;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  text-align: right;
}

.input-area {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 