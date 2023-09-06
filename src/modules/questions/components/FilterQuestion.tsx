import type { Question } from '../dto';

import { Col, Row } from 'antd';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { statusOptions } from '@/interface';

interface Props {
    onSearch: any;
    isRefresh: boolean;
}

const FilterQuestion = (props: Props): React.ReactElement => {
    const { onSearch, isRefresh } = props;

    useEffect(() => {
        form.resetFields();
    }, [isRefresh]);
    const [paramSearch, setParamSearch] = useState<Partial<Question>>();

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
                            name="question"
                            type="input"
                            label="Nội dung câu hỏi"
                            innerProps={{ placeholder: 'Tìm kiếm', allowClear: true }}
                            onChange={() =>
                                setParamSearch({
                                    ...paramSearch,
                                    question: form.getFieldValue('question') ?? undefined,
                                })
                            }
                        ></MyFormItem>
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

export default FilterQuestion;
