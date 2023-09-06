import React, {useEffect, useMemo, useState} from "react";
import {Button, Col, Drawer, Image, Modal, Popconfirm, Radio, Row, Space, Tag, Tooltip} from "antd";
import {findAnswerApi, findPedagogyApi} from "@/modules/pedagogy/api";
import MyPage, {MyPageTableOptions} from "@/components/business/page";
import {Answer, Pedagogy, SubjectPedagogy} from "@/modules/pedagogy/dto";
import {CaretUpOutlined, EyeOutlined} from "@ant-design/icons";
import MyTable from "@/components/core/table";
import FilterAnswer from "@/modules/pedagogy/pages/drawer/filterAnswer";
import Filter from "@/modules/pedagogy/components/filter";


const DrawerAnswer = (props: any) => {
    const {open, onClose, idAnswer} = props;
    const [data, setData] = useState([]);
    const [resetFormAnswer, setResetFormAnswer] = useState(true);
    const [paramSearch, setParamSearch] = useState({});

    const handelSearch = (value: object) => {
        setParamSearch(value);
    };

    enum attachmentTypeEnum {
        IMAGE = 'image',
        VIDEO = 'video',
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataModal, setDataModal] = useState<any>({});
    const showModal = (e: any, value: Answer) => {
        setIsModalOpen(true);
        setDataModal(value)
    };


    const tableColumns: MyPageTableOptions<Answer> = [
        {
            title: 'Nội dung câu trả lời',
            key: '_id',
            dataIndex: 'answer',
            align: 'left',
            render: (_, record) => (
                <>
                    <p style={{
                        display: "inline-block",
                        width: "180px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}>
                        {record.answer}</p>
                </>
            )

        },
        {
            title: 'Người trả lời',
            width: "25%",
            key: '_id',
            dataIndex: ['userId', 'fullName'],
            align: 'center',

        },
        {
            title: 'Trạng thái',
            width: "20%",
            key: '_id',
            dataIndex: 'status',
            align: 'center',
            render: (status: boolean | null) => (
                <Tag color={
                    status == null ? 'gray' : (status === true ? 'green' : 'red')
                }>
                    {
                        status === null ? (
                            <p>Đang xử lý</p>
                        ) : (
                            <>
                                {
                                    status ? (
                                        <p>Được chấp nhận</p>
                                    ) : (
                                        <p>Không được chấp nhận</p>
                                    )
                                }
                            </>
                        )
                    }
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: '_id',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <div className="display-center">
                    <Space size="middle">

                        <Tooltip title="Chi tiết">
                            <EyeOutlined
                                onClick={(event) => showModal(event, record)}
                            />
                        </Tooltip>


                    </Space>
                </div>
            ),
        },
    ];
    useEffect(() => {
        const payload = {
            filterQuery: {
                ...paramSearch,
                pedagogyId: idAnswer
            },
            options: {
                pagination: false,
            }
        }
        const fetchDataById = async () => {
            const response: any = await findAnswerApi(payload);
            setData(response?.result?.docs);
        };

        fetchDataById()
    }, [idAnswer, paramSearch])
    const modalPreview = useMemo(() => {
        if (dataModal.attachment) {
            return (
                <Modal
                    title="Nội dung câu hỏi"
                    footer={<><Button onClick={() => setIsModalOpen(false)}>Đóng</Button></>}
                    open={isModalOpen}>
                    <>
                        <p>{dataModal.answer}</p>
                        {dataModal.attachment.map((attachments: any) => {

                                if (attachments.type === attachmentTypeEnum.IMAGE) {
                                    return <Image
                                        src={attachments.url}
                                        alt={'Câu hỏi'}
                                        width={100}
                                    ></Image>
                                } else if (attachments.type === attachmentTypeEnum.VIDEO) {
                                    return <a href={attachments.url}>{attachments.url}</a>
                                }
                            }
                        )}
                    </>
                </Modal>
            )
        }
    }, [dataModal, isModalOpen]);

    const filter = useMemo(() => {
        return <FilterAnswer onSearch={(value) => handelSearch(value)} resetForm={resetFormAnswer} />;
    }, [resetFormAnswer]);

    return (
        <>
            <Drawer title="Câu trả lời" placement="right" width='750'
                    onClose={onClose} open={open}
                    extra={
                        <>
                            <Button type="primary" onClick={() => setResetFormAnswer(resetFormAnswer => !resetFormAnswer)}>
                                Xoá bộ lọc
                            </Button>
                        </>
                    }>
                {filter}
                <MyTable
                    dataSource={data}
                    columns={tableColumns}
                />
                {modalPreview}

            </Drawer>
        </>
    );
};

export default DrawerAnswer;
