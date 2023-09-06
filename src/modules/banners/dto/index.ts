import {MentorIntroduce} from "@/interface/mentor";

export interface FilterProps<T = any> {
    onSearch: (value: T) => void;
    isRefresh?: boolean | null;
}
export interface ListProps<T = any> {
    paramSearch?: T;
    isRefresh?: boolean | null;
    setIdActive: (record: MentorIntroduce) => void;
}

export interface FormProps<T = any> {
    open: boolean;
    onClose: (isRefresh: boolean | null) => void;
    type: string;
    id: string;
}
