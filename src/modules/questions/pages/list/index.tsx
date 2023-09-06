import type { Question } from '../../dto';
import type { MyPageTableOptions } from '@/components/business/page';

import './index.less';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Space, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { callbackApi } from '@/common';
import MyPage from '@/components/business/page';

import { deleteQuestionApi, getQuestionsApi } from '../../api';
import FilterQuestion from '../../components/FilterQuestion';

interface Props {
    handleSetQuestion: (data: Question) => void;
    isRefresh: boolean;
}

const ListQuestion = (props: Props) => {
    const { handleSetQuestion, isRefresh } = props;
    const params = useParams();
    const [paramSearch, setParamSearch] = useState<object | null>(null);

    useEffect(() => {
        if (isRefresh !== null) {
            setParamSearch({
                ...paramSearch,
                testId: params.id || undefined,
            });
        }
    }, [isRefresh]);

    const deleteQuestionApis = async (id: string) => {
        const response: any = await deleteQuestionApi(id);

        callbackApi(response, 'Xóa câu hỏi thành công', () => {
            setParamSearch({
                ...paramSearch,
                testId: params.id || undefined,
            });
        });
    };

    useEffect(() => {
        if (params.id) {
            setParamSearch({
                testId: params.id,
            });

            return;
        }

        setParamSearch({});
    }, [params.id]);

    const tableColumns: MyPageTableOptions<Question> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            align: 'center',
            width: '5%',
            render: (id, record, index) => {
                ++index;

                return index;
            },
            showSorterTooltip: false,
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'type',
            width: '40%',
            render: (_, record) => (
                <p
                    dangerouslySetInnerHTML={{
                        __html: `${record.question}`,
                    }}
                ></p>
            ),
        },
        {
            title: 'Đáp án',
            dataIndex: 'anwLength',
            width: '40%',
            render: (_, record) => {
                let choice = '';
                const inputType = record.type === 'SINGLE CHOICE' ? 'radio' : 'checkbox';

                record.choices?.forEach((c) => {
                    if (c.isCorrect) {
                        choice = choice.concat(`<Col span={4}><Input type='${inputType}' checked disabled> </Col>`);
                    } else {
                        choice = choice.concat(`<Col span={4}><Input type='${inputType}' disabled></Col>`);
                    }

                    choice = choice.concat(' ');
                    choice = choice.concat(`<Col span={20}>${c.answer}</Col>`);
                    choice = choice.concat('</br>');
                });

                return (
                    <p
                        dangerouslySetInnerHTML={{
                            __html: choice,
                        }}
                    ></p>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            width: '5%',
            render: (_: any, record: Question) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa bài test">
                        <EditOutlined className="edit-icon" onClick={() => handleSetQuestion(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa bài test">
                        <Popconfirm
                            placement="right"
                            title={'Bạn có muốn xóa ?'}
                            onConfirm={() => deleteQuestionApis(record._id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <DeleteOutlined className="delete-icon" />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const onSearch = (value: any) => {
        if (value) {
            setParamSearch({
                ...value,
                testId: params.id || undefined,
            });
        }
    };

    const filter = useMemo(() => {
        return <FilterQuestion onSearch={onSearch} isRefresh={isRefresh}></FilterQuestion>;
    }, [isRefresh]);

    const tableQuestion = useMemo(() => {
        if (!paramSearch) return null;

        return <MyPage pageApi={getQuestionsApi} paramSearch={paramSearch} tableOptions={tableColumns}></MyPage>;
    }, [paramSearch]);

    return (
        <>
            {filter}
            {tableQuestion}
        </>
    );
};

export default ListQuestion;
