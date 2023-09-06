import type { Exam, IExamListProps, IGetExamParams } from '../../dto';
import type { MyPageTableOptions } from '@/components/business/page';

import './index.less';

import {
    CodeSandboxOutlined,
    DeleteOutlined,
    EditOutlined,
    OrderedListOutlined,
    UsergroupDeleteOutlined,
} from '@ant-design/icons';
import { Popconfirm, Space, Switch, Tag, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { callbackApi } from '@/common';
import MyPage from '@/components/business/page';
import { StatusEnum } from '@/interface';
import { updateExamApi } from '@/modules/exams/api';

import { deleteExamsApi, findAllExamsApi } from '../../api';
import FilterExam from '../../components/FilterExam';

const ExamListForm = (props: IExamListProps) => {
    const { handleSetExam, isRefresh } = props;

    const [paramSearch, setParamSearch] = useState<object | null>(null);

    useEffect(() => {
        if (isRefresh !== null) {
            setParamSearch({});
        }
    }, [isRefresh]);

    const tableColumns: MyPageTableOptions<Exam> = [
        {
            title: 'Tên bài thi',
            key: '_id',
            dataIndex: 'name',
        },
        {
            title: 'Mô hình bài thi',
            dataIndex: 'plan',
            key: '_id',
            align: 'center',
            width: '15%',
            render: (_, { plan }) => {
                if (plan === 'PREMIUM') {
                    const color = '#faad14';

                    return (
                        <Tag color={color} key={plan}>
                            {'Mất phí'.toUpperCase()}
                        </Tag>
                    );
                } else {
                    const color = 'green';

                    return (
                        <Tag color={color} key={plan}>
                            {'Miễn phí'.toUpperCase()}
                        </Tag>
                    );
                }
            },
        },
        {
            title: 'Loại bài thi',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            render: (_, { type }) => {
                if (type === 'TEST') {
                    const color = 'geekblue';

                    return (
                        <Tag color={color} key={type}>
                            {'Thi thử'.toUpperCase()}
                        </Tag>
                    );
                } else {
                    const color = '#faad14';

                    return (
                        <Tag color={color} key={type}>
                            {'Quiz'.toUpperCase()}
                        </Tag>
                    );
                }
            },
        },
        {
            title: 'Tổng câu hỏi',
            dataIndex: 'countQuestions',
            key: 'countQuestions',
            align: 'center',
            width: 150,
        },
        {
            title: 'Số lượt đã làm',
            dataIndex: 'tested',
            key: 'tested',
            align: 'center',
            width: 150,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: '_id',
            align: 'center',
            width: '10%',
            render: (status, record) => (
                <>
                    {status === StatusEnum.ACTIVE ? (
                        <Switch
                            defaultChecked
                            onClick={(checked: boolean, _) => {
                                updateExamStatus(checked, record._id as string);
                            }}
                        />
                    ) : (
                        <Switch
                            onClick={(checked: boolean, _) => {
                                updateExamStatus(checked, record._id as string);
                            }}
                        />
                    )}
                </>
            ),
        },
        {
            title: 'Hành động',
            key: '_id',
            align: 'center',
            render: (_: any, record: Exam) => (
                <>
                    <Space size="middle">
                        <Tooltip title="Mã kích hoạt">
                            <CodeSandboxOutlined
                                className="list-question-icon"
                                style={{ color: '#FAAD14' }}
                                onClick={() => handleSetExam('activation', record)}
                            />
                        </Tooltip>
                        <Tooltip title="Danh sách người dùng đã làm bài">
                            <UsergroupDeleteOutlined onClick={() => handleSetExam('listUser', record)} />
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa bộ câu hỏi">
                            <NavLink to={`/questions/${record?._id}`}>
                                <OrderedListOutlined className="list-question-icon" />
                            </NavLink>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa bài test">
                            <EditOutlined className="edit-icon" onClick={() => handleSetExam('edit', record)} />
                        </Tooltip>
                        <Tooltip title="Xóa bài thi">
                            <Popconfirm
                                placement="right"
                                title={'Bạn có muốn xóa ?'}
                                onConfirm={() => deleteExam(record._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined className="delete-icon" />
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                </>
            ),
        },
    ];

    const updateExamStatus = async (checked: boolean, id: string) => {
        const status = checked ? StatusEnum.ACTIVE : StatusEnum.INACTIVE;
        const response: any = await updateExamApi(id, { status: status });

        callbackApi(response, 'Cập nhật trạng thái bài thi thành công', () => {
            setParamSearch({ ...paramSearch });
        });
    };

    const deleteExam = async (id: string) => {
        const response: any = await deleteExamsApi(id);

        callbackApi(response, 'Xóa bài thi thành công', () => {
            setParamSearch({ ...paramSearch });
        });
    };

    const onSearch = (values: IGetExamParams) => {
        if (values) {
            setParamSearch(values);
        }
    };

    const filterExam = useMemo(() => {
        return (
            <>
                <FilterExam onSearch={onSearch} isRefresh={isRefresh} />
            </>
        );
    }, [isRefresh]);

    const tableExam = useMemo(() => {
        return <MyPage pageApi={findAllExamsApi} paramSearch={paramSearch} tableOptions={tableColumns} />;
    }, [paramSearch]);

    return (
        <>
            {filterExam}
            {tableExam}
        </>
    );
};

export default ExamListForm;
