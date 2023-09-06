import type { CreateExamsParams, Exam, GetExamsParams, GetQuestionParams, IResultParams, IResultTest } from '../dto';
import type { FindAllParam, PageData } from '@/interface';

import { settings } from '@/api/const';
import { request } from '@/api/request';

export const findAllExamsApi = (data: FindAllParam<GetExamsParams>) =>
    request<PageData<Exam>>('post', `${settings.API_URL}/exam/tests/find`, data);
//delete
export const deleteExamsApi = (id: string) => request<Exam>('delete', `${settings.API_URL}/exam/tests/${id}`);
//create
export const createExamApi = (data: CreateExamsParams) => request<Exam>('post', `${settings.API_URL}/exam/tests`, data);
//get detail
export const getExamApi = (id: string) => request<Exam>('get', `${settings.API_URL}/exam/tests/detail/${id}`);
// update
export const updateExamApi = (id: string, data: Partial<CreateExamsParams>) =>
    request<CreateExamsParams>('put', `${settings.API_URL}/exam/tests/${id}`, data);
//get question by id
export const getQuestionsById = (data: GetQuestionParams) =>
    request<Exam>('post', `${settings.API_URL}/exam/questions/find`, data);

export const getResultTestApi = (data: FindAllParam<IResultParams>) =>
    request<PageData<IResultTest>>('post', `${settings.API_URL}/exam/results/find`, data);
