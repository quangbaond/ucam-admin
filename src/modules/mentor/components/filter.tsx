import type { FilterProp } from '../dto';
import type { Subject } from '@/modules/subjects/dto';

import { Col, Form, Input, Row, Select } from 'antd';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';

import { MentorStatusOptions } from '@/interface';
import { findSubjectsApi } from '@/modules/subjects/api';

const FilterMentor = (props: FilterProp) => {
    const { onSearch, resetForm } = props;
    const [subjectOptions, setSubjectOptions] = React.useState<Subject[]>([]);
    const [paramSearch, setParamSearch] = useState<any>({
        isMentor: true,
    });
    const [form] = Form.useForm();

    const onChange = (e: any) => {
        setParamSearch({
            ...paramSearch,
            search: e.target.value,
        });
    };

    const handleChangeSubjects = (value: string) => {
        console.log(value);
        setParamSearch({
            ...paramSearch,
            subjects: value,
        });
    };

    const handleChangeStatus = (value: boolean) => {
        setParamSearch({
            ...paramSearch,
            mentorStatus: value,
        });
    };

    const debouncedChangeHandler = useCallback(debounce(onSearch, 300), []);

    useEffect(() => {
        if (paramSearch) {
            debouncedChangeHandler(paramSearch);
        }
    }, [paramSearch]);

    useEffect(() => {
        form.resetFields();
        setParamSearch({
            isMentor: true,
        });
    }, [resetForm]);
    React.useEffect(() => {
        const body = {
            filterQuery: {},
            options: {
                pagination: false,
            },
        };

        const fetchSubjects = async () => {
            const response: any = await findSubjectsApi(body);

            if (response) {
                const { result } = response;
                const data = result?.docs.map((item: Subject) => {
                    return {
                        label: item.name,
                        value: item._id,
                    };
                });

                setSubjectOptions(data);
            }
        };

        fetchSubjects();
    }, []);

    return (
        <>
            <Form form={form} layout="vertical">
                <Row gutter={10}>
                    <Col span={8}>
                        <Form.Item name="search" label="Tìm kiếm">
                            <Input placeholder="Tìm kiếm" allowClear onChange={onChange} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="school" label="Môn học">
                            <Select
                                placeholder="Chọn môn học"
                                onChange={handleChangeSubjects}
                                options={subjectOptions}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="status" label="Trạng thái">
                            <Select
                                placeholder="Chọn trạng thái"
                                onChange={handleChangeStatus}
                                options={MentorStatusOptions}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default FilterMentor;
