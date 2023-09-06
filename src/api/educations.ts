import type { FindAllParam, PageData } from '@/interface';
import type { Education, EducationParams, GetEducationParams } from '@/interface/educations';
import type { ParamSearch } from '@/modules/educations/dto';

import { settings } from './const';
import { request } from './request';

//dont page
export const findEducationsApi = (data: FindAllParam<ParamSearch>) =>
    request<PageData<Education>>('post', `${settings.API_URL}/edu/educations/find`, data);

export const createEducationApi = (data: Education) =>
    request<Education>('post', `${settings.API_URL}/edu/educations`, data);

export const updateEducationApi = (id: string, data: Partial<EducationParams>) =>
    request<Education>('put', `${settings.API_URL}/edu/educations/${id}`, data);

export const deleteEducationApi = (id: string) => request('delete', `${settings.API_URL}/edu/educations/${id}`);

export const getEducationApi = (id: string) => request<Education>('get', `${settings.API_URL}/edu/educations/${id}`);
