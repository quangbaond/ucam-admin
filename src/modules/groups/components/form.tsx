import { Button, Col, Drawer, Form, message as $message, Row, Space } from 'antd';
import { useEffect, useState } from 'react';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { MODULE_GROUP, TYPE_FORM_ENUM } from '@/interface/';

import { createGroupApi, detailGroupApi, updateGroupApi } from '../api';

interface IFormProps {
    isShowForm: boolean;
    id: string;
    closeForm: () => void;
    type: TYPE_FORM_ENUM;
}

const FormComponent = (props: IFormProps) => {
    const { isShowForm, id, closeForm, type } = props;
    const [defaultValues, setDefaultValues] = useState<any>([]);
    const [form] = Form.useForm();
    const [title, setTitle] = useState<string>('Thêm mới nhóm');

    useEffect(() => {
        if (id && type == TYPE_FORM_ENUM.EDIT) {
            setTitle('Chỉnh sửa nhóm');

            const getUserDetail = async () => {
                const res = await detailGroupApi(id);

                const { result, status } = res;

                if (status && result) {
                    setDefaultValues(result);
                    result.permissions.map((item: any) => {
                        form.setFieldsValue({
                            [item.name]: item.permissions,
                        });

                        return result;
                    });
                }
            };

            getUserDetail();
        }
    }, [id]);

    useEffect(() => {
        form.setFieldsValue(defaultValues);
    }, [defaultValues, form]);

    const handelOnFinish = async (values: any) => {
        const query = values;
        let response;
        let message;

        const permissions: any = [];

        MODULE_GROUP.forEach((item, i) => {
            if (query[item.key]) {
                permissions.push({
                    name: item.key,
                    permissions: query[item.key],
                });
                delete query[item.key];
            }
        });
        query.permissions = permissions;

        if (id && type === TYPE_FORM_ENUM.EDIT) {
            response = await updateGroupApi(id, query);
            message = 'Cập nhật thành công';
        } else {
            response = await createGroupApi(query);
            message = 'Thêm mới thành công';
        }

        if (response.status) {
            $message.success(message);
            closeForm();
            form.resetFields();
        }
    };

    const onFailed = () => {
        $message.error('Vui lòng điền đầy đủ thông tin');
    };

    return (
        <Drawer
            title={title}
            width={720}
            onClose={closeForm}
            open={isShowForm}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Space>
                    <Button onClick={closeForm}>Hủy</Button>
                    <Button onClick={() => form.submit()} type="primary">
                        {title}
                    </Button>
                </Space>
            }
        >
            <MyForm form={form} layout="vertical" onFinish={handelOnFinish} onFinishFailed={onFailed}>
                <Row gutter={16}>
                    <Col span={24}>
                        <MyFormItem
                            label="Tên nhóm"
                            name="name"
                            type="input"
                            innerProps={{ placeholder: 'Nhập tên đầy đủ', allowClear: true }}
                            required
                        />
                    </Col>
                    {MODULE_GROUP.map((item, i) => {
                        return (
                            <Col span={24}>
                                <MyFormItem
                                    label={item.label}
                                    name={item.key}
                                    type="select"
                                    innerProps={{ placeholder: 'Chọn quyền', allowClear: true, mode: 'multiple' }}
                                    options={item.permissions}
                                />
                            </Col>
                        );
                    })}
                </Row>
            </MyForm>
        </Drawer>
    );
};

export default FormComponent;
