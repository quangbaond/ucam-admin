import type { IConfigProps } from '../dto';

import { Button, Col, Row } from 'antd';
import { useEffect } from 'react';

import { callbackApi } from '@/common';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { RoleEnum } from '@/interface';
import { checkAdmin, createUserApi } from '@/modules/users/api';

const ConfigAccount = (props: IConfigProps) => {
    const { handleNextStep } = props;
    const [form] = MyForm.useForm();

    useEffect(() => {
        const findUserAdmin = async () => {
            const res: any = await checkAdmin();

            callbackApi(res, 'Lấy thông tin thành công.', () => {
                if (res.status) {
                    handleNextStep();
                }
            });
        };

        findUserAdmin();
    }, []);

    const onFinish = async (values: any) => {
        values.role = [RoleEnum.ADMIN];
        const response: any = await createUserApi(values);

        callbackApi(response, 'Tạo tài khoản thành công.', () => {
            handleNextStep();
        });
    };

    return (
        <div>
            <MyForm form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16} style={{ margin: 'auto', width: '50%' }}>
                    <Col span={24}>
                        <MyFormItem
                            label="Họ Tên"
                            name="fullName"
                            type="input"
                            required
                            innerProps={{ placeHolder: 'Nhập họ tên', allowClear: true }}
                        />
                    </Col>
                    <Col span={24}>
                        <MyFormItem
                            label="Email"
                            name="email"
                            type="input"
                            required
                            innerProps={{ placeHolder: 'Nhập email', allowClear: true }}
                        />
                    </Col>
                    <Col span={24}>
                        <MyFormItem
                            label="Số điện thoại"
                            name="phoneNumber"
                            type="input"
                            required
                            innerProps={{ placeHolder: 'Nhập số điện thoại', allowClear: true }}
                        />
                    </Col>
                    <Col span={24}>
                        <MyFormItem
                            label="Mật khẩu"
                            name="password"
                            type="input-password"
                            required
                            innerProps={{ placeHolder: 'Nhập mật khẩu', allowClear: true }}
                        />
                    </Col>
                    <Col span={24}>
                        <MyFormItem
                            label="Nhập lại mật khẩu"
                            name="confirmPassword"
                            type="input-password"
                            required
                            innerProps={{ placeHolder: 'Nhập lại mật khẩu', allowClear: true }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập lại mật khẩu',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value !== form.getFieldValue('password')) {
                                            callback('Mật khẩu không khớp');
                                        }

                                        callback();
                                    },
                                },
                            ]}
                        />
                    </Col>
                    <Row style={{ width: '100%', justifyContent: 'end' }}>
                        <Col span={3}>
                            <Button htmlType="submit" type="primary">
                                Tiếp tục
                            </Button>
                        </Col>
                    </Row>
                </Row>
            </MyForm>
        </div>
    );
};

export default ConfigAccount;
