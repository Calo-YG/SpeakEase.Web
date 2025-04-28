<template>
  <div class="practice">
    <div class="header-section">
      <div class="today-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <clock-circle-outlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ studyTime }}分钟</div>
            <div class="stat-label">今日学习时长</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <calendar-outlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ consecutiveDays }}天</div>
            <div class="stat-label">连续学习</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <trophy-outlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ todayPoints }}分</div>
            <div class="stat-label">今日积分</div>
          </div>
        </div>
      </div>
      <div class="timer-card">
        <div class="timer-display">
          <div class="timer-value">{{ formattedTimer }}</div>
          <div class="timer-label">当前学习时长</div>
        </div>
        <div class="timer-controls">
          <a-button 
            type="primary" 
            @click="startTimer" 
            :disabled="isTimerActive"
          >
            开始学习
          </a-button>
          <a-button 
            @click="pauseTimer" 
            :disabled="!isTimerActive"
          >
            暂停
          </a-button>
          <a-button 
            danger 
            @click="endTimer" 
            :disabled="!currentTimer"
          >
            结束
          </a-button>
        </div>
      </div>
      <div class="goals-section">
        <h3>学习目标</h3>
        <div class="goals-grid">
          <div class="goal-card" v-for="goal in learningGoals" :key="goal.id">
            <div class="goal-header">
              <div class="goal-title">{{ goal.title }}</div>
              <div class="goal-period">{{ goal.period }}</div>
            </div>
            <div class="goal-progress">
              <div class="progress-bar">
                <div class="progress" :style="{ width: `${goal.progress}%` }"></div>
              </div>
              <div class="progress-text">{{ goal.current }}/{{ goal.target }}</div>
            </div>
          </div>
        </div>
        <button class="set-goal-btn" @click="showGoalDialog = true">
          <plus-outlined />设置新目标
        </button>
      </div>
    </div>

    <div class="main-content">
      <div class="tasks-section">
        <h2>今日任务</h2>
        <div class="task-list">
          <div 
            v-for="task in dailyTasks" 
            :key="task.id"
            class="task-card"
            :class="{ completed: task.completed }"
          >
            <div class="task-header">
              <div class="task-type">
                <component :is="task.icon" />
                {{ task.type }}
              </div>
              <div class="task-points">+{{ task.points }}分</div>
            </div>
            <div class="task-content">
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
              <div class="task-progress" v-if="task.progress">
                <div class="progress-text">
                  完成进度: {{ task.progress.current }}/{{ task.progress.total }}
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress" 
                    :style="{ width: (task.progress.current / task.progress.total * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="task-actions">
              <button 
                class="action-btn"
                :class="{ completed: task.completed }"
                @click="handleTaskAction(task)"
              >
                {{ task.completed ? '已完成' : '开始学习' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="side-section">
        <div class="calendar-card">
          <div class="card-header">
            <h3>学习日历</h3>
            <div class="month-selector">
              <button class="month-btn" @click="previousMonth">
                <left-outlined />
              </button>
              <span>{{ currentMonth }}</span>
              <button class="month-btn" @click="nextMonth">
                <right-outlined />
              </button>
            </div>
          </div>
          <div class="calendar-grid">
            <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
            <div 
              v-for="date in calendarDates" 
              :key="date.day"
              class="date-cell"
              :class="{
                'other-month': !date.currentMonth,
                'today': date.isToday,
                'has-study': date.hasStudy
              }"
            >
              {{ date.day }}
              <div class="study-indicator" v-if="date.hasStudy"></div>
            </div>
          </div>
        </div>

        <div class="achievement-card">
          <div class="card-header">
            <h3>成就解锁</h3>
          </div>
          <div class="achievement-list">
            <div 
              v-for="achievement in recentAchievements" 
              :key="achievement.id"
              class="achievement-item"
            >
              <div class="achievement-icon">
                <component :is="achievement.icon" />
              </div>
              <div class="achievement-info">
                <div class="achievement-name">{{ achievement.name }}</div>
                <div class="achievement-desc">{{ achievement.description }}</div>
              </div>
              <div class="achievement-date">{{ achievement.date }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 目标设置对话框 -->
    <a-modal
      v-model:visible="showGoalDialog"
      title="设置学习目标"
      @ok="handleSetGoal"
      @cancel="showGoalDialog = false"
    >
      <div class="goal-form">
        <a-form :model="newGoal" layout="vertical">
          <a-form-item label="目标类型">
            <a-select v-model:value="newGoal.type">
              <a-select-option value="vocabulary">词汇量</a-select-option>
              <a-select-option value="listening">听力时长</a-select-option>
              <a-select-option value="speaking">口语练习</a-select-option>
              <a-select-option value="reading">阅读数量</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="目标数值">
            <a-input-number v-model:value="newGoal.target" :min="1" />
          </a-form-item>
          <a-form-item label="目标周期">
            <a-select v-model:value="newGoal.period">
              <a-select-option value="daily">每日目标</a-select-option>
              <a-select-option value="weekly">每周目标</a-select-option>
              <a-select-option value="monthly">每月目标</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 学习数据统计 -->
    <a-card class="statistics-card" title="学习数据统计">
      <div class="chart-container">
        <Line :data="weeklyData" :options="chartOptions" height="300" />
      </div>
    </a-card>

    <!-- 目标统计卡片 -->
    <a-card class="goal-stats-card" title="目标完成情况">
      <div class="goal-stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ goalStats.total }}</div>
          <div class="stat-label">总目标数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ goalStats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ goalStats.inProgress }}</div>
          <div class="stat-label">进行中</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ goalStats.notStarted }}</div>
          <div class="stat-label">未开始</div>
        </div>
      </div>
      
      <div class="goal-trend-chart">
        <Line :data="goalTrendData" :options="goalTrendOptions" height="200" />
      </div>
    </a-card>

    <!-- 提醒列表卡片 -->
    <a-card class="reminder-card" title="学习提醒">
      <template #extra>
        <a-button type="primary" @click="showReminderDialog = true">
          <plus-outlined />添加提醒
        </a-button>
      </template>
      
      <div class="reminder-list">
        <div 
          v-for="reminder in reminders" 
          :key="reminder.id"
          class="reminder-item"
        >
          <div class="reminder-icon">
            <bell-outlined />
          </div>
          <div class="reminder-content">
            <div class="reminder-time">{{ reminder.time }}</div>
            <div class="reminder-desc">{{ reminder.content }}</div>
            <div class="reminder-days">
              每周{{ reminder.days.map(d => ['一', '二', '三', '四', '五', '六', '日'][parseInt(d)-1]).join('、') }}
            </div>
          </div>
          <div class="reminder-actions">
            <a-switch 
              :checked="reminder.enabled"
              @change="() => toggleReminder(reminder)"
            />
            <a-button 
              type="text" 
              danger
              @click="() => deleteReminder(reminder.id)"
            >
              删除
            </a-button>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 提醒设置对话框 -->
    <a-modal
      v-model:visible="showReminderDialog"
      title="添加提醒"
      @ok="handleSetReminder"
      @cancel="showReminderDialog = false"
    >
      <a-form :model="reminderForm" layout="vertical">
        <a-form-item label="提醒时间">
          <a-time-picker
            v-model:value="reminderForm.time"
            format="HH:mm"
            placeholder="选择时间"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="重复">
          <a-checkbox-group v-model:value="reminderForm.days">
            <a-checkbox value="1">周一</a-checkbox>
            <a-checkbox value="2">周二</a-checkbox>
            <a-checkbox value="3">周三</a-checkbox>
            <a-checkbox value="4">周四</a-checkbox>
            <a-checkbox value="5">周五</a-checkbox>
            <a-checkbox value="6">周六</a-checkbox>
            <a-checkbox value="7">周日</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="提醒内容">
          <a-textarea
            v-model:value="reminderForm.content"
            placeholder="输入提醒内容"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 笔记列表卡片 -->
    <a-card class="notes-card" title="学习笔记">
      <template #extra>
        <a-button type="primary" @click="showNoteDialog = true">
          <plus-outlined />添加笔记
        </a-button>
      </template>
      
      <div class="notes-list">
        <div 
          v-for="note in notes" 
          :key="note.id"
          class="note-item"
        >
          <div class="note-header">
            <div class="note-title">
              <file-text-outlined />
              {{ note.title }}
            </div>
            <div class="note-category">
              {{ categoryOptions.find(c => c.value === note.category)?.label }}
            </div>
          </div>
          <div class="note-content">{{ note.content }}</div>
          <div class="note-footer">
            <div class="note-time">更新于：{{ note.updateTime }}</div>
            <div class="note-actions">
              <a-button 
                type="text"
                @click="editNote(note)"
              >
                <template #icon><edit-outlined /></template>
                编辑
              </a-button>
              <a-button 
                type="text" 
                danger
                @click="deleteNote(note)"
              >
                <template #icon><delete-outlined /></template>
                删除
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 笔记编辑对话框 -->
    <a-modal
      v-model:visible="showNoteDialog"
      :title="isEditingNote ? '编辑笔记' : '添加笔记'"
      @ok="handleSaveNote"
      @cancel="resetNoteForm"
      width="800px"
    >
      <a-form :model="noteForm" layout="vertical">
        <a-form-item label="笔记标题">
          <a-input v-model:value="noteForm.title" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item label="笔记分类">
          <a-select v-model:value="noteForm.category">
            <a-select-option 
              v-for="option in categoryOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="笔记内容">
          <a-textarea
            v-model:value="noteForm.content"
            placeholder="请输入笔记内容"
            :rows="10"
            :auto-size="{ minRows: 10, maxRows: 20 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 数据导出按钮组 -->
    <div class="export-actions">
      <input
        type="file"
        id="data-import"
        accept=".json"
        style="display: none;"
        @change="importData"
        ref="fileInput"
      />
      <a-button @click="handleFileInputClick">
        <template #icon><upload-outlined /></template>
        导入数据
      </a-button>
      <a-button @click="exportData">
        <template #icon><download-outlined /></template>
        导出JSON数据
      </a-button>
      <a-button type="primary" @click="exportToExcel">
        <template #icon><download-outlined /></template>
        导出Excel报表
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted, h } from 'vue';
import {
  ClockCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ReadOutlined,
  SoundOutlined,
  AudioOutlined,
  BookOutlined,
  LeftOutlined,
  RightOutlined,
  FireOutlined,
  StarOutlined,
  PlusOutlined,
  BellOutlined,
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js'
import { message, notification, Modal } from 'ant-design-vue';
import * as XLSX from 'xlsx';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const router = useRouter();

// 学习统计数据
const studyTime = ref(45);
const consecutiveDays = ref(7);
const todayPoints = ref(120);

// 每日任务数据
const dailyTasks = ref([
  {
    id: '1',
    type: '词汇学习',
    icon: ReadOutlined,
    title: '掌握20个新单词',
    description: '学习并记忆今日推荐的核心词汇',
    points: 30,
    completed: false,
    progress: {
      current: 8,
      total: 20
    },
    route: '/index/vocabulary'
  },
  {
    id: '2',
    type: '听力训练',
    icon: SoundOutlined,
    title: '日常对话练习',
    description: '完成2个听力理解练习',
    points: 40,
    completed: false,
    progress: {
      current: 1,
      total: 2
    },
    route: '/index/listening'
  },
  {
    id: '3',
    type: '口语练习',
    icon: AudioOutlined,
    title: '情景对话',
    description: '完成1个口语练习任务',
    points: 50,
    completed: false,
    progress: {
      current: 0,
      total: 1
    },
    route: '/index/speaking'
  },
  {
    id: '4',
    type: '阅读理解',
    icon: BookOutlined,
    title: '短文阅读',
    description: '阅读并完成一篇文章的理解练习',
    points: 40,
    completed: false,
    progress: {
      current: 0,
      total: 1
    },
    route: '/index/reading'
  }
]);

// 日历相关
const currentDate = new Date();
const currentMonth = computed(() => {
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString('zh-CN', { month: 'long' });
  return `${year}年${month}`;
});

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

// 模拟日历数据
const calendarDates = ref(generateCalendarDates());

function generateCalendarDates() {
  const dates = [];
  const today = new Date();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // 添加上月剩余日期
  const prevMonthDays = firstDay.getDay();
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    dates.push({
      day: prevMonth.getDate() - i,
      currentMonth: false,
      isToday: false,
      hasStudy: false
    });
  }
  
  // 添加当月日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    dates.push({
      day: i,
      currentMonth: true,
      isToday: today.getDate() === i && 
               today.getMonth() === currentDate.getMonth() && 
               today.getFullYear() === currentDate.getFullYear(),
      hasStudy: Math.random() > 0.5 // 模拟学习记录
    });
  }
  
  // 添加下月开始日期
  const nextMonthDays = 42 - dates.length;
  for (let i = 1; i <= nextMonthDays; i++) {
    dates.push({
      day: i,
      currentMonth: false,
      isToday: false,
      hasStudy: false
    });
  }
  
  return dates;
}

function previousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  calendarDates.value = generateCalendarDates();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  calendarDates.value = generateCalendarDates();
}

// 成就数据
const recentAchievements = ref([
  {
    id: '1',
    icon: FireOutlined,
    name: '坚持不懈',
    description: '连续学习7天',
    date: '今天'
  },
  {
    id: '2',
    icon: StarOutlined,
    name: '词汇达人',
    description: '累计掌握500个单词',
    date: '昨天'
  }
]);

// 学习目标数据
const learningGoals = ref([
  {
    id: '1',
    title: '词汇量目标',
    period: '每日目标',
    target: 50,
    current: 30,
    progress: 60,
    type: 'vocabulary'
  },
  {
    id: '2',
    title: '听力练习',
    period: '每周目标',
    target: 120,
    current: 45,
    progress: 37.5,
    type: 'listening'
  }
]);

// 目标设置相关
const showGoalDialog = ref(false);
const newGoal = ref({
  type: 'vocabulary',
  target: 1,
  period: 'daily'
});

// 任务完成处理
async function handleTaskAction(task: any) {
  if (!task.completed) {
    if (task.progress) {
      // 如果是进度型任务，跳转到对应页面
      router.push(task.route);
    } else {
      // 直接完成的任务
      task.completed = true;
      todayPoints.value += task.points;
      
      // 显示积分奖励动画
      showPointsReward(task.points);
      
      // 显示成功提示
      message.success(`恭喜完成任务！获得 ${task.points} 积分`);
      
      // 检查是否触发成就
      checkAchievements();
    }
  }
}

