import type { MyPageTableOptions } from '@/components/business/page';
import type { MentorSubject } from '@/modules/mentor/dto';
import type { User } from '@/modules/users/dto/login';

import { Avatar, Image, Space, Switch } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { callbackApi } from '@/common';
import MyPage from '@/components/business/page';
import { MentorStatusEnum } from '@/interface';
import FilterMentor from '@/modules/mentor/components/filter';
import { findUsersApi, updateUserApi } from '@/modules/users/api';

import Info from '../../components/info';

const MentorList = (props: { isRefresh: boolean }) => {
    const { isRefresh } = props;
    const [paramSearch, setParamSearch] = useState<any>({
        isMentor: true,
    });
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [dataSubject, setDataSubject] = useState<MentorSubject[]>([]);

    const handelSearch = (value: object) => {
        setParamSearch(value);
    };

    const handleUpdateStatus = async (id: string, checked: boolean) => {
        const status = checked ? MentorStatusEnum.APPROVED : MentorStatusEnum.REJECTED;
        const res: any = await updateUserApi(id, {
            mentorStatus: status,
        });

        callbackApi(res, 'Cập nhật trạng thái thành công', () => {
            setParamSearch({
                ...paramSearch,
            });
        });
    };

    const showInfoMentor = (e: any, record: User) => {
        e.preventDefault();
        setOpenInfo(true);
        setDataSubject(record?.subjects);
    };

    const tableColumns: MyPageTableOptions<User> = [
        {
            title: 'Tên Mentor',
            key: '_id',
            dataIndex: 'fullName',
            align: 'left',
            width: '15%',
            render(value: string, record: User) {
                return (
                    <Space>
                        <Avatar src={record.avatarUrl} />
                        <a href="" onClick={e => showInfoMentor(e, record)}>
                            {record.fullName}
                        </a>
                    </Space>
                );
            },
        },
        {
            title: 'Địa chỉ',
            key: '_id',
            dataIndex: 'email',
            align: 'left',
            width: '15%',
        },
        {
            title: 'Số điện thoại',
            key: '_id',
            dataIndex: 'phoneNumber',
            align: 'left',
            width: '15%',
        },
        {
            title: 'Số lượng khóa học',
            key: '_id',
            dataIndex: 'countCourse',
            align: 'left',
        },
        {
            title: 'Số tài liệu',
            key: '_id',
            width: '10%',
            dataIndex: 'countDocument',
            align: 'left',
        },
        {
            title: 'Số bài test',
            key: '_id',
            width: '10%',
            dataIndex: 'countTest',
            align: 'left',
        },
        {
            title: 'Số câu trả lời',
            key: '_id',
            width: '10%',
            dataIndex: 'countAnswer',
            align: 'left',
        },
        {
            title: 'Trạng thái',
            key: '_id',
            dataIndex: 'mentorStatus',
            align: 'center',
            render: (value: string, record: User) => (
                <Switch
                    defaultChecked={record?.mentorStatus === MentorStatusEnum.APPROVED}
                    onChange={(checked: boolean) => {
                        handleUpdateStatus(record._id, checked);
                    }}
                />
            ),
            width: '10%',
        },
    ];

    useEffect(() => {
        setParamSearch({
            ...paramSearch,
        });
    }, [isRefresh]);

    const tableData = useMemo(() => {
        if (!paramSearch) return;

        return <MyPage pageApi={findUsersApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch]);
    const filter = useMemo(() => {
        return <FilterMentor onSearch={handelSearch} resetForm={isRefresh} />;
    }, [isRefresh]);

    return (
        <>
            {filter}
            {tableData}
            <Info
                open={openInfo}
                onCancel={() => {
                    setOpenInfo(false);
                }}
                data={dataSubject}
            />
        </>
    );
};

export default MentorList;
