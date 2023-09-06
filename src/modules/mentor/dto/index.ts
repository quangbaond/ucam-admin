export interface Mentor {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: number;
    educationId: string;
    countTest: number;
    countDocument: number;
    countCourse: number;
    countAnswer: number;
}

export interface FindMentor {
    _id?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: number;
    educationId?: string;
    countTest?: number;
    countDocument?: number;
    countCourse?: number;
    countAnswer?: number;
}

export interface FilterProp<T = any> {
    onSearch: (value: T) => void;
    resetForm: T;
}

export interface ParamSearch {
    search?: string;
    subjectId?: string;
    isPoints?: boolean;
}

export interface MentorSubject {
    files: { url: string }[];
    universityDegree: string;
    _id: string;
}

export interface InfoProps {
    open: boolean;
    onCancel: () => void;
    data: MentorSubject[];
}
