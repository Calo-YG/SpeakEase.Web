import type { 
    CreateUserRequest, 
    UpdateUserRequest, 
    UserResponse, 
    UserSettingRequest, 
    UserSettingUpdateRequest, 
    UserSettingResponse 
} from '@/api/user/user';
import request from '@/http/request';
import { IResponseType } from '@/http/response';

const URL = {
    Register: "/api/user/Register",
    ModifyPassword: "/api/user/ModifyPassword",
    GetUser: "/api/user/CurrentUser",
    CreateUserSetting: "/api/user/CreateUserSetting",
    UpdateUserSetting: "/api/user/UpdateUserSetting",
    GetUserSetting: "/api/user/GetUserSetting",
    UploadAvatar: "/api/user/UploadAvatar"
};

const register = (data: CreateUserRequest) => 
    request.post<IResponseType<void>>(URL.Register, data);

const modifyPassword = (data: UpdateUserRequest) => 
    request.post<IResponseType<void>>(URL.ModifyPassword, data);

const getUser = () => 
    request.get<IResponseType<UserResponse>>(URL.GetUser);

const createUserSetting = (data: UserSettingRequest) => 
    request.post<IResponseType<void>>(URL.CreateUserSetting, data);

const updateUserSetting = (data: UserSettingUpdateRequest) => 
    request.post<IResponseType<void>>(URL.UpdateUserSetting, data);

const getUserSetting = () => 
    request.get<IResponseType<UserSettingResponse>>(URL.GetUserSetting);

const uploadAvatar = (file: File,extraData:Record<string, string>) => request.uploadFile(file,URL.UploadAvatar,extraData);

export { 
    register, 
    modifyPassword, 
    getUser, 
    createUserSetting, 
    updateUserSetting, 
    getUserSetting, 
    uploadAvatar 
};