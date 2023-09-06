import type { IConfigProps } from '../dto';

import { Button, Card, Col, Row } from 'antd';
import { useEffect } from 'react';

import { settings } from '@/api/const';
import { callbackApi } from '@/common';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';

import { createConfigApi, getConfigApi } from '../api';

// import './index.less';

const ConfigSystem = (props: IConfigProps) => {
    const { handleNextStep } = props;
    const [form] = MyForm.useForm();

    useEffect(() => {
        const findSystemConfig = async () => {
            const res: any = await getConfigApi();

            callbackApi(res, 'Lấy thông tin thành công.', () => {
                if (res.result) {
                    form.setFieldsValue(res.result?.systemConfigs);
                }
            });
        };

        findSystemConfig();
    }, []);

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        const res: any = await createConfigApi({
            systemConfigs: values,
        });

        callbackApi(res, 'Cấu hình thành công. Vui lòng đợi tải trang.', () => {
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        });
    };

    return (
        <div>
            <MyForm form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16} style={{ margin: 'auto', width: '50%' }}>
                    <Col span={12}>
                        <MyFormItem
                            label="Domain"
                            name="domain"
                            type="input"
                            required
                            innerProps={{ placeHolder: `${'https://smarlms.online'}` }}
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label="Đường dẫn tải file"
                            name="uploadApi"
                            type="input"
                            required
                            innerProps={{ placeHolder: `${settings.FILE_URL}` }}
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label="Email"
                            name="senderEmail"
                            type="input"
                            required
                            innerProps={{ placeHolder: `${'hiblue.techvn@gmail.com'}` }}
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem label="Email client ID" name="senderClientId" type="input" required />
                    </Col>
                    <Col span={12}>
                        <MyFormItem label="Email client secret" name="senderClientSecret" type="input" required />
                    </Col>
                    <Col span={12}>
                        <MyFormItem label="Email refresh token" name="senderRefreshToken" type="input" required />
                    </Col>
                    <Col span={12}>
                        <MyFormItem label="VNPAY TMN CODE" name="vnpTmnCode" type="input" required />
                    </Col>
                    <Col span={12}>
                        <MyFormItem label="VNPAY HASHSECRET" name="vnpHashSecret" type="input" required />
                    </Col>
                    <Col span={12}>
                        <MyFormItem label="VNPAY URL" name="vnpUrl" type="input" required />
                    </Col>
                    <Col span={12}>
                        <MyFormItem label="VNPAY RETURN URL" name="vnpReturnUrl" type="input" required />
                    </Col>
                    <Col span={12}>
                        <MyFormItem label="VNPAY VERSION" name="vnpVersion" type="input" required />
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary">Quay lại</Button>
                        <Button type="primary" htmlType="submit">
                            Tiếp tục
                        </Button>
                    </Col>
                </Row>
            </MyForm>
        </div>
    );
};

export default ConfigSystem;
