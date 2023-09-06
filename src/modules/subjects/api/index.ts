import type { FindAllParam, PageData } from '@/interface';
import type { CreateSubject, FindSubjectParams, Subject } from '@/modules/subjects/dto';

import { settings } from '@/api/const';
import { request } from '@/api/request';

export const findSubjectsApi = (data: FindAllParam<FindSubjectParams>) =>
    request<PageData<Subject>>('post', `${settings.API_URL}/subjects/find`, data);
export const deleteSubjectApi = (data: string | undefined) =>
    request<Subject>('delete', `${settings.API_URL}/subjects?id=${data}`);
//create
export const createSubjectApi = (data: CreateSubject) => request<Subject>('post', `${settings.API_URL}/subjects`, data);
//get detail
export const getDetailSubjectApi = (id: string) => request<Subject>('get', `${settings.API_URL}/edu/subjects/${id}`);
// update
export const updateSubjectApi = (id: string, data: CreateSubject) =>
    request<Subject>('put', `${settings.API_URL}/subjects/${id}`, data);
