import type { Enroll } from '../../dto';
import type { MyPageTableOptions } from '@/components/business/page';
import type { SelectOptions } from '@/components/core/form-item';
import type { ModelEnum, PageData } from '@/interface';
import type { User } from '@/modules/users/dto/login';

import { Button, Col, Divider, Drawer, message, Popconfirm, Progress, Row, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import MyTable from '@/components/core/table';
import { EnrollEnum } from '@/interface';
import { findUsersApi } from '@/modules/users/api';
import { useStates } from '@/utils/use-states';

import { createEnrollApi, deleteEnrollApi, findAllEnrollApi } from '../../api';

interface DrawerProps {
    targetId: string;
    targetModel: ModelEnum;
    openDrawer: boolean;
    setOpenDrawer: any;
}

const EnrollDrawer = (props: DrawerProps) => {
    const { targetId, targetModel, openDrawer, setOpenDrawer } = props;

    const [form] = MyForm.useForm();
    const [reloadTable, setReloadTable] = useState(false);
    const [userOptions, setUserOptions] = useState<SelectOptions[]>([]);
    const [enrollUser, setEnrollUser] = useState<string[]>([]);
    const [hasNextPage, setHasNextPage] = useState<boolean>(true);
    const [paginationUser, setPaginationUser] = useState<any>({
        page: 1,
        limit: 10,
    });
    const [pageData, setPageData] = useStates<PageData<Enroll>>({
        limit: 10,
        page: 1,
        totalDocs: 0,
        docs: [],
    });

    const createEnroll = async () => {
        const values = await form.validateFields();

        if (targetId) {
            const payload = {
                targetId: targetId,
                targetModel: targetModel,
                userIds: values.users?.map((e: SelectOptions) => e.value),
                type: EnrollEnum.STUDENT,
            };

            const res = await createEnrollApi(payload);

            if (res.status) {
                form.resetFields();
                setReloadTable(!reloadTable);
            } else {
                message.error(res.message);
            }
        }
    };

    const deleteEnroll = async (id: string) => {
        const res = await deleteEnrollApi(id);

        if (res.status) {
            setReloadTable(!reloadTable);
            message.success('Xoá thành công');
        } else {
            message.error('Đã xảy ra lỗi khi xoá!');
        }
    };

    async function fetchUsers(search: string, options: any): Promise<any> {
        const filterQuery = search ? { search: search, isMentor: false } : { isMentor: false };
        const pagination = search ? { page: 1, limit: 10 } : options;

        return findUsersApi({ filterQuery: filterQuery, options: pagination })
            .then((response: any) => response.result)
            .then(body =>
                body.docs.reduce(function (ids: SelectOptions[], user: User) {
                    if (!enrollUser.includes(user._id)) {
                        ids.push({
                            label: `${user.fullName} - ${user.email}`,
                            value: user._id,
                        });
                    }

                    return ids;
                }, []),
            );
    }

    useEffect(() => {
        const fetchUserOptions = async () => {
            const res = await fetchUsers('', paginationUser);

            setUserOptions([...userOptions, ...res]);
        };

        fetchUserOptions();
    }, [enrollUser, paginationUser]);

    const tableColumns: MyPageTableOptions<Enroll> = [
        {
            title: 'Học viên',
            key: 'user',
            dataIndex: ['user', 'fullName'],
            width: '25%',
        },
        {
            title: 'Mã code',
            key: 'activationCode',
            dataIndex: ['activation', 'activationCode'],
            align: 'center' as const,
            width: '15%',
        },
        {
            title: 'Ngày tham gia',
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center' as const,
            width: '20%',
            render: (date: Date) => {
                return new Intl.DateTimeFormat(['ban', 'id']).format(new Date(date));
            },
        },
        {
            title: 'Tiến trình',
            dataIndex: 'progression',
            key: 'progression',
            align: 'center' as const,
            render: (progression: any) => {
                const total = progression.remains.length + progression.done.length + 1;

                const percent = new Intl.NumberFormat('en-IN', {
                    maximumSignificantDigits: 2,
                }).format((progression.done.length / total) * 100);

                if (progression.done.length === 0) {
                    return <Progress percent={0} />;
                }

                if (progression.done.some((e: string) => e === progression.doing.toString())) {
                    return <Progress percent={100} />;
                }

                return <Progress percent={Number(percent)} />;
            },
        },
        {
            title: 'Hành động',
            key: '_id',
            width: '20%',
            align: 'center' as const,
            render: (_, record) => (
                <div className="display-center">
                    <Space size="middle">
                        <Popconfirm
                            placement="right"
                            title={'Bạn có muốn xoá mã code?'}
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() => deleteEnroll(record._id as string)}
                        >
                            <AiOutlineDelete className="icon-button-delete" />
                        </Popconfirm>
                    </Space>
                </div>
            ),
        },
    ];

    const onPageChange = (page: number, limit?: number) => {
        setPageData({ page });

        if (limit) {
            setPageData({ limit });
        }
    };

    const getPageData = useCallback(async () => {
        if (targetId) {
            const res = await findAllEnrollApi({
                filterQuery: { targetId: targetId, targetModel: targetModel },
                options: { limit: pageData.limit, page: pageData.page },
            });

            if (res.status) {
                setEnrollUser(res.result.docs.map((enroll: Enroll) => enroll.user?._id as string));
                setPageData({ totalDocs: res.result.totalDocs, docs: res.result.docs });
            } else {
                setEnrollUser([]);
            }
        }
    }, [targetId, reloadTable, pageData.limit, pageData.page]);

    useEffect(() => {
        getPageData();
    }, [getPageData]);

    const closeDrawer = () => {
        setOpenDrawer(false);
        form.resetFields();
    };

    return (
        <>
            <Drawer
                title={'Danh sách học viên'}
                width={'50%'}
                onClose={closeDrawer}
                open={openDrawer}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={closeDrawer}>Đóng</Button>
                        <Button onClick={createEnroll} type="primary">
                            Thêm
                        </Button>
                    </Space>
                }
            >
                <MyForm layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <MyFormItem
                                label={'Chọn học viên'}
                                type="select-debounce"
                                name="users"
                                options={userOptions}
                                fetchOptions={fetchUsers}
                                innerProps={{
                                    placeholder: 'Chọn danh sách học viên',
                                    allowClear: true,
                                    showSearch: true,
                                    mode: 'multiple',
                                    maxTagCount: 'responsive',
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
                    </Row>
                </MyForm>
                <Divider></Divider>
                <MyTable
                    dataSource={pageData.docs}
                    columns={tableColumns}
                    rowKey="_id"
                    pagination={{
                        current: pageData.page,
                        pageSize: pageData.limit,
                        total: pageData.totalDocs,
                        onChange: onPageChange,
                    }}
                />
            </Drawer>
        </>
    );
};

export default EnrollDrawer;
