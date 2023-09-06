import type { ChangePassword } from '../const';
import type { MyPageTableOptions } from '@/components/business/page';
import type { User } from '@/modules/users/dto/login';

import './index.less';

import { SwapOutlined } from '@ant-design/icons';
import { Avatar, Button, message as $message, Modal, Popconfirm, Space, Switch, Table, Tag, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

import { callbackApi } from '@/common';
import MyPage from '@/components/business/page';
import { RoleEnum, StatusEnum } from '@/interface';
import { deleteUserApi, findUsersApi, updateUserApi } from '@/modules/users/api';

import History from '../../components/history/';
import UpdateUserForm from '../edit';
import ModalChangePassword from './changePassword';
import FilterUser from './filterUser';

interface UserListProps<T = any> {
    resetForm: T;
    setParamExport: (value: T) => void;
}

const UserList = (props: UserListProps) => {
    const { resetForm, setParamExport } = props;
    const [isShowForm, setIsShowForm] = useState<boolean>(false);
    const [idUserActive, setIdUserActive] = useState<string>('');
    const [dataModalChangePassword, setDataModalChangePassword] = useState<ChangePassword>({
        isShowModal: false,
        email: '',
        name: '',
    });
    const [openHistory, setOpenHistory] = useState<boolean>(false);
    const [openDevice, setOpenDevice] = useState<boolean>(false);
    const [dataDevice, setDataDevice] = useState<User | null>(null);
    const columnDevice: MyPageTableOptions<User> = [
        {
            title: 'Hệ điều hành',
            dataIndex: 'os',
            key: 'os',
        },
        {
            title: 'Trình duyệt',
            dataIndex: 'browser',
            key: 'browser',
        },
    ];

    useEffect(() => {}, [dataModalChangePassword]);

    const handelChangePassword = (user: User) => {
        setDataModalChangePassword({
            isShowModal: true,
            email: user.email,
            name: user.fullName,
        });
    };

    const handleShowHistory = (e: any, user: User) => {
        e.preventDefault();
        setIdUserActive(user._id as string);
        setOpenHistory(true);
    };

    const tableColumns: MyPageTableOptions<User> = [
        {
            title: 'Họ tên',
            key: '_id',
            dataIndex: 'fullName',
            render: (_: string, record: User) => (
                <Space>
                    <Avatar src={record.avatarUrl} />
                    <a href="" onClick={e => handleShowHistory(e, record)}>
                        {record.fullName}
                    </a>
                </Space>
            ),
        },
        {
            title: 'Đia chỉ email',
            key: '_id',
            dataIndex: 'email',
        },
        {
            title: 'Số điện thoại',
            key: '_id',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Trạng thái',
            key: '_id',
            dataIndex: 'accountStatus',
            width: 100,
            align: 'center' as const,
            render: (status: string, record: User) => (
                <>
                    {status === StatusEnum.ACTIVE ? (
                        <Switch
                            defaultChecked
                            onClick={(checked: boolean, _) => {
                                updateUserStatus(checked, record._id as string);
                            }}
                        />
                    ) : (
                        <Switch
                            onClick={(checked: boolean, _) => {
                                updateUserStatus(checked, record._id as string);
                            }}
                        />
                    )}
                </>
            ),
        },
        {
            title: 'Quyền',
            key: '_id',
            dataIndex: 'role',
            width: 150,
            align: 'center' as const,
            render: (arrayRole: RoleEnum[]) => {
                return (
                    <>
                        {arrayRole.map((role: string | null | undefined) => {
                            let color = 'green';
                            let text = 'Người dùng';

                            if (role === RoleEnum.ADMIN) {
                                color = 'red';
                                text = 'Quản trị';
                            } else if (role === RoleEnum.PREMIUM_USER) {
                                color = 'blue';
                                text = 'Premium';
                            } else {
                                color = 'green';
                                text = 'Người dùng';
                            }

                            return (
                                <Tag color={color} key={role} style={{ margin: '5px 0' }}>
                                    {text}
                                </Tag>
                            );
                        })}
                    </>
                );
            },
        },
        {
            title: 'Hành Động',
            key: '_id',
            align: 'center' as const,
            render: (record: User) => (
                <div>
                    <Space size="middle">
                        <Tooltip placement="top" title="Chỉnh sửa người dùng">
                            <AiOutlineEdit className="icon-button" onClick={() => handelUpdateUser(record._id)} />
                        </Tooltip>

                        <Popconfirm
                            placement="right"
                            title={'Xác nhận xoá bản ghi?'}
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() => deleteUser(record._id)}
                        >
                            <Tooltip placement="top" title="Xóa người dùng">
                                <AiOutlineDelete className="icon-button-delete icon-button" />
                            </Tooltip>
                        </Popconfirm>
                        <Tooltip placement="top" title="Đổi mật khẩu">
                            <SwapOutlined
                                onClick={() => handelChangePassword(record)}
                                className="icon-button-change-password icon-button"
                            />
                        </Tooltip>
                    </Space>
                </div>
            ),
        },
    ];

    const updateUserStatus = async (checked: boolean, id: string) => {
        const status = checked ? StatusEnum.ACTIVE : StatusEnum.INACTIVE;
        const res: any = await updateUserApi(id, { accountStatus: status });

        callbackApi(res, 'Cập nhật trạng thái thành công!', () => {
            setParamSearch({
                ...paramSearch,
            });
        });
    };

    const [paramSearch, setParamSearch] = useState<object | null>(null);

    const handelUpdateUser = (userId: string) => {
        setIdUserActive(userId);
        setIsShowForm(true);
    };

    const deleteUser = async (userId: string) => {
        const respone = await deleteUserApi(userId);

        if (respone.status) {
            setParamSearch({
                ...paramSearch,
            });
            $message.success('Xoá bản ghi thành công');
        }
    };

    const handelSearchUser = (value: object | null) => {
        if (value) {
            setParamSearch(value);
            setParamExport(value);
        }
    };

    const closeForm = () => {
        setIsShowForm(false);
        setIdUserActive('');
        setParamSearch({
            ...paramSearch,
        });
    };

    const tableData = useMemo(() => {
        if (!paramSearch) return null;

        return <MyPage pageApi={findUsersApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch]);
    const filterUser = useMemo(() => {
        return <FilterUser onSearch={handelSearchUser} resetForm={resetForm} />;
    }, [resetForm]);

    return (
        <>
            {' '}
            {filterUser} {tableData}{' '}
            <ModalChangePassword
                dataModalChangePassword={dataModalChangePassword}
                successChangePassword={() => {
                    setDataModalChangePassword({
                        isShowModal: false,
                        name: '',
                        email: '',
                    });
                }}
            />
            {isShowForm && idUserActive && (
                <UpdateUserForm isShowForm={isShowForm} id={idUserActive} closeForm={closeForm} />
            )}
            {idUserActive && openHistory && (
                <History
                    onClose={() => {
                        setOpenHistory(false);
                        setIdUserActive('');
                    }}
                    open={openHistory}
                    idUser={idUserActive}
                />
            )}
            <Modal
                title={`Thiết bị đăng nhập: ${dataDevice?.fullName}`}
                open={openDevice}
                onCancel={() => {
                    setOpenDevice(false);
                    setDataDevice(null);
                }}
                width={'50%'}
                footer={
                    <>
                        <Button
                            onClick={() => {
                                setOpenDevice(false);
                                setDataDevice(null);
                            }}
                        >
                            Đóng
                        </Button>
                    </>
                }
            >
                <Table bordered dataSource={dataDevice?.devices} columns={columnDevice}></Table>
            </Modal>
        </>
    );
};

export default UserList;
