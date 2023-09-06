import type { Question } from '@/modules/questions/dto';
import type { UploadChangeParam } from 'antd/es/upload';

export interface Lesson {
    _id?: string;
    name: string;
    media: string;
    descriptions?: string;
    parentId?: string;
    length?: number;
    status?: string;
    questions?: Question[];
    countQuestions?: number;
    documents?: any;
    countDocuments?: number;
    position?: number;
    import?: UploadChangeParam;
}
