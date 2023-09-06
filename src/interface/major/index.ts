import type { EducationTypeEnum } from '..';

export interface Major {
    _id: string;
    name: string;
    status: string;
    educationType: EducationTypeEnum;
    countStudents: number;
}
export interface FindMajorParams {
    _id?: string;
    search?: string;
    educationType?: string;
    status?: string;
}
export interface CreateMajor {
    name?: string;
    educationType?: string;
}
export interface MajorResult { }
