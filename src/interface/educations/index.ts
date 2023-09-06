import type { Subject } from '../../modules/subjects/dto';
import type { EducationTypeEnum } from '..';

export interface GetEducationParams {
    filterQuery: any;
    options: any;
}
export interface Education {
    _id: string;
    name: string;
    shortName: string;
    educationType: EducationTypeEnum;
    logo: string;
    address: string;
    phoneNumber: string;
    status: string;
    majors: any;
    countStudents: number;
    countSubjects: number;
    countMajors: number;
    coverMedia: any;
    subjects: Subject[];
}
export interface EducationParams {
    _id: string;
    name: string;
    shortName: string;
    educationType: EducationTypeEnum;
    logo: string;
    address: string;
    phoneNumber: string;
    status: string;
    majors: any;
    countStudents: number;
    countSubjects: number;
    countMajors: number;
    coverMedia: any;
    subjects: string[];
    categoryId: string;
}
