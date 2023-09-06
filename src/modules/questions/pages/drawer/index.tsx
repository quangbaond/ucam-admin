import type { IChoice, Question } from '../../dto';

import { Button, Drawer, InputNumber, message, Select, Space } from 'antd';
import { useEffect, useState } from 'react';

import MyForm from '@/components/core/form';
import { ActionEnum } from '@/const';
import { QuestionTypeEnum } from '@/interface';

import { createQuestionApi, updateQuestionApi } from '../../api';
import CreateQuestionForm from '../../components/CreateQuestionForm';

interface Props {
    type: string;
    open: boolean;
    setOpenDrawer: (open: boolean) => void;
    refreshPage: () => void;
    testId: string | undefined;
    data: Question | undefined;
}

const QuestionDrawer = (props: Props) => {
    const { type, open, setOpenDrawer, refreshPage, testId, data } = props;

    const [questionType, setQuestionType] = useState(QuestionTypeEnum.SINGLE_CHOICE);
    const [point, setPoint] = useState(10);
    const [form] = MyForm.useForm();

    useEffect(() => {
        if (data) {
            setQuestionType(data.type);
            setPoint(data.point);
        }
    }, [data]);

    const handleSubmit = async () => {
        const values = await form.validateFields();
        const payload: Question = testId
            ? {
                  ...values,
                  type: questionType,
                  point: point,
              }
            : {
                  ...values,
                  testId: testId,
                  type: questionType,
                  point: point,
              };

        if (type === ActionEnum.EDIT) {
            const response = await updateQuestionApi(data?._id as string, payload);

            if (response.status) {
                message.success('Cập nhật câu hỏi thành công');
                refreshPage();
                setOpenDrawer(false);
            }
        } else {
            const response = await createQuestionApi(payload);

            if (response.status) {
                message.success('Tạo mới câu hỏi thành công');
                refreshPage();
                setOpenDrawer(false);
            }
        }
    };

    const closeDrawer = () => {
        form.resetFields();

        setOpenDrawer(false);
        refreshPage();
    };

    const handleRadioChange = (index: number) => {
        const currentValues = form.getFieldValue('choices');

        const choices = currentValues.map((choice: IChoice, choiceIndex: number) => {
            if (choiceIndex === index) {
                return { ...choice, isCorrect: true };
            } else {
                return { ...choice, isCorrect: false };
            }
        });

        form.setFieldsValue({ choices });
    };

    return (
        <Drawer
            title={type === ActionEnum.EDIT ? 'Chỉnh sửa câu hỏi' : 'Tạo mới câu hỏi'}
            placement="right"
            onClose={closeDrawer}
            open={open}
            width={'90%'}
            extra={
                <Space>
                    Loại câu hỏi:{' '}
                    <Select
                        onChange={(e: any) => setQuestionType(e)}
                        value={questionType}
                        options={[
                            {
                                value: 'SINGLE CHOICE',
                                label: 'Câu hỏi một đáp án',
                            },
                            {
                                value: 'MULTIPLE CHOICE',
                                label: 'Câu hỏi nhiều đáp án',
                            },
                        ]}
                    />
                    Điểm: <InputNumber min={1} max={100} value={point} onChange={(e: any) => setPoint(e)} />
                    <Button
                        style={{
                            margin: '0 8px',
                        }}
                        type="primary"
                        onClick={handleSubmit}
                    >
                        Xác nhận
                    </Button>
                    <Button onClick={closeDrawer} danger>
                        Hủy
                    </Button>
                </Space>
            }
        >
            <CreateQuestionForm
                questionType={questionType}
                data={data}
                form={form}
                handleRadioChange={handleRadioChange}
            />
        </Drawer>
    );
};

export default QuestionDrawer;
