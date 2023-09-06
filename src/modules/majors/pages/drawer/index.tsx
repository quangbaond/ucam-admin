import type { Major } from '@/interface/major';

import { Button, Drawer, Form, Input, notification, Select, Space } from 'antd';
import React, { useEffect } from 'react';

import { SchoolOptions } from '@/interface';

import { createMajorApi, updateMajorApi } from '../../api';

const MajorForm = (props: any): React.ReactElement => {
    const { onClose, open, setParamSearch, paramSearch, type, majorData } = props;
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(majorData);
    }, [majorData, form]);

    const onFinish = async (values: Major) => {
        if (type === 'create') {
            const res = await createMajorApi(values);

            if (res.status) {
                setParamSearch({
                    ...paramSearch,
                });
                onClose();
                api.success({
                    message: `Thêm mới thành công `,
                });
            }
        } else {
            const res = await updateMajorApi(majorData._id, values);

            if (res.status) {
                setParamSearch({
                    ...paramSearch,
                });
                onClose();
                api.success({
                    message: `Chỉnh sửa thành công `,
                });
            }
        }

        form.resetFields();
    };

    const onPressClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <>
            <Drawer
                title={type === 'create' ? 'Thêm chuyên ngành mới' : 'Chỉnh sửa chuyên ngành'}
                width={500}
                placement="right"
                onClose={onPressClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onPressClose}>Hủy</Button>
                        <Button onClick={() => form.submit()} type="primary">
                            Hoàn tất
                        </Button>
                    </Space>
                }
            >
                <Form name="validate_other" onFinish={onFinish} form={form}>
                    <Form.Item
                        name={['name']}
                        label="Tên chuyên ngành:"
                        rules={[{ required: true, message: 'Vui lòng nhập tên chuyên ngành' }]}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Input placeholder="Nhập tên chuyên ngành" />
                    </Form.Item>
                    <Form.Item
                        name={['educationType']}
                        label="Khối trường"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn khối trường để tiếp tục!',
                            },
                        ]}
                    >
                        <Select placeholder="Chọn khối trường" options={SchoolOptions} />
                    </Form.Item>
                </Form>
                {contextHolder}
            </Drawer>
        </>
    );
};

export default MajorForm;
