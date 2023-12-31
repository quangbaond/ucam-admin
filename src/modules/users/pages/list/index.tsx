import type { User } from '../../dto/login';
import type { MyPageTableOptions } from '@/components/business/page';

import './index.less';

import { Avatar, message as $message, Popconfirm, Space, Switch, Tag, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useSelector } from 'react-redux';

import MyPage from '@/components/business/page';
import { MenuEnum, PERMISSION_ENUM } from '@/interface';

import { deleteUserApi, findUsersApi } from '../../api';

interface EditGroup {
    editUser: (id: string) => void;
    reload: boolean;
}

const UserList = (props: EditGroup) => {
    const { editUser, reload } = props;

    const userModule = useSelector(state => state.user.modules);
    const userModuleItem = userModule.find(item => item.name === MenuEnum.USER);
    const tableColumns: MyPageTableOptions<User> = [
        {
            title: 'Họ tên',
            key: '_id',
            dataIndex: 'fullName',
            render: (_: any, record) => (
                <>
                    <Avatar src={record.avatarUrl} />
                    <span style={{ marginLeft: '5px' }}>{record.fullName}</span>
                </>
            ),
        },
        {
            title: 'Email',
            key: '_id',
            dataIndex: 'email',
        },
        {
            title: 'Trạng thái giảng viên',
            key: '_id',
            dataIndex: 'isMentor',
            render: (_: any, record: User) => <Switch disabled defaultChecked={record.isMentor}></Switch>,
            align: 'center' as const,
        },
        {
            title: 'Nhóm',
            key: '_id',
            dataIndex: 'group',
            render: (_: any, record: User) => {
                if (record.group) {
                    return <Tag color="green">{record.group.name}</Tag>;
                } else {
                    return <Tag color="red">Chưa có nhóm</Tag>;
                }
            },
            align: 'center' as const,
        },
        {
            title: 'Hành Động',
            key: '_id',
            align: 'center' as const,
            width: '100px',
            render: (record: User) => (
                <div>
                    <Space size="middle">
                        {userModuleItem?.permissions.includes(PERMISSION_ENUM.EDIT) && (
                            <Tooltip placement="top" title="Chỉnh sửa người dùng">
                                <AiOutlineEdit className="icon-button" onClick={() => editUser(record._id)} />
                            </Tooltip>
                        )}

                        {userModuleItem?.permissions.includes(PERMISSION_ENUM.DELETE) && (
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
                        )}
                    </Space>
                </div>
            ),
        },
    ];

    const [paramSearch, setParamSearch] = useState<object | null>(null);

    const deleteUser = async (userId: string) => {
        const response = await deleteUserApi(userId);

        if (response.status) {
            setParamSearch({
                ...paramSearch,
            });
            $message.success('Xoá bản ghi thành công');
        }
    };

    useEffect(() => {
        setParamSearch({
            ...paramSearch,
        });
    }, [reload]);

    const tableData = useMemo(() => {
        if (!paramSearch) return;

        return <MyPage pageApi={findUsersApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch]);

    return <> {tableData} </>;
};

export default UserList;
