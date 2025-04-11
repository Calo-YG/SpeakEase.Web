import type {LoginRequest,VerificationCodeResponse, TokenResponse} from '@/api/auth/auth'
import request from '@/http/request'
// Removed unused 'get' import from 'http'

const URL={
    Login:"/api/auth/login",
    Verify:"/api/auth/GetVerificationCode?capcha=",
    LogingOut:"/api/auth/GetVerificationCode"
}


const login = (data:LoginRequest) => request.post<TokenResponse>(URL.Login,data)
const verify = (param: string) => request.get<VerificationCodeResponse>(URL.Verify + param);
const loginOut = ()=> request.post(URL.LogingOut);

export {login,verify,loginOut}