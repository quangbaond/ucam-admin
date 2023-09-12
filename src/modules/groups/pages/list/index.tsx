import type { Group } from '../../interface';
import type { MyPageTableOptions } from '@/components/business/page';
import type { USER_MODULE } from '@/interface';

import './index.less';

import { message as $message, Popconfirm, Space, Tag, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useSelector } from 'react-redux';

import MyPage from '@/components/business/page';
import { MenuEnum, PERMISSION_ENUM } from '@/interface';

import { deleteGroupApi, findGroupApi } from '../../api';

interface EditGroup {
    editGroup: (id: string) => void;
    reload: boolean;
}

const GroupList = (props: EditGroup) => {
    const { editGroup, reload } = props;
    const userModule = useSelector(state => state.user.modules);
    const userModuleItem = userModule.find(item => item.name === MenuEnum.GROUP);
    const tableColumns: MyPageTableOptions<Group> = [
        {
            title: 'Tên nhóm',
            key: '_id',
            dataIndex: 'name',
        },
        {
            title: 'Quyền',
            key: '_id',
            dataIndex: 'permissions',
            render: (record: USER_MODULE[]) => {
                return record.map(item => {
                    const permissions = item.permissions.join(', ');

                    return (
                        <>
                            <Tooltip placement="top" title={permissions}>
                                <Tag color="blue" style={{ marginLeft: '5px' }}>
                                    {item.name}
                                </Tag>
                            </Tooltip>
                        </>
                    );
                });
            },
        },
        {
            title: 'Hành Động',
            key: '_id',
            align: 'center' as const,
            render: (record: Group) => (
                <div>
                    <Space size="middle">
                        {userModuleItem?.permissions.includes(PERMISSION_ENUM.EDIT) && (
                            <Tooltip placement="top" title="Chỉnh sửa nhóm">
                                <AiOutlineEdit className="icon-button" onClick={() => editGroup(record._id)} />
                            </Tooltip>
                        )}

                        {userModuleItem?.permissions.includes(PERMISSION_ENUM.DELETE) && (
                            <Popconfirm
                                placement="right"
                                title={'Xác nhận xoá bản ghi?'}
                                okText="Có"
                                cancelText="Không"
                                onConfirm={() => deleteGroup(record._id)}
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

    const deleteGroup = async (userId: string) => {
        const response = await deleteGroupApi(userId);

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
        return <MyPage pageApi={findGroupApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch]);

    return <> {tableData} </>;
};

export default GroupList;
