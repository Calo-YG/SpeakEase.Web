<template>
  <div class="message-container">
    <div class="header">
      <h2>消息中心</h2>
      <div class="header-actions">
        <button class="mark-all-read" @click="markAllAsRead">
          全部标记为已读
        </button>
        <button class="clear-all" @click="clearAll">
          清空消息
        </button>
      </div>
    </div>

    <div class="message-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="['tab-button', { active: currentTab === tab.value }]"
        @click="currentTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="badge">{{ tab.count }}</span>
      </button>
    </div>

    <div class="message-list" v-if="!loading">
      <template v-if="filteredMessages.length">
        <div 
          v-for="message in filteredMessages" 
          :key="message.id"
          :class="['message-item', { unread: !message.read }]"
          @click="markAsRead(message)"
        >
          <div class="message-icon" :class="message.type">
            <span v-if="message.type === 'system'">🔔</span>
            <span v-else-if="message.type === 'notification'">📢</span>
            <span v-else>💬</span>
          </div>
          
          <div class="message-content">
            <div class="message-header">
              <h3>{{ message.title }}</h3>
              <span class="message-time">{{ formatDate(message.createdAt) }}</span>
            </div>
            <p class="message-text">{{ message.content }}</p>
            
            <div class="message-actions">
              <button 
                v-if="!message.read" 
                class="action-btn read"
                @click.stop="markAsRead(message)"
              >
                标记已读
              </button>
              <button 
                class="action-btn delete"
                @click.stop="deleteMessage(message)"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </template>
      
      <div v-else class="empty-state">
        <div class="empty-icon">📭</div>
        <p>暂无消息</p>
      </div>
    </div>
    
    <div v-else class="loading">
      加载中...
    </div>

    <div v-if="filteredMessages.length" class="pagination">
      <button 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)"
      >
        上一页
      </button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button 
        :disabled="currentPage === totalPages" 
        @click="changePage(currentPage + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Message {
  id: number;
  title: string;
  content: string;
  type: 'system' | 'notification' | 'message';
  read: boolean;
  createdAt: string;
}

const tabs = [
  { label: '全部消息', value: 'all', count: 0 },
  { label: '系统通知', value: 'system', count: 0 },
  { label: '公告', value: 'notification', count: 0 },
  { label: '私信', value: 'message', count: 0 }
];

const messages = ref<Message[]>([]);
const loading = ref(true);
const currentTab = ref('all');
const currentPage = ref(1);
const pageSize = 10;

// 模拟数据
onMounted(async () => {
  setTimeout(() => {
    messages.value = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `测试消息 ${i + 1}`,
      content: `这是一条测试消息的内容，用于展示消息列表的样式和布局。消息 ID: ${i + 1}`,
      type: i % 3 === 0 ? 'system' : i % 2 === 0 ? 'notification' : 'message',
      read: i % 4 === 0,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
    updateTabCounts();
    loading.value = false;
  }, 1000);
});

const filteredMessages = computed(() => {
  let result = [...messages.value];
  
  if (currentTab.value !== 'all') {
    result = result.filter(msg => msg.type === currentTab.value);
  }
  
  const start = (currentPage.value - 1) * pageSize;
  return result.slice(start, start + pageSize);
});

const totalPages = computed(() => {
  const filteredCount = currentTab.value === 'all' 
    ? messages.value.length 
    : messages.value.filter(msg => msg.type === currentTab.value).length;
  return Math.ceil(filteredCount / pageSize);
});

function updateTabCounts() {
  tabs.forEach(tab => {
    if (tab.value === 'all') {
      tab.count = messages.value.filter(msg => !msg.read).length;
    } else {
      tab.count = messages.value.filter(msg => 
        msg.type === tab.value && !msg.read
      ).length;
    }
  });
}

function formatDate(date: string) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: zhCN
  });
}

function markAsRead(message: Message) {
  if (!message.read) {
    message.read = true;
    updateTabCounts();
  }
}

function markAllAsRead() {
  messages.value.forEach(msg => {
    msg.read = true;
  });
  updateTabCounts();
}

function deleteMessage(message: Message) {
  const index = messages.value.findIndex(msg => msg.id === message.id);
  if (index > -1) {
    messages.value.splice(index, 1);
    updateTabCounts();
  }
}

function clearAll() {
  messages.value = [];
  updateTabCounts();
}

function changePage(page: number) {
  currentPage.value = page;
}
</script>

<style scoped>
.message-container {
  padding: 24px;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-actions button {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.3s;
}

.header-actions button:hover {
  border-color: #1677ff;
  color: #1677ff;
}

.message-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
}

.tab-button {
  position: relative;
  padding: 8px 16px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.3s;
}

.tab-button.active {
  color: #1677ff;
  font-weight: 500;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -13px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #1677ff;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  margin-left: 8px;
  background: #ef4444;
  color: white;
  border-radius: 10px;
  font-size: 12px;
}

.message-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.3s;
}

.message-item:hover {
  background: #f9fafb;
}

.message-item.unread {
  background: #f0f9ff;
}

.message-item.unread:hover {
  background: #e0f2fe;
}

.message-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  flex-shrink: 0;
}

.message-icon.system {
  background: #eff6ff;
  color: #1d4ed8;
}

.message-icon.notification {
  background: #fef3c7;
  color: #d97706;
}

.message-icon.message {
  background: #f0fdf4;
  color: #059669;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.message-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.message-time {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  margin-left: 12px;
}

.message-text {
  font-size: 14px;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
}

.message-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.read {
  background: #eff6ff;
  color: #1d4ed8;
}

.action-btn.read:hover {
  background: #dbeafe;
}

.action-btn.delete {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #fee2e2;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.loading {
  padding: 48px;
  text-align: center;
  color: #6b7280;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination button:hover:not(:disabled) {
  border-color: #1677ff;
  color: #1677ff;
}

.pagination button:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .message-container {
    padding: 16px;
  }
  
  .header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .message-tabs {
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .tab-button {
    white-space: nowrap;
  }
  
  .message-item {
    padding: 16px;
  }
  
  .message-header {
    flex-direction: column;
    gap: 4px;
  }
  
  .message-time {
    margin-left: 0;
  }
}
</style> 