import type { IFillterExamProps, IGetExamParams } from '../dto';

import { Col, Row } from 'antd';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { planOptions, statusOptions, TypeTest } from '@/interface';

const FilterExam = (props: IFillterExamProps): React.ReactElement => {
    const { onSearch, isRefresh } = props;

    useEffect(() => {
        form.resetFields();
    }, [isRefresh]);
    const [paramSearch, setParamSearch] = useState<IGetExamParams | null>(null);

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
                            name="name"
                            type="input"
                            label="Tiêu đề"
                            innerProps={{ placeholder: 'Tìm kiếm', allowClear: true }}
                            onChange={() =>
                                setParamSearch({ ...paramSearch, name: form.getFieldValue('name') ?? undefined })
                            }
                        ></MyFormItem>
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            name="plan"
                            type="select"
                            label="Mô hình bài thi"
                            options={planOptions}
                            onChange={() =>
                                setParamSearch({ ...paramSearch, plan: form.getFieldValue('plan') ?? undefined })
                            }
                            innerProps={{ placeholder: 'Chọn mô hình', allowClear: true }}
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            name="type"
                            type="select"
                            label="Loại bài thi"
                            options={TypeTest}
                            onChange={() =>
                                setParamSearch({ ...paramSearch, type: form.getFieldValue('type') ?? undefined })
                            }
                            innerProps={{ placeholder: 'Chọn loại bài thi', allowClear: true }}
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            name="status"
                            type="select"
                            label="Trạng thái"
                            options={statusOptions}
                            innerProps={{ placeholder: 'Chọn trạng thái', allowClear: true }}
                            onChange={() => setParamSearch({ ...paramSearch, status: form.getFieldValue('status') })}
                        />
                    </Col>
                </Row>
            </MyForm>
        </div>
    );
};

export default FilterExam;
