import type { FindAllParam, PageData } from '@/interface';
import type { ActivationCode, FindActivationCodeParams, UpdateActivationParams } from '@/modules/activations/dto';

import { settings } from '../../../api/const';
import { request } from '../../../api/request';

export const findAllActivationCodeApi = (data: FindAllParam<FindActivationCodeParams>) =>
    request<PageData<ActivationCode>>('post', `${settings.API_URL}/edu/activations/find`, data);

export const getActivationCodeApi = (data: string) =>
    request<ActivationCode>('get', `${settings.API_URL}/edu/activations/${data}`);

export const deleteActivationCodeApi = (data: string | undefined) =>
    request<ActivationCode>('delete', `${settings.API_URL}/edu/activations/${data}`);

export const createActivationCodeApi = (data: ActivationCode) =>
    request<ActivationCode>('post', `${settings.API_URL}/edu/activations`, data);

export const updateActivationCodeApi = (id: string | undefined, data: UpdateActivationParams) =>
    request<ActivationCode>('put', `${settings.API_URL}/edu/activations/${id}`, data);
