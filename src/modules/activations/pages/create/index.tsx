import type { MyPageTableOptions } from '@/components/business/page';
import type { PageData } from '@/interface';
import type { ActivationCode } from '@/modules/activations/dto';

import './index.less';

import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, message, Modal, Popconfirm, Row, Space, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import MyTable from '@/components/core/table';
import { ModelEnum } from '@/interface';
import { createActivationCodeApi, deleteActivationCodeApi, findAllActivationCodeApi } from '@/modules/activations/api';
import { useStates } from '@/utils/use-states';

interface CreateActivationCodeProps {
    courseId: string;
}

const CreateActivationCode = (props: CreateActivationCodeProps) => {
    const { courseId } = props;
    const [openModal, setOpenModal] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const [form] = MyForm.useForm();
    const [pageData, setPageData] = useStates<PageData<ActivationCode>>({
        limit: 10,
        page: 1,
        totalDocs: 0,
        docs: [],
    });

    const createActionCode = async () => {
        const values = await form.validateFields();
        const payload = {
            targetId: courseId,
            targetModel: ModelEnum.COURSE,
            limitAccess: values.limitAccess,
            activationCode: values.activationCode,
        };
        const res = await createActivationCodeApi(payload);

        if (res.status) {
            setOpenModal(false);
            setReloadTable(!reloadTable);
            message.success('Thêm code thành công!');
            form.resetFields();
        }
    };

    const deleteActivationCode = async (id: string) => {
        const res = await deleteActivationCodeApi(id);

        if (res.status) {
            setReloadTable(!reloadTable);
            message.success('Xoá code thành công!');
        } else {
            message.error('Xoá code không thành công!');
        }
    };

    const tableColumns: MyPageTableOptions<ActivationCode> = [
        {
            title: 'Mã code',
            key: 'activationCode',
            dataIndex: 'activationCode',
            width: '25%',
            render: question => (
                <div
                    dangerouslySetInnerHTML={{
                        __html: `${question}`,
                    }}
                />
            ),
        },
        {
            title: 'Giới hạn',
            key: 'limitAccess',
            dataIndex: 'limitAccess',
            width: '20%',
        },
        {
            title: 'Đã sử dụng',
            key: 'used',
            dataIndex: 'used',
            width: '20%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: '_id',
            align: 'center' as const,
            render: status => (
                <>
                    <Tag color="blue" key={status}>
                        {status}
                    </Tag>
                </>
            ),
        },

        {
            title: 'Hành động',
            key: '_id',
            width: '20%',
            align: 'center' as const,
            render: (_, record) => (
                <div className="display-center">
                    <Space size="middle">
                        <Popconfirm
                            placement="right"
                            title={'Bạn có muốn xoá mã code?'}
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() => deleteActivationCode(record._id as string)}
                        >
                            <AiOutlineDelete className="icon-button-delete" />
                        </Popconfirm>
                    </Space>
                </div>
            ),
        },
    ];

    const onPageChange = (page: number, limit?: number) => {
        setPageData({ page });

        if (limit) {
            setPageData({ limit });
        }
    };

    const getPageData = useCallback(async () => {
        if (courseId) {
            const res = await findAllActivationCodeApi({
                filterQuery: { targetId: courseId },
                options: { limit: pageData.limit, page: pageData.page },
            });

            if (res.status) {
                setPageData({ totalDocs: res.result.totalDocs, docs: res.result.docs });
            }

            if (res.status) {
                setPageData({ totalDocs: res.result.totalDocs, docs: res.result.docs });
            }
        }
    }, [courseId, reloadTable, pageData.limit, pageData.page]);

    useEffect(() => {
        getPageData();
    }, [getPageData]);

    return (
        <>
            <MyTable
                dataSource={pageData.docs}
                columns={tableColumns}
                rowKey="_id"
                pagination={{
                    current: pageData.page,
                    pageSize: pageData.limit,
                    total: pageData.totalDocs,
                    onChange: onPageChange,
                }}
            />
            <Button
                style={{ marginTop: 20 }}
                onClick={() => setOpenModal(true)}
                icon={<PlusCircleOutlined style={{ color: 'green' }} />}
            >
                Mã code mới
            </Button>
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={createActionCode}
                title={'Tạo code'}
                okText={'Xác nhận'}
                cancelText={'Huỷ'}
            >
                <MyForm layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={19}>
                            <MyFormItem
                                label="Code"
                                type="input"
                                name="activationCode"
                                innerProps={{ placeholder: 'Nhập code', allowClear: true }}
                                required
                            />
                        </Col>
                        <Col span={5}>
                            <MyFormItem
                                label="Giới hạn"
                                type="input-number"
                                name="limitAccess"
                                innerProps={{
                                    placeholder: 'Giới hạn',
                                    allowClear: true,
                                    min: 1,
                                }}
                                required
                            />
                        </Col>
                    </Row>
                </MyForm>
            </Modal>
        </>
    );
};

export default CreateActivationCode;
