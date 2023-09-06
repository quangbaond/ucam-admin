export interface ActivationCode {
    _id?: string;
    targetId?: string;
    targetModel?: string;
    limitAccess?: number;
    activationCode?: string;
}
export interface UpdateActivationParams {
    status?: string;
    targetId?: string;
    targetModel?: string;
    limitAccess?: number;
    activationCode?: string;
}
export interface FindActivationCodeParams {
    targetModel?: string;
    targetId?: string;
    activationCode?: string;
}
