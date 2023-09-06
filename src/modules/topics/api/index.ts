import type { FindAllParam, PageData } from '@/interface';
import type { FindTopicParams, Topic } from '@/modules/topics/dto';

import { settings } from '../../../api/const';
import { request } from '../../../api/request';

export const findAllTopicApi = (data: FindAllParam<FindTopicParams>) =>
    request<PageData<Topic>>('post', `${settings.API_URL}/edu/topics/find`, data);

export const getTopicApi = (data: string) => request<Topic>('get', `${settings.API_URL}/edu/topics/${data}`);

export const deleteTopicApi = (data: string | undefined) =>
    request<Topic>('delete', `${settings.API_URL}/edu/topics/${data}`);

export const createTopicApi = (data: Topic) => request<Topic>('post', `${settings.API_URL}/edu/topics`, data);

export const updateTopicApi = (id: string | undefined, data: Topic) =>
    request<Topic>('put', `${settings.API_URL}/edu/topics/${id}`, data);
