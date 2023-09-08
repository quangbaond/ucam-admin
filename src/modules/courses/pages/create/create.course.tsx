import type { PageData } from '@/interface';
import type { Education } from '@/interface/educations';
import type { Category } from '@/modules/categories/dto';
import type { Subject } from '@/modules/subjects/dto';
import type { User } from '@/modules/users/dto/login';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

import './index.less';

import { PlusOutlined } from '@ant-design/icons';
import { Col, message as $message, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';

import { settings } from '@/api/const';
import { findEducationsApi } from '@/api/educations';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { EducationTypeEnum, PlanEnum, planOptions, SchoolOptions } from '@/interface';
import { useLocale } from '@/locales';
import { findAllCategoryApi } from '@/modules/categories/api';
import { findSubjectsApi } from '@/modules/subjects/api';
import { findUsersApi } from '@/modules/users/api';

interface CreateCourseProps {
    form: any;
    setDescriptions: any;
    setEducations: any;
    imageUrl: string;
}

const CreateCourseForm = (props: CreateCourseProps) => {
    const { form, setDescriptions, setEducations, imageUrl } = props;

    const { formatMessage } = useLocale();

    const [educationType, setEducationType] = useState(EducationTypeEnum.UNIVERSITY);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [subjectOptions, setSubjectOptions] = useState();
    const [mentorOptions, setMentorOptions] = useState();
    const [educationOptions, setEducationOptions] = useState();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const dateInWeek = [
        {
            label: 'Thứ 2',
            value: 1,
        },
        {
            label: 'Thứ 3',
            value: 2,
        },
        {
            label: 'Thứ 4',
            value: 3,
        },
        {
            label: 'Thứ 5',
            value: 4,
        },
        {
            label: 'Thứ 6',
            value: 5,
        },
        {
            label: 'Thứ 7',
            value: 6,
        },
        {
            label: 'Chủ nhật',
            value: 0,
        },
    ];

    const [typePlan, setTypePlan] = useState<PlanEnum>(PlanEnum.FREE);

    useEffect(() => {
        if (form.getFieldValue('plan')) {
            setTypePlan(form.getFieldValue('plan') === PlanEnum.FREE ? PlanEnum.FREE : PlanEnum.PREMIUM);
        }
    }, [form.getFieldValue('plan')]);

    const selectAll = [{ label: 'Tất cả', value: 'ALL' }];
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
        multiple: true,
        maxCount: 1,
        listType: 'picture-card',
        action: `${settings.FILE_URL}/upload/large-image`,
        onChange(info) {
            const { status } = info.file;

            setFileList(info.fileList);

            if (status === 'done') {
                $message.success(`Tải file ${info.file.name} thành công.`);
                form.setFieldValue('coverMedia', info);
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

    const uploadButton = (
        <div>
            <PlusOutlined />
        </div>
    );

    async function fetchCategory(search: string, others: any): Promise<any> {
        const filterQuery = search ? { search: search, ...others } : others;

        return findAllCategoryApi({ filterQuery: filterQuery, options: { pagination: false } })
            .then((response: any) => response.result)
            .then((body: PageData<Category>) =>
                body.docs.map((category: Category) => ({
                    label: category.name,
                    value: category._id,
                })),
            );
    }

    async function fetchMentorList(search: string): Promise<any> {
        const filterQuery = search ? { search: search, isMentor: true } : { isMentor: true };

        return findUsersApi({ filterQuery: filterQuery, options: { pagination: false } })
            .then((response: any) => response.result)
            .then((body: PageData<User>) =>
                body.docs.map((user: User) => ({
                    label: user.fullName,
                    value: user._id,
                })),
            );
    }

    useEffect(() => {
        const fetchCategoryOption = async () => {
            const res = await fetchCategory('', {});

            setSubjectOptions(res);
        };

        const fetchMentorOption = async () => {
            const res = await fetchMentorList('');

            setMentorOptions(res);
        };

        fetchCategoryOption();
        fetchMentorOption();
    }, [educationType]);

    useEffect(() => {
        if (imageUrl) {
            setFileList([
                {
                    uid: '1',
                    name: 'image.png',
                    status: 'done',
                    url: settings.FILE_URL + '/' + imageUrl,
                },
            ]);
        }
    }, [imageUrl]);

    const propsImageCrop = {
        aspect: 2 / 1,
        rotationSlider: true,
        cropShape: 'rect',
    };

    return (
        <div className="course-create-page">
            <MyForm form={form} layout="vertical">
                <Row gutter={10}>
                    <Col span={16}>
                        <Row gutter={30}>
                            <Col span={6}>
                                <MyFormItem
                                    label={formatMessage({ id: 'component.search.plan' })}
                                    type="select"
                                    name="plan"
                                    options={planOptions}
                                    initialValue={PlanEnum.FREE}
                                    required
                                    onChange={(value: PlanEnum) => {
                                        setTypePlan(value);
                                        form.setFieldValue('cost', undefined);
                                    }}
                                />
                            </Col>
                            <Col span={3}>
                                <MyFormItem
                                    label={'Số tiền'}
                                    type="input-number"
                                    name="cost"
                                    required={typePlan === PlanEnum.PREMIUM}
                                    innerProps={{ min: 1, disabled: typePlan === PlanEnum.FREE }}
                                />
                            </Col>
                            <Col span={9}>
                                <MyFormItem
                                    label={formatMessage({ id: 'component.search.title' })}
                                    type="input"
                                    name="name"
                                    innerProps={{ placeholder: 'Nhập tiêu đề khoá học', allowClear: true }}
                                    required
                                />
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={9}>
                                <MyFormItem
                                    label={formatMessage({ id: 'component.search.subject' })}
                                    name="categoryId"
                                    options={subjectOptions}
                                    type="select-debounce"
                                    fetchOptions={fetchCategory}
                                    innerProps={{ placeholder: 'Chọn danh mục', allowClear: true }}
                                    required
                                />
                            </Col>
                            <Col span={9}>
                                <MyFormItem
                                    label={formatMessage({ id: 'component.search.mentor' })}
                                    name="mentor"
                                    options={mentorOptions}
                                    type="select-debounce"
                                    fetchOptions={fetchMentorList}
                                    innerProps={{ placeholder: 'Chọn mentor', allowClear: true, showSearch: true }}
                                    required
                                />
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={6}>
                                <MyFormItem
                                    label={'Ngày khai giảng'}
                                    name="startDate"
                                    type="date"
                                    innerProps={{ placeholder: 'Nhập ngày khai giảng', allowClear: true }}
                                    required
                                />
                            </Col>
                            <Col span={18}>
                                <MyFormItem
                                    label={'Schedules'}
                                    name="schedules"
                                    type="checkbox"
                                    options={dateInWeek}
                                    innerProps={{ placeholder: 'Schedules' }}
                                    required
                                />
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={6}>
                                <MyFormItem
                                    label={'Bắt đầu'}
                                    name="startAt"
                                    type="time"
                                    innerProps={{ placeholder: 'Thời gian bắt đầu', allowClear: true }}
                                    required
                                />
                            </Col>
                            <Col span={18}>
                                <MyFormItem
                                    label={'Kết thúc'}
                                    name="endAt"
                                    type="time"
                                    innerProps={{ placeholder: 'Thời gian kết thúc', allowClear: true }}
                                    required
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={4}>
                        <MyFormItem
                            label="Ảnh khoá học"
                            name="coverMedia"
                            type="upload-image-crop"
                            uploadProps={{ ...propsImageDocument, fileList: fileList }}
                            cropOptions={propsImageCrop}
                            uploadButton={fileList.length >= 1 ? null : uploadButton}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <MyFormItem
                            label={formatMessage({ id: 'component.search.description' })}
                            type="editor"
                            name="editor-1"
                            innerProps={{ data: form.getFieldValue('descriptions') }}
                            setData={setDescriptions}
                        />
                    </Col>
                </Row>
            </MyForm>

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default CreateCourseForm;
