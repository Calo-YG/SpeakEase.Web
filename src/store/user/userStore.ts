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
        isAuthenticated:payload.isAuthenticated || false
      })
    },

    // 清空所有信息（登出）
    clearUserInfo() {
      this.$reset()
      TokenStorage.clear()
    },
  },
})
