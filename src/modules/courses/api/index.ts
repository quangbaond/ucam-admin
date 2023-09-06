import type { FindAllParam, PageData } from '@/interface';
import type { Course, FindCourseParams } from '@/modules/courses/dto';

import { settings } from '../../../api/const';
import { request } from '../../../api/request';

export const findAllCoursesApi = (data: FindAllParam<FindCourseParams>) =>
    request<PageData<Course>>('post', `${settings.API_URL}/courses/find`, data);

export const getCourseApi = (data: string) => request<Course>('get', `${settings.API_URL}/courses/${data}`);

export const deleteCourseApi = (data: string | undefined) =>
    request<Course>('delete', `${settings.API_URL}/courses/${data}`);

export const createCourseApi = (data: Course) => request<Course>('post', `${settings.API_URL}/courses`, data);

export const updateCourseApi = (id: string | undefined, data: Partial<Course>) =>
    request<Course>('put', `${settings.API_URL}/courses/${id}`, data);
