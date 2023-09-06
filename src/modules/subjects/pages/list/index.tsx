import type { MyPageTableOptions } from '@/components/business/page';
import type { Subject } from '@/modules/subjects/dto';

import { Button, Card, message, Popconfirm, Space, Switch, Tag } from 'antd';
import React, { useMemo, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

import MyPage from '@/components/business/page';
import { StatusEnum } from '@/interface';
import FilterUser from '@/modules/users/pages/list/filterUser';

import { deleteSubjectApi, findSubjectsApi, getDetailSubjectApi, updateSubjectApi } from '../../api';
import SubjectForm from '../drawer';

const SubjectList: React.FC = () => {
    const tableColumns: MyPageTableOptions<Subject> = [
        {
            title: 'Môn học',
            key: '_id',
            dataIndex: 'name',
            width: '40%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: '_id',
            width: '10%',
            align: 'center' as const,
            render: (status: string, record: Subject) => (
                <>
                    {status === StatusEnum.ACTIVE ? (
                        <Switch
                            defaultChecked
                            onClick={(checked: boolean, _) => {
                                updateSubjectStatus(checked, record._id as string);
                            }}
                        />
                    ) : (
                        <Switch
                            onClick={(checked: boolean, _) => {
                                updateSubjectStatus(checked, record._id as string);
                            }}
                        />
                    )}
                </>
            ),
        },
        {
            title: 'Action',
            key: '_id',
            align: 'center' as const,
            width: '10%',
            render: (_, record) => (
                <div className="display-center">
                    <Space size="middle">
                        <AiOutlineEdit className="icon-button" onClick={(event: any) => getSubjectId(event, record)} />

                        <Popconfirm
                            placement="right"
                            title={'Xác nhận xoá bản ghi?'}
                            okText="Có"
                            cancelText="Không"
                            onConfirm={(event: any) => deleteSubject(event, record)}
                        >
                            <AiOutlineDelete className="icon-button-delete icon-button" />
                        </Popconfirm>
                    </Space>
                </div>
            ),
        },
    ];

    const updateSubjectStatus = async (checked: boolean, id: string) => {
        const status = checked ? StatusEnum.ACTIVE : StatusEnum.INACTIVE;
        const res = await updateSubjectApi(id, { status: status });

        if (res) {
            message.success('Cập nhật trạng thái khoá học thành công');
        }
    };

    const dispatch = useDispatch();
    const [paramSearch, setParamSearch] = useState<object | null>(null);
    const [resetForm, setResetForm] = useState(true);
    const [typeBtn, setTypeBtn] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [subjectData, setSubjectData] = useState<object>({});

    const deleteSubject = (e: any, value: Subject) => {
        const deleteExamById = async () => {
            const response: any = await deleteSubjectApi(value._id);

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

    const handelSearchSubject = (value: object) => {
        setParamSearch(value);
    };

    const tableData = useMemo(() => {
        if (!paramSearch) return null;

        return <MyPage pageApi={findSubjectsApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch]);
    const filterUser = useMemo(() => {
        return <FilterUser onSearch={handelSearchSubject} resetForm={resetForm} />;
    }, [resetForm]);

    const onPressCreate = () => {
        setOpenCreate(true);
        setTypeBtn('create');
    };

    const onPressUpdate = () => {
        setOpenUpdate(true);
        setTypeBtn('update');
    };

    const getSubjectId = (e: any, value: Subject) => {
        const getSubjectData = async () => {
            const response: any = await getDetailSubjectApi(value._id);

            if (response.message === 'success') {
                setSubjectData(response.result);
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
                title="Danh sách môn học"
                bordered={true}
                hoverable
                extra={
                    <>
                        <Button onClick={() => setResetForm(!resetForm)} type="primary">
                            Xoá bộ lọc
                        </Button>
                        <Button onClick={onPressCreate} type="primary">
                            Thêm mới
                        </Button>
                    </>
                }
            >
                {filterUser}
                {tableData}
            </Card>
            {typeBtn === 'create' ? (
                <SubjectForm
                    open={openCreate}
                    onClose={onCloseDrawerCreate}
                    setParamSearch={setParamSearch}
                    paramSearch={paramSearch}
                    type="create"
                />
            ) : (
                <SubjectForm
                    open={openUpdate}
                    subjectData={subjectData}
                    onClose={onCloseDrawerUpdate}
                    setParamSearch={setParamSearch}
                    paramSearch={paramSearch}
                    type="update"
                />
            )}
        </div>
    );
};

export default SubjectList;
