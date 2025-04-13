import axios from 'axios'
import { TokenStorage } from '@/utils/tokenStorage'
import { notification } from 'ant-design-vue';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://api.example.com',
  timeout: 10000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = TokenStorage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (!res.isSuccess) {
      // 业务错误（由后端 isSuccess 决定）
      openNotification('error', '请求失败', res.message || '未知错误');
      return Promise.reject(res.message);
    }
    return res.data; 
  },
  (error) => {
    const status = error?.response?.status;

    switch (status) {
      case 400:
        openNotification('error', '请求参数错误', '请检查提交的数据是否正确');
        break;
      case 401:
        openNotification('warning', '未授权', '请重新登录');
        // 可选：跳转到登录页逻辑
        break;
      case 403:
        openNotification('warning', '无权限', '你没有访问该资源的权限');
        break;
      case 404:
        openNotification('info', '资源未找到', '请求的接口不存在');
        break;
      case 500:
        openNotification('error', '服务器错误', '请稍后再试');
        break;
      case 499:
        openNotification('warning','友好提示',error?.response?.data?.message)
        break; 
      default:
        openNotification('error', '请求异常', error?.message || '未知错误');
        break;
    }

    return Promise.reject(error);
  }
);

//通知提醒
function openNotification (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) {
  notification[type]({
    message: title,
    description: message,
    duration: 1,
  });
};

export default instance
