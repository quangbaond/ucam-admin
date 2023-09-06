// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export interface Locales<T = any> {
    /** Chinese */
    zh_CN: T;
    /** English */
    en_US: T;
}

export type Language = keyof Locales;

export interface FindAllOptions {
    pagination?: boolean;
    limit?: number;
    page?: number;
    sort?: any;
}

export interface PageData<T> {
    page: number;
    limit: number;
    totalDocs: number;
    docs: T[];
}

export interface FindAllParam<T = any> {
    filterQuery: T;
    options?: FindAllOptions;
}

export enum StatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    APPROVED = 'APPROVED',
    UNAPPROVED = 'UNAPPROVED',
    LOCK = 'LOCK',
    SUCCESS = 'SUCCESS',
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    DELETED = 'DELETED',
}

export enum VerifyStatusEnum {
    VERIFIED = 'VERIFIED',
    UNVERIFIED = 'UNVERIFIED',
}

export enum EducationTypeEnum {
    HIGH_SCHOOL = 'HIGH SCHOOL',
    UNIVERSITY = 'UNIVERSITY',
}
export enum EducationTypeTextEnum {
    HIGH_SCHOOL = 'THPT',
    UNIVERSITY = 'Đại học',
}

export enum RoleEnum {
    FREE_USER = 'FREE_USER',
    PREMIUM_USER = 'PREMIUM_USER',
    ADMIN = 'ADMIN',
}

export enum PlanEnum {
    FREE = 'FREE',
    PREMIUM = 'PREMIUM',
}

export enum DocumentTypeEnum {
    EXAM = 'EXAM',
    CURRICULUM = 'CURRICULUM',
    SLIDE = 'SLIDE',
    OTHER = 'OTHER',
}

export enum TestTypeEnum {
    QUIZ = 'QUIZ',
    TEST = 'TEST',
}

export enum QuestionTypeEnum {
    SINGLE_CHOICE = 'SINGLE CHOICE',
    MULTIPLE_CHOICE = 'MULTIPLE CHOICE',
    TRUE_FALSE = 'TRUE FALSE',
}

export enum ResultEnum {
    PASS = 'PASS',
    FAIL = 'FAIL',
}

export enum ActionEnum {
    CREATE = 'CREATE',
    UPLOAD = 'UPLOAD',
    VIEW = 'VIEW',
    DOWNLOAD = 'DOWNLOAD',
    PURCHASE = 'PURCHASE',
}

export enum EnrollEnum {
    MENTOR = 'MENTOR',
    STUDENT = 'STUDENT',
}

export enum ModelEnum {
    TOPIC = 'TOPIC',
    COURSE = 'COURSE',
    TEST = 'TEST',
    QUIZ = 'QUIZ',
    LESSON = 'LESSON',
}

export enum ProgressionEnum {
    DONE = 'DONE',
    DOING = 'DOING',
}
export const planOptions = [
    {
        label: 'Miễn Phí',
        value: PlanEnum.FREE,
    },
    {
        label: 'Trả Phí',
        value: PlanEnum.PREMIUM,
    },
];
export const statusOptions = [
    {
        label: 'Kích hoạt',
        value: StatusEnum.ACTIVE,
    },
    {
        label: 'Không kích hoạt',
        value: StatusEnum.INACTIVE,
    },
];

export const SchoolOptions = [
    {
        label: 'Đại học',
        value: EducationTypeEnum.UNIVERSITY,
    },
    {
        label: 'Trung học phổ thông',
        value: EducationTypeEnum.HIGH_SCHOOL,
    },
];

export const RoleOptions = [
    {
        label: 'Quản trị',
        value: RoleEnum.ADMIN,
    },
    {
        label: 'Người dùng',
        value: RoleEnum.FREE_USER,
    },
    {
        label: 'Người dùng cao cấp',
        value: RoleEnum.PREMIUM_USER,
    },
];

export enum TestTypeEnum {
    TEST = 'TEST',
    QUIZ = 'QUIZ',
}

export const TypeTest = [
    {
        value: TestTypeEnum.TEST,
        label: 'Bài thi',
    },
    {
        value: TestTypeEnum.QUIZ,
        label: 'Bài quiz',
    },
];

export interface IResponse<T = any> {
    result: T;
    message: string;
    status: number;
}

export enum MentorStatusEnum {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export const MentorStatusOptions = [
    {
        label: 'Đang chờ duyệt',
        value: MentorStatusEnum.PENDING,
    },
    {
        label: 'Đã duyệt',
        value: MentorStatusEnum.APPROVED,
    },
    {
        label: 'Từ chối',
        value: MentorStatusEnum.REJECTED,
    },
];

export interface steps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
}
