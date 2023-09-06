import type { FindWithDrawParam, WidthDraw } from '../dto';
import type { FindAllParam, PageData } from '@/interface';

import { settings } from '@/api/const';
import { request } from '@/api/request';

export const findWithDrawApi = (data: FindAllParam<FindWithDrawParam>) =>
    request<PageData<WidthDraw>>('post', `${settings.API_URL}/withdraws/find`, data);

export const updateWithDrawApi = (id: string, data: Partial<WidthDraw>) =>
    request<WidthDraw>('put', `${settings.API_URL}/withdraws/${id}`, data);
