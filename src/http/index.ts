import axios from 'axios'
import { ElMessage } from 'element-plus'
import { TokenStorage } from '@/utils/tokenStorage'

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
    const res = response.data
    if (!res.isSuccess) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    ElMessage.error(error?.response?.data?.message || '网络异常')
    return Promise.reject(error)
  }
)

export default instance
