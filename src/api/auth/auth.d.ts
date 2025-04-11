/**
 * VerificationCodeResponse，验证码响应
 */
export interface VerificationCodeResponse {
    /**
     * 唯一id
     */
    uniqueId: string;
    /**
     * 验证吗
     */
    verificationCode: string;
}

/**
 * LoginRequest，loing request
 */
export interface LoginRequest {
    /**
     * 验证码
     */
    code:  string;
    /**
     * 用户密码
     */
    password: string;
    /**
     * 唯一键
     */
    uniqueId:  string;
    /**
     * 用户账号
     */
    userAccount:  string;
}

/**
 * TokenResponse，登录返回token 响应
 */
export interface TokenResponse {
    /**
     * 刷新token
     */
    refreshToken: string;
    /**
     * token
     */
    token:  string;
}