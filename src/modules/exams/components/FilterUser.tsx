import type { IFillterExamProps, IFilterResultProps, IGetExamParams, IResultParams } from '../dto';

import { Col, Form, Input, Row, Select } from 'antd';
import debounce from 'lodash.debounce';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { planOptions, statusOptions, TypeTest } from '@/interface';

const FilterUser = (props: IFilterResultProps): React.ReactElement => {
    const { onSearch, isRefresh } = props;
    const [date, setDate] = useState<any>(null);

    useEffect(() => {
        form.resetFields();
    }, [isRefresh]);
    const [paramSearch, setParamSearch] = useState<IResultParams | null>(null);

    const [form] = MyForm.useForm();

    const debouncedChangeHandler = useCallback(debounce(onSearch, 300), []);

    useEffect(() => {
        if (paramSearch) {
            debouncedChangeHandler(paramSearch);
        }
    }, [paramSearch]);

    return (
        <div className="filter-exam">
            <MyForm layout="vertical" form={form}>
                <Row gutter={10}>
                    <Col span={6}>
                        <MyFormItem
                            name="search"
                            type="input"
                            label="Tìm kiếm"
                            innerProps={{ placeholder: 'Tìm kiếm', allowClear: true }}
                            onChange={() =>
                                setParamSearch({ ...paramSearch, search: form.getFieldValue('search') ?? undefined })
                            }
                        ></MyFormItem>
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            name="status"
                            type="select"
                            label="Trạng thái"
                            options={[
                                { label: 'PASS', value: 'PASS' },
                                { label: 'FAIL', value: 'FAIL' },
                            ]}
                            innerProps={{ placeholder: 'Chọn trạng thái', allowClear: true }}
                            onChange={() => setParamSearch({ ...paramSearch, status: form.getFieldValue('status') })}
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            name="date"
                            type="date-picker"
                            label="Thời gian"
                            innerProps={{ placeholder: 'Chọn ngày bắt đầu', allowClear: true }}
                            onChange={(e: any) => {
                                setParamSearch({
                                    ...paramSearch,
                                    startDate: e[0] ? moment(e[0].$d).format('DD/MM/YYYY') : undefined,
                                    endDate: e[1] ? moment(e[1].$d).format('DD/MM/YYYY') : undefined,
                                });
                            }}
                        />
                    </Col>
                </Row>
            </MyForm>
        </div>
    );
};

export default FilterUser;
