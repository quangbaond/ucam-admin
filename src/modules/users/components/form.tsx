import type { PageData } from '@/interface/';
import type { Group } from '@/modules/groups/interface';

import { Button, Col, Drawer, Form, message as $message, Row, Space } from 'antd';
import { useEffect, useState } from 'react';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { PermissionOptions, RoleEnum, RoleOptions, TYPE_FORM_ENUM } from '@/interface/';
import { findGroupApi } from '@/modules/groups/api';

import { createUserApi, detailUserApi, updateUserApi } from '../api';

interface IFormProps {
    isShowForm: boolean;
    id: string;
    closeForm: () => void;
    type: TYPE_FORM_ENUM;
}

const FormComponent = (props: IFormProps) => {
    const { isShowForm, id, closeForm, type } = props;
    const [defaultValues, setDefaultValues] = useState<any>([]);
    const [form] = Form.useForm();
    const [title, setTitle] = useState<string>('Thêm mới nhóm');
    const [groupOptions, setGroupOptions] = useState([]);
    const [isMentor, setIsMentor] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    async function fetchGroups(search: string, others: any): Promise<any> {
        const filterQuery = search ? { search: search, ...others } : others;

        return findGroupApi({ filterQuery: filterQuery, options: { pagination: false } })
            .then((response: any) => response.result)
            .then((body: PageData<Group>) =>
                body?.docs.map((major: Group) => ({
                    label: major.name,
                    value: major._id,
                })),
            );
    }

    useEffect(() => {
        if (id && type == TYPE_FORM_ENUM.EDIT) {
            setTitle('Chỉnh sửa nhóm');

            const getUserDetail = async () => {
                const res = await detailUserApi(id);

                const { result, status } = res;

                if (status && result) {
                    setDefaultValues(result);

                    setIsMentor(result.isMentor);

                    if (result.role.includes(RoleEnum.ADMIN)) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                }
            };

            getUserDetail();
        }

        const fetchGroupOption = async () => {
            const res = await fetchGroups('', {});

            setGroupOptions(res);
        };

        fetchGroupOption();
    }, [id]);

    useEffect(() => {
        form.setFieldsValue(defaultValues);
    }, [defaultValues, form]);

    const handelOnFinish = async (values: any) => {
        const query = values;
        let response;
        let message;

        if (id && type === TYPE_FORM_ENUM.EDIT) {
            response = await updateUserApi(id, query);
            message = 'Cập nhật thành công';
        } else {
            response = await createUserApi(query);
            message = 'Thêm mới thành công';
        }

        if (response.status) {
            $message.success(message);
            closeForm();
            form.resetFields();
        }
    };

    const onFailed = () => {
        $message.error('Vui lòng điền đầy đủ thông tin');
    };

    return (
        <Drawer
            title={title}
            width={720}
            onClose={closeForm}
            open={isShowForm}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Space>
                    <Button onClick={closeForm}>Hủy</Button>
                    <Button onClick={() => form.submit()} type="primary">
                        {title}
                    </Button>
                </Space>
            }
        >
            <MyForm form={form} layout="vertical" onFinish={handelOnFinish} onFinishFailed={onFailed}>
                <Row gutter={10}>
                    <Col span={12}>
                        <MyFormItem
                            label="Họ tên"
                            name="fullName"
                            type="input"
                            innerProps={{ placeholder: 'Nhập tên đầy đủ', allowClear: true }}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label="Email"
                            name="email"
                            type="input"
                            innerProps={{ placeholder: 'Nhập email', allowClear: true }}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label="Số điện thoại"
                            name="phoneNumber"
                            type="input"
                            innerProps={{ placeholder: 'Nhập số điện thoại', allowClear: true }}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label="Chức vụ"
                            name="role"
                            type="select"
                            innerProps={{ placeholder: 'Chọn chức vụ', allowClear: true, mode: 'multiple' }}
                            options={RoleOptions}
                            required
                            onChange={(values: RoleEnum) => {
                                if (values.includes(RoleEnum.ADMIN)) {
                                    setIsAdmin(true);
                                }
                            }}
                        />
                    </Col>
                    {isAdmin && (
                        <>
                            <Col span={12}>
                                <MyFormItem
                                    label="Nhóm & Quyền"
                                    name="groupId"
                                    type="select"
                                    innerProps={{ placeholder: 'Chọn nhóm', allowClear: true }}
                                    options={groupOptions}
                                    required
                                />
                            </Col>
                        </>
                    )}

                    {type === TYPE_FORM_ENUM.CREATE && (
                        <>
                            <Col span={12}>
                                <MyFormItem
                                    label="Mật khẩu"
                                    name="password"
                                    type="input"
                                    innerProps={{ placeholder: 'Nhập mật khẩu', allowClear: true }}
                                    required
                                />
                            </Col>
                            <Col span={12}>
                                <MyFormItem
                                    label="Nhập lại mật khẩu"
                                    name="confirmPassword"
                                    type="input"
                                    innerProps={{
                                        placeholder: 'Nhập mật khẩu',
                                        allowClear: true,
                                    }}
                                    required
                                    rules={[
                                        {
                                            validator: async (_: any, value: string) => {
                                                if (!value || form.getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(new Error('Mật khẩu không khớp'));
                                            },
                                        },
                                    ]}
                                />
                            </Col>
                        </>
                    )}

                    <Col span={24}>
                        <MyFormItem
                            label="Giảng viên"
                            name="isMentor"
                            type="switch"
                            onChange={(value: boolean) => {
                                setIsMentor(value);
                            }}
                            innerProps={{ checked: isMentor }}
                        />
                    </Col>
                    {isMentor && (
                        <>
                            <Col span={24}>
                                <MyFormItem
                                    label="CCCD"
                                    name="cccd"
                                    type="input"
                                    required={isMentor}
                                    innerProps={{ placeholder: 'Nhập CCCD', allowClear: true }}
                                />
                            </Col>
                            <Col span={24}>
                                <MyFormItem
                                    label="Hộ chiếu"
                                    name="passport"
                                    type="input"
                                    required={isMentor}
                                    innerProps={{ placeholder: 'Nhập hộ chiếu', allowClear: true }}
                                />
                            </Col>

                            <Col span={24}>
                                <MyFormItem
                                    label="Video giới thiệu"
                                    name="coverUrl"
                                    type="input"
                                    innerProps={{ placeholder: 'Nhập video giới thiệu', allowClear: true }}
                                />
                            </Col>
                        </>
                    )}
                </Row>
            </MyForm>
        </Drawer>
    );
};

export default FormComponent;
