<template>
  <div class="content-card">
    <div class="card-header">
      <h2>学习日历</h2>
      <div class="calendar-controls">
        <a-button size="small" @click="$emit('prevMonth')">
          <left-outlined />
        </a-button>
        <span class="current-month">{{ dayjs(calendarDate).format('YYYY年MM月') }}</span>
        <a-button size="small" :disabled="isCurrentMonth" @click="$emit('nextMonth')">
          <right-outlined />
        </a-button>
        <a-button type="link" size="small" @click="$emit('resetToday')">今天</a-button>
      </div>
    </div>
    <div class="card-body">
      <div class="custom-calendar">
        <div class="weekdays">
          <div class="weekday" v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day">
            {{ day }}
          </div>
        </div>
        
        <div class="calendar-grid">
          <div 
            v-for="date in calendarDays" 
            :key="date.toString()"
            class="calendar-day" 
            :class="{ 
              'other-month': !isSameMonth(date, calendarDate),
              'has-record': hasLearningRecord(date),
              'is-today': isSameDay(date, dayjs()),
              'is-selected': isSameDay(date, selectedDate)
            }"
            @click="$emit('dateClick', date)"
          >
            <div class="day-number">{{ date.date() }}</div>
            <div class="day-indicator" v-if="hasLearningRecord(date)">
              <check-circle-filled />
            </div>
          </div>
        </div>
      </div>

      <div class="record-details" v-if="selectedDateRecord">
        <div class="details-header">
          <h3>{{ dayjs(selectedDate).format('YYYY年MM月DD日') }} 学习详情</h3>
          <div class="completion-badge">
            <check-circle-filled />
            <span>已完成学习</span>
          </div>
        </div>
        
        <div class="details-grid">
          <div class="detail-card">
            <div class="detail-icon time">
              <clock-circle-outlined />
            </div>
            <div class="detail-info">
              <div class="detail-label">学习时长</div>
              <div class="detail-value">{{ selectedDateRecord.duration }} 分钟</div>
            </div>
          </div>
          
          <div class="detail-card">
            <div class="detail-icon words">
              <book-outlined />
            </div>
            <div class="detail-info">
              <div class="detail-label">单词学习</div>
              <div class="detail-stats">
                <div class="stat">
                  <span class="value">{{ selectedDateRecord.newWords }}</span>
                  <span class="label">新学</span>
                </div>
                <div class="stat">
                  <span class="value">{{ selectedDateRecord.reviewWords }}</span>
                  <span class="label">复习</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="detail-card">
            <div class="detail-icon skills">
              <experiment-outlined />
            </div>
            <div class="detail-info">
              <div class="detail-label">技能练习</div>
              <div class="detail-stats three-column">
                <div class="stat">
                  <span class="value">{{ selectedDateRecord.listeningTime }}</span>
                  <span class="label">听力</span>
                </div>
                <div class="stat">
                  <span class="value">{{ selectedDateRecord.speakingTime }}</span>
                  <span class="label">口语</span>
                </div>
                <div class="stat">
                  <span class="value">{{ selectedDateRecord.readingTime }}</span>
                  <span class="label">阅读</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="no-record" v-else-if="selectedDate">
        <a-empty description="" />
        <p>{{ dayjs(selectedDate).format('YYYY年MM月DD日') }} 没有学习记录</p>
        <a-button type="primary">开始今日学习</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { 
  LeftOutlined, 
  RightOutlined, 
  CheckCircleFilled,
  ClockCircleOutlined,
  BookOutlined,
  ExperimentOutlined
} from '@ant-design/icons-vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  calendarDate: Dayjs;
  selectedDate: Dayjs;
  learningRecords: any[];
  selectedDateRecord: any;
  isCurrentMonth: boolean;
}>();

const emit = defineEmits<{
  (e: 'dateClick', date: Dayjs): void;
  (e: 'prevMonth'): void;
  (e: 'nextMonth'): void;
  (e: 'resetToday'): void;
}>();

