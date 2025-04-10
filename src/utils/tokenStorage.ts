export interface TokenInfo {
    token: string;
    refreshToken: string;
  }
  
  const TOKEN_KEY = 'user_token'
  
  export const TokenStorage = {
    /** 保存 token 到 localStorage */
    setToken(tokenInfo: TokenInfo): void {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenInfo));
    },
  
    /** 从 localStorage 获取 token 信息 */
    getToken(): TokenInfo | null {
      const tokenString = localStorage.getItem(TOKEN_KEY);
      try {
        return tokenString ? JSON.parse(tokenString) as TokenInfo : null;
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
  