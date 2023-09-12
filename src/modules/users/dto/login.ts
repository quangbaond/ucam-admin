/** user's role */
import type { MentorStatusEnum, RoleEnum, StatusEnum } from '@/interface';
import type { Education } from '@/interface/educations';
import type { Group } from '@/modules/groups/interface';
import type { MentorSubject } from '@/modules/mentor/dto';

export type Role = RoleEnum.ADMIN | RoleEnum.FREE_USER | RoleEnum.PREMIUM_USER;

export interface LoginParams {
    account: string;
    password: string;
    remember: boolean;
    isAdmin: boolean;
}

export interface FindUserParam {
    _id?: string;
    accountStatus?: string;
    fullName?: string;
    role?: RoleEnum;
    isMentor?: boolean;
    search?: string;
}
export interface User {
    _id: string;
    accessToken: string;
    accountStatus: string | boolean;
    avatarUrl: string;
    coverImgUrl: string;
    createdAt: string;
    fullName: string;
    role: RoleEnum[];
    isMentor: boolean;
    email: string;
    status: StatusEnum;
    education: Education;
    mentorStatus: MentorStatusEnum;
    subjects: MentorSubject[];
    devices: any;
    group: Group;
    groupId: string;
}

export interface LogoutParams {
    accessToken: string;
}

export interface LogoutResult { }

export interface UsersResult { }

export interface IHistoryProps {
    onClose: () => void;
    open: boolean;
    idUser: string;
}
export interface IHistory {
    course?: any;
    documents?: any;
    result?: any;
}

export interface iDocumentProps {
    data: any;
    isRefresh: boolean | null;
}
