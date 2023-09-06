import type { Exam } from '../dto';
import type { PageData } from '@/interface';
import type { Education } from '@/interface/educations';
import type { IFormExamProps } from '@/modules/exams/dto';
import type { Subject } from '@/modules/subjects/dto';

import { Button, Col, Drawer, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { findEducationsApi } from '@/api/educations';
import { callbackApi } from '@/common';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { EducationTypeEnum, PlanEnum, planOptions, SchoolOptions, TypeTest } from '@/interface';
import { useLocale } from '@/locales';
import { createExamApi, getExamApi, updateExamApi } from '@/modules/exams/api';
import { findSubjectsApi } from '@/modules/subjects/api';

const FormExam = (props: IFormExamProps): React.ReactElement => {
    const { formatMessage } = useLocale();

    const navigate = useNavigate();
    const { onClose, open, type, id } = props;
    const [subjectOptions, setSubjectOptions] = useState<{ label: string; value: string }[]>([]);
    const [educationOptions, setEducationOptions] = useState<{ label: string; value: string }[]>([]);
    const [form] = MyForm.useForm();
    const [defaultValues, setDefaultValues] = useState<Exam | null>(null);
    const [educationType, setEducationType] = useState(EducationTypeEnum.UNIVERSITY);
    const selectAll = [{ label: 'Tất cả', value: 'ALL' }];
    const [typePlan, setTypePlan] = useState(PlanEnum.FREE);

    async function fetchSubjects(search: string, others: any): Promise<any> {
        const filterQuery = search ? { search: search, ...others } : others;

        return findSubjectsApi({ filterQuery: filterQuery, options: { pagination: false } })
            .then((response: any) => response.result)
            .then((body: PageData<Subject>) =>
                body.docs.map((subject: Subject) => ({
                    label: subject.name,
                    value: subject._id,
                })),
            );
    }

    async function fetchEducations(search: string, others: any): Promise<any> {
        const filterQuery = search ? { search: search, ...others } : others;
        const res = await findEducationsApi({ filterQuery: filterQuery, options: { pagination: false } });

        return res.result.docs.map((education: Education) => ({
            label: education.name,
            value: education._id,
        }));
    }

    useEffect(() => {
        if (!open) return;

        const fetchSubjectOption = async () => {
            const res = await fetchSubjects('', { educationType: educationType });

            setSubjectOptions(res);
        };

        const fetchEducationOptions = async () => {
            const resMap = await fetchEducations('', { educationType: educationType });
            const res = selectAll.concat(resMap);

            setEducationOptions(res);
        };

        fetchSubjectOption();
        fetchEducationOptions();
    }, [open, educationType]);

    useEffect(() => {
        if (type === 'edit' && id) {
            const getExamDetail = async () => {
                const response: {
                    result: Exam;
                    status: boolean;
                } = await getExamApi(id);

                const { result, status } = response;

                if (status) {
                    setDefaultValues(result);
                }
            };

            getExamDetail();
        }
    }, [type, id]);

    useEffect(() => {
        if (defaultValues) {
            form.setFieldsValue({
                ...defaultValues,
                subjectId: subjectOptions.find((e: any) => e.value === defaultValues.subjectId),
                educations: educationOptions.filter((e: any) => defaultValues.educations.includes(e.value)),
            });
        }
    }, [defaultValues]);

    const onFinish = async (values: any) => {
        const query = values;

        query.subjectId = values.subjectId.value;
        query.educations = values.educations
            ? values.educations.some((e: any) => e.value === 'ALL')
                ? educationOptions.map((e: any) => {
                      // remove select all
                      if (e.value !== 'ALL') return e.value;
                  })
                : values.educations.map((e: any) => (e.value ? e.value : e))
            : [];
        const response: any = type == 'edit' && id ? await updateExamApi(id, query) : await createExamApi(query);
        const callback =
            type === 'edit'
                ? () => callbackApi(response, 'Cập nhật bài thi thành công!', () => onClose())
                : () =>
                      callbackApi(response, 'Tạo bài thi thành công!', () => {
                          onClose();
                          navigate(`/questions/${response?.result?._id}`);
                      });

        callback();
    };

    const onCloseForm = () => {
        form.resetFields();
        onClose();
    };

    const hadleChangeEducation = async () => {
        const response: any = await fetchSubjects('', {
            educationType: educationType,
            educations: form.getFieldValue('educations').map((e: any) => e.value),
        });

        setSubjectOptions(response);
    };

    return (
        <Drawer
            title={type === 'edit' ? 'Chỉnh sửa bài thi' : 'Tạo bài thi mới'}
            width={750}
            onClose={onCloseForm}
            open={open}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Space>
                    <Button onClick={onCloseForm}>Hủy</Button>
                    <Button onClick={() => form.submit()} type="primary">
                        Tiếp tục
                    </Button>
                </Space>
            }
        >
            <MyForm layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={24}>
                        <MyFormItem
                            label="Tên bài thi"
                            type="input"
                            name="name"
                            innerProps={{ placeholder: 'Nhập tên bài thi', allowClear: true }}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label="Chọn loại bài thi"
                            type="select"
                            name="type"
                            options={TypeTest}
                            innerProps={{
                                placeholder: 'Chọn loại bài thi',
                                allowClear: true,
                            }}
                            initialValue={TypeTest[0].value}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label="Chọn khối trường"
                            type="select"
                            name="educationType"
                            options={SchoolOptions}
                            innerProps={{
                                placeholder: 'Chọn khối trường',
                                allowClear: true,
                            }}
                            initialValue={SchoolOptions[0].value}
                            onChange={(_: any, value: any) => {
                                setEducationType(value.value);
                                form.resetFields(['educations', 'subject']);
                            }}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label="Chọn mô hình bài thi"
                            type="select"
                            name="plan"
                            options={planOptions}
                            innerProps={{
                                placeholder: 'Chọn mô hình bài thi',
                                allowClear: true,
                            }}
                            initialValue={planOptions[0].value}
                            required
                            onChange={(value: any) => {
                                setTypePlan(value);

                                if (value === PlanEnum.FREE) {
                                    form.resetFields(['cost']);
                                }
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label="Số điểm"
                            type="input-number"
                            name="cost"
                            innerProps={{
                                placeholder: 'Số điểm',
                                allowClear: true,
                                min: 1,
                                disabled: typePlan === PlanEnum.FREE,
                            }}
                            required={typePlan === PlanEnum.PREMIUM}
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label={formatMessage({ id: 'component.search.school' })}
                            name="educations"
                            options={educationOptions}
                            type="select-debounce"
                            fetchOptions={fetchEducations}
                            innerProps={{
                                placeholder: 'Chọn trường học',
                                allowClear: true,
                                mode: 'multiple',
                                maxTagCount: 'responsive',
                            }}
                            onChange={() => hadleChangeEducation()}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label={formatMessage({ id: 'component.search.subject' })}
                            name="subjectId"
                            options={subjectOptions}
                            otherFilter={{ educationType: educationType }}
                            type="select-debounce"
                            fetchOptions={fetchSubjects}
                            innerProps={{
                                placeholder: 'Chọn môn học',
                                allowClear: true,
                            }}
                            required
                        />
                    </Col>
                </Row>
            </MyForm>
        </Drawer>
    );
};

export default FormExam;
