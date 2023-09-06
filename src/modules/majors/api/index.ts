import type { FindAllParam, PageData } from '@/interface';
import type { CreateMajor, FindMajorParams, Major, MajorResult } from '@/interface/major';

import { settings } from '@/api/const';
import { request } from '@/api/request';

export const findMajorApi = (data: FindAllParam<FindMajorParams>) =>
    request<PageData<Major>>('post', `${settings.API_URL}/edu/majors/find`, data);
export const deleteMajorApi = (data: string | undefined) =>
    request<Major>('delete', `${settings.API_URL}/edu/majors/${data}`);
//create
export const createMajorApi = (data: CreateMajor) =>
    request<MajorResult>('post', `${settings.API_URL}/edu/majors`, data);
//get detail
export const getDetailMajorApi = (id: string) => request<MajorResult>('get', `${settings.API_URL}/edu/majors/${id}`);
// update
export const updateMajorApi = (id: string, data: Partial<Major>) =>
    request<MajorResult>('put', `${settings.API_URL}/edu/majors/${id}`, data);
