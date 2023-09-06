import type { RoleEnum } from '@/interface/';

import { FacebookFilled, InstagramFilled, YoutubeFilled } from '@ant-design/icons';
import { Button, Card, Col, Drawer, Form, Input, message as $message, Row, Select, Space, Switch } from 'antd';
import { useEffect, useState } from 'react';

import Avator from '@/assets/header/avator.jpeg';
import { planOptions, RoleOptions, SchoolOptions } from '@/interface/';
import { detailUserApi, updateUserApi } from '@/modules/users/api';

interface IUpdateUserFormProps {
    isShowForm: boolean;
    id: string;
    closeForm: () => void;
}
interface UserFormUpdateProps {
    fullName: string;
    email: string;
    phoneNumber: string;
    educationType: string;
    role: RoleEnum[];
    plan: string[];
    isMentor: boolean;
    accountStatus: string | boolean;
}

const updateUserForm = (props: IUpdateUserFormProps) => {
    const { isShowForm, id, closeForm } = props;
    const [defaultValues, setDefaultValues] = useState<any>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (id) {
            const getUserDetail = async () => {
                const res = await detailUserApi(id);

                const { result, status } = res;

                if (status && result) {
                    setDefaultValues(result);
                }
            };

            getUserDetail();
        }
    }, [id]);

    useEffect(() => {
        form.setFieldsValue(defaultValues);
    }, [defaultValues, form]);

    const onClose = () => {
        closeForm();
    };

    const handelOnFinish = async (values: UserFormUpdateProps) => {
        const query = values;

        // query.accountStatus = values.accountStatus ? 'ACTIVE' : 'INACTIVE';
        const respone = await updateUserApi(id, query);

        if (respone.status) {
            $message.success('Cập nhật thành công');
            onClose();
        }
    };

    return (
        <Drawer
            title="Cập nhật thông tin"
            width={720}
            onClose={onClose}
            open={isShowForm}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Space>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button onClick={() => form.submit()} type="primary">
                        Cập nhật
                    </Button>
                </Space>
            }
        >
            <Form initialValues={defaultValues} form={form} layout="vertical" onFinish={handelOnFinish}>
                <Row gutter={10} style={{ padding: '15px' }}>
                    {/* <Col span={24} md={24} lg={24}>
                        <Row gutter={10}>
                            <Col span={24}>
                                <Card title={defaultValues.fullName} className="user_info">
                                    <Row>
                                        <Col span={24}>
                                            <img
                                                style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                                                src={defaultValues.avatarUrl || Avator}
                                                alt={defaultValues.fullName}
                                            />
                                        </Col>
                                        <Col span={24}>
                                            {defaultValues.social &&
                                                defaultValues.social.length > 0 &&
                                                defaultValues.social.map((social: any) => (
                                                    <>
                                                        <a href={social.url} style={{ display: 'block' }}>
                                                            {social.type === 'Facebook' && (
                                                                <>
                                                                    <FacebookFilled
                                                                        style={{ color: '#3b5998', marginRight: '5px' }}
                                                                    />
                                                                </>
                                                            )}
                                                            {social.type === 'Instagram' && (
                                                                <>
                                                                    <InstagramFilled
                                                                        style={{ color: '#dd4b39', marginRight: '5px' }}
                                                                    />
                                                                </>
                                                            )}
                                                            {social.type === 'Youtube' && (
                                                                <>
                                                                    <YoutubeFilled
                                                                        style={{ color: '#1da1f2', marginRight: '5px' }}
                                                                    />
                                                                </>
                                                            )}
                                                            {social.type === 'TikTok' && (
                                                                <>
                                                                    <YoutubeFilled
                                                                        style={{ color: '#1da1f2', marginRight: '5px' }}
                                                                    />
                                                                </>
                                                            )}
                                                            {social.url}
                                                        </a>
                                                    </>
                                                ))}
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col> */}
                    <Col className="form" span={24} md={24} lg={24}>
                        <Row gutter={10}>
                            <Col span={12}>
                                <Form.Item
                                    name="fullName"
                                    label="Họ tên"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập họ tên',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Họ tên" allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập email',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Email không đúng định dạng',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Email" allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="phoneNumber"
                                    label="Số điện thoại"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số điện thoại',
                                        },
                                        {
                                            pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                                            message: 'Số điện thoại không đúng định dạng',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Số điện thoại" allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="role"
                                    label="Quyền"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn quyền',
                                        },
                                    ]}
                                >
                                    <Select
                                        maxTagCount={'responsive'}
                                        mode="multiple"
                                        placeholder="Chọn quyền"
                                        options={RoleOptions}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="isMentor" label="Mentor">
                                    <Switch defaultChecked={defaultValues.isMentor} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default updateUserForm;
