import axiosInstance from '@/http/index'
import type { AxiosRequestConfig } from 'axios'
import type { IResponseType } from '@/http/response'

// 通用 request 方法
const request = <T = any>(config: AxiosRequestConfig): Promise<IResponseType<T>> => {
  return axiosInstance.request(config)
}

// GET 封装
const get = <T = any>(url: string, params?: any): Promise<IResponseType<T>> => {
  return request<T>({
    url,
    method: 'get',
    params,
  })
}

// POST 封装
const post = <T = any>(url: string, data?: any): Promise<IResponseType<T>> => {
  return request<T>({
    url,
    method: 'post',
    data,
  })
}

/**
 * 文件上传封装
 * @param file 要上传的文件
 * @param uploadUrl 上传接口地址
 * @param extraData 可选的额外字段
 */
const uploadFile = async (
    file: File,
    uploadUrl: string,
    extraData?: Record<string, string>
  ): Promise<IResponseType<string>> => {
    const formData = new FormData()
    formData.append('file', file)
  
    if (extraData) {
      Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }
  
    return axiosInstance.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

export default {
  request,
  get,
  post,
  uploadFile
}
