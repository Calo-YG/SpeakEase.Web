  import type {TokenResponse} from '@/api/auth/auth'
  import type {UserState} from "@/store/user/user"
  
  const TOKEN_KEY = 'user_token'
  const USER_KEY = "user_info"
  
  export const TokenStorage = {
    /** 保存 token 到 localStorage */
    setToken(tokenInfo: TokenResponse): void {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenInfo));
    },
  
    /** 从 localStorage 获取 token 信息 */
    getToken(): TokenResponse | null {
      const tokenString = localStorage.getItem(TOKEN_KEY);
      try {
        return tokenString ? JSON.parse(tokenString) as TokenResponse : null;
      } catch {
        return null;
      }
    },
  
    /** 获取 access token（常用于请求头） */
    getAccessToken(): string | null {
      const tokenInfo = this.getToken();
      return tokenInfo?.token || null;
    },
  
    /** 清除 token */
    clear(): void {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY)
    },

    setUserInfo(user:UserState){
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    getUserInfo():UserState | null{
      const tokenString = localStorage.getItem(USER_KEY);
      try {
        return tokenString ? JSON.parse(tokenString) as UserState : null;
      } catch {
        return null;
      }
    }
  }
  