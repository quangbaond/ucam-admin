import type { PlanEnum } from '@/interface';

export interface Pedagogy {
    _id: string;
    userId: IUserId;
    question: string;
    attachment?: IAttachment[];
    subjectId: SubjectPedagogy[];
    date: string;
    plan: PlanEnum;
}
export interface SubjectPedagogy {
    name: string;
    _id: string;
}
interface IAttachment {
    type: string;
    url: string;
}
interface IUserId {
    fullName: string;
    _id: string;
}
export interface FindPedagogyParams {
    _id?: string;
    userId?: string;
    question?: string;
    attachment?: Array<object>;
    subjectId?: Array<object>;
    date?: string;
    isPoints?: boolean;
}

export interface FilterProp<T = any> {
    onSearch: (value: T) => void;
    resetForm: T;
}

export interface ParamSearch {
    search?: string;
    subjectId?: string;
    isPoints?: boolean;
}

export interface Answer {
    _id: string;
    userId?: string;
    pedagogyId?: string;
    answer?: string;
    attachment?: Array<object>;
    assessment?: Array<object>;
    status?: boolean;
}

export interface FindAnswer {
    pedagogyId?: string;
}
