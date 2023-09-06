import type { SelectOptions } from '@/components/core/form-item';
import type { PageData } from '@/interface';
import type { Education } from '@/interface/educations';
import type { FormProps } from '@/modules/banners/dto';
import type { Subject } from '@/modules/subjects/dto';
import type { User } from '@/modules/users/dto/login';
import type { UploadFile, UploadProps } from 'antd';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Row } from 'antd';
import { useEffect, useState } from 'react';

import { settings } from '@/api/const';
import { callbackApi, callbackUpload } from '@/common';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import { EducationTypeEnum, SchoolOptions } from '@/interface';
import { createMentorIntroduceApi, getDetailMentorIntroduceApi, updateMentorIntroduceApi } from '@/modules/banners/api';
import { findEducationsApi } from '@/modules/educations/api';
import { findSubjectsApi } from '@/modules/subjects/api';
import { findUsersApi } from '@/modules/users/api';

const Form = (props: FormProps) => {
    const { onClose, open, type, id } = props;
    const [form] = MyForm.useForm();
    const [paginationUser, setPaginationUser] = useState<any>({
        page: 1,
        limit: 10,
    });
    const [userOptions, setUserOptions] = useState<SelectOptions[]>([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [educationOptions, setEducationOptions] = useState<{ label: string; value: string }[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [educationType, setEducationType] = useState<EducationTypeEnum>(EducationTypeEnum.UNIVERSITY);
    const selectAll = [{ label: 'Chọn Tất cả', value: 'ALL' }];

    const propsImage: UploadProps = {
        accept: 'image/*',
        name: 'attachment',
        multiple: true,
        maxCount: 1,
        listType: 'picture-card',
        action: `${settings.FILE_URL}/upload/attachments`,
        onChange(info) {
            const { status } = info.file;

            setFileList(info.fileList);
            callbackUpload(status, 'Tải file thành công', 'Tải file không thành công', () => {
                form.setFieldValue('mentorImage', info.file.response[0]);
            });
        },
    };

    async function fetchUsers(search: string, options: any): Promise<any> {
        const filterQuery = search ? { search: search, isMentor: true } : { isMentor: true };
        const pagination = search ? { page: 1, limit: 10 } : options;

        return findUsersApi({ filterQuery: filterQuery, options: pagination })
            .then((response: any) => response.result)
            .then((body) =>
                body.docs.reduce(function (ids: SelectOptions[], user: User) {
                    ids.push({
                        label: `${user.fullName} - ${user.email}`,
                        value: user._id,
                    });

                    return ids;
                }, []),
            );
    }

    async function fetchSubjects(search: string): Promise<any> {
        const filterQuery = {
            search: search ? search : undefined,
            educationType: educationType,
        };

        return findSubjectsApi({ filterQuery: filterQuery, options: { pagination: false } })
            .then((response: any) => response.result)
            .then((body: PageData<Subject>) =>
                body.docs.map((subject: Subject) => ({
                    label: subject.name,
                    value: subject._id,
                })),
            );
    }

    async function fetchEducation(search: string): Promise<any> {
        const filterQuery = {
            search: search ? search : undefined,
            educationType: educationType,
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
        if (type === 'update' && id) {
            const getDetail = async () => {
                const res = await getDetailMentorIntroduceApi(id);
                const { status, result } = res;

                if (status) {
                    form.setFieldsValue(result);
                    setFileList([
                        {
                            status: 'done',
                            uid: '1',
                            url: settings.FILE_URL + '/' + result?.mentorImage,
                            name: 'image',
                        },
                    ]);
                }
            };

            getDetail();
        }
    }, [id, type]);

    useEffect(() => {
        const fetchUserOptions = async () => {
            const res = await fetchUsers('', paginationUser);

            setUserOptions([...userOptions, ...res]);
        };

        fetchUserOptions().then((r) => {});
    }, [paginationUser]);

    useEffect(() => {
        const fetchSubjectOption = async (): Promise<void> => {
            const res = await fetchSubjects('');

            setSubjectOptions(res);
        };

        const fetchEducationOption = async (): Promise<void> => {
            const res = await fetchEducation('');
            const options = selectAll.concat(res);

            setEducationOptions(options);
        };

        fetchSubjectOption().then((r) => {});
        fetchEducationOption().then((r) => {});
    }, [educationType]);

    const handleFinish = async (values: any) => {
        const query = values;

        query.subjectId = values.subjectId.value;
        query.mentorId = values.mentorId.value;
        query.educations = values.educations.some((e: any) => e.value === 'ALL')
            ? educationOptions.map((item: any) => {
                  if (item.value !== 'ALL') return item.value;
              })
            : values.educations.map((e: any) => (e.value ? e.value : e));

        console.log(values);
        query.mentorImage = values?.mentorImage ? values.mentorImage.url : undefined;
        delete query.educationType;

        if (query.educations.length && query.educations[0] == undefined) {
            query.educations.shift();
        }

        console.log(query);
        const res: any =
            type === 'create' ? await createMentorIntroduceApi(query) : await updateMentorIntroduceApi(id, query);
        const message = type === 'create' ? 'Thêm mới thành công' : 'Chỉnh sửa thành công';

        callbackApi(res, message, () => {
            onClose(true);
            form.resetFields();
        });
    };

    return (
        <>
            <Drawer
                title={type === 'create' ? 'Thêm mới' : 'Chỉnh sửa'}
                placement="right"
                onClose={() => {
                    onClose(null);
                }}
                open={open}
                width={750}
                extra={
                    <Button type={'primary'} onClick={() => form.submit()}>
                        {type === 'create' ? 'Thêm mới' : 'Chỉnh sửa'}
                    </Button>
                }
            >
                <MyForm layout={'vertical'} form={form} onFinish={handleFinish}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <MyFormItem
                                label={'Chọn Mentor'}
                                type="select-debounce"
                                name="mentorId"
                                options={userOptions}
                                fetchOptions={fetchUsers}
                                required
                                innerProps={{
                                    placeholder: 'Chọn Mentor',
                                    allowClear: true,
                                    showSearch: true,
                                }}
                                onPopupScroll={(e: any) => {
                                    if (e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight) {
                                        setPaginationUser({
                                            ...paginationUser,
                                            page: paginationUser.page + 1,
                                        });
                                    }
                                }}
                            />
                        </Col>
                        <Col span={12}>
                            <MyFormItem
                                label={'Chọn khối trường'}
                                type="select"
                                name="educationType"
                                options={SchoolOptions}
                                innerProps={{
                                    allowClear: true,
                                    placeholder: 'Chọn khối trường',
                                }}
                                initialValue={SchoolOptions[0].value}
                                required
                                onChange={(value: EducationTypeEnum) => {
                                    setEducationType(value);
                                    form.resetFields(['subjectId', 'educations']);
                                }}
                            />
                        </Col>
                        <Col span={12}>
                            <MyFormItem
                                label={'Chọn môn học'}
                                type="select-debounce"
                                name="subjectId"
                                options={subjectOptions}
                                fetchOptions={fetchSubjects}
                                required
                                innerProps={{
                                    placeholder: 'Chọn môn học',
                                    allowClear: true,
                                    showSearch: true,
                                }}
                            />
                        </Col>
                        <Col span={24}>
                            <MyFormItem
                                label={'Chọn trường học'}
                                type="select-debounce"
                                name="educations"
                                options={educationOptions}
                                fetchOptions={fetchEducation}
                                required
                                innerProps={{
                                    placeholder: 'Chọn trường học',
                                    allowClear: true,
                                    showSearch: true,
                                    mode: 'multiple',
                                    maxTagCount: 'responsive',
                                }}
                            />
                        </Col>
                        <Col span={8}>
                            <MyFormItem
                                label={'Ảnh Mentor'}
                                type="upload"
                                name="mentorImage"
                                required
                                uploadProps={{ ...propsImage, fileList }}
                                uploadButton={
                                    fileList.length >= 1 ? null : (
                                        <div>
                                            <PlusOutlined />
                                        </div>
                                    )
                                }
                            />
                        </Col>
                        <Col span={24}>
                            <MyFormItem
                                name="descriptions"
                                label="Nội dung giới thiệu"
                                type="editor"
                                required
                                innerProps={{ data: form.getFieldValue('descriptions') }}
                                setData={(data: any) => {
                                    form.setFieldsValue({ descriptions: data });
                                }}
                            ></MyFormItem>
                        </Col>
                    </Row>
                </MyForm>
            </Drawer>
        </>
    );
};

export default Form;
