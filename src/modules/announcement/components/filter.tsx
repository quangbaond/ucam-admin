import type { FilterProp, ParamSearch } from '../dto';

import { Col, Form, Input, Row, Select } from 'antd';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';

import { findEducationsApi } from '@/api/educations';
import { StatusEnum } from '@/interface';

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

    const handleChangeSchool = (value: string) => {
        console.log(value);
        setParamSearch({
            ...paramSearch,
            educations: value,
        });
    };

    const handleChangeStatus = (value: StatusEnum) => {
        setParamSearch({
            ...paramSearch,
            status: value,
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

        const fetchSchools = async () => {
            const response: any = await findEducationsApi(body);

            setSchools(response?.result?.docs);
        };

        fetchSchools();
    }, []);
    const dataSchool: any[] = [];

    schools &&
        schools.forEach((item, key) => {
            dataSchool.push({
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
                        <Form.Item name="school" label="Trường học">
                            <Select
                                placeholder="Chọn trường học"
                                onChange={handleChangeSchool}
                                options={dataSchool}
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
                                        label: 'Hiển thị',
                                        value: StatusEnum.ACTIVE,
                                    },
                                    {
                                        label: 'Ẩn',
                                        value: StatusEnum.INACTIVE,
                                    },
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
