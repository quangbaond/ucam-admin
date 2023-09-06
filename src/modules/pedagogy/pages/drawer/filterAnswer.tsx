import type {FilterProp, ParamSearch} from '../../dto';

import {Col, Form, Input, Row, Select} from 'antd';
import debounce from 'lodash.debounce';
import React, {useCallback, useEffect, useState} from 'react';


const FilterAnswer = (props: FilterProp) => {
    const {onSearch, resetForm} = props;
    const [paramSearch, setParamSearch] = useState({});
    const [form] = Form.useForm();
    const onChange = (e: any) => {
        setParamSearch({
            ...paramSearch,
            search: e.target.value,
        });
    };
    const handleChangeActive = (value: any) => {
        setParamSearch({
            ...paramSearch,
            status: value
        });
    }
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

return(
    <>
        <Form form={form} layout="vertical">
            <Row gutter={10}>
                <Col span={8}>
                    <Form.Item name="search" label="Tìm kiếm">
                        <Input placeholder="Tìm kiếm" allowClear onChange={onChange} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="status" label="Trạng thái">
                        <Select
                            placeholder="Chọn trạng thái"
                            onChange={handleChangeActive}
                            options={[
                                {
                                    label: "Được chấp nhận",
                                    value: true
                                },
                                {
                                    label: "Không được chấp nhận",
                                    value: false
                                },
                                {
                                    label: "Đang xử lí",
                                    value: null
                                }
                            ]}
                            allowClear
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>

    </>
)
};


export default FilterAnswer;
