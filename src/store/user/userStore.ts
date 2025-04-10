// src/store/user.ts
import { defineStore } from 'pinia'
import { TokenStorage } from '@/utils/tokenStorage'

export interface UserState {
  userId: number
  userName: string
  email: string
  phone: string
  avatar: string
  token: string
  refreshToken: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: 0,
    userName: '',
    email: '',
    phone: '',
    avatar: '',
    token: '',
    refreshToken: '',
  }),

  actions: {
    // 设置用户信息（登录后）
    setUserInfo(payload: Partial<UserState>) {
      this.$patch(payload)

      // 只保存 token 部分到 localStorage
      TokenStorage.setToken({
        token: payload.token || '',
        refreshToken: payload.refreshToken || '',
      })
    },

    // 从 localStorage 恢复 token（页面刷新用）
    restoreToken() {
      const stored = TokenStorage.getToken()
      if (stored) {
        this.token = stored.token
        this.refreshToken = stored.refreshToken
      }
    },

    // 清空所有信息（登出）
    clearUserInfo() {
      this.$reset()
      TokenStorage.clear()
    },
  },
})
