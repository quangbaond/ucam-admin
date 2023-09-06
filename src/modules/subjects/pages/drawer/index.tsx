import type { UploadFile, UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';

import './index.less';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, message, Modal, notification, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';

import { settings } from '@/api/const';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { EducationTypeEnum, SchoolOptions } from '@/interface';
import { useLocale } from '@/locales';

import { createSubjectApi, updateSubjectApi } from '../../api';

const SubjectForm = (props: any): React.ReactElement => {
    const { formatMessage } = useLocale();

    const { onClose, open, setParamSearch, paramSearch, type, subjectData } = props;
    const [api, contextHolder] = notification.useNotification();
    const [form] = MyForm.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedFile, setUploadedFile] = useState<UploadFile>();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [descriptions, setDescriptions] = useState('');

    useEffect(() => {
        if (type === 'update') {
            setFileList([
                {
                    uid: '1',
                    name: 'image.png',
                    status: 'done',
                    url: settings.FILE_URL + '/' + subjectData.image,
                },
            ]);
        } else {
            setFileList([]);
        }

        form.setFieldsValue(subjectData);
    }, [subjectData, form]);

    const propsImageDocument: UploadProps = {
        name: 'image',
        multiple: false,
        listType: 'picture-card',
        maxCount: 1,
        action: settings.FILE_URL + '/upload/image',
        onChange(info) {
            const { status } = info.file;

            setFileList(info.fileList);

            if (status === 'done') {
                message.success(`Tải file ${info.file.name} thành công.`);

                setUploadedFile(info.file.response);
            } else if (status === 'error') {
                message.error(`Tải file ${info.file.name} thất bại.`);
            }
        },
        async onPreview(file: UploadFile) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj as RcFile);
            }

            setPreviewImage(file.url || (file.preview as string));
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
        },
        onRemove() {
            setUploadedFile(undefined);
        },
    };
    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    const handleCancel = () => setPreviewOpen(false);

    const createSubject = async () => {
        const values = await form.validateFields();

        const payload = {
            name: values.name,
            educationType: values.educationType,
            image: uploadedFile?.url as string,
            description: descriptions,
        };

        if (type === 'create') {
            const res = await createSubjectApi(payload);

            if (res.status) {
                setParamSearch({
                    ...paramSearch,
                });
                onPressClose();
                api.success({
                    message: `Thêm mới thành công `,
                });
            }
        } else {
            const res = await updateSubjectApi(subjectData._id, payload);

            if (res.status) {
                setParamSearch({
                    ...paramSearch,
                });
                onPressClose();
                api.success({
                    message: `Chỉnh sửa thành công `,
                });
            }
        }

        setFileList([]);
        form.resetFields();
    };

    const onPressClose = () => {
        form.resetFields();
        setFileList([]);

        onClose();
    };

    const propsImageCrop = {
        aspect: 2 / 1,
        rotationSlider: true,
        cropShape: 'rect',
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
        </div>
    );

    return (
        <>
            <Drawer
                title={type === 'create' ? 'Thêm môn học mới' : 'Chỉnh sửa môn học'}
                width={'50%'}
                placement="right"
                onClose={onPressClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onPressClose}>Hủy</Button>
                        <Button onClick={createSubject} type="primary">
                            Cập nhật
                        </Button>
                    </Space>
                }
            >
                <MyForm form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={18}>
                            <Row>
                                <Col span={24}>
                                    <MyFormItem
                                        label={formatMessage({ id: 'component.search.educationType' })}
                                        type="select"
                                        name="educationType"
                                        options={SchoolOptions}
                                        initialValue={EducationTypeEnum.UNIVERSITY}
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <MyFormItem
                                        label={formatMessage({ id: 'component.search.title' })}
                                        type="input"
                                        name="name"
                                        innerProps={{ placeholder: 'Nhập tiêu đề khoá học', allowClear: true }}
                                        required
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <MyFormItem
                                label="Ảnh môn học"
                                name="image"
                                type="upload-image-crop"
                                uploadProps={{ ...propsImageDocument, fileList: fileList }}
                                cropOptions={propsImageCrop}
                                uploadButton={fileList.length >= 1 ? null : uploadButton}
                            />
                        </Col>
                    </Row>
                    <Row>
                        {' '}
                        <Col span={24}>
                            <MyFormItem
                                label={formatMessage({ id: 'component.search.description' })}
                                type="editor"
                                name="editor-1"
                                innerProps={{ data: form.getFieldValue('description') }}
                                setData={setDescriptions}
                            />
                        </Col>
                    </Row>
                </MyForm>
                {contextHolder}
            </Drawer>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default SubjectForm;
