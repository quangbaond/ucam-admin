import type { MyPageTableOptions } from '@/components/business/page';
import type { ModelEnum, PageData } from '@/interface';
import type { ActivationCode } from '@/modules/activations/dto';

import { Button, Col, Divider, Drawer, message, Popconfirm, Row, Space, Switch, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import MyTable from '@/components/core/table';
import { StatusEnum } from '@/interface';
import {
    createActivationCodeApi,
    deleteActivationCodeApi,
    findAllActivationCodeApi,
    updateActivationCodeApi,
} from '@/modules/activations/api';
import { useStates } from '@/utils/use-states';

interface ActivationDrawerProps {
    targetId?: string;
    targetModel?: ModelEnum;
    openActivationCodeDrawer: boolean;
    setOpenActivationCodeDrawer: any;
}

const ActivationDrawer = (props: ActivationDrawerProps) => {
    const { targetId, targetModel, openActivationCodeDrawer, setOpenActivationCodeDrawer } = props;

    const [form] = MyForm.useForm();
    const [reloadTable, setReloadTable] = useState(false);
    const [pageData, setPageData] = useStates<PageData<ActivationCode>>({
        limit: 10,
        page: 1,
        totalDocs: 0,
        docs: [],
    });

    const createActionCode = async () => {
        const values = await form.validateFields();

        if (targetId) {
            const payload = {
                targetId: targetId,
                targetModel: targetModel,
                limitAccess: values.limitAccess,
                activationCode: values.activationCode,
            };
            const res = await createActivationCodeApi(payload);

            if (res.status) {
                form.resetFields();
                setReloadTable(!reloadTable);
            } else {
                message.error(res.message);
            }
        }
    };

    const deleteActivationCode = async (id: string) => {
        const res = await deleteActivationCodeApi(id);

        if (res.status) {
            setReloadTable(!reloadTable);
            message.success('Xoá code thành công');
        } else {
            message.error('Đã xảy ra lỗi khi xoá code');
        }
    };

    const tableColumns: MyPageTableOptions<ActivationCode> = [
        {
            title: 'Mã code',
            key: 'activationCode',
            dataIndex: 'activationCode',
            width: '25%',
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
            render: (status: string, record: ActivationCode) => (
                <>
                    {status === StatusEnum.ACTIVE ? (
                        <Switch
                            defaultChecked
                            onClick={(checked: boolean, _) => {
                                updateStatus(checked, record._id as string);
                            }}
                        />
                    ) : (
                        <Switch
                            onClick={(checked: boolean, _) => {
                                updateStatus(checked, record._id as string);
                            }}
                        />
                    )}
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

    const updateStatus = async (checked: boolean, id: string) => {
        const status = checked ? StatusEnum.ACTIVE : StatusEnum.INACTIVE;
        const res = await updateActivationCodeApi(id, { status: status });

        if (res) {
            message.success('Cập nhật trạng thái thành công');
        }
    };

    const onPageChange = (page: number, limit?: number) => {
        setPageData({ page });

        if (limit) {
            setPageData({ limit });
        }
    };

    const getPageData = useCallback(async () => {
        if (targetId) {
            const res = await findAllActivationCodeApi({
                filterQuery: { targetId: targetId, targetModel: targetModel },
                options: { limit: pageData.limit, page: pageData.page },
            });

            if (res.status) {
                setPageData({ totalDocs: res.result.totalDocs, docs: res.result.docs });
            }

            if (res.status) {
                setPageData({ totalDocs: res.result.totalDocs, docs: res.result.docs });
            }
        }
    }, [targetId, targetModel, reloadTable, pageData.limit, pageData.page]);

    useEffect(() => {
        getPageData();
    }, [getPageData]);

    return (
        <>
            <Drawer
                title={'Danh sách mã code'}
                width={'50%'}
                onClose={() => setOpenActivationCodeDrawer(false)}
                open={openActivationCodeDrawer}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={() => setOpenActivationCodeDrawer(false)}>Đóng</Button>
                        <Button onClick={createActionCode} type="primary">
                            Thêm
                        </Button>
                    </Space>
                }
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
                                innerProps={{ placeholder: 'Giới hạn', allowClear: true, min: 1 }}
                                required
                            />
                        </Col>
                    </Row>
                </MyForm>
                <Divider></Divider>
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
            </Drawer>
        </>
    );
};

export default ActivationDrawer;
