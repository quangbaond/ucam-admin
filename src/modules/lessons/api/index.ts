import type { Lesson } from '@/modules/lessons/dto';

import { settings } from '../../../api/const';
import { request } from '../../../api/request';

export const getLessonApi = (data: string) => request<Lesson>('get', `${settings.API_URL}/edu/lessons/${data}`);

export const deleteLessonApi = (data: string | undefined) =>
    request<Lesson>('delete', `${settings.API_URL}/edu/lessons/${data}`);

export const createLessonApi = (data: Lesson) => request<Lesson>('post', `${settings.API_URL}/edu/lessons`, data);

export const updateLessonApi = (id: string | undefined, data: Lesson) =>
    request<Lesson>('put', `${settings.API_URL}/edu/lessons/${id}`, data);
