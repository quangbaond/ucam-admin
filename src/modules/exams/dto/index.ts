import type { ModelEnum, StatusEnum } from '@/interface';

interface IChoice {
    answer: string;
}
interface IHint {
    content: string;
}
interface IQuestion {
    _id: string;
    question: { content: string };
    point: number;
    content: string;
    choices: IChoice[];
    hint: IHint;
    testId: string;
    type: string;
}
export interface IExamDetail {
    _id: string;
    countQuestions: number;
    educations: string[];
    isLocked: boolean;
    name: string;
    plan: string;
    position: number;
    questions: IQuestion[];
    status: StatusEnum;
    subjectId: string;
    tested: number;
    type: string;
}

export interface IFormExamProps {
    open: boolean;
    type: string;
    onClose: () => void;
    id?: string;
}

export interface IExamListProps {
    handleSetExam: (type: string, reccord: Exam) => void;
    isRefresh: boolean | null;
}

export interface IFillterExamProps {
    onSearch: (value: IGetExamParams) => void;
    isRefresh: boolean | null;
}
export interface IFilterResultProps {
    onSearch: (value: IResultParams) => void;
    isRefresh: boolean | null;
}

export interface IGetExamParams {
    name?: string;
    plan?: string;
    type?: string;
    status?: string;
    courseId?: string;
}

export interface GetExamsParams {
    search?: string;
    plan?: string;
    type?: string;
    status?: string;
    courseId?: string;
}
export interface IExamsParams {
    search?: string;
    plan?: string;
    type?: string;
    status?: string;
    courseId?: string;
}

export interface CreateExamsParams {
    name: string;
    plan?: string;
    type?: string;
    subjectId?: string;
    education?: string[];
    status?: string;
}

export interface UpdateExam {
    name?: string;
    plan?: string;
    type?: string;
    subjectId?: string;
    education?: string[];
    status?: StatusEnum;
}
export interface DeleteExam {
    _id: string;
}
export interface GetQuestionParams {
    filterQuery: object;
    options: object;
}

export interface Exam {
    _id: string;
    name: string;
    plan: string;
    countQuestions: number;
    tested: number;
    status: string;
    type: ModelEnum;
    educations: string[];
    subjectId: string;
}
export interface IListUserProps {
    onClose: (isRefresh: boolean) => void;
    open: boolean;
    exam: Exam;
}

export interface IResultTest {
    _id: string;
    testId: any;
    userId: { _id: string; fullName: string; avatar: string };
    submitDate: Date;
    status: string;
}
export interface IResultParams {
    testId?: string;
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}
