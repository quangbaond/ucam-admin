import type { EducationTypeEnum, StatusEnum } from '../../../interface';

export interface Subject {
    _id: string;
    name: string;
    image: string;
    description: string;
    educationType: EducationTypeEnum;
    status: string;
    search: string;
    category_id?: string;
}
export interface CreateSubject {
    name?: string;
    educationType?: string;
    image?: string;
    description?: string;
    status?: StatusEnum;
}
export interface FindSubjectParams {
    _id?: string;
    search?: string;
    educationType?: string;
    status?: string;
}
