import type { DocumentTypeEnum } from '../../../interface';

export interface Document {
    _id?: string;
    name?: string;
    isDownloadable?: boolean;
    lessonId?: string;
    files?: DocumentFile[];
    courseId?: string;
    description?: string;
    type?: DocumentTypeEnum;
}

export interface DocumentFile {
    url: string;
    type: string;
    name: string;
}
