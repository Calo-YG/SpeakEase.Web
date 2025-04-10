/**
 * CreateUserRequest，创建用户请求
 */
export interface CreateUserRequest {
    /**
     * 邮箱
     */
    email?: null | string;
    /**
     * 用户密码
     */
    password?: null | string;
    /**
     * 唯一键
     */
    unquneId?: null | string;
    /**
     * 用户账号
     */
    userAccount?: null | string;
    /**
     * 昵称
     */
    userName?: null | string;
    /**
     * 验证码
     */
    verificationCode?: null | string;
}

/**
 * UpdateUserRequest，更新用户信息
 */
export interface UpdateUserRequest {
    /**
     * 旧密码
     */
    oldPassword?: null | string;
    /**
     * 密码
     */
    password?: null | string;
    /**
     * 用户id
     */
    userId?: number;
}

/**
 * UserResponse，当前登录用户信息
 */
export interface UserResponse {
    /**
     * 头像
     */
    avatar?: null | string;
    /**
     * 邮箱
     */
    email?: null | string;
    /**
     * 用户手机
     */
    phone?: null | string;
    /**
     * 用户id
     */
    userId?: number;
    /**
     * 用户名
     */
    userName?: null | string;
}

/**
 * UserSettingRequest，用户设置创建请求
 */
export interface UserSettingRequest {
    /**
     * 账户是否处于激活状态
     */
    accountActive?: boolean;
    /**
     * 是否允许接收私信
     */
    allowMessages?: boolean;
    /**
     * 个人简介
     */
    bio?: null | string;
    /**
     * 生日
     */
    birthday?: Date | null;
    /**
     * 性别
     */
    gender?: null | string;
    /**
     * 个人资料是否公开
     */
    isProfilePublic?: boolean;
    /**
     * 是否接收邮件更新
     */
    receiveEmailUpdates?: boolean;
    /**
     * 是否接收通知
     */
    receiveNotifications?: boolean;
    /**
     * 是否接收推送通知
     */
    receivePushNotifications?: boolean;
    /**
     * 是否展示学习进度
     */
    showLearningProgress?: boolean;
}

/**
 * UserSettingUpdateRequest
 */
export interface UserSettingUpdateRequest {
    /**
     * 账户是否处于激活状态
     */
    accountActive?: boolean;
    /**
     * 是否允许接收私信
     */
    allowMessages?: boolean;
    /**
     * 个人简介
     */
    bio?: null | string;
    /**
     * 生日
     */
    birthday?: Date | null;
    /**
     * 性别
     */
    gender?: null | string;
    /**
     * 主键
     */
    id?: number;
    /**
     * 个人资料是否公开
     */
    isProfilePublic?: boolean;
    /**
     * 是否接收邮件更新
     */
    receiveEmailUpdates?: boolean;
    /**
     * 是否接收通知
     */
    receiveNotifications?: boolean;
    /**
     * 是否接收推送通知
     */
    receivePushNotifications?: boolean;
    /**
     * 是否展示学习进度
     */
    showLearningProgress?: boolean;
}

/**
 * UserSettingResponse
 */
export interface UserSettingResponse {
    /**
     * 账户是否处于激活状态
     */
    accountActive?: boolean;
    /**
     * 是否允许接收私信
     */
    allowMessages?: boolean;
    /**
     * 个人简介
     */
    bio?: null | string;
    /**
     * 生日
     */
    birthday?: Date | null;
    /**
     * 性别
     */
    gender?: null | string;
    /**
     * 个人资料是否公开
     */
    isProfilePublic?: boolean;
    /**
     * 是否接收邮件更新
     */
    receiveEmailUpdates?: boolean;
    /**
     * 是否接收通知
     */
    receiveNotifications?: boolean;
    /**
     * 是否接收推送通知
     */
    receivePushNotifications?: boolean;
    /**
     * 是否展示学习进度
     */
    showLearningProgress?: boolean;
}