// 显示积分奖励动画
function showPointsReward(points: number) {
  const reward = document.createElement('div');
  reward.className = 'points-reward';
  reward.textContent = `+${points}`;
  document.body.appendChild(reward);
  
  // 动画结束后移除元素
  setTimeout(() => {
    document.body.removeChild(reward);
  }, 1000);
}

// 检查是否触发新的成就
function checkAchievements() {
  // 检查连续学习天数
  if (consecutiveDays.value === 7) {
    const achievement = {
      id: Date.now().toString(),
      icon: FireOutlined,
      name: '坚持不懈',
      description: '连续学习7天',
      date: '刚刚'
    };
    
    recentAchievements.value.unshift(achievement);
    message.success('解锁新成就：坚持不懈！');
  }
  
  // 检查今日积分
  if (todayPoints.value >= 100) {
    const achievement = {
      id: Date.now().toString(),
      icon: TrophyOutlined,
      name: '学习达人',
      description: '单日获得100积分',
      date: '刚刚'
    };
    
    if (!recentAchievements.value.some(a => a.name === '学习达人')) {
      recentAchievements.value.unshift(achievement);
      message.success('解锁新成就：学习达人！');
    }
  }
}

// 设置目标
function handleSetGoal() {
  type GoalType = 'vocabulary' | 'listening' | 'speaking' | 'reading';
  type PeriodType = 'daily' | 'weekly' | 'monthly';

  const goalTypes: Record<GoalType, string> = {
    vocabulary: '词汇量目标',
    listening: '听力练习',
    speaking: '口语练习',
    reading: '阅读数量'
  };

  const periodTypes: Record<PeriodType, string> = {
    daily: '每日目标',
    weekly: '每周目标',
    monthly: '每月目标'
  };

  learningGoals.value.push({
    id: Date.now().toString(),
    title: goalTypes[newGoal.value.type as GoalType],
    period: periodTypes[newGoal.value.period as PeriodType],
    target: newGoal.value.target,
    current: 0,
    progress: 0,
    type: newGoal.value.type
  });

  showGoalDialog.value = false;
  newGoal.value = {
    type: 'vocabulary',
    target: 1,
    period: 'daily'
  };
}

