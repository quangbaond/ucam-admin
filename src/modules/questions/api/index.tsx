import type { Question } from '../dto';
import type { FindAllParam, PageData } from '@/interface';

import { settings } from '@/api/const';
import { request } from '@/api/request';

//dont page
export const getQuestionsApi = (data: FindAllParam<Partial<Question>>) =>
    request<PageData<Question>>('post', `${settings.API_URL}/exam/questions/find`, data);

export const uploadQuestionsApi = (data: Partial<Question>) =>
    request<Question>('post', `${settings.API_URL}/exam/questions/import`, data);

export const createQuestionApi = (data: Partial<Question>) =>
    request<Question>('post', `${settings.API_URL}/exam/questions`, data);

export const deleteQuestionApi = (id: string) =>
    request<Question>('delete', `${settings.API_URL}/exam/questions/${id}`);

export const getDetailQuestionApi = (id: string) =>
    request<Question>('get', `${settings.API_URL}/exam/questions/${id}`);

export const updateQuestionApi = (id: string, data: Partial<Question>) =>
    request<Question>('put', `${settings.API_URL}/exam/questions/${id}`, data);
