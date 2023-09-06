import type { Question } from '../dto';
import type { QuestionTypeEnum } from '@/interface';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Radio, Row } from 'antd';
import { memo, useEffect, useState } from 'react';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';

interface Props {
    data: Question | undefined;
    questionType: QuestionTypeEnum;
    form: any;
    handleRadioChange: (index: number) => void;
}

const CreateQuestionForm = (props: Props) => {
    const { data, questionType, form, handleRadioChange } = props;
    const [question, setQuestion] = useState('');
    const [hint, setHint] = useState('');
    const [explanation, setExplanation] = useState('');

    useEffect(() => {
        if (data) {
            setQuestion(data.question);
            setHint(data.hint ? data.hint : '');
            setExplanation(data.explanation ? data.explanation : '');
            form.setFieldValue('choices', data.choices);
        } else {
            setQuestion('');
            setHint('');
            setExplanation('');
        }
    }, [data]);

    const renderChoiceList = () => {
        return (
            <MyForm.List
                name="choices"
                rules={[
                    {
                        validator: async (_, choices) => {
                            if (!choices || choices.length < 2) {
                                return Promise.reject(new Error('Nhập ít nhất 2 câu trả lời'));
                            }
                        },
                    },
                ]}
            >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <MyFormItem required={false} key={field.key}>
                                <Row>
                                    <Col span={3}>Đáp án {index + 1}</Col>
                                    <Col span={19}>
                                        <MyFormItem
                                            {...field}
                                            required={false}
                                            key={field.key}
                                            name={[field.name, 'answer']}
                                            style={{ marginBottom: '-5px' }}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: 'Vui lòng nhập đáp án.',
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Input
                                                placeholder="Nội dung đáp án"
                                                style={{
                                                    width: '60%',
                                                }}
                                            />
                                        </MyFormItem>
                                    </Col>
                                    <Col span={1}>
                                        <MyFormItem
                                            {...field}
                                            required={false}
                                            key={'isCorrect'}
                                            name={[field.name, 'isCorrect']}
                                            style={{ marginBottom: '-5px' }}
                                            valuePropName={'checked'}
                                        >
                                            {questionType === 'SINGLE CHOICE' ? (
                                                <Radio onChange={() => handleRadioChange(index)}></Radio>
                                            ) : (
                                                <Checkbox></Checkbox>
                                            )}
                                        </MyFormItem>
                                    </Col>
                                    <Col span={1}>
                                        {fields.length > 2 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                style={{
                                                    color: 'red',
                                                    paddingTop: '10px',
                                                }}
                                                onClick={() => remove(field.name)}
                                            />
                                        ) : null}
                                    </Col>
                                </Row>
                                <Form.ErrorList errors={errors} />
                            </MyFormItem>
                        ))}
                        <MyFormItem>
                            <Button
                                type="dashed"
                                onClick={() => add({ answer: '', isCorrect: false })}
                                style={{
                                    width: '60%',
                                }}
                                icon={<PlusOutlined />}
                            >
                                Thêm đáp án
                            </Button>
                        </MyFormItem>
                    </>
                )}
            </MyForm.List>
        );
    };

    return (
        <>
            <MyForm
                layout="vertical"
                form={form}
                initialValues={{
                    choices: [
                        { answer: '', isCorrect: true },
                        { answer: '', isCorrect: false },
                    ],
                }}
            >
                <Row gutter={16} style={{ marginTop: 10 }}>
                    <Col span={12}>
                        <MyFormItem
                            label={'Nội dung câu hỏi:'}
                            type={'editor'}
                            labelCol={{ span: 24 }}
                            name="question"
                            innerProps={{ data: question }}
                            setData={(value: string) => {
                                form.setFieldValue('question', value);
                            }}
                        ></MyFormItem>
                    </Col>
                    <Col span={12}>
                        <div>
                            <label>
                                <h3>Đáp án:</h3>
                            </label>
                        </div>
                        {renderChoiceList()}
                    </Col>
                </Row>

                <Row gutter={16} style={{ marginTop: 10 }}>
                    <Col span={12}>
                        <MyFormItem
                            label={'Gợi ý:'}
                            labelCol={{ span: 24 }}
                            name="hint"
                            type="editor"
                            innerProps={{ data: hint }}
                            setData={(value: string) => {
                                form.setFieldValue('hint', value);
                            }}
                        ></MyFormItem>
                    </Col>

                    <Col span={12}>
                        <MyFormItem
                            label={'Giải thích:'}
                            labelCol={{ span: 24 }}
                            type="editor"
                            name="explanation"
                            innerProps={{ data: explanation }}
                            setData={(value: string) => {
                                form.setFieldValue('explanation', value);
                            }}
                        ></MyFormItem>
                    </Col>
                </Row>
            </MyForm>
        </>
    );
};

export default memo(CreateQuestionForm);
