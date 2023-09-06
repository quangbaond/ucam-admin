import type { QuestionTypeEnum, StatusEnum } from '@/interface';

export interface Question {
    _id: string;
    question: string;
    point: number;
    choices: IChoice[];
    hint: string;
    testId: string;
    lessonId: string;
    explanation: string;
    type: QuestionTypeEnum;
    status: StatusEnum;
}

export interface IChoice {
    answer: string;
    isCorrect: boolean;
}
