import type { ChangePasswordForm, ChangePasswordProps } from '../const';

import { LockOutlined } from '@ant-design/icons';
import { Form, Input, message as $message, Modal } from 'antd';

import { changePasswordApi } from '@/modules/users/api';

const ModalChangePassword = (props: ChangePasswordProps) => {
    const { dataModalChangePassword, successChangePassword } = props;
    const [form] = Form.useForm();
    const rexge = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

    return (
        <Modal
            title={`Đổi mật khẩu: ${dataModalChangePassword.name}`}
            open={dataModalChangePassword.isShowModal}
            onOk={() => {
                form.validateFields().then(async (values: ChangePasswordForm) => {
                    values.isAdmin = true;
                    const res = await changePasswordApi(values, dataModalChangePassword.email);

                    if (res.status) {
                        $message.success('Đổi mật khẩu thành công');
                        form.resetFields();
                        successChangePassword();
                    }
                });
            }}
            onCancel={() => {
                form.resetFields();
                successChangePassword();
            }}
            okText="Đổi mật khẩu"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Mật khẩu mới"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu mới',
                        },
                        {
                            pattern: rexge,
                            message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
                        },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
                <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu mới',
                        },
                        {
                            validator: (rule, value) => {
                                if (value !== form.getFieldValue('password')) {
                                    return Promise.reject('Mật khẩu không khớp');
                                }

                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalChangePassword;
