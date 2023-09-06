export interface DataType {
    key: string;
    disabled: boolean;
    tag: string;
    name: string;
}

export interface IUpdateFormProps {
    isShowForm: boolean;
    closeForm: (reload: boolean | null) => void;
    type: string;
    id: string;
}

export interface FilterProp<T = any> {
    onSearch: (value: T) => void;
    resetForm: T;
}

export interface ParamSearch {
    search?: string;
    educationType?: string;
    status?: string;
}

export interface IListProps<T = any> {
    resetForm: T;
    handelUpdate: (id: string) => void;
}

