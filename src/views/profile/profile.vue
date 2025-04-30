<template>
  <div class="profile-container">
    <ProfileHero 
      :user-info="userInfo" 
      :user-settings="userSettings" 
      :stats="userStats"
      :background-image="backgroundImage"
      @avatar-upload="handleAvatarUpload"
      @before-avatar-upload="beforeAvatarUpload"
    />

    <div class="content-layout">
      <ProfileSidebar 
        :active-tab="activeTab" 
        @update:active-tab="activeTab = $event" 
      />

      <div class="main-content">
        <ProfileInfo 
          v-if="activeTab === 'info'" 
          :user-info="userInfo" 
          :user-settings="userSettings"
          :form-state="formState"
          @update-profile="handleUpdateProfile" 
        />
        
        <ProfileProgress 
          v-if="activeTab === 'progress'" 
          :stats="userStats"
          :time-range.sync="timeRange" 
        />
        
        <ProfileCalendar 
          v-if="activeTab === 'calendar'" 
          :calendar-date="calendarDate"
          :selected-date="selectedDate"
          :learning-records="learningRecords"
          :selected-date-record="selectedDateRecord"
          :is-current-month="isCurrentMonth"
          @date-click="handleDateClick"
          @prev-month="prevMonth"
          @next-month="nextMonth"
          @reset-today="resetToToday"
        />
        
        <ProfileSettings 
          v-if="activeTab === 'settings'" 
          :form-state="formState"
          :background-image="backgroundImage"
          @setting-change="handleSettingChange"
          @background-upload="handleBackgroundUpload"
        />
        
        <ProfileSecurity 
          v-if="activeTab === 'security'" 
          @show-password-modal="showChangePasswordModal" 
        />
      </div>
    </div>

    <PasswordModal 
      :visible="passwordModalVisible" 
      :loading="confirmLoading"
      :form="passwordForm"
      @cancel="passwordModalVisible = false"
      @submit="handleChangePassword" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useUserStore } from "@/store/user/userStore";
import { notification } from "ant-design-vue";
import { 
  CameraOutlined, 
  CheckCircleFilled,
  BookOutlined,
  SoundOutlined,
  AudioOutlined,
  ReadOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  LeftOutlined,
  RightOutlined,
  LockOutlined,
  UserOutlined,
  BarChartOutlined,
  CalendarOutlined,
  SettingOutlined,
  SafetyOutlined,
  NotificationOutlined,
  EyeOutlined,
  MobileOutlined
} from "@ant-design/icons-vue";
import dayjs, { Dayjs } from "dayjs";
import { 
  getUser, 
  getUserSetting, 
  uploadAvatar, 
  updateUserSetting, 
  modifyPassword,
  uploadBackground
} from "@/api/user";
import type { UserSettingUpdateRequest, UserResponse, UserSettingResponse } from "@/api/user/user";

// 导入拆分后的组件
import ProfileHero from './components/ProfileHero.vue';
import ProfileSidebar from './components/ProfileSidebar.vue';
import ProfileInfo from './components/ProfileInfo.vue';
import ProfileProgress from './components/ProfileProgress.vue';
import ProfileCalendar from './components/ProfileCalendar.vue';
import ProfileSettings from './components/ProfileSettings.vue';
import ProfileSecurity from './components/ProfileSecurity.vue';
import PasswordModal from './components/PasswordModal.vue';

// 活动标签
const activeTab = ref('info');
const timeRange = ref('week');

// 用户基本信息
const userStore = useUserStore();
const userInfo = ref<UserResponse>({
  userId: null,
  userName: "",
  email: "",
  phone: "",
  avatar: ""
});
const userSettings = ref<UserSettingResponse>({
  bio: "",
  gender: null,
  birthday: null,
  accountActive: true,
  allowMessages: true,
  isProfilePublic: false,
  receiveEmailUpdates: true,
  receiveNotifications: true,
  receivePushNotifications: true,
  showLearningProgress: true
});

// 背景图
const backgroundImage = ref('');

// 学习统计数据
const userStats = reactive({
  wordCount: 1258,
  listeningHours: 23.5,
  speakingCount: 78,
  readingCount: 42
});

