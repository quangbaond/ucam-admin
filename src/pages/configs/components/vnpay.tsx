import type { FC } from 'react';

import { Card, Col, Row } from 'antd';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';

// import './index.less';

const ConfigVnPay: FC = () => {
    const [form] = MyForm.useForm();

    return (
        <div>
            <MyForm form={form} layout="vertical">
                <Row gutter={16} style={{ margin: 'auto', width: '50%' }}>
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
            </MyForm>
        </div>
    );
};

export default ConfigVnPay;
