import type { FindGroupParam, Group } from '../interface';
import type { FindAllParam, PageData } from '@/interface';

import { path } from '@/api/path';

import { settings } from '../../../api/const';
import { request } from '../../../api/request';

export const findGroupApi = (data: FindAllParam<FindGroupParam>) =>
    request<PageData<Group>>('post', `${settings.API_URL}/groups/find`, data);

export const deleteGroupApi = (id: string) => request('delete', `${settings.API_URL}/groups/${id}`);

export const detailGroupApi = (id: string) => request<Group>('get', `${settings.API_URL}/groups/${id}`);

export const createGroupApi = (data: Partial<Group>) => request<Group>('post', `${settings.API_URL}/groups`, data);

export const updateGroupApi = (id: string, data: Partial<Group>) =>
    request<Group>('put', `${settings.API_URL}/groups/${id}`, data);
