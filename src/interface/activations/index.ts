export interface ActivationCode {
    _id?: string;
    targetId: string;
    targetModel: string;
    limitAccess: number;
    activationCode: string;
}
export interface FindActivationCodeParams {
    targetId?: string;
    activationCode?: string;
    targetModel?: string;
}
