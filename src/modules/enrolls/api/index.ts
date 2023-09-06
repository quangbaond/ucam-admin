import type { CreateEnrollParams, Enroll, FindEnrollParams } from '../dto';
import type { FindAllParam, PageData } from '@/interface';

import { settings } from '../../../api/const';
import { request } from '../../../api/request';

export const findAllEnrollApi = (data: FindAllParam<FindEnrollParams>) =>
    request<PageData<Enroll>>('post', `${settings.API_URL}/edu/enrolls/find`, data);

export const deleteEnrollApi = (data: string | undefined) =>
    request<Enroll>('delete', `${settings.API_URL}/edu/enrolls/${data}`);

export const createEnrollApi = (data: CreateEnrollParams) =>
    request<string>('post', `${settings.API_URL}/edu/enrolls`, data);
