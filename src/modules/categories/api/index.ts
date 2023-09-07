import type { FindAllParam, PageData } from '@/interface';
import type {
    Category,
    Detail,
    FindCategoriesDetailParams,
    FindCategoriesParams,
    ICategoryParams,
} from '@/modules/categories/dto';

import { settings } from '@/api/const';
import { request } from '@/api/request';

export const findAllCategoryApi = (data: FindAllParam<FindCategoriesParams>) =>
    request<PageData<Category>>('post', `${settings.API_URL}/category/find`, data);

export const findCategoryDetailApi = (data: FindAllParam<FindCategoriesDetailParams>) =>
    request<PageData<Detail>>('post', `${settings.API_URL}/category-details/find`, data);

export const createCategoryApi = (data: ICategoryParams) =>
    request<Category>('post', `${settings.API_URL}/category`, data);

export const updateCategoryApi = (id: string, data: ICategoryParams) =>
    request<Category>('put', `${settings.API_URL}/category/${id}`, data);

export const deleteCategoryApi = (id: string) => request<Category>('delete', `${settings.API_URL}/category/${id}`);

export const getCategoryDetailApi = (id: string, data: FindAllParam<FindCategoriesParams>) =>
    request<Category>('get', `${settings.API_URL}/category/${id}`, data);