// 计算属性
const calendarDays = computed(() => {
  const startOfMonth = props.calendarDate.startOf('month');
  const endOfMonth = props.calendarDate.endOf('month');
  
  // 获取当月第一天是星期几
  const startDay = startOfMonth.day();
  
  // 获取上个月需要显示的天数
  const daysFromPrevMonth = startDay;
  
  // 获取这个月的总天数
  const daysInMonth = endOfMonth.date();
  
  // 计算下个月需要显示的天数，使总数为42（6行7列）
  const daysFromNextMonth = 42 - daysFromPrevMonth - daysInMonth;
  
  // 生成日历天数数组
  const days = [];
  
  // 添加上个月的日期
  const prevMonth = startOfMonth.subtract(1, 'day');
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    days.push(prevMonth.subtract(i, 'day'));
  }
  
  // 添加当前月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(startOfMonth.add(i - 1, 'day'));
  }
  
  // 添加下个月的日期
  for (let i = 1; i <= daysFromNextMonth; i++) {
    days.push(endOfMonth.add(i, 'day'));
  }
  
  return days;
});

// 方法
const hasLearningRecord = (date: Dayjs) => {
  const dateStr = date.format('YYYY-MM-DD');
  return props.learningRecords.some(record => record.date === dateStr);
};

const isSameMonth = (date1: Dayjs, date2: Dayjs) => {
  return date1.month() === date2.month() && date1.year() === date2.year();
};

const isSameDay = (date1: Dayjs, date2: Dayjs) => {
  return date1.format('YYYY-MM-DD') === date2.format('YYYY-MM-DD');
};
</script>

<style scoped>
.content-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-height: 500px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.calendar-controls {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.current-month {
  margin: 0 16px;
  font-size: 16px;
  font-weight: 500;
  min-width: 100px;
  text-align: center;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.custom-calendar {
  margin-bottom: 24px;
}

.weekdays {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.weekday {
  flex: 1;
  text-align: center;
  color: #666;
  font-weight: 500;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
  position: relative;
  min-height: 60px;
}

.calendar-day:hover {
  background: #f0f2f5;
}

.calendar-day.other-month {
  opacity: 0.5;
}

.calendar-day.has-record {
  background: #f0f7ff;
}

.calendar-day.is-today {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
}

.calendar-day.is-selected {
  background: #1890ff;
  color: white;
}

.calendar-day.is-selected .day-indicator {
  color: white;
}

.day-number {
  font-size: 16px;
  font-weight: 500;
}

.day-indicator {
  margin-top: 4px;
  color: #52c41a;
}

.record-details {
  margin-top: 24px;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.details-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.completion-badge {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: #52c41a;
}

.completion-badge .anticon {
  margin-right: 4px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.detail-card {
  background: white;
  padding: 16px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.detail-icon {
  margin-bottom: 8px;
  font-size: 24px;
}

.detail-icon.time {
  color: #1890ff;
}

.detail-icon.words {
  color: #52c41a;
}

.detail-icon.skills {
  color: #faad14;
}

.detail-info {
  text-align: center;
  width: 100%;
}

.detail-label {
  color: #666;
  margin-bottom: 8px;
}

.detail-value {
  font-size: 18px;
  font-weight: 500;
}

.detail-stats {
  display: flex;
  justify-content: space-around;
}

.detail-stats.three-column {
  justify-content: space-between;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.value {
  font-size: 16px;
  font-weight: 500;
}

.label {
  color: #666;
  font-size: 12px;
}

.no-record {
  margin-top: 24px;
  text-align: center;
  padding: 32px;
  background: #f9f9f9;
  border-radius: 8px;
}

.no-record p {
  margin: 16px 0;
  color: #666;
}

@media (max-width: 768px) {
  .content-card {
    padding: 16px;
  }
  
  .calendar-day {
    min-height: 50px;
    padding: 4px;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style> 