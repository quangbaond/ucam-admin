import { settings } from '@/api/const';
import { request } from '@/api/request';

export const createConfigApi = (data: any) => request('post', `${settings.API_URL}/configs`, data);

export const updateConfigApi = (id: string, data: any) => request('put', `${settings.API_URL}/configs/${id}`, data);

export const getConfigApi = () => request('get', `${settings.API_URL}/configs`);