// 表单数据
const formState = reactive<Record<string, any>>({
  bio: "",
  gender: null,
  birthday: null,
  allowMessages: true,
  isProfilePublic: false,
  receiveEmailUpdates: true,
  receiveNotifications: true,
  receivePushNotifications: true,
  showLearningProgress: true,
  backgroundImage: ""
});

// 密码表单
const passwordForm = reactive({
  oldPassword: "",
  password: "",
  confirmPassword: ""
});
const passwordModalVisible = ref(false);
const confirmLoading = ref(false);

// 日历相关
const selectedDate = ref(dayjs());
const calendarDate = ref(dayjs());
const selectedDateRecord = ref<any>(null);
const learningRecords = ref([
  {
    date: dayjs().format("YYYY-MM-DD"),
    duration: 120,
    newWords: 32,
    reviewWords: 68,
    listeningTime: 30,
    speakingTime: 15,
    readingTime: 45
  },
  {
    date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    duration: 90,
    newWords: 25,
    reviewWords: 50,
    listeningTime: 20,
    speakingTime: 10,
    readingTime: 30
  },
  {
    date: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
    duration: 150,
    newWords: 40,
    reviewWords: 80,
    listeningTime: 40,
    speakingTime: 20,
    readingTime: 60
  }
]);

// 计算属性
const isCurrentMonth = computed(() => {
  const now = dayjs();
  return calendarDate.value.month() === now.month() && 
         calendarDate.value.year() === now.year();
});

// 生命周期钩子
onMounted(async () => {
  await fetchUserData();
  await fetchUserSettings();
  checkTodayRecord();
});

// API方法
const fetchUserData = async () => {
  try {
    const response = await getUser();
    if (response && typeof response === 'object' && 'data' in response) {
      userInfo.value = response.data as UserResponse;
      userStore.setUserInfo(response.data as UserResponse);
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
    notification.error({
      message: "错误",
      description: "获取用户信息失败，请重试",
      duration: 2
    });
  }
};

const fetchUserSettings = async () => {
  try {
    const response = await getUserSetting();
    if (response && typeof response === 'object' && 'data' in response) {
      const settingsData = response.data as UserSettingResponse;
      userSettings.value = settingsData;
      
      // 将设置数据复制到表单
      formState.bio = settingsData.bio || "";
      formState.gender = settingsData.gender || null;
      formState.birthday = settingsData.birthday ? dayjs(settingsData.birthday) : null;
      formState.allowMessages = settingsData.allowMessages ?? true;
      formState.isProfilePublic = settingsData.isProfilePublic ?? false;
      formState.receiveEmailUpdates = settingsData.receiveEmailUpdates ?? true;
      formState.receiveNotifications = settingsData.receiveNotifications ?? true;
      formState.receivePushNotifications = settingsData.receivePushNotifications ?? true;
      formState.showLearningProgress = settingsData.showLearningProgress ?? true;
      
      // 设置背景图
      if (settingsData.backgroundImage) {
        backgroundImage.value = settingsData.backgroundImage;
      }
    }
  } catch (error) {
    console.error("获取用户设置失败:", error);
    notification.error({
      message: "错误",
      description: "获取用户设置失败，请重试",
      duration: 2
    });
  }
};

// 事件处理方法
const handleUpdateProfile = async () => {
  try {
    const updateData: UserSettingUpdateRequest = {
      bio: formState.bio,
      gender: formState.gender,
      birthday: formState.birthday && formState.birthday.toDate ? formState.birthday.toDate() : null
    };
    
    await updateUserSetting(updateData);
    
    notification.success({
      message: "成功",
      description: "个人资料已更新",
      duration: 2
    });
    
    await fetchUserSettings();
  } catch (error) {
    console.error("更新个人资料失败:", error);
    notification.error({
      message: "错误",
      description: "更新个人资料失败，请重试",
      duration: 2
    });
  }
};

const handleSettingChange = async (key: string, value: boolean) => {
  try {
    const updateData = {
      [key]: value
    } as unknown as UserSettingUpdateRequest;
    
    await updateUserSetting(updateData);
    
    notification.success({
      message: "成功",
      description: "设置已更新",
      duration: 1
    });
  } catch (error) {
    console.error("更新设置失败:", error);
    notification.error({
      message: "错误",
      description: "更新设置失败，请重试",
      duration: 2
    });
    
    // 恢复表单状态
    formState[key] = !value;
  }
};

const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    notification.error({
      message: '上传失败',
      description: '只能上传图片文件!',
      duration: 2
    });
  }
  
  if (!isLt2M) {
    notification.error({
      message: '上传失败',
      description: '图片必须小于2MB!',
      duration: 2
    });
  }
  
  return isImage && isLt2M;
};

