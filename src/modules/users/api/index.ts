import type { FindUserParam, IHistory, LoginParams, LogoutParams, LogoutResult, User } from '../dto/login';
import type { FindAllParam, PageData } from '@/interface';

import { path } from '@/api/path';

import { settings } from '../../../api/const';
import { request } from '../../../api/request';
/** api login */
export const apiLogin = (data: LoginParams) => request<User>('post', `${settings.AUTH_URL}/${path.auth.login}`, data);

/** 登出接口 */
export const apiLogout = (data: LogoutParams) => request<LogoutResult>('post', '/user/logout', data);

export const findUsersApi = (data: FindAllParam<FindUserParam>) =>
    request<PageData<User>>('post', `${settings.API_URL}/users/find`, data);

export const deleteUserApi = (id: string) => request('delete', `${settings.API_URL}/users/${id}`);

export const detailUserApi = (id: string) => request<User>('get', `${settings.API_URL}/users/${id}`);

export const createUserApi = (data: Partial<User>) => request<User>('post', `${settings.API_URL}/auth/signup`, data);

export const updateUserApi = (id: string, data: Partial<User>) =>
    request<User>('put', `${settings.API_URL}/edu/users/${id}`, data);

export const changePasswordApi = (data: { password: string; confirmPassword: string }, email: string) =>
    request('put', `${settings.API_URL}/edu/users/change-password/${email}`, data);

export const getHistoryApi = (id: string) => request<IHistory>('get', `${settings.API_URL}/users/history/${id}`);

export const checkAdmin = () => request('post', `${settings.API_URL}/users/check-admin`);
