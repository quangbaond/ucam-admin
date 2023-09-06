import type { IUpdateFormProps } from '../dto';
import type { PageData } from '@/interface';
import type { Education } from '@/interface/educations';
import type { Major } from '@/interface/major';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, message as $message, message, Modal, Row, Space } from 'antd';
import { useEffect, useState } from 'react';

import { settings } from '@/api/const';
import { cropOptions } from '@/common';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { EducationTypeEnum, SchoolOptions } from '@/interface';
import { useLocale } from '@/locales';
import { findMajorApi } from '@/modules/majors/api';

import { createEducationApi, getEducationApi, updateEducationApi } from '../api';

const { TextArea } = Input;

const FormComponent = (props: IUpdateFormProps) => {
    const { isShowForm, closeForm, type, id } = props;
    const [form] = Form.useForm();
    const [defaultValues, setDefaultValues] = useState<Education>();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [majorOptions, setMajorOptions] = useState();
    const [educationType, setEducationType] = useState<EducationTypeEnum>(EducationTypeEnum.UNIVERSITY);

    const [uploadedFile, setUploadedFile] = useState<UploadFile>();
    const { formatMessage } = useLocale();

    const handlePreviewUpload = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const onClose = (reload: boolean | null) => {
        closeForm(reload);
    };

    const handelSubmit = () => {
        form.submit();
    };

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error: any) => reject(error);
        });
    const handleCancel = () => setPreviewOpen(false);
    const propsImageDocument: UploadProps = {
        name: 'image',
        accept: 'image/*',
        listType: 'picture-card',
        action: `${settings.FILE_URL}/upload/large-image`,
        maxCount: 1,
        onChange(info: any) {
            const { status } = info.file;

            setFileList(info.fileList);

            if (status === 'done') {
                $message.success(`Tải file ${info.file.name} thành công.`);
                setUploadedFile(info.file.response);
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
        onRemove() {
            setUploadedFile(undefined);
            form.setFieldValue('coverMedia', undefined);
        },
    };
    const uploadButton = (
        <div>
            <PlusOutlined />
        </div>
    );

    useEffect(() => {
        if (type == 'update' && id) {
            const getDetail = async () => {
                const res = await getEducationApi(id);

                if (res.status) {
                    setDefaultValues(res.result);
                    setEducationType(res.result.educationType);
                    setFileList([
                        {
                            uid: '1',
                            name: 'image.png',
                            status: 'done',
                            url: settings.FILE_URL + '/' + res.result.logo,
                        },
                    ]);
                }
            };

            getDetail();
        }
    }, [id, type]);

    useEffect(() => {
        if (defaultValues && id && majorOptions) {
            form.setFieldsValue({
                ...defaultValues,
                educationType: educationType,
                majors: defaultValues?.majors
                    ? defaultValues?.majors.map((major: Major) => {
                          return {
                              label: major.name,
                              value: major._id,
                          };
                      })
                    : [],
                coverMedia: {
                    file: {
                        response: {
                            url: defaultValues.logo,
                            name: defaultValues.name,
                            status: 'done',
                            uid: defaultValues._id,
                        },
                    },
                },
            });
        }
    }, [defaultValues, id, majorOptions]);

    async function fetchMajor(search: string, others: any): Promise<any> {
        const filterQuery = search ? { search: search, ...others } : others;

        return findMajorApi({ filterQuery: filterQuery, options: { pagination: false } })
            .then((response: any) => response.result)
            .then((body: PageData<Major>) =>
                body?.docs.map((major: Major) => ({
                    label: major.name,
                    value: major._id,
                })),
            );
    }

    useEffect(() => {
        const fetchMajorOption = async () => {
            const res = await fetchMajor('', { educationType: educationType });

            setMajorOptions(res);
        };

        if (educationType) {
            form.setFieldsValue({
                majors: [],
            });
            fetchMajorOption();
        }
    }, [educationType]);

    const handelOnFinish = async (values: any) => {
        const query = values;

        query.logo = uploadedFile && uploadedFile.url ? uploadedFile.url : undefined;

        query.majors = query.majors.length > 0 ? query.majors.map((major: any) => major.value) : [];

        delete query.coverMedia;
        const res = type === 'create' ? await createEducationApi(query) : await updateEducationApi(id, query);

        if (res.status) {
            $message.success('Cập nhật trường học thành công');
            form.resetFields();
        }

        onClose(true);
    };

    const onFailed = () => {
        message.error('Vui lòng điền đầy đủ thông tin rồi thử lại!');
    };

    return (
        <Drawer
            title="Thêm mới trường học"
            width={'50%'}
            onClose={() => onClose(null)}
            open={isShowForm}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Space>
                    <Button onClick={() => onClose(null)}>Hủy</Button>
                    <Button onClick={() => handelSubmit()} type="primary">
                        {type === 'create' ? 'Thêm mới' : 'Cập nhật'}
                    </Button>
                </Space>
            }
        >
            <MyForm form={form} layout="vertical" onFinish={handelOnFinish} onFinishFailed={onFailed}>
                <Row gutter={10} style={{ padding: '15px' }}>
                    <Col span={12}>
                        <MyFormItem
                            label="Tên đầy đủ"
                            name="name"
                            type="input"
                            innerProps={{ placeholder: 'Nhập tên đầy đủ', allowClear: true }}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label="Tên viết tắt"
                            name="shortName"
                            type="input"
                            innerProps={{ placeholder: 'Nhập tên viết tắt', allowClear: true }}
                            required
                        />
                    </Col>

                    <Col span={19}>
                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                        >
                            <TextArea placeholder="Nhập địa chỉ" rows={5} />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <MyFormItem
                            label="Logo trường học"
                            name="coverMedia"
                            type="upload"
                            cropOptions={cropOptions}
                            uploadProps={{
                                ...propsImageDocument,
                                fileList: fileList,
                                onPreview: handlePreviewUpload,
                            }}
                            uploadButton={uploadedFile?.url !== undefined || fileList.length >= 1 ? null : uploadButton}
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label="Số điện thoại"
                            name="phoneNumber"
                            type="input"
                            innerProps={{ placeholder: 'Nhập số điện thoại', allowClear: true }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại',
                                },
                                {
                                    pattern: /(84|0[3|5|7|8|9])+([0-9]{8,9})\b/,
                                    message: 'Số điện thoại không đúng định dạng',
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <MyFormItem
                            label={formatMessage({ id: 'component.search.educationType' })}
                            type="select"
                            name="educationType"
                            options={SchoolOptions}
                            initialValue={educationType}
                            required
                            onChange={(_: any, value: any) => {
                                setEducationType(value.value);
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <MyFormItem
                            label="Chuyên ngành"
                            name="majors"
                            options={majorOptions}
                            type="select-debounce"
                            fetchOptions={fetchMajor}
                            innerProps={{
                                placeholder: 'Chọn chuyên ngành',
                                allowClear: true,
                                maxTagCount: 'responsive',
                                mode: 'multiple',
                            }}
                        />
                    </Col>
                </Row>
            </MyForm>

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Drawer>
    );
};

export default FormComponent;
