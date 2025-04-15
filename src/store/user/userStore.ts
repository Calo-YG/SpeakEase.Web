// src/store/user.ts
import { defineStore } from 'pinia'
import { TokenStorage } from '@/utils/tokenStorage'
import type {TokenResponse} from '@/api/auth/auth'
import type {UserState} from '@/store/user/user'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: 0,
    userName: '',
    email: '',
    phone: '',
    avatar: '',
    token: '',
    refreshToken: '',
    isAuthenticated:false
  }),

  actions: {
    setToken(data:TokenResponse){
      TokenStorage.setToken(data)

    },
    // 设置用户信息（登录后）
    setUserInfo(payload: Partial<UserState>) {
      this.$patch(payload)

      TokenStorage.setUserInfo({
        userId: payload.userId || 0,
        userName: payload.userName || '',
        email: payload.email || '',
        phone: payload.phone || '',
        avatar: payload.avatar || '',
        token: payload.token || '',
        refreshToken: payload.refreshToken || '',
        isAuthenticated:payload.isAuthenticated || false
      })

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
