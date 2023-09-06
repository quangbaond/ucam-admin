import type { SelectOptions } from '@/components/core/form-item';
import type { User } from '@/modules/users/dto/login';

import { Col, Form, Input, Row, Select } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

import MyFormItem from '@/components/core/form-item';
import { StatusEnum } from '@/interface';
import { findUsersApi } from '@/modules/users/api';

interface FilterUserProp<T = any> {
    onSearch: (value: T) => void;
    resetForm: T;
}
interface ParamSearch {
    search?: string;
    educationType?: string;
    accountStatus?: string;
    educationId?: string[];
}

const FilterUser = (props: FilterUserProp) => {
    const { onSearch, resetForm } = props;
    const [paramSearch, setParamSearch] = useState<any | null>(null);
    const [form] = Form.useForm();
    const [enrollUser, setEnrollUser] = useState<string[]>([]);
    const [paginationUser, setPaginationUser] = useState<any>({
        page: 1,
        limit: 10,
    });
    const [userOptions, setUserOptions] = useState<SelectOptions[]>([]);

    async function fetchUsers(search: string, options: any): Promise<any> {
        const filterQuery = search ? { search: search } : {};
        const pagination = search ? { page: 1, limit: 10 } : options;

        return findUsersApi({ filterQuery: filterQuery, options: pagination })
            .then((response: any) => response.result)
            .then(body =>
                body.docs.reduce(function (ids: SelectOptions[], user: User) {
                    if (!enrollUser.includes(user._id)) {
                        ids.push({
                            label: `${user.fullName} - ${user.email}`,
                            value: user._id,
                        });
                    }

                    return ids;
                }, []),
            );
    }

    useEffect(() => {
        const fetchUserOptions = async () => {
            const res = await fetchUsers('', paginationUser);

            setUserOptions([...userOptions, ...res]);
        };

        fetchUserOptions();
    }, [enrollUser, paginationUser]);

    const onChange = (e: any) => {
        setParamSearch({
            ...paramSearch,
            search: e.target.value ? e.target.value : undefined,
        });
    };

    const handleChangeStatus = (value: string) => {
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
                        <MyFormItem
                            label={'Người dùng'}
                            type="select-debounce"
                            name="userId"
                            options={userOptions}
                            fetchOptions={fetchUsers}
                            innerProps={{
                                placeholder: '',
                                allowClear: true,
                                showSearch: true,
                            }}
                            onPopupScroll={(e: any) => {
                                if (e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight) {
                                    setPaginationUser({
                                        ...paginationUser,
                                        page: paginationUser.page + 1,
                                    });
                                }
                            }}
                            onChange={(value: SelectOptions) => {
                                setParamSearch({
                                    ...paramSearch,
                                    userId: value.value,
                                });
                            }}
                        />
                    </Col>
                    <Col span={8}>
                        <Form.Item name="status" label="Trạng thái">
                            <Select
                                placeholder="Chọn trạng thái"
                                onChange={handleChangeStatus}
                                options={[
                                    {
                                        label: 'Thành công',
                                        value: StatusEnum.SUCCESS,
                                    },
                                    {
                                        label: 'Đang chờ',
                                        value: StatusEnum.PENDING,
                                    },
                                    {
                                        label: 'Đã huỷ',
                                        value: StatusEnum.REJECTED,
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

export default FilterUser;
