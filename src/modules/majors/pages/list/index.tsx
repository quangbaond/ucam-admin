import type { MyPageTableOptions } from '@/components/business/page';
import type { Major } from '@/interface/major';

import { Button, Card, message, Popconfirm, Space, Switch, Tag } from 'antd';
import React, { useMemo, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

import MyPage from '@/components/business/page';
import { EducationTypeEnum, EducationTypeTextEnum, StatusEnum } from '@/interface';
import FilterUser from '@/modules/users/pages/list/filterUser';

import { deleteMajorApi, findMajorApi, getDetailMajorApi, updateMajorApi } from '../../api';
import MajorForm from '../drawer';

const MajorList: React.FC = () => {
    const tableColumns: MyPageTableOptions<Major> = [
        {
            title: 'Tên chuyên ngành',
            key: '_id',
            dataIndex: 'name',
        },
        {
            title: 'Khối trường',
            dataIndex: 'educationType',
            key: '_id',
            align: 'center',
            width: '10%',
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
            dataIndex: 'status',
            key: '_id',
            align: 'center',
            width: '10%',
            render: (status: string, record: Major) => (
                <>
                    {status === StatusEnum.ACTIVE ? (
                        <Switch
                            defaultChecked
                            onClick={(checked: boolean, _) => {
                                updateMajorStatus(checked, record._id as string);
                            }}
                        />
                    ) : (
                        <Switch
                            onClick={(checked: boolean, _) => {
                                updateMajorStatus(checked, record._id as string);
                            }}
                        />
                    )}
                </>
            ),
        },
        {
            title: 'Hành động',
            key: '_id',
            align: 'center',
            width: '15%',
            render: (_, record) => (
                <div className="display-center">
                    <Space size="middle">
                        <AiOutlineEdit className="icon-button" onClick={event => getSubjectId(event, record)} />

                        <Popconfirm
                            placement="right"
                            title={'Xác nhận xoá bản ghi?'}
                            okText="Có"
                            cancelText="Không"
                            onConfirm={event => deleteSubject(event, record)}
                        >
                            <AiOutlineDelete className="icon-button-delete icon-button" />
                        </Popconfirm>
                    </Space>
                </div>
            ),
        },
    ];

    const updateMajorStatus = async (checked: boolean, id: string) => {
        const status = checked ? StatusEnum.ACTIVE : StatusEnum.INACTIVE;
        const res = await updateMajorApi(id, { status: status });

        if (res) {
            message.success('Cập nhật trạng thái thành công');
        }
    };

    const dispatch = useDispatch();
    const [paramSearch, setParamSearch] = useState<object | null>(null);
    const [resetForm, setResetForm] = useState(true);
    const [typeBtn, setTypeBtn] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [majorData, setMajorData] = useState<object>({});

    const deleteSubject = (e: any, value: Major) => {
        const deleteExamById = async () => {
            const response: any = await deleteMajorApi(value._id);

            if (response.message === 'success') {
                setParamSearch({
                    ...paramSearch,
                });
                message.success('Xóa môn học thành công!');
            } else {
                message.error(`Lỗi! - ${response.message}`);
            }
        };

        dispatch(deleteExamById);
    };

    const handelSearchMajor = (value: object) => {
        setParamSearch(value);
    };

    const tableData = useMemo(() => {
        if (!paramSearch) return null;

        return <MyPage pageApi={findMajorApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch]);
    const filterUser = useMemo(() => {
        return <FilterUser onSearch={handelSearchMajor} resetForm={resetForm} />;
    }, [resetForm]);

    const onPressCreate = () => {
        setOpenCreate(true);
        setTypeBtn('create');
    };

    const onPressUpdate = () => {
        setOpenUpdate(true);
        setTypeBtn('update');
    };

    const getSubjectId = (e: any, value: Major) => {
        const getSubjectData = async () => {
            const response: any = await getDetailMajorApi(value._id);

            if (response.message === 'success') {
                setMajorData(response.result);
                onPressUpdate();
            }
        };

        dispatch(getSubjectData);
    };

    const onCloseDrawerCreate = () => {
        setOpenCreate(false);
    };

    const onCloseDrawerUpdate = () => {
        setOpenUpdate(false);
    };

    return (
        <div className="course-list-page">
            <Card
                title="Danh sách chuyên ngành"
                bordered={true}
                hoverable
                extra={
                    <>
                        <Button onClick={() => setResetForm(!resetForm)} type="primary">
                            Xoá bộ lọc
                        </Button>
                        <Button onClick={onPressCreate} type="primary">
                            Tạo môn chuyên ngành
                        </Button>
                    </>
                }
            >
                {filterUser}
                {tableData}
            </Card>
            {typeBtn === 'create' ? (
                <MajorForm
                    open={openCreate}
                    onClose={onCloseDrawerCreate}
                    setParamSearch={setParamSearch}
                    paramSearch={paramSearch}
                    type="create"
                />
            ) : (
                <MajorForm
                    open={openUpdate}
                    majorData={majorData}
                    onClose={onCloseDrawerUpdate}
                    setParamSearch={setParamSearch}
                    paramSearch={paramSearch}
                    type="update"
                />
            )}
        </div>
    );
};

export default MajorList;