const handleAvatarUpload = async ({ file }: { file: File }) => {
  try {
    const extraData = { userId: String(userInfo.value.userId) };
    const result = await uploadAvatar(file, extraData);
    
    if (result.success) {
      // 更新头像URL
      userInfo.value.avatar = result.data;
      userStore.setUserInfo({ avatar: result.data });
      
      notification.success({
        message: '成功',
        description: '头像上传成功',
        duration: 2
      });
    }
  } catch (error) {
    console.error("上传头像失败:", error);
    notification.error({
      message: '错误',
      description: '头像上传失败，请重试',
      duration: 2
    });
  }
};

const handleBackgroundUpload = async (file: File) => {
  try {
    const extraData = { userId: String(userInfo.value.userId) };
    const result = await uploadBackground(file, extraData);
    
    if (result.success) {
      // 更新背景图URL
      backgroundImage.value = result.data;
      
      // 更新用户设置
      await updateUserSetting({
        backgroundImage: result.data
      });
      
      notification.success({
        message: '成功',
        description: '背景图上传成功',
        duration: 2
      });
    }
  } catch (error) {
    console.error("上传背景图失败:", error);
    notification.error({
      message: '错误',
      description: '背景图上传失败，请重试',
      duration: 2
    });
  }
};

// 日历相关方法
const checkTodayRecord = () => {
  const today = dayjs().format('YYYY-MM-DD');
  selectedDateRecord.value = learningRecords.value.find(record => record.date === today) || null;
};

const handleDateClick = (date: Dayjs) => {
  selectedDate.value = date;
  
  // 查找记录
  const dateStr = date.format('YYYY-MM-DD');
  selectedDateRecord.value = learningRecords.value.find(record => record.date === dateStr) || null;
  
  // 如果点击的日期是其他月份，更新日历视图
  if (!isSameMonth(date, calendarDate.value)) {
    calendarDate.value = date;
  }
  
  // 如果在主页，切换到日历标签
  if (activeTab.value !== 'calendar') {
    activeTab.value = 'calendar';
  }
};

const prevMonth = () => {
  calendarDate.value = calendarDate.value.subtract(1, 'month');
};

const nextMonth = () => {
  if (!isCurrentMonth.value) {
    calendarDate.value = calendarDate.value.add(1, 'month');
  }
};

const resetToToday = () => {
  calendarDate.value = dayjs();
  selectedDate.value = dayjs();
  checkTodayRecord();
};

function isSameMonth(date1: Dayjs, date2: Dayjs) {
  return date1.month() === date2.month() && date1.year() === date2.year();
}

// 密码修改相关
const showChangePasswordModal = () => {
  passwordModalVisible.value = true;
  passwordForm.oldPassword = '';
  passwordForm.password = '';
  passwordForm.confirmPassword = '';
};

const handleChangePassword = async () => {
  // 表单验证
  if (!passwordForm.oldPassword || !passwordForm.password || !passwordForm.confirmPassword) {
    notification.error({
      message: '错误',
      description: '请填写所有密码字段',
      duration: 2
    });
    return;
  }
  
  if (passwordForm.password !== passwordForm.confirmPassword) {
    notification.error({
      message: '错误',
      description: '两次输入的新密码不一致',
      duration: 2
    });
    return;
  }
  
  confirmLoading.value = true;
  
  try {
    await modifyPassword({
      oldPassword: passwordForm.oldPassword,
      password: passwordForm.password
    });
    
    passwordModalVisible.value = false;
    notification.success({
      message: '成功',
      description: '密码修改成功',
      duration: 2
    });
  } catch (error) {
    console.error("修改密码失败:", error);
    notification.error({
      message: '错误',
      description: '修改密码失败，请检查当前密码是否正确',
      duration: 2
    });
  } finally {
    confirmLoading.value = false;
  }
};
</script>

<style scoped>
.profile-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.content-layout {
  display: flex;
}

.main-content {
  flex: 1;
}
</style> 