import type { FindAllParam, PageData } from '@/interface';
import type {
    Announcement,
    AnnouncementResult,
    CreateAnnouncement,
    FindAnnouncementParams,
} from '@/modules/announcement/dto';

import { settings } from '../../../api/const';
import { request } from '../../../api/request';

export const findAnnouncementApi = (data: FindAllParam<FindAnnouncementParams>) =>
    request<PageData<Announcement>>('post', `${settings.API_URL}/announcements/find`, data);

export const deleteAnnouncementApi = (data: string | undefined) =>
    request<Announcement>('delete', `${settings.API_URL}/announcements/${data}`);

export const detailsAnnouncementApi = (id: string) =>
    request<AnnouncementResult>('get', `${settings.API_URL}/announcements/${id}`);

export const createAnnouncementApi = (data: CreateAnnouncement) =>
    request<AnnouncementResult>('post', `${settings.API_URL}/announcements`, data);

export const updateAnnouncementApi = (id: string, data: CreateAnnouncement) =>
    request<AnnouncementResult>('put', `${settings.API_URL}/announcements/${id}`, data);
