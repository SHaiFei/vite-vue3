
import request from './request'

type PromiseRes<T> = Promise<ManageResult<T>>
// 登录接口数据类型
interface adminLoginData {
    username: string
    password: string
}
// 登录成功后的类型
interface adminInfo {
    menus: []
}

interface AdminLoginRes {
    token: string
    tokenHead: string
}

interface ManageResult<T = {}> {
    code: number
    data: T
}
// 登录
export const adminLoginApi = (data: adminLoginData): PromiseRes<AdminLoginRes> => request.post("admin/login", data)

// 获取用户信息
export const getAdminInfoApi = (): PromiseRes<adminInfo> => request.get('admin/info')

