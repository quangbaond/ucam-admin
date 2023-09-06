import type { MyPageTableOptions } from '@/components/business/page';
import type { Announcement } from '@/modules/announcement/dto';

import { Button, Card, message, Popconfirm, Space, Switch, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

import { callbackApi } from '@/common';
import MyPage from '@/components/business/page';
import { StatusEnum } from '@/interface';
import {
    deleteAnnouncementApi,
    detailsAnnouncementApi,
    findAnnouncementApi,
    updateAnnouncementApi,
} from '@/modules/announcement/api';
import Filter from '@/modules/announcement/components/filter';
import AnnouncementForm from '@/modules/announcement/pages/drawer';

const AnnouncementsList: React.FC = () => {
    const tableColumns: MyPageTableOptions<Announcement> = [
        {
            title: 'Tiêu đề',
            key: '_id',
            dataIndex: 'title',
        },
        {
            title: 'Nội dung',
            key: '_id',
            dataIndex: ['content'],
            render: (value: string) => {
                return (
                    <p
                        dangerouslySetInnerHTML={{
                            __html: `${value}`,
                        }}
                    ></p>
                );
            },
        },
        {
            title: 'Trạng Thái',
            key: '_id',
            width: '8%',
            dataIndex: 'active',
            align: 'center',
            render: (_, record) => (
                <>
                    {record.status == StatusEnum.ACTIVE ? (
                        <Switch
                            defaultChecked
                            onClick={(checked: boolean, _) => {
                                handelUpdateActive(checked, record._id as string);
                            }}
                        />
                    ) : (
                        <Switch
                            onClick={(checked: boolean, _) => {
                                handelUpdateActive(checked, record._id as string);
                            }}
                        />
                    )}
                </>
            ),
        },
        {
            title: 'Action',
            key: '_id',
            width: '10%',
            align: 'center',
            render: (_, record) => (
                <div className="display-center">
                    <Space size="middle">
                        <Tooltip title="Chỉnh sửa">
                            <AiOutlineEdit
                                className="icon-button"
                                onClick={(event: any) => getAnnouncementId(event, record)}
                            />
                        </Tooltip>

                        <Tooltip title="Xóa thông báo">
                            <Popconfirm
                                placement="right"
                                title={'Xác nhận xoá bản ghi?'}
                                okText="Có"
                                cancelText="Không"
                                onConfirm={(event: any) => deleteAnnouncement(event, record)}
                            >
                                <AiOutlineDelete className="icon-button-delete icon-button" />
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                </div>
            ),
        },
    ];
    const dispatch = useDispatch();
    const [paramSearch, setParamSearch] = useState<null | object>(null);
    const [resetForm, setResetForm] = useState(true);
    const [typeBtn, setTypeBtn] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);

    const [announcementData, setAnnouncementData] = useState<object>({});

    const deleteAnnouncement = (e: any, value: Announcement) => {
        const deleteExamById = async () => {
            const response: any = await deleteAnnouncementApi(value._id);

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

    const handelUpdateActive = async (checked: boolean, id: string) => {
        const status = checked ? StatusEnum.ACTIVE : StatusEnum.INACTIVE;
        const response: any = await updateAnnouncementApi(id, { status: status });

        callbackApi(response, 'Cập nhật thành công!', () => {
            setParamSearch({ ...paramSearch });
        });
    };

    const tableData = useMemo(() => {
        if (!paramSearch) return;

        return <MyPage pageApi={findAnnouncementApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch]);
    const filter = useMemo(() => {
        return <Filter onSearch={handelSearchMajor} resetForm={resetForm} />;
    }, [resetForm]);

    const onPressCreate = () => {
        setOpenCreate(true);
        setTypeBtn('create');
    };

    const onPressUpdate = () => {
        setOpenUpdate(true);
        setTypeBtn('update');
    };

    const onCloseDrawerCreate = () => {
        setOpenCreate(false);
    };

    const onCloseDrawerUpdate = () => {
        setOpenUpdate(false);
    };

    const getAnnouncementId = (e: any, value: Announcement) => {
        const getAnnouncementData = async () => {
            const response: any = await detailsAnnouncementApi(value._id);

            if (response.message === 'success') {
                setAnnouncementData(response.result);
                onPressUpdate();
            }
        };

        dispatch(getAnnouncementData);
    };

    return (
        <div className="course-list-page">
            <Card
                title="Danh sách nội dung"
                bordered={true}
                hoverable
                extra={
                    <>
                        <Button onClick={() => setResetForm(!resetForm)} type="primary">
                            Xoá bộ lọc
                        </Button>
                        <Button onClick={onPressCreate} type="primary">
                            Tạo nội dung
                        </Button>
                    </>
                }
            >
                {filter}
                {tableData}
            </Card>
            {typeBtn === 'create' ? (
                <AnnouncementForm
                    open={openCreate}
                    onClose={onCloseDrawerCreate}
                    setParamSearch={setParamSearch}
                    paramSearch={paramSearch}
                    type="create"
                />
            ) : (
                <AnnouncementForm
                    open={openUpdate}
                    announcementData={announcementData}
                    onClose={onCloseDrawerUpdate}
                    setParamSearch={setParamSearch}
                    paramSearch={paramSearch}
                    type="update"
                />
            )}
        </div>
    );
};

export default AnnouncementsList;
