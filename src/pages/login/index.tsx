import type { LoginParams } from '@/modules/users/dto/login';

import './index.less';

import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, message as $message } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';

import { LocaleFormatter, useLocale } from '@/locales';

import { loginAsync } from '../../stores/user.action';

const initialValues: LoginParams = {
    account: '',
    password: '',
    remember: true,
    isAdmin: true,
};

const LoginForm: React.FC = () => {
    const dispatch = useDispatch();
    const { formatMessage } = useLocale();

    const onFinished = async (form: LoginParams) => {
        form.isAdmin = true;
        const res: any = await dispatch(loginAsync(form));

        if (res) {
            window.location.reload();

            return;
        }

        $message.error(formatMessage({ id: 'gloabal.tips.loginFailed' }), 1.5);
    };

    return (
        <div className="login-page">
            <Card
                title="Mentorz ADMIN"
                bordered={true}
                hoverable
                actions={[
                    <>
                        @2023 <Button type="link"> Hi-Blue JSC</Button>
                    </>,
                ]}
            >
                <Form<LoginParams> onFinish={onFinished} className="login-page-form" initialValues={initialValues}>
                    <Form.Item
                        name="account"
                        rules={[
                            {
                                required: true,
                                message: formatMessage({
                                    id: 'gloabal.tips.enterEmailMessage',
                                }),
                            },
                            {
                                pattern: /^([a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$)/,
                                message: 'Email không đúng định dạng',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder={formatMessage({
                                id: 'gloabal.tips.email',
                            })}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: formatMessage({
                                    id: 'gloabal.tips.enterPasswordMessage',
                                }),
                            },
                            {
                                pattern:   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,16}$/,
                                message: 'Mật khẩu không đúng định dạng',
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder={formatMessage({
                                id: 'gloabal.tips.password',
                            })}
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>
                            <LocaleFormatter id="gloabal.tips.rememberUser" />
                        </Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary" className="login-page-form_button">
                            <LocaleFormatter id="gloabal.tips.login" />
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginForm;
