import type { IListUserProps, IResultParams, IResultTest } from '../dto';

import { Button, Drawer, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';

import MyPage from '@/components/business/page';

import { getResultTestApi } from '../api';
import FilterUser from './FilterUser';

const ListUser = (props: IListUserProps) => {
    const { open, onClose, exam } = props;
    const [paramSearch, setParamSearch] = useState<object | null>(null);
    const [isRefresh, setIsRefresh] = useState<boolean>(false);

    useEffect(() => {
        if (exam) {
            setParamSearch({ testId: exam._id });
        }
    }, [exam]);

    useEffect(() => {
        setParamSearch({
            testId: exam?._id,
        });
    }, [isRefresh]);

    const tableColumns = [
        {
            title: 'Tên người dùng',
            key: '_id',
            dataIndex: 'fullName',
            render: (_: any, record: IResultTest) => <p>{record?.userId?.fullName}</p>,
        },
        {
            title: 'Trạng thái',
            key: '_id',
            dataIndex: 'status',
            render: (status: string) => <Tag color={status === 'PASS' ? 'green' : 'red'}>{status}</Tag>,
        },
        {
            title: 'Thực hiện ngày',
            key: '_id',
            dataIndex: 'submitDate',
            render: (submitDate: string) => <p>{moment(submitDate).format('DD/MM/YYYY HH:mm:ss')}</p>,
        },
    ];

    const tableListUser = useMemo(() => {
        if (!paramSearch) return null;

        return <MyPage pageApi={getResultTestApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch]);

    const onSearch = (values: IResultParams) => {
        if (values) {
            setParamSearch({
                ...values,
                testId: exam?._id,
            });
        }
    };

    const filterUser = useMemo(() => {
        return (
            <FilterUser
                onSearch={(values: any) => {
                    onSearch(values);
                }}
                isRefresh={isRefresh}
            ></FilterUser>
        );
    }, [isRefresh]);

    return (
        <Drawer
            title="Danh sách người dùng"
            placement="right"
            width={750}
            onClose={() => {
                onClose(false);
            }}
            open={open}
            extra={
                <>
                    <Button type="primary" onClick={() => setIsRefresh(isRefresh => !isRefresh)}>
                        Xóa bộ lọc
                    </Button>
                    <Button onClick={() => onClose(false)}>Đóng</Button>
                </>
            }
        >
            {filterUser}
            {tableListUser}
        </Drawer>
    );
};

export default ListUser;
