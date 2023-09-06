import type { UploadFile } from 'antd';

export interface Config {
    _id: string;
    contacts: Contacts[];
    partners: Partner[];
    socials: Socials[];
    systemConfigs: SystemConfigs;
}
export interface SystemConfigs {
    domain: string;
    uploadApi: string;
    senderEmail: string;
    senderClientId: string;
}

export enum SocialEnum {
    FACEBOOK = 'FACEBOOK',
    INSTAGRAM = 'INSTAGRAM',
    TWITTER = 'TWITTER',
}
export interface Contacts {
    name: string;
    phoneNumber: string;
    email: string;
    _id: string;
}
export interface Partner {
    name: string;
    phoneNumber: string;
    email: string;
}

export interface Socials {
    type: SocialEnum;
    url: string;
    icon: string;
}
export interface ConfigFormProps {
    form: any;
    fileList?: UploadFile[];
    setFileList?: any;
}
