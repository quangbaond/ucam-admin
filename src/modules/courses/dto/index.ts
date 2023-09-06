import type { Subject } from '../../subjects/dto';
import type { User } from '../../users/dto/login';
import type { SelectOptions } from '@/components/core/form-item';
import type { StatusEnum } from '@/interface';
import type { UploadFile } from 'antd';

export interface Course {
    _id?: string;
    name: string;
    plan: string;
    status?: StatusEnum;
    mentorId: string;
    mentor?: User;
    subject?: Subject;
    subjectId?: string;
    coverMedia: string | undefined;
    descriptions: string;
    countStudents?: number;
    countTopics?: number;
    countTests?: number;
    educations?: string[];
}

export interface CourseRequestForm {
    _id?: string;
    name: string;
    plan: string;
    status: SelectOptions;
    mentor: SelectOptions;
    subject: SelectOptions;
    coverMedia: UploadFile;
    descriptions: string;
    educations?: SelectOptions[];
}

export interface FindCourseParams {
    search: string;
    subjectId: string;
    mentorId: string;
    plan: string;
    status: string;
}
