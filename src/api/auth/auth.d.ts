/**
 * VerificationCodeResponse，验证码响应
 */
export interface VerificationCodeResponse {
    /**
     * 唯一id
     */
    uniqueId?: null | string;
    /**
     * 验证吗
     */
    verificationCode?: null | string;
}

/**
 * LoginRequest，loing request
 */
export interface LoginRequest {
    /**
     * 验证码
     */
    code?: null | string;
    /**
     * 用户密码
     */
    password?: null | string;
    /**
     * 唯一键
     */
    uniqueId?: null | string;
    /**
     * 用户账号
     */
    userAccount?: null | string;
}

/**
 * TokenResponse，登录返回token 响应
 */
export interface TokenResponse {
    /**
     * 刷新token
     */
    refreshToken?: null | string;
    /**
     * token
     */
    token?: null | string;
}