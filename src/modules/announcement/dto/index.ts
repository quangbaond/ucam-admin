import type { StatusEnum } from '@/interface';
import type { Education } from '@/interface/educations';

export interface FindAnnouncementParams {
    _id?: string;
    search?: string;
    educations?: string;
    status?: StatusEnum;
}

export interface Announcement {
    _id: string;
    title: string;
    content: string;
    educations: Education;
    status?: StatusEnum;
}

export interface CreateAnnouncement {
    content?: string;
    educations?: string;
    status?: StatusEnum;
}

export interface AnnouncementResult { }

export interface FilterProp<T = any> {
    onSearch: (value: T) => void;
    resetForm: T;
}

export interface ParamSearch {
    search?: string;
    educations?: string;
    status?: StatusEnum;
}