// 学习数据
const weeklyData = ref({
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  datasets: [
    {
      label: '学习时长(分钟)',
      data: [45, 60, 30, 90, 55, 75, 40],
      borderColor: '#1890ff',
      tension: 0.4
    },
    {
      label: '完成任务数',
      data: [3, 4, 2, 5, 3, 4, 2],
      borderColor: '#52c41a',
      tension: 0.4
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: '本周学习数据统计'
    }
  }
}

// 计时器相关
const isTimerActive = ref(false);
const currentTimer = ref(0);
const timerInterval = ref<number | null>(null);

// 开始计时
function startTimer() {
  if (!isTimerActive.value) {
    isTimerActive.value = true;
    timerInterval.value = window.setInterval(() => {
      currentTimer.value++;
      studyTime.value++;
    }, 60000); // 每分钟更新一次
  }
}

// 暂停计时
function pauseTimer() {
  if (isTimerActive.value && timerInterval.value) {
    isTimerActive.value = false;
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
}

// 结束计时并保存
function endTimer() {
  pauseTimer();
  // TODO: 这里可以添加保存学习记录的逻辑
  currentTimer.value = 0;
}

// 组件销毁前清理计时器
onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});

// 格式化时间显示
const formattedTimer = computed(() => {
  const hours = Math.floor(currentTimer.value / 60);
  const minutes = currentTimer.value % 60;
  return `${hours > 0 ? `${hours}小时` : ''}${minutes}分钟`;
});

