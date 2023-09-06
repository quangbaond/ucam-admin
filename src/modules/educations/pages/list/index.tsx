import type { IListProps, ParamSearch } from '../../dto';
import type { MyPageTableOptions } from '@/components/business/page';
import type { Education } from '@/interface/educations';

import { FormOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { message as $message, Popconfirm, Space, Switch, Tag, Tooltip } from 'antd';
import { useMemo, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

import MyPage from '@/components/business/page';
import { EducationTypeEnum, EducationTypeTextEnum, StatusEnum } from '@/interface';
import CategoryDrawer from '@/modules/categories/components/drawer';

import { deleteEducationApi, findEducationsApi, updateEducationApi } from '../../api';
import Filter from '../../components/filter';
import UploadFile from '../../components/UploadFile';

const EducationList = (props: IListProps) => {
    const { resetForm, handelUpdate } = props;
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [educationId, setEducationId] = useState<string>('');
    const [educationType, setEducationType] = useState<EducationTypeEnum>(EducationTypeEnum.UNIVERSITY);

    const [openUpload, setOpenUpload] = useState<boolean>(false);

    const handelUpdateEdu = (userId: string) => {
        handelUpdate(userId);
    };

    const tableColumns: MyPageTableOptions<Education> = [
        {
            title: 'Tên đầy đủ',
            key: '_id',
            dataIndex: 'name',
            width: '20%',
            align: 'left' as const,
        },
        {
            title: 'Tên viết tắt',
            key: '_id',
            dataIndex: 'shortName',
            align: 'left' as const,
            width: '10%',
        },
        {
            title: 'Địa chỉ',
            key: '_id',
            dataIndex: 'address',
            align: 'left' as const,
            width: '20%',
        },
        {
            title: 'Số điện thoại',
            key: '_id',
            dataIndex: 'phoneNumber',
            align: 'left' as const,
            width: '10%',
        },
        {
            title: 'Số chuyên ngành',
            key: '_id',
            dataIndex: 'countMajors',
            align: 'left' as const,
            width: '10%',
        },
        {
            title: 'Số môn học',
            key: '_id',
            dataIndex: 'countSubjects',
            align: 'left' as const,
            width: '10%',
        },
        {
            title: 'Số sinh viên',
            key: '_id',
            dataIndex: 'countStudents',
            align: 'left' as const,
            width: '10%',
        },
        {
            title: 'Khối trường',
            key: '_id',
            width: '25%',
            align: 'left' as const,
            dataIndex: 'educationType',
            render: (educationType: EducationTypeEnum) => {
                let color = 'green';
                let text = EducationTypeTextEnum.UNIVERSITY;

                if (educationType === EducationTypeEnum.UNIVERSITY) {
                    color = 'blue';
                    text = EducationTypeTextEnum.UNIVERSITY;
                } else if (educationType === EducationTypeEnum.HIGH_SCHOOL) {
                    color = 'green';
                    text = EducationTypeTextEnum.HIGH_SCHOOL;
                } else {
                    color = 'green';
                    text = EducationTypeTextEnum.HIGH_SCHOOL;
                }

                return (
                    <>
                        <Tag color={color} key={educationType}>
                            {text}
                        </Tag>
                    </>
                );
            },
        },
        {
            title: 'Trạng thái',
            key: '_id',
            dataIndex: 'status',
            align: 'center' as const,
            width: '15%',
            render: (status: string, record: Education) => (
                <>
                    {status === StatusEnum.ACTIVE ? (
                        <Switch
                            defaultChecked
                            onClick={(checked: boolean, _) => {
                                updateEducationStatus(checked, record._id as string);
                            }}
                        />
                    ) : (
                        <Switch
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            onClick={(checked: boolean, _) => {
                                updateEducationStatus(checked, record._id as string);
                            }}
                        />
                    )}
                </>
            ),
        },
        {
            title: 'Hành động',
            key: '_id',
            align: 'center' as const,
            render: (record: Education) => (
                <div>
                    <Space size="small">
                        <Tooltip placement="top" title="Nhập môn học">
                            <FormOutlined
                                className="icon-button"
                                onClick={() => {
                                    setEducationId(record._id);
                                    setOpenUpload(true);
                                }}
                            />
                        </Tooltip>
                        <Tooltip placement="top" title="Chỉnh sửa trường học">
                            <AiOutlineEdit className="icon-button" onClick={() => handelUpdateEdu(record._id)} />
                        </Tooltip>
                        <Tooltip placement="top" title="Xem danh sách môn học">
                            <UnorderedListOutlined
                                className="icon-button"
                                onClick={() => {
                                    setOpenDrawer(true);
                                    setEducationType(record.educationType);
                                    setEducationId(record._id);
                                }}
                            />
                        </Tooltip>
                        <Popconfirm
                            placement="right"
                            title={'Xác nhận xoá bản ghi?'}
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() => deleteSchool(record._id)}
                        >
                            <Tooltip placement="top" title="Xóa trường học">
                                <AiOutlineDelete className="icon-button-delete icon-button" />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                </div>
            ),
        },
    ];

    const updateEducationStatus = async (checked: boolean, id: string) => {
        const status = checked ? StatusEnum.ACTIVE : StatusEnum.INACTIVE;
        const res = await updateEducationApi(id, { status: status });

        if (res) {
            $message.success('Cập nhật trạng thái khoá học thành công');
        }
    };

    const [paramSearch, setParamSearch] = useState<ParamSearch | null>(null);

    const deleteSchool = async (id: string) => {
        const res = await deleteEducationApi(id);

        if (res.status) {
            setParamSearch({
                ...paramSearch,
            });
            $message.success('Xoá bản ghi thành công');
        }
    };

    const handelSearchUser = (value: ParamSearch | null) => {
        if (value) {
            setParamSearch(value);
        }
    };

    const tableData = useMemo(() => {
        if (!paramSearch) return null;

        return <MyPage pageApi={findEducationsApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch, resetForm]);
    const filter = useMemo(() => {
        return <Filter onSearch={handelSearchUser} resetForm={resetForm} />;
    }, [resetForm]);

    return (
        <>
            {filter} {tableData}
            {educationId && (
                <CategoryDrawer
                    refresh={() => {
                        setParamSearch({
                            ...paramSearch,
                        });
                        setEducationId('');
                    }}
                    educationId={educationId}
                    educationType={educationType}
                    openDrawer={openDrawer}
                    setOpenDrawer={setOpenDrawer}
                />
            )}
            {educationId && openUpload && (
                <UploadFile
                    testId={educationId}
                    isModalOpen={openUpload}
                    setIsModalOpen={setOpenUpload}
                    refreshTable={() => {
                        setParamSearch({
                            ...paramSearch,
                        });
                    }}
                />
            )}
        </>
    );
};

export default EducationList;
