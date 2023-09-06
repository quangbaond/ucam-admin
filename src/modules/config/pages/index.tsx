import type { UploadFile } from 'antd';

import './index.less';

import { Button, Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';

import { settings } from '@/api/const';
import { callbackApi } from '@/common';
import MyForm from '@/components/core/form';
import { ConfigEnum } from '@/const';
import { getConfigApi, updateConfigApi } from '@/pages/configs/api';

import ConfigContact from '../components/contacts';
import ConfigPartner from '../components/partners';
import ConfigSystem from '../components/systems';

interface Props {
    type: ConfigEnum;
}

const ConfigForm = (props: Props) => {
    const { type } = props;
    const [configs, setConfigs] = useState<any>({});
    const [form] = MyForm.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await getConfigApi();

                callbackApi(response, 'Lấy dữ liệu thành công', () => {
                    setConfigs(response.result);
                    form.setFieldsValue(response.result);

                    if (response.result.logos) {
                        setFileList(
                            response.result.logos.map((logo: string) => {
                                return {
                                    name: logo.replace(`${settings.FILE_URL}/upload/images/`, ''),
                                    status: 'done',
                                    url: logo,
                                };
                            }),
                        );
                    }
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async () => {
        const values = await form.validateFields();

        const response: any = await updateConfigApi(configs._id, values);

        callbackApi(response, 'Lưu dữ liệu thành công', () => {
            setConfigs(response.result);
        });
    };

    const handleCalcel = async () => {
        window.location.reload();
    };

    const render = () => {
        switch (type) {
            case ConfigEnum.CONTACT:
                return (
                    <Card
                        title="Cấu hình trang web"
                        hoverable
                        extra={
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Button type="primary" onClick={handleSubmit}>
                                        Cập nhật
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button type={'default'}>Cancel</Button>
                                </Col>
                            </Row>
                        }
                    >
                        <ConfigContact form={form} />
                    </Card>
                );
            case ConfigEnum.SYSTEM:
                return (
                    <Card
                        title="Cấu hình hệ thống"
                        hoverable
                        extra={
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Button type="primary" onClick={handleSubmit}>
                                        Cập nhật
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button type={'default'}>Cancel</Button>
                                </Col>
                            </Row>
                        }
                    >
                        <ConfigSystem form={form} />
                    </Card>
                );
            case ConfigEnum.PARTNER:
                return (
                    <Card
                        title="Cấu hình đối tác"
                        hoverable
                        extra={
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Button type="primary" onClick={handleSubmit}>
                                        Cập nhật
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button type={'default'} onClick={handleCalcel}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        }
                    >
                        <ConfigPartner form={form} fileList={fileList} setFileList={setFileList} />
                    </Card>
                );
        }
    };

    return <>{render()}</>;
};

export default ConfigForm;
