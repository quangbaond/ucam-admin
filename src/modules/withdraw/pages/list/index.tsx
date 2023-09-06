import type { WidthDraw } from '../../dto';
import type { MyPageTableOptions } from '@/components/business/page';
import type { SelectOptions } from '@/components/core/form-item';
import type { User } from '@/modules/users/dto/login';

import './index.less';

import { Avatar, Space, Switch, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import { callbackApi } from '@/common';
import MyPage from '@/components/business/page';
import { StatusEnum } from '@/interface';
import { findUsersApi } from '@/modules/users/api';

import { findWithDrawApi, updateWithDrawApi } from '../../api';
import FilterUser from './filterUser';

moment().locale('vi');
interface UserListProps<T = any> {
    resetForm: T;
    setParamExport: (value: T) => void;
}

const UserList = (props: UserListProps) => {
    const { resetForm, setParamExport } = props;
    const tableColumns: MyPageTableOptions<WidthDraw> = [
        {
            title: 'Họ tên',
            key: '_id',
            dataIndex: 'fullName',
            width: '20%',
            render: (_: string, record: WidthDraw) => (
                <Space>
                    <Avatar src={record.userId?.avatarUrl} />
                    <span>{record.userId?.fullName}</span>
                </Space>
            ),
        },
        {
            title: 'Tên chủ tải khoản',
            key: '_id',
            dataIndex: 'fullName',
            width: '15%',
        },
        {
            title: 'Tên ngân hàng',
            key: '_id',
            dataIndex: 'bank',
            width: '15%',
        },
        {
            title: 'Só tài khoản',
            key: '_id',
            dataIndex: 'cardNumber',
            width: '10%',
        },
        {
            title: 'Số điểm rút',
            key: '_id',
            dataIndex: 'value',
            width: '10%',
        },
        {
            title: 'Số điểm còn lại',
            key: '_id',
            dataIndex: 'valueAfter',
            width: '10%',
        },
        {
            title: 'Ngày yêu cầu',
            key: '_id',
            dataIndex: 'createdAt',
            width: '10%',
            render: (date: Date) => <span>{moment(date).format('DD/MM/YYYY')}</span>,
        },
        {
            title: 'Trạng thái',
            key: '_id',
            dataIndex: 'status',
            width: '5%',
            align: 'center' as const,
            render: (status: string) => {
                switch (status) {
                    case StatusEnum.PENDING:
                        return <Tag color="warning">Đang chờ</Tag>;
                    case StatusEnum.SUCCESS:
                        return <Tag color="success">Thành công</Tag>;
                    case StatusEnum.REJECTED:
                        return <Tag color="error">Đã huỷ</Tag>;
                    default:
                        return <Tag color="warning">Đang chờ</Tag>;
                }
            },
        },
        {
            title: 'Note',
            key: '_id',
            dataIndex: 'note',
            width: '20%',
            render: (note: string) => <span>{note ? note : 'Không có'}</span>,
        },
        {
            title: 'Hành động',
            key: '_id',
            dataIndex: 'status',
            width: '10%',
            align: 'center' as const,
            render: (status: string, record: WidthDraw) => (
                <>
                    {status === StatusEnum.SUCCESS ? (
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
    ];

    const updateUserStatus = async (checked: boolean, id: string) => {
        const status = checked ? StatusEnum.SUCCESS : StatusEnum.REJECTED;
        const res: any = await updateWithDrawApi(id, { status: status });

        callbackApi(res, 'Cập nhật trạng thái thành công!', () => {
            setParamSearch({
                ...paramSearch,
            });
        });
    };

    const [paramSearch, setParamSearch] = useState<object | null>(null);

    const handelSearchUser = (value: object | null) => {
        if (value) {
            setParamSearch(value);
            setParamExport(value);
        }
    };

    const tableData = useMemo(() => {
        if (!paramSearch) return null;

        return <MyPage pageApi={findWithDrawApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch]);
    const filterUser = useMemo(() => {
        return <FilterUser onSearch={handelSearchUser} resetForm={resetForm} />;
    }, [resetForm]);

    return (
        <>
            {' '}
            {filterUser} {tableData}{' '}
        </>
    );
};

export default UserList;
