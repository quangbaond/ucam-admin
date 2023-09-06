import type { EnrollEnum } from '@/interface';
import type { ActivationCode } from '@/interface/activations';
import type { User } from '@/modules/users/dto/login';

export interface Enroll {
    _id: string;
    targetId: string;
    targetModel: string;
    userId: string;
    user?: User;
    type: EnrollEnum;
    activationId: string;
    activation?: ActivationCode;
}

export interface FindEnrollParams {
    targetId?: string;
    targetModel?: string;
    userId?: string;
    type?: EnrollEnum;
    activationId?: string;
}

export interface CreateEnrollParams {
    targetId: string;
    targetModel: string;
    userIds: string[];
    activationCode?: string;
}
