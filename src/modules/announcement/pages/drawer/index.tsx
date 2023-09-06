import type { PageData } from '@/interface';
import type { Education } from '@/interface/educations';

import { Button, Col, Drawer, Form, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';

import { findEducationsApi } from '@/api/educations';
import { callbackApi } from '@/common';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';

import { createAnnouncementApi, updateAnnouncementApi } from '../../api';

const AnnouncementFrom = (props: any): React.ReactElement => {
    const { onClose, open, setParamSearch, paramSearch, type, announcementData } = props;
    const [educationOptions, setEducationOptions] = useState<{ label: string; value: string }[]>([]);
    const [content, setContent] = useState<string>('');
    const [form] = Form.useForm();
    const selectAll = [{ label: 'Chọn Tất cả', value: 'ALL' }];

    useEffect(() => {
        if (announcementData) {
            form.setFieldsValue(announcementData);
            setContent(announcementData.content);
        } else {
            setContent('');
        }
    }, [announcementData, form]);

    const onFinish = async (values: any) => {
        const query = values;

        query.educations = values.educations.some((e: any) => e.value === 'ALL')
            ? educationOptions.map((item: any) => {
                  if (item.value !== 'ALL') return item.value;
              })
            : values.educations.map((e: any) => (e.value ? e.value : e));

        if (query.educations.length && query.educations[0] == undefined) {
            query.educations.shift();
        }

        if (content) {
            query.content = content;
        }

        const response: any =
            type === 'create'
                ? await createAnnouncementApi(query)
                : await updateAnnouncementApi(announcementData._id, query);
        const message = type === 'update' ? 'Chỉnh sửa thành công' : 'Thêm mới thành công';

        callbackApi(response, message, () => {
            setParamSearch({
                ...paramSearch,
            });
            onClose();
            form.resetFields();
            setContent('');
        });
    };

    const onPressClose = () => {
        form.resetFields();
        onClose();
    };

    async function fetchEducation(search: string): Promise<any> {
        const filterQuery = {
            search: search ? search : undefined,
        };

        return findEducationsApi({ filterQuery: filterQuery, options: { pagination: false } })
            .then((response: any) => response.result)
            .then((body: PageData<Education>) =>
                body.docs.map((edu: Education) => ({
                    label: edu.name,
                    value: edu._id,
                })),
            );
    }

    useEffect(() => {
        const fetchEducationOption = async (): Promise<void> => {
            const res = await fetchEducation('');
            const options = selectAll.concat(res);

            setEducationOptions(options);
        };

        fetchEducationOption();
    }, []);

    return (
        <>
            <Drawer
                title={type === 'create' ? 'Thêm nội dung mới' : 'Chỉnh sửa nội dung'}
                width={750}
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
                <MyForm onFinish={onFinish} form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <MyFormItem
                                name="title"
                                label="Tiêu đề"
                                type="input"
                                innerProps={{
                                    allowClear: true,
                                    placeholder: 'Vui lòng nhập tiêu đề',
                                }}
                            />
                        </Col>
                        <Col span={12}>
                            <MyFormItem
                                name="educations"
                                label="Chọn trường học"
                                type="select-debounce"
                                innerProps={{
                                    mode: 'multiple',
                                    allowClear: true,
                                    placeholder: 'Vui lòng chọn trường học',
                                    maxTagCount: 'responsive',
                                }}
                                options={educationOptions}
                                fetchOptions={fetchEducation}
                                required
                            />
                        </Col>
                    </Row>

                    <MyFormItem
                        label="Nội dung"
                        type="editor"
                        required
                        name="editor-1"
                        innerProps={{ data: content }}
                        setData={setContent}
                    />
                </MyForm>
            </Drawer>
        </>
    );
};

export default AnnouncementFrom;