const goalStats = computed(() => {
  return {
    total: learningGoals.value.length,
    completed: learningGoals.value.filter(goal => 
      (goal.current / goal.target) >= 1
    ).length,
    inProgress: learningGoals.value.filter(goal => 
      goal.current > 0 && (goal.current / goal.target) < 1
    ).length,
    notStarted: learningGoals.value.filter(goal => 
      goal.current === 0
    ).length
  };
});

// 目标完成趋势数据
const goalTrendData = ref({
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  datasets: [
    {
      label: '目标完成率',
      data: [40, 65, 55, 80, 70, 85, 75],
      borderColor: '#722ed1',
      backgroundColor: 'rgba(114, 46, 209, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
});

const goalTrendOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: '目标完成趋势'
    }
  },
  scales: {
    y: {
      type: 'linear',
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value: number | string) => `${value}%`
      }
    }
  }
};

// 提醒相关类型定义
interface Reminder {
  id: string;
  time: string;
  days: string[];
  content: string;
  enabled: boolean;
}

// 提醒相关状态
const showReminderDialog = ref(false);
const reminderForm = ref({
  time: '',
  days: ['1', '2', '3', '4', '5'],
  content: ''
});

const reminders = ref<Reminder[]>([
  {
    id: '1',
    time: '09:00',
    days: ['1', '2', '3', '4', '5'],
    content: '早上好！开始今天的学习吧',
    enabled: true
  },
  {
    id: '2',
    time: '20:00',
    days: ['1', '2', '3', '4', '5', '6', '7'],
    content: '晚上好！记得完成今天的学习任务',
    enabled: true
  }
]);

// 添加提醒
function handleSetReminder() {
  if (!reminderForm.value.time || !reminderForm.value.content || reminderForm.value.days.length === 0) {
    message.error('请填写完整的提醒信息');
    return;
  }

  const newReminder: Reminder = {
    id: Date.now().toString(),
    time: reminderForm.value.time,
    days: [...reminderForm.value.days],
    content: reminderForm.value.content,
    enabled: true
  };
  
  reminders.value.push(newReminder);
  showReminderDialog.value = false;
  
  // 重置表单
  reminderForm.value = {
    time: '',
    days: ['1', '2', '3', '4', '5'],
    content: ''
  };
  
  message.success('提醒设置成功！');
  setupReminder(newReminder);
}

// 设置提醒定时器
function setupReminder(reminder: Reminder) {
  if (!reminder.enabled) return;

  const [hours, minutes] = reminder.time.split(':');
  const now = new Date();
  const today = now.getDay() || 7; // 转换为 1-7
  
  // 检查今天是否需要提醒
  if (reminder.days.includes(today.toString())) {
    const reminderTime = new Date();
    reminderTime.setHours(parseInt(hours));
    reminderTime.setMinutes(parseInt(minutes));
    reminderTime.setSeconds(0);
    
    // 如果时间已过，设置为明天
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    setTimeout(() => {
      showReminder(reminder);
      // 设置下一次提醒
      setupReminder(reminder);
    }, timeUntilReminder);
  }
}

// 显示提醒通知
function showReminder(reminder: Reminder) {
  notification.info({
    message: '学习提醒',
    description: reminder.content,
    duration: 0,
    key: 'reminder',
    btn: () => h('a-button', {
      type: 'primary',
      size: 'small',
      onClick: () => {
        notification.close('reminder');
        startTimer();
      }
    }, '开始学习')
  });
}

// 切换提醒状态
function toggleReminder(reminder: Reminder) {
  reminder.enabled = !reminder.enabled;
  if (reminder.enabled) {
    setupReminder(reminder);
    message.success('提醒已启用');
  } else {
    message.success('提醒已禁用');
  }
}

// 删除提醒
function deleteReminder(id: string) {
  reminders.value = reminders.value.filter(r => r.id !== id);
  message.success('提醒已删除');
}

// 初始化所有提醒
onMounted(() => {
  reminders.value.forEach(reminder => {
    if (reminder.enabled) {
      setupReminder(reminder);
    }
  });
});

// 笔记相关类型定义
interface Note {
  id: string;
  title: string;
  content: string;
  category: 'vocabulary' | 'listening' | 'speaking' | 'reading';
  createTime: string;
  updateTime: string;
}

// 笔记相关状态
const showNoteDialog = ref(false);
const isEditingNote = ref(false);
const currentNote = ref<Note | null>(null);
const noteForm = ref({
  title: '',
  content: '',
  category: 'vocabulary' as Note['category']
});

