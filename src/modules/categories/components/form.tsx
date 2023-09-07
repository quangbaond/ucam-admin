import type { Category, ICategoryParams, IFormCategoryProps } from '../dto';

import { Button, Col, Drawer, Row } from 'antd';
import { useEffect, useState } from 'react';

import { callbackApi } from '@/common';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';

import { createCategoryApi, findAllCategoryApi, getCategoryDetailApi, updateCategoryApi } from '../api';

const FormCategory = (props: IFormCategoryProps) => {
    const { open, onClose, type, id } = props;
    const [form] = MyForm.useForm();
    const [categoryList, setCategoryList] = useState<any>([
        {
            key: 1,
            label: 'Danh muc',
        },
    ]);

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
                    form.setFieldsValue({ name: result.name });
                }
            };

            getDetailCategory();
        }

        const getCategories = async () => {
            const res = await findAllCategoryApi({
                filterQuery: { parentId: null },
                options: { pagination: false },
            });

            if (res.status) {
                setCategoryList(
                    res.result?.docs.map((category: Category) => ({
                        label: category.name,
                        value: category._id,
                    })),
                );
            }
        };

        getCategories();
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
                            name="parentId"
                            label="Danh mục lớn"
                            type="select"
                            options={categoryList}
                        ></MyFormItem>
                    </Col>
                </Row>
            </MyForm>
        </Drawer>
    );
};

export default FormCategory;
