import type { 
    CreateUserRequest, 
    UpdateUserRequest, 
    UserResponse, 
    UserSettingRequest, 
    UserSettingUpdateRequest, 
    UserSettingResponse 
} from '@/api/user/user';
import request from '@/http/request';
import { ApiResponse } from '@/http/response';

const URL = {
    Register: "/api/user/Register",
    ModifyPassword: "/api/user/ModifyPassword",
    GetUser: "/api/user/CurrentUser",
    CreateUserSetting: "/api/user/CreateUserSetting",
    UpdateUserSetting: "/api/user/UpdateUserSetting",
    GetUserSetting: "/api/user/GetUserSetting",
    UploadAvatar: "/api/user/UploadAvatar",
    UploadBackground: "/api/user/UploadBackground",
};

const register = (data: CreateUserRequest) => 
    request.post<void>(URL.Register, data);

const modifyPassword = (data: UpdateUserRequest) => 
    request.post<void>(URL.ModifyPassword, data);

const getUser = () => 
    request.get<UserResponse>(URL.GetUser);

const createUserSetting = (data: UserSettingRequest) => 
    request.post<ApiResponse<void>>(URL.CreateUserSetting, data);

const updateUserSetting = (data: UserSettingUpdateRequest) => 
    request.post<void>(URL.UpdateUserSetting, data);

const getUserSetting = () => 
    request.get<UserSettingResponse>(URL.GetUserSetting);

const uploadAvatar = (file: File,extraData:Record<string, string>) => request.uploadFile(file,URL.UploadAvatar,extraData);

/**
 * 上传背景图
 * @param file 上传的图片文件
 * @param extraData 额外参数
 * @returns 上传结果
 */
export const uploadBackground = (file: File, extraData?: Record<string, string>) => {
  return request.uploadFile(file, URL.UploadBackground, extraData || {});
};

export { 
    register, 
    modifyPassword, 
    getUser, 
    createUserSetting, 
    updateUserSetting, 
    getUserSetting, 
    uploadAvatar 
};