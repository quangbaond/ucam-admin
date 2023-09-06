export interface MentorIntroduce {
    _id: string;
    subjectId: string;
    mentorId: string;
    mentorImage: string;
    descriptions: string;
    educations: string;
    status: string;
}
export interface FindMentorIntroduceParams {
    _id?: string;
    search?: string;
    subjectId?: string;
    mentorId?: string;
    mentorImage?: string;
    descriptions?: string;
    educations?: string;
    status?: string;
}
export interface CreateMentorIntroduce {
    subjectId: {
        value: string;
    };
    mentorId?: string;
    mentorImage?: any;
    descriptions?: string;
    educations: string[];
}
export interface MentorIntroduceData {
    _id: string;
    subjectId: string;
    mentor: {
        _id: string;
        fullName: string;
    };
    mentorImage: string;
    descriptions: string;
    educations: string[];
    status: string;
}
export interface MentorIntroduceResult {}
