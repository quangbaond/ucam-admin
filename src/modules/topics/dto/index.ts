import type { Course } from '../../courses/dto';
import type { Lesson } from '../../lessons/dto';

export interface Topic {
    _id?: string;
    name: string;
    descriptions?: string;
    status?: string;
    lessons?: Lesson[];
    parentId?: string;
    course?: Course;
    countLessons?: number;
}

export interface FindTopicParams {
    search?: string;
    parentId?: string;
    status?: string;
}
