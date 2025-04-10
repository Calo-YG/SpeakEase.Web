import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // 从环境变量读取基础地址
    timeout: 15000 // 请求超时时间
})

// Request interceptors
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // do something
        return config;
    },
    (error: any) => {
        Promise.reject(error);
    }
);

// Response interceptors
request.interceptors.response.use(
    async (response: AxiosResponse) => {
        // do something
        return response;
    },
    (error: any) => {
        // do something
        return Promise.reject(error);
    }
);

export default request;