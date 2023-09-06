export interface ChangePassword {
    isShowModal: boolean;
    email: string;
    name: string;
}
export interface ChangePasswordProps {
    dataModalChangePassword: ChangePassword;
    successChangePassword: () => void;
}
export interface ChangePasswordForm {
    account: string;
    password: string;
    confirmPassword: string;
    isAdmin: boolean;
}