const notes = ref<Note[]>([
  {
    id: '1',
    title: '常用商务英语词汇',
    content: '1. Meeting - 会议\n2. Schedule - 日程安排\n3. Deadline - 截止日期',
    category: 'vocabulary',
    createTime: '2024-03-15 10:00',
    updateTime: '2024-03-15 10:00'
  },
  {
    id: '2',
    title: '日常对话练习笔记',
    content: '今天练习了餐厅点餐的场景对话，需要注意的表达：\n1. Would you like to...?\n2. I will have...',
    category: 'speaking',
    createTime: '2024-03-15 14:30',
    updateTime: '2024-03-15 14:30'
  }
]);

// 笔记分类选项
const categoryOptions = [
  { label: '词汇学习', value: 'vocabulary' },
  { label: '听力训练', value: 'listening' },
  { label: '口语练习', value: 'speaking' },
  { label: '阅读理解', value: 'reading' }
];

// 添加或更新笔记
function handleSaveNote() {
  if (!noteForm.value.title || !noteForm.value.content) {
    message.error('请填写笔记标题和内容');
    return;
  }

  const now = new Date().toLocaleString('zh-CN');
  
  if (isEditingNote.value && currentNote.value) {
    // 更新笔记
    const index = notes.value.findIndex(n => n.id === currentNote.value!.id);
    if (index !== -1) {
      notes.value[index] = {
        ...currentNote.value,
        title: noteForm.value.title,
        content: noteForm.value.content,
        category: noteForm.value.category,
        updateTime: now
      };
      message.success('笔记已更新');
    }
  } else {
    // 添加新笔记
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteForm.value.title,
      content: noteForm.value.content,
      category: noteForm.value.category,
      createTime: now,
      updateTime: now
    };
    notes.value.unshift(newNote);
    message.success('笔记已添加');
  }

  resetNoteForm();
}

// 编辑笔记
function editNote(note: Note) {
  currentNote.value = note;
  noteForm.value = {
    title: note.title,
    content: note.content,
    category: note.category
  };
  isEditingNote.value = true;
  showNoteDialog.value = true;
}

// 删除笔记
function deleteNote(note: Note) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条笔记吗？',
    onOk() {
      notes.value = notes.value.filter(n => n.id !== note.id);
      message.success('笔记已删除');
    }
  });
}

// 重置笔记表单
function resetNoteForm() {
  noteForm.value = {
    title: '',
    content: '',
    category: 'vocabulary'
  };
  currentNote.value = null;
  isEditingNote.value = false;
  showNoteDialog.value = false;
}

// 导出数据相关
interface ExportData {
  learningStats: {
    studyTime: number;
    consecutiveDays: number;
    todayPoints: number;
  };
  goals: {
    id: string;
    title: string;
    period: string;
    target: number;
    current: number;
    progress: number;
    type: string;
  }[];
  tasks: {
    id: string;
    type: string;
    icon: any;
    title: string;
    description: string;
    points: number;
    completed: boolean;
    progress?: {
      current: number;
      total: number;
    };
    route: string;
  }[];
  notes: Note[];
  reminders: Reminder[];
}

// 导出数据
function exportData() {
  const data: ExportData = {
    learningStats: {
      studyTime: studyTime.value,
      consecutiveDays: consecutiveDays.value,
      todayPoints: todayPoints.value
    },
    goals: [...learningGoals.value],
    tasks: [...dailyTasks.value],
    notes: [...notes.value],
    reminders: [...reminders.value]
  };

  // 创建 Blob
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  
  // 创建下载链接
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date().toLocaleString('zh-CN').replace(/[/:]/g, '-');
  
  link.href = url;
  link.download = `speakease-data-${now}.json`;
  
  // 触发下载
  document.body.appendChild(link);
  link.click();
  
  // 清理
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  
  message.success('数据导出成功！');
}

