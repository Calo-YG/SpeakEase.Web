// axiosClient.js
import axios from 'axios';
import router from '@/router'; // 确保使用项目路由实例，而非 useRouter()  
import { TokenStorage } from '@/utils/tokenStorage';
import { notification } from 'ant-design-vue';

// 创建 Axios 实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://api.example.com',
  timeout: 10000,
});

// 刷新状态与队列
let isRefreshing = false;
let failedQueue: { resolve: (value?: string | PromiseLike<string>) => void; reject: (reason?: any) => void }[] = [];

// 处理队列：根据刷新结果依次重试或拒绝
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token || '');
  });
  failedQueue = [];
};

// 请求拦截：注入 Access Token
instance.interceptors.request.use(
  config => {
    const token = TokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;  // 在请求头加上 Bearer Token&#8203;:contentReference[oaicite:6]{index=6}
    }
    return config;
  },
  error => Promise.reject(error)
);

// 刷新接口封装
function refreshToken() {
  return axios.post('/auth/refresh', {
    refreshToken: TokenStorage.getToken(),      // 使用 Refresh Token 获取新 Access Token&#8203;:contentReference[oaicite:7]{index=7}
  })
  .then(res => res.data.accessToken);
}

// 响应拦截：业务错误与 Token 刷新
instance.interceptors.response.use(
  response => {
    const res = response.data;
    if (!res.isSuccess) {
      notification.error({ message: '请求失败', description: res.message || '未知错误', duration: 1 });
      return Promise.reject(res.message);
    }
    return res.data;
  },
  error => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // 401: Access Token 失效，尝试刷新
    if (status === 401 && !originalRequest._retry) {
      // 标记已重试，避免循环
      originalRequest._retry = true;
      // 若已有刷新请求，挂起当前请求
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });        // 将请求加入队列&#8203;:contentReference[oaicite:8]{index=8}
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      // 开始刷新流程
      isRefreshing = true;
      return refreshToken()
        .then(newToken => {
          TokenStorage.setToken(newToken);        // 更新本地存储&#8203;:contentReference[oaicite:9]{index=9}
          instance.defaults.headers.Authorization = `Bearer ${newToken}`;  // 更新默认头
          processQueue(null, newToken);                 // 刷新成功，重试挂起请求&#8203;:contentReference[oaicite:10]{index=10}
          return instance(originalRequest);
        })
        .catch(err => {
          processQueue(err, null);                      // 刷新失败，拒绝所有挂起请求
          TokenStorage.clear();                         // 清除本地 Token
          router.push('/login');                        // 跳转登录页&#8203;:contentReference[oaicite:11]{index=11}
          return Promise.reject(err);
        })
        .finally(() => {
          isRefreshing = false;                         // 重置刷新状态
        });
    }

    // 其他状态码统一处理
    switch (status) {
      case 400:
        notification.error({ message: '请求参数错误', description: '请检查提交的数据是否正确', duration: 1 });
        break;
      case 403:
        notification.warning({ message: '无权限', description: '你没有访问该资源的权限', duration: 1 });
        break;
      case 404:
        notification.info({ message: '资源未找到', description: '请求的接口不存在', duration: 1 });
        break;
      case 500:
        notification.error({ message: '服务器错误', description: '请稍后再试', duration: 1 });
        break;
      case 999:
        notification.warning({message:'refresh token 过期',description:'请重新登录',duration:1})
        break;  
      default:
        notification.error({ message: '请求异常', description: error?.message || '未知错误', duration: 1 });
    }

    return Promise.reject(error);
  }
);

export default instance;
