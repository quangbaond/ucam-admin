import type { FilterProp, ParamSearch } from '../dto';

import { Col, Form, Input, Row, Select } from 'antd';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import {findSubjectsApi} from "@/modules/subjects/api";

const Filter = (props: FilterProp) => {
    const { onSearch, resetForm } = props;
    const [schools, setSchools] = React.useState<any[]>([]);
    const [paramSearch, setParamSearch] = useState<ParamSearch | null>(null);
    const [form] = Form.useForm();

    const onChange = (e: any) => {
        setParamSearch({
            ...paramSearch,
            search: e.target.value,
        });
    };

    const handleChangeSubjects = (value: string) => {
        setParamSearch({
            ...paramSearch,
            subjectId: value,
        });
    };

    const handleChangeStatus = (value: boolean) => {
        setParamSearch({
            ...paramSearch,
            isPoints: value,
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
        setParamSearch({});
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

            setSchools(response?.result?.docs);
        };

        fetchSubjects();
    }, []);
    const dataSubjects: any[] = [];

    schools &&
    schools.forEach((item, key) => {
        dataSubjects.push({
            value: item._id,
            label: item.name,
            key: key,
        });
    });
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
                                options={dataSubjects}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="status" label="Trạng thái">
                            <Select
                                placeholder="Chọn trạng thái"
                                onChange={handleChangeStatus}
                                options={[
                                    {
                                        label: "Mất phí",
                                        value: true
                                    },
                                    {
                                        label: "Không mất phí",
                                        value: false
                                    }
                                ]}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Filter;