// 导出为 Excel
async function exportToExcel() {
  try {
    // 创建工作簿
    const workbook = {
      SheetNames: ['学习统计', '目标', '任务', '笔记', '提醒'],
      Sheets: {
        '学习统计': {
          '!ref': 'A1:B4',
          A1: { v: '项目' },
          B1: { v: '数值' },
          A2: { v: '学习时长(分钟)' },
          B2: { v: studyTime.value },
          A3: { v: '连续学习天数' },
          B3: { v: consecutiveDays.value },
          A4: { v: '今日积分' },
          B4: { v: todayPoints.value }
        },
        '目标': {
          '!ref': 'A1:E' + (learningGoals.value.length + 1),
          A1: { v: '标题' },
          B1: { v: '目标值' },
          C1: { v: '当前值' },
          D1: { v: '进度' },
          E1: { v: '周期' },
          ...learningGoals.value.reduce((acc, goal, index) => ({
            ...acc,
            [`A${index + 2}`]: { v: goal.title },
            [`B${index + 2}`]: { v: goal.target },
            [`C${index + 2}`]: { v: goal.current },
            [`D${index + 2}`]: { v: goal.progress + '%' },
            [`E${index + 2}`]: { v: goal.period }
          }), {})
        },
        '笔记': {
          '!ref': 'A1:D' + (notes.value.length + 1),
          A1: { v: '标题' },
          B1: { v: '分类' },
          C1: { v: '内容' },
          D1: { v: '更新时间' },
          ...notes.value.reduce((acc, note, index) => ({
            ...acc,
            [`A${index + 2}`]: { v: note.title },
            [`B${index + 2}`]: { v: categoryOptions.find(c => c.value === note.category)?.label },
            [`C${index + 2}`]: { v: note.content },
            [`D${index + 2}`]: { v: note.updateTime }
          }), {})
        }
      }
    };

    // 创建 Blob
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    
    // 下载文件
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const now = new Date().toLocaleString('zh-CN').replace(/[/:]/g, '-');
    
    link.href = url;
    link.download = `speakease-report-${now}.xlsx`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    message.success('Excel报表导出成功！');
  } catch (error) {
    message.error('导出失败，请确保已安装相关依赖');
    console.error('Export error:', error);
  }
}

// 导入数据
function importData(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];
  
  if (!file) {
    message.error('请选择文件');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string) as ExportData;
      
      // 验证数据格式
      if (!data.learningStats || !data.goals || !data.notes || !data.reminders) {
        throw new Error('无效的数据格式');
      }
      
      // 导入数据
      studyTime.value = data.learningStats.studyTime;
      consecutiveDays.value = data.learningStats.consecutiveDays;
      todayPoints.value = data.learningStats.todayPoints;
      learningGoals.value = data.goals;
      notes.value = data.notes;
      reminders.value = data.reminders;
      
      message.success('数据导入成功');
      
      // 重置文件输入
      fileInput.value = '';
    } catch (error) {
      message.error('数据导入失败，请确保文件格式正确');
      console.error('Import error:', error);
    }
  };
  
  reader.readAsText(file);
}

// 文件导入引用
const fileInput = ref<HTMLInputElement | null>(null);

// 处理文件输入点击
function handleFileInputClick() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}
</script>

<style scoped>
.practice {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  .today-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    
    .stat-card {
      background: var(--component-bg);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(var(--border-color-rgb), 0.1);
      display: flex;
      align-items: center;
      gap: 16px;
      
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        background: rgba(var(--primary-color-rgb), 0.1);
        color: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }
      
      .stat-content {
        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-color);
          line-height: 1.2;
        }
        
        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
        }
      }
    }
  }
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

.tasks-section {
  h2 {
    font-size: 20px;
    color: var(--text-color);
    margin: 0 0 20px;
  }
  
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.task-card {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  
  &.completed {
    background: rgba(var(--success-color-rgb), 0.05);
    border-color: var(--success-color);
  }
  
  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .task-type {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .task-points {
      font-size: 14px;
      color: var(--primary-color);
      font-weight: 500;
    }
  }
  
  .task-content {
    h3 {
      font-size: 16px;
      color: var(--text-color);
      margin: 0 0 8px;
    }
    
    p {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0 0 12px;
    }
    
    .task-progress {
      .progress-text {
        font-size: 13px;
        color: var(--text-secondary);
        margin-bottom: 6px;
      }
      
      .progress-bar {
        height: 4px;
        background: var(--border-secondary);
        border-radius: 2px;
        overflow: hidden;
        
        .progress {
          height: 100%;
          background: var(--primary-color);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
      }
    }
  }
  
  .task-actions {
    margin-top: 16px;
    
    .action-btn {
      width: 100%;
      height: 36px;
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
      
      &.completed {
        background: var(--success-color);
        cursor: default;
        
        &:hover {
          background: var(--success-color);
        }
      }
    }
  }
}

.calendar-card,
.achievement-card {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h3 {
      font-size: 16px;
      color: var(--text-color);
      margin: 0;
    }
  }
}

.calendar-card {
  .month-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .month-btn {
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
    
    span {
      font-size: 14px;
      color: var(--text-color);
      min-width: 100px;
      text-align: center;
    }
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    
    .weekday {
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: var(--text-secondary);
    }
    
    .date-cell {
      height: 32px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: var(--text-color);
      position: relative;
      
      &.other-month {
        color: var(--text-secondary);
      }
      
      &.today {
        background: var(--primary-color);
        color: white;
      }
      
      &.has-study {
        font-weight: 500;
        
        .study-indicator {
          position: absolute;
          bottom: 4px;
          width: 4px;
          height: 4px;
          border-radius: 2px;
          background: var(--primary-color);
        }
      }
    }
  }
}

.achievement-card {
  .achievement-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .achievement-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    background: rgba(var(--border-color-rgb), 0.05);
    
    .achievement-icon {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background: rgba(var(--primary-color-rgb), 0.1);
      color: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .achievement-info {
      flex: 1;
      
      .achievement-name {
        font-size: 14px;
        color: var(--text-color);
        margin-bottom: 4px;
      }
      
      .achievement-desc {
        font-size: 13px;
        color: var(--text-secondary);
      }
    }
    
    .achievement-date {
      font-size: 13px;
      color: var(--text-secondary);
    }
  }
}

.goals-section {
  margin-top: 24px;
  
  h3 {
    font-size: 18px;
    color: var(--text-color);
    margin-bottom: 16px;
  }
  
  .goals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .goal-card {
    background: var(--component-bg);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid rgba(var(--border-color-rgb), 0.1);
    
    .goal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .goal-title {
        font-size: 15px;
        color: var(--text-color);
        font-weight: 500;
      }
      
      .goal-period {
        font-size: 13px;
        color: var(--text-secondary);
      }
    }
    
    .goal-progress {
      .progress-bar {
        height: 6px;
        background: var(--border-secondary);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 8px;
        
        .progress {
          height: 100%;
          background: var(--primary-color);
          border-radius: 3px;
          transition: width 0.3s ease;
        }
      }
      
      .progress-text {
        font-size: 13px;
        color: var(--text-secondary);
        text-align: right;
      }
    }
  }
  
  .set-goal-btn {
    width: 100%;
    height: 40px;
    border: 1px dashed var(--border-color);
    border-radius: 8px;
    background: transparent;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s;
    
    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  }
}

