import type { StatusEnum } from '@/interface';
import type { User } from '@/modules/users/dto/login';

export interface WidthDraw {
    _id: string;
    userId: User;
    status: StatusEnum;
    search?: string;
}
export interface FindWithDrawParam {
    status: StatusEnum;
}
