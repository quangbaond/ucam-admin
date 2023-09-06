import type { FindAllParam, PageData } from '@/interface';
import type {
    CreateMentorIntroduce,
    FindMentorIntroduceParams,
    MentorIntroduce,
    MentorIntroduceResult,
    MentorIntroduceData
} from '@/interface/mentor';

import { settings } from '@/api/const';
import { request } from '@/api/request';

export const findMentorIntroduceApi = (data: FindAllParam<FindMentorIntroduceParams>) =>
    request<PageData<MentorIntroduce>>('post', `${settings.API_URL}/edu/mentorIntroduce/find`, data);
export const deleteMentorIntroduceApi = (data: string | undefined) =>
    request<MentorIntroduce>('delete', `${settings.API_URL}/edu/mentorIntroduce/${data}`);
//create
export const createMentorIntroduceApi = (data: CreateMentorIntroduce) =>
    request<MentorIntroduceResult>('post', `${settings.API_URL}/edu/mentorIntroduce`, data);
//get detail
export const getDetailMentorIntroduceApi = (id: string) =>
    request<MentorIntroduceData>('get', `${settings.API_URL}/edu/mentorIntroduce/${id}`);
// update
export const updateMentorIntroduceApi = (id: string, data: Partial<MentorIntroduce>) =>
    request<MentorIntroduceResult>('put', `${settings.API_URL}/edu/mentorIntroduce/${id}`, data);
