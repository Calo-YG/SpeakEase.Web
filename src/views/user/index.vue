<template>
  <div class="user-container">
    <div class="header">
      <h2>用户管理</h2>
      <button class="add-button" @click="showAddUserModal">
        <span class="icon">+</span>
        添加用户
      </button>
    </div>

    <div class="search-bar">
      <div class="search-input">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索用户名、邮箱或角色"
          @input="handleSearch"
        />
        <span class="search-icon">🔍</span>
      </div>
      <div class="filters">
        <select v-model="roleFilter">
          <option value="">所有角色</option>
          <option value="admin">管理员</option>
          <option value="user">普通用户</option>
        </select>
        <select v-model="statusFilter">
          <option value="">所有状态</option>
          <option value="active">活跃</option>
          <option value="inactive">未激活</option>
          <option value="blocked">已封禁</option>
        </select>
      </div>
    </div>

    <div class="user-table">
      <div class="table-header">
        <div class="col">用户信息</div>
        <div class="col">角色</div>
        <div class="col">状态</div>
        <div class="col">注册时间</div>
        <div class="col">操作</div>
      </div>
      
      <div v-if="loading" class="loading">
        加载中...
      </div>
      
      <template v-else>
        <div v-for="user in filteredUsers" :key="user.id" class="table-row">
          <div class="col user-info">
            <img :src="getUserAvatar(user)" alt="avatar" class="avatar" />
            <div class="user-details">
              <div class="username">{{ user.username }}</div>
              <div class="email">{{ user.email }}</div>
            </div>
          </div>
          <div class="col">
            <span class="role-badge" :class="user.role">{{ user.role }}</span>
          </div>
          <div class="col">
            <span class="status-badge" :class="user.status">{{ user.status }}</span>
          </div>
          <div class="col">{{ formatDate(user.createdAt) }}</div>
          <div class="col actions">
            <button class="action-btn edit" @click="editUser(user)">编辑</button>
            <button class="action-btn delete" @click="deleteUser(user)">删除</button>
          </div>
        </div>
      </template>
    </div>

    <div class="pagination">
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

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  createdAt: string;
}

const users = ref<User[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const pageSize = 10;
const baseUrl = import.meta.env.VITE_API_BASE || '';

// 模拟数据
onMounted(async () => {
  // 这里应该调用实际的 API
  setTimeout(() => {
    users.value = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      username: `用户${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'admin' : 'user',
      status: i % 4 === 0 ? 'inactive' : i % 5 === 0 ? 'blocked' : 'active',
      avatar: '',
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
    loading.value = false;
  }, 1000);
});

const filteredUsers = computed(() => {
  let result = [...users.value];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }
  
  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value);
  }
  
  if (statusFilter.value) {
    result = result.filter(user => user.status === statusFilter.value);
  }
  
  return result;
});

const totalPages = computed(() => 
  Math.ceil(filteredUsers.value.length / pageSize)
);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredUsers.value.slice(start, start + pageSize);
});

function getUserAvatar(user: User) {
  if (!user.avatar) return '/src/assets/default-avatar.png';
  if (user.avatar.startsWith('http')) return user.avatar;
  return `${baseUrl}${user.avatar}`;
}

function formatDate(date: string) {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true,
    locale: zhCN
  });
}

function handleSearch() {
  currentPage.value = 1;
}

function changePage(page: number) {
  currentPage.value = page;
}

function showAddUserModal() {
  // 实现添加用户的逻辑
  console.log('显示添加用户模态框');
}

function editUser(user: User) {
  // 实现编辑用户的逻辑
  console.log('编辑用户:', user);
}

function deleteUser(user: User) {
  // 实现删除用户的逻辑
  console.log('删除用户:', user);
}
</script>

<style scoped>
.user-container {
  padding: 24px;
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

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #1677ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background: #0958d9;
}

.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  position: relative;
}

.search-input input {
  width: 100%;
  height: 40px;
  padding: 0 40px 0 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.filters {
  display: flex;
  gap: 12px;
}

.filters select {
  height: 40px;
  padding: 0 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #1f2937;
}

.user-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #4b5563;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-weight: 500;
  color: #1f2937;
}

.email {
  font-size: 12px;
  color: #6b7280;
}

.role-badge,
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge.admin {
  background: #eff6ff;
  color: #1d4ed8;
}

.role-badge.user {
  background: #f3f4f6;
  color: #4b5563;
}

.status-badge.active {
  background: #ecfdf5;
  color: #059669;
}

.status-badge.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.blocked {
  background: #fef2f2;
  color: #dc2626;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.edit {
  background: #eff6ff;
  color: #1d4ed8;
}

.action-btn.edit:hover {
  background: #dbeafe;
}

.action-btn.delete {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #fee2e2;
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
  .user-container {
    padding: 16px;
  }
  
  .search-bar {
    flex-direction: column;
  }
  
  .filters {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .col:not(:first-child) {
    display: none;
  }
  
  .actions {
    margin-top: 8px;
  }
}
</style> 