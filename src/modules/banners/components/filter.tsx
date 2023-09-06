import React, {useCallback, useEffect, useState} from 'react';
import MyForm from "@/components/core/form";
import MyFormItem from "@/components/core/form-item";
import {Col, Row} from "antd";
import {statusOptions} from "@/interface";
import debounce from "lodash.debounce";
import {FilterProps} from "@/modules/banners/dto";

const Filter = (props: FilterProps) => {
    const {onSearch, isRefresh} = props;
    const [form] = MyForm.useForm();
    const [paramSearch, setParamSearch] = useState<any>(null);
    const debouncedChangeHandler = useCallback(debounce(onSearch, 300), []);

    useEffect(() => {
        form.resetFields()
        setParamSearch({})
    }, [isRefresh])
    useEffect(() => {
        if (paramSearch) {
            debouncedChangeHandler(paramSearch);
        }
    }, [paramSearch]);
    return (
        <MyForm layout={'vertical'} form={form}>
            <Row gutter={10}>
                <Col span={8}>
                    <MyFormItem
                        name="search"
                        label="Tìm kiếm"
                        type={'input'}
                        onChange={(e: any) => {
                            setParamSearch({
                                ...paramSearch,
                                search: e.target.value,
                            });
                        }}
                        innerProps={{
                            allowClear: true
                        }}
                    />
                </Col>
                <Col span={8}>
                    <MyFormItem
                        name="status"
                        label="Trạng thái"
                        type={'select'}
                        options={statusOptions}
                        onChange={(value: string) => {
                              setParamSearch({
                                ...paramSearch,
                                status: value,
                            });
                        }}
                        innerProps={{
                            allowClear: true
                        }}
                    />
                </Col>
            </Row>
        </MyForm>
    );
}

export default Filter;