.goal-form {
  padding: 0 12px;
}

.timer-card {
  background: var(--component-bg);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(var(--border-color-rgb), 0.1);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timer-display {
  .timer-value {
    font-size: 32px;
    font-weight: 600;
    color: var(--text-color);
  }
  
  .timer-label {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 4px;
  }
}

.timer-controls {
  display: flex;
  gap: 12px;
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .side-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    
    .calendar-card,
    .achievement-card {
      margin: 0;
    }
  }
}

@media (max-width: 768px) {
  .practice {
    padding: 16px;
  }
  
  .header-section {
    .today-stats {
      grid-template-columns: 1fr;
    }
  }
  
  .side-section {
    grid-template-columns: 1fr;
  }
}

@keyframes points-reward {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-100px);
  }
}

.points-reward {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  font-weight: bold;
  color: var(--primary-color);
  pointer-events: none;
  z-index: 1000;
  animation: points-reward 1s ease-out forwards;
}

.goal-stats-card {
  margin-top: 24px;
  
  .goal-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
    
    .stat-item {
      text-align: center;
      padding: 16px;
      background: rgba(var(--border-color-rgb), 0.05);
      border-radius: 8px;
      
      .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 14px;
        color: var(--text-secondary);
      }
    }
  }
  
  .goal-trend-chart {
    height: 200px;
  }
}

@media (max-width: 768px) {
  .goal-stats-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

.reminder-card {
  margin-top: 24px;
  
  .reminder-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .reminder-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: rgba(var(--border-color-rgb), 0.05);
    border-radius: 8px;
    
    .reminder-icon {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background: rgba(var(--primary-color-rgb), 0.1);
      color: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .reminder-content {
      flex: 1;
      
      .reminder-time {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-color);
        margin-bottom: 4px;
      }
      
      .reminder-desc {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 4px;
      }
      
      .reminder-days {
        font-size: 13px;
        color: var(--text-secondary);
      }
    }
    
    .reminder-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
}

.notes-card {
  margin-top: 24px;
  
  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .note-item {
    background: rgba(var(--border-color-rgb), 0.05);
    border-radius: 8px;
    padding: 16px;
    
    .note-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .note-title {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-color);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .note-category {
        font-size: 13px;
        color: var(--primary-color);
        background: rgba(var(--primary-color-rgb), 0.1);
        padding: 2px 8px;
        border-radius: 4px;
      }
    }
    
    .note-content {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 12px;
      white-space: pre-line;
      max-height: 100px;
      overflow: hidden;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40px;
        background: linear-gradient(transparent, rgba(var(--border-color-rgb), 0.05));
      }
    }
    
    .note-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .note-time {
        font-size: 13px;
        color: var(--text-secondary);
      }
      
      .note-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}

.export-actions {
  margin-top: 24px;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}
</style> 