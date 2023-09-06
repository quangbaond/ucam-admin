import type { steps } from '@/interface';
import type { FC } from 'react';

import './index.less';

import { BankOutlined, FileSyncOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Row, Steps } from 'antd';
import { useState } from 'react';

import { settings } from '@/api/const';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';

import ConfigAccount from './components/account';
import ConfigSystem from './components/system';
import ConfigVnPay from './components/vnpay';

const Configs: FC = () => {
    const [form] = MyForm.useForm();
    const steps: steps[] = [
        {
            title: 'Tài khoản',
            icon: <UserOutlined />,
        },
        {
            title: 'Hệ thống',
            icon: <FileSyncOutlined />,
        },
    ];
    const [current, setCurrent] = useState<number>(0);

    return (
        <div>
            <Card title="Cấu hình trang web">
                <Steps
                    size="small"
                    current={current}
                    items={steps}
                    style={{ width: '70%', margin: 'auto', padding: '20px 0' }}
                />
                {current === 0 && (
                    <ConfigAccount
                        handleNextStep={() => {
                            setCurrent(cur => cur + 1);
                        }}
                    />
                )}
                {current === 1 && (
                    <ConfigSystem
                        handleNextStep={() => {
                            setCurrent(cur => cur + 1);
                        }}
                    />
                )}
            </Card>
        </div>
    );
};

export default Configs;
