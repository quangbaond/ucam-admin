import { Col, Form, Input, Row, Select } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

import { SchoolOptions, statusOptions } from '@/interface';

interface FilterProp<T = any> {
    onSearch: (value: T) => void;
    isRefresh: T;
}
interface ParamSearch {
    search?: string;
    educationType?: string;
    status?: string;
}

const Filter = (props: FilterProp) => {
    const { onSearch, isRefresh } = props;
    const [paramSearch, setParamSearch] = useState<ParamSearch | null>(null);
    const [form] = Form.useForm();

    const onChange = (e: any) => {
        setParamSearch({
            ...paramSearch,
            search: e.target.value,
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
    }, [isRefresh]);

    return (
        <>
            <Form form={form} layout="vertical">
                <Row gutter={10}>
                    <Col span={8}>
                        <Form.Item name="search" label="Tìm kiếm">
                            <Input placeholder="Tìm kiếm" allowClear onChange={onChange} />
                        </Form.Item>
                    </Col>
                    {/* <Col span={8}>
                        <Form.Item name="status" label="Trạng thái">
                            <Select
                                placeholder="Chọn trạng thái"
                                onChange={handleChangeStatus}
                                options={statusOptions}
                                allowClear
                            />
                        </Form.Item>
                    </Col> */}
                </Row>
            </Form>
        </>
    );
};

export default Filter;
