import type { ConfigFormProps } from '../dto';

import { Col, Row } from 'antd';

import { settings } from '@/api/const';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';

const ConfigSystem = (props: ConfigFormProps) => {
    const { form } = props;

    return (
        <div className="config">
            <MyForm form={form} layout="vertical">
                <Row gutter={10}>
                    <Col span={6}>
                        <MyFormItem
                            label="Domain"
                            name={['systemConfigs', 'domain']}
                            type="input"
                            required
                            innerProps={{ placeHolder: `${'https://smarlms.online'}` }}
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            label="Đường dẫn tải file"
                            name={['systemConfigs', 'uploadApi']}
                            type="input"
                            required
                            innerProps={{ placeHolder: `${settings.FILE_URL}` }}
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            label="Email"
                            name={['systemConfigs', 'senderEmail']}
                            type="input"
                            required
                            innerProps={{ placeHolder: `${'hiblue.techvn@gmail.com'}` }}
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            label="Email client ID"
                            name={['systemConfigs', 'senderClientId']}
                            type="input"
                            required
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            label="Email client secret"
                            name={['systemConfigs', 'senderClientSecret']}
                            type="input"
                            required
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            label="Email refresh token"
                            name={['systemConfigs', 'senderRefreshToken']}
                            type="input"
                            required
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            label="VNPAY TMN CODE"
                            name={['systemConfigs', 'vnpTmnCode']}
                            type="input"
                            required
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            label="VNPAY HASHSECRET"
                            name={['systemConfigs', 'vnpHashSecret']}
                            type="input"
                            required
                        />
                    </Col>
                    <Col span={6}>
                        <MyFormItem label="VNPAY URL" name={['systemConfigs', 'vnpUrl']} type="input" required />
                    </Col>
                    <Col span={6}>
                        <MyFormItem
                            label="VNPAY VERSION"
                            name={['systemConfigs', 'vnpVersion']}
                            type="input"
                            required
                        />
                    </Col>
                </Row>
            </MyForm>
        </div>
    );
};

export default ConfigSystem;
