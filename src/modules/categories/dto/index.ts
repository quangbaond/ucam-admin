import type { EducationTypeEnum, StatusEnum } from '../../../interface';

export interface Category {
    _id: string;
    status: StatusEnum;
    position: number;
    name: string;
    educationType: string;
    details: Detail[];
}
export interface Detail {
    categoryId: string;
    educationId: string;
    subjectId: string;
}

export interface FindCategoriesParams {
    educationType?: Array<EducationTypeEnum | string>;
    educationId?: string;
    search?: string;
}

export interface FindCategoriesDetailParams {
    educationId: string;
}

export interface IListCategoryProps {
    paramSearch: FindCategoriesParams | null;
    reload: () => void;
    handleSetCategory: (id: string) => void;
}

export interface IFormCategoryProps {
    open: boolean;
    onClose: (isRefresh: boolean) => void;
    type: 'create' | 'update';
    id: string;
}

export interface ICategoryParams {
    name?: string;
    educationType?: EducationTypeEnum;
    position?: number;
    status?: StatusEnum;
}
