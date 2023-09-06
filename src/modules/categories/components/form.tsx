import type { ICategoryParams, IFormCategoryProps } from '../dto';

import { Button, Col, Drawer, Row } from 'antd';
import { useEffect } from 'react';

import { callbackApi } from '@/common';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { SchoolOptions } from '@/interface';

import { createCategoryApi, getCategoryDetailApi, updateCategoryApi } from '../api';

const FormCategory = (props: IFormCategoryProps) => {
    const { open, onClose, type, id } = props;
    const [form] = MyForm.useForm();

    const onFinish = async (values: ICategoryParams) => {
        const response: any = type === 'create' ? await createCategoryApi(values) : await updateCategoryApi(id, values);

        const message = type === 'create' ? 'Thêm mới thành công' : 'Cập nhật thành công';

        callbackApi(response, message, () => {
            onClose(true);
            form.resetFields();
        });
    };

    useEffect(() => {
        if (type === 'update' && id) {
            const getDetailCategory = async () => {
                const payload = {
                    filterQuery: {},
                    options: {
                        pagination: false,
                    },
                };
                const response: any = await getCategoryDetailApi(id, payload);

                const { status, result } = response;

                if (status) {
                    form.setFieldsValue({
                        name: result.name,
                        educationType: result.educationType,
                        position: result.position,
                    });
                }
            };

            getDetailCategory();
        }
    }, [type, id]);

    return (
        <Drawer
            title={type == 'create' ? 'Thêm mới danh mục' : 'Chỉnh sửa danh mục'}
            placement="right"
            width={750}
            onClose={() => onClose(false)}
            open={open}
            extra={
                <Button type="primary" onClick={() => form.submit()}>
                    {type == 'create' ? 'Thêm mới' : 'Cập nhật'}
                </Button>
            }
        >
            <MyForm onFinish={onFinish} form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <MyFormItem name="name" label="Tên danh mục" required type="input"></MyFormItem>
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            name="educationType"
                            label="Khối trường"
                            required
                            type="select"
                            options={SchoolOptions}
                            initialValue={SchoolOptions[0].value}
                        ></MyFormItem>
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            name="position"
                            label="Thứ tự hiển thị"
                            required
                            type="input-number"
                            innerProps={{ min: 0 }}
                        ></MyFormItem>
                    </Col>
                </Row>
            </MyForm>
        </Drawer>
    );
};

export default FormCategory;
