import type { IHistory, IHistoryProps } from '../../dto/login';

import { Button, Drawer, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';

import { getHistoryApi } from '../../api';
import Course from './course';
import Document from './documents';
import Result from './result';

const History = (props: IHistoryProps) => {
    const { open, onClose, idUser } = props;
    const [data, setData] = useState<IHistory>({});
    const [isRefresh, setIsRefresh] = useState<boolean | null>(null);

    useEffect(() => {
        if (idUser) {
            const getHistory = async () => {
                const response: any = await getHistoryApi(idUser);
                const { status, result } = response;

                if (status) {
                    setData(result);
                }
            };

            getHistory();
        }
    }, [idUser]);
    const itemTabs = [
        {
            label: 'Danh sách tài liệu',
            key: '1',
            children: <Document data={data.documents} isRefresh={isRefresh} />,
        },
        {
            label: 'Danh sách khóa học',
            key: '2',
            children: <Course data={data.course} isRefresh={isRefresh} />,
        },
        {
            label: 'Danh sách Bài thi',
            key: '3',
            children: <Result data={data.result} isRefresh={isRefresh} />,
        },
    ];

    return (
        <Drawer
            title="Lịch sử người dùng"
            placement="right"
            onClose={onClose}
            open={open}
            width={750}
            extra={
                <>
                    <Button onClick={onClose}>Đóng</Button>
                </>
            }
        >
            <Tabs defaultActiveKey="1" type="card" size="middle" items={itemTabs} />
        </Drawer>
    );
};

export default History;
