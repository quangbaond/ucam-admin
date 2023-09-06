import type { ConfigFormProps } from '../dto';
import type { FormListFieldData, UploadFile, UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, message as $message, Modal, Row } from 'antd';
import { useState } from 'react';

import { settings } from '@/api/const';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';

const ConfigPartner = (props: ConfigFormProps) => {
    const { form, fileList, setFileList } = props;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error: any) => reject(error);
        });

    const propsImageDocument: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture',
        action: `${settings.FILE_URL}/upload/large-image`,
        onChange(info) {
            const { status } = info.file;

            setFileList(info.fileList);

            if (status === 'done' || status == 'removed') {
                form.setFieldValue(
                    'logos',
                    info.fileList.map((file: UploadFile) =>
                        file.response ? `${settings.FILE_URL}/${file.response.url}` : file.url,
                    ),
                );
            } else if (status === 'error') {
                $message.error(`Tải file ${info.file.name} thất bại.`);
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
    };

    return (
        <div className="config">
            <MyForm layout="vertical" form={form}>
                <Row gutter={16}>
                    <Col span={16}>
                        <h3>Đối tác</h3>
                        <MyForm.List name="partners">
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map((field: FormListFieldData) => (
                                        <MyFormItem required={false} key={field.key}>
                                            <Row gutter={8}>
                                                <Col span={8}>
                                                    <MyFormItem
                                                        {...field}
                                                        required={true}
                                                        key={field.key}
                                                        name={[field.name, 'name']}
                                                        style={{ marginBottom: '-5px' }}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        label="Tên đối tác"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                whitespace: true,
                                                                message: 'Vui lòng nhập tên đối tác.',
                                                            },
                                                        ]}
                                                        innerProps={{ placeholder: 'Tên đối tác' }}
                                                        type="input"
                                                    />
                                                </Col>
                                                <Col span={8}>
                                                    <MyFormItem
                                                        {...field}
                                                        required
                                                        key={field.key}
                                                        name={[field.name, 'email']}
                                                        style={{ marginBottom: '-5px' }}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        label="Email"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                whitespace: true,
                                                                message: 'Vui lòng nhập email đối tác.',
                                                            },
                                                        ]}
                                                        innerProps={{ placeholder: 'Email liên hệ' }}
                                                        type="input"
                                                    />
                                                </Col>
                                                <Col span={7}>
                                                    <MyFormItem
                                                        {...field}
                                                        required
                                                        key={field.key}
                                                        name={[field.name, 'phoneNumber']}
                                                        style={{ marginBottom: '-5px' }}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        label="Số điện thoại"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                whitespace: true,
                                                                message: 'Vui lòng nhập số điện thoại.',
                                                            },
                                                        ]}
                                                        innerProps={{ placeholder: 'Số điện thoại liên hệ' }}
                                                        type="input"
                                                    />
                                                </Col>
                                                <Col span={1}>
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        style={{
                                                            color: 'red',
                                                            paddingTop: '38px',
                                                        }}
                                                        onClick={() => remove(field.name)}
                                                    />
                                                </Col>
                                            </Row>
                                            <MyForm.ErrorList errors={errors} />
                                        </MyFormItem>
                                    ))}
                                    <Row gutter={8}>
                                        <Col span={8}>
                                            <Button
                                                type="dashed"
                                                style={{
                                                    width: '100%',
                                                }}
                                                onClick={() => add()}
                                                icon={<PlusOutlined />}
                                            >
                                                Thêm đối tác mới
                                            </Button>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </MyForm.List>
                    </Col>
                    <Col span={8}>
                        <h3>Logo các trường hợp tác</h3>
                        <MyFormItem
                            name="logos"
                            type="upload"
                            uploadProps={{
                                ...propsImageDocument,
                                fileList: fileList,
                            }}
                            uploadButton={
                                <Button
                                    type="dashed"
                                    style={{
                                        width: '100%',
                                    }}
                                    icon={<PlusOutlined />}
                                >
                                    Thêm mới logo
                                </Button>
                            }
                        />
                    </Col>
                </Row>
            </MyForm>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default ConfigPartner;
