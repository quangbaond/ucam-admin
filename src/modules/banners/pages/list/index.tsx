import React, {useEffect, useMemo, useState} from 'react';
import MyPage, {MyPageTableOptions} from "@/components/business/page";
import {deleteMentorIntroduceApi, findMentorIntroduceApi, updateMentorIntroduceApi} from "@/modules/banners/api";
import {MentorIntroduce} from "@/interface/mentor";
import {StatusEnum} from "@/interface";
import {Popconfirm, Space, Switch} from "antd";
import {AiOutlineDelete, AiOutlineEdit} from "react-icons/ai";
import {callbackApi} from "@/common";
import {ListProps} from "@/modules/banners/dto";
import Filter from "@/modules/banners/components/filter";

const MentorIntroduceList = (props: ListProps) => {

    const [paramSearch, setParamSearch] = useState<null | object>(null);
    const {isRefresh, setIdActive } = props;

    const updateStatus = async (checked: boolean, id: string): Promise<void> => {
        const status = checked ? StatusEnum.ACTIVE : StatusEnum.INACTIVE;
        const res: any = await updateMentorIntroduceApi(id, {status: status});

        callbackApi(res, 'Cập nhật trạng thái thành công', () => {
        })
    };


    const deleteSubject = async (value: MentorIntroduce): Promise<void> => {
        const response: any = await deleteMentorIntroduceApi(value._id);

        callbackApi(response, 'Xóa thành công', () => {
            setParamSearch({
                ...paramSearch,
            })
        })
    };

    const tableColumns: MyPageTableOptions<MentorIntroduce> = [
        {
            title: 'Tên mentor',
            key: '_id',
            dataIndex: ['mentor', 'fullName'],
        },
        {
            title: 'Môn học',
            key: '_id',
            dataIndex: ['subjectId', 'name'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: '_id',
            width: '10%',
            align: 'center' as const,
            render: (status: string, record: MentorIntroduce) => (
                <>
                    {status === StatusEnum.ACTIVE ? (
                        <Switch
                            defaultChecked
                            onClick={(checked: boolean, _) => {
                                updateStatus(checked, record._id as string).then(r => {
                                });
                            }}
                        />
                    ) : (
                        <Switch
                            onClick={(checked: boolean, _) => {
                                updateStatus(checked, record._id as string).then(r => {
                                });
                            }}
                        />
                    )}
                </>
            ),
        },
        {
            title: 'Hành động',
            key: '_id',
            align: 'center' as const,
            width: '10%',
            render: (_, record) => (
                <div className="display-center">
                    <Space size="middle">
                        <AiOutlineEdit className="icon-button" onClick={() => {
                            setIdActive(record)
                        }}/>

                        <Popconfirm
                            placement="right"
                            title={'Xác nhận xoá bản ghi?'}
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() => deleteSubject(record)}
                        >
                            <AiOutlineDelete className="icon-button-delete icon-button"/>
                        </Popconfirm>
                    </Space>
                </div>
            ),
        },
    ];
    const renderTable = useMemo(() => {
        if(!paramSearch) return

        return <MyPage pageApi={findMentorIntroduceApi} paramSearch={paramSearch} tableOptions={tableColumns}></MyPage>
    }, [paramSearch])

    return (
        <>
            <Filter
                onSearch={(value: any) => {
                    setParamSearch(value)
                }}
                isRefresh={isRefresh}
            />
            {renderTable}
        </>
    );
};

export default MentorIntroduceList;
