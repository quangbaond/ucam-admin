import type { MyPageTableOptions } from '@/components/business/page';
import type { Pedagogy, SubjectPedagogy } from '@/modules/pedagogy/dto';

import { CaretUpOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Image, message as $message, Modal, Popconfirm, Space, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

import MyPage from '@/components/business/page';
import { PlanEnum } from '@/interface';
import { deletePedagogyApi, findPedagogyApi } from '@/modules/pedagogy/api';
import Filter from '@/modules/pedagogy/components/filter';
import DrawerAnswer from '@/modules/pedagogy/pages/drawer';

const PedagogyList = (props: { isRefresh: boolean }) => {
    const { isRefresh } = props;
    const [paramSearch, setParamSearch] = useState<null | object>(null);
    const [idAnswer, setIdAnswer] = useState<string>('');

    const handelSearch = (value: object) => {
        setParamSearch(value);
    };

    enum attachmentTypeEnum {
        IMAGE = 'image',
        VIDEO = 'video',
    }

    const tableColumns: MyPageTableOptions<Pedagogy> = [
        {
            title: 'Nội dung câu hỏi',
            key: '_id',
            dataIndex: 'question',
            align: 'left',

            render: (_, record) => (
                <>
                    <p
                        style={{
                            display: 'inline-block',
                            width: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {record.question}
                    </p>
                </>
            ),
        },
        {
            title: 'Người hỏi',
            key: '_id',
            dataIndex: 'userId',
            align: 'left',
            width: '15%',
            render: (_, record) => (
                <>
                    <p>{record?.userId?.fullName}</p>
                </>
            ),
        },
        {
            title: 'Tên môn học',
            key: '_id',
            dataIndex: 'subjectId',
            align: 'left',
            render: (_, record) => (
                <>
                    {record.subjectId &&
                        record.subjectId.map((subject: SubjectPedagogy) => {
                            return <p>{subject.name}</p>;
                        })}
                </>
            ),
        },
        {
            title: 'Ngày hỏi',
            key: '_id',
            dataIndex: 'date',
            align: 'left',
            width: '10%',
            render: (_, record) => <p>{moment(record?.date).format('YYYY-MM-DD')}</p>,
        },
        {
            title: 'Loại câu hỏi',
            key: '_id',
            width: '10%',
            dataIndex: 'plan',
            align: 'center',
            render: (_, record) => (
                <Tag color={record?.plan === PlanEnum.PREMIUM ? 'red' : 'green'}>
                    {record?.plan === PlanEnum.PREMIUM ? 'Mất phí' : 'Miễn phí'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: '_id',
            width: '10%',
            align: 'center',
            render: (_, record) => (
                <div className="display-center">
                    <Space size="middle">
                        <Tooltip title="Câu trả lời">
                            <CaretUpOutlined
                                type="primary"
                                onClick={e => showDrawer(e, record._id)}
                                className="icon-button"
                            />
                        </Tooltip>
                        <Tooltip title="Chi tiết câu hỏi">
                            <EyeOutlined
                                onClick={event => showModal(event, record)}
                                className="icon-button"
                                style={{ color: '#000' }}
                            />
                        </Tooltip>

                        <Tooltip title="Xóa câu hỏi">
                            <Popconfirm
                                placement="right"
                                title={'Xác nhận xoá bản ghi?'}
                                okText="Có"
                                cancelText="Không"
                                onConfirm={() => deletePedagogy(record?._id)}
                            >
                                <AiOutlineDelete className="icon-button-delete icon-button" />
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                </div>
            ),
        },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataModal, setDataModal] = useState<any>({});
    const [open, setOpen] = useState(false);

    const showDrawer = (e: any, value: string) => {
        setIdAnswer(value);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const showModal = (e: any, value: Pedagogy) => {
        setIsModalOpen(true);
        setDataModal(value);
    };

    const deletePedagogy = async (id: string) => {
        const res = await deletePedagogyApi(id);

        if (res.status) {
            setParamSearch({
                ...paramSearch,
            });
            $message.success('Xoá bản ghi thành công');
        }
    };

    useEffect(() => {
        setParamSearch({});
    }, [isRefresh]);

    const tableData = useMemo(() => {
        if (!paramSearch) return;

        return <MyPage pageApi={findPedagogyApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch]);
    const filter = useMemo(() => {
        return <Filter onSearch={handelSearch} resetForm={isRefresh} />;
    }, [isRefresh]);

    const modalPreview = useMemo(() => {
        if (dataModal.attachment) {
            return (
                <Modal
                    title="Nội dung câu hỏi"
                    footer={
                        <>
                            <Button onClick={() => setIsModalOpen(false)}>Đóng</Button>
                        </>
                    }
                    open={isModalOpen}
                >
                    <>
                        <p>{dataModal.question}</p>
                        {dataModal.attachment.map((attachments: any) => {
                            if (attachments.type === attachmentTypeEnum.IMAGE) {
                                return <Image src={attachments.url} alt={'Câu hỏi'} width={100}></Image>;
                            } else if (attachments.type === attachmentTypeEnum.VIDEO) {
                                return <a href={attachments.url}>{attachments.url}</a>;
                            }
                        })}
                    </>
                </Modal>
            );
        }
    }, [dataModal, isModalOpen]);

    return (
        <>
            {filter}
            {tableData}
            {modalPreview}
            <DrawerAnswer open={open} onClose={onClose} idAnswer={idAnswer} />
        </>
    );
};

export default PedagogyList;
