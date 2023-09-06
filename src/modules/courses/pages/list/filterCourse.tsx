import type { SelectOptions } from '@/components/core/form-item';
import type { PageData } from '@/interface';
import type { Subject } from '@/modules/subjects/dto';
import type { User } from '@/modules/users/dto/login';

import { Col, Form, Row } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { planOptions, statusOptions } from '@/interface';
import { useLocale } from '@/locales';
import { findSubjectsApi } from '@/modules/subjects/api';
import { findUsersApi } from '@/modules/users/api';

interface FilterUserProp<T = any> {
    onSearch: (value: T) => void;
    resetForm: T;
}

const FilterCourse = (props: FilterUserProp) => {
    const { formatMessage } = useLocale();
    const { onSearch, resetForm } = props;
    const [paramSearch, setParamSearch] = useState({});
    const [form] = MyForm.useForm();
    const [subjectOptions, setSubjectOptions] = useState();
    const [mentorOptions, setMentorOptions] = useState();

    const handleFilterChange = (filter: any) => {
        setParamSearch({
            ...paramSearch,
            ...filter,
        });
    };

    const debouncedChangeHandler = useCallback(debounce(onSearch, 800), []);

    useEffect(() => {
        debouncedChangeHandler(paramSearch);
    }, [debouncedChangeHandler, paramSearch]);

    useEffect(() => {
        form.resetFields();
        setParamSearch({});
    }, [resetForm]);

    async function fetchSubjects(search: string): Promise<any> {
        const filterQuery = search ? { search: search } : {};

        return findSubjectsApi({ filterQuery: filterQuery, options: { pagination: false } })
            .then((response: any) => response.result)
            .then((body: PageData<Subject>) =>
                body.docs.map((subject: Subject) => ({
                    label: subject.name,
                    value: subject._id,
                })),
            );
    }

    async function fetchMentorList(search: string): Promise<any> {
        const filterQuery = search ? { search: search, isMentor: true } : { isMentor: true };

        return findUsersApi({ filterQuery: filterQuery, options: { pagination: false } })
            .then((response: any) => response.result)
            .then((body: PageData<User>) =>
                body.docs.map((user: User) => ({
                    label: user.fullName,
                    value: user._id,
                })),
            );
    }

    useEffect(() => {
        const fetchSubjectOption = async () => {
            const res = await fetchSubjects('');

            setSubjectOptions(res);
        };

        const fetchMentorOption = async () => {
            const res = await fetchMentorList('');

            setMentorOptions(res);
        };

        fetchSubjectOption();
        fetchMentorOption();
    }, []);

    return (
        <>
            <Form form={form} layout="vertical">
                <Row gutter={10}>
                    <Col span={6}>
                        <MyFormItem
                            label={formatMessage({ id: 'component.search.title' })}
                            name="search"
                            type="input"
                            onChange={(value: string) => handleFilterChange({ search: value })}
                            innerProps={{
                                placeholder: 'Tìm kiếm',
                                allowClear: true,
                            }}
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            label={formatMessage({ id: 'component.search.mentor' })}
                            name="mentorId"
                            options={mentorOptions}
                            type="select-debounce"
                            fetchOptions={fetchMentorList}
                            onChange={(selected: SelectOptions) => handleFilterChange({ mentorId: selected.value })}
                            innerProps={{ placeholder: 'Chọn mentor', allowClear: true, showSearch: true }}
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            label={formatMessage({ id: 'component.search.subject' })}
                            name="subjectId"
                            options={subjectOptions}
                            type="select-debounce"
                            onChange={(selected: SelectOptions) => handleFilterChange({ subjectId: selected.value })}
                            fetchOptions={fetchSubjects}
                            innerProps={{ placeholder: 'Chọn môn học', allowClear: true }}
                        />
                    </Col>
                    <Col span={3}>
                        <MyFormItem
                            label={formatMessage({ id: 'component.search.plan' })}
                            name="plan"
                            type="select"
                            options={planOptions}
                            onChange={(value: string) => handleFilterChange({ plan: value })}
                            innerProps={{ placeholder: 'Chọn loại khoá học', allowClear: true }}
                        />
                    </Col>
                    <Col span={3}>
                        <MyFormItem
                            label={formatMessage({ id: 'component.search.status' })}
                            name="status"
                            type="select"
                            options={statusOptions}
                            onChange={(value: string) => handleFilterChange({ status: value })}
                            innerProps={{ placeholder: 'Chọn trạng thái', allowClear: true }}
                        />
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default FilterCourse;
