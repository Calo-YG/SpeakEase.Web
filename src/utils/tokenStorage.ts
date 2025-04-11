  import type {TokenResponse} from '@/api/auth/auth'
  
  const TOKEN_KEY = 'user_token'
  
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
    }
  }
  