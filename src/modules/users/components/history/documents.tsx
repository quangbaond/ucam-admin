import type { iDocumentProps } from '../../dto/login';

import { Button, Card, Col, Form, Input, Row, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { settings } from '@/api/const';
import { exportFile, fileName } from '@/common';
import { PlanEnum } from '@/interface';

const Document = (props: iDocumentProps) => {
    const { data, isRefresh } = props;

    const [dataHistory, setDataHistory] = useState<any>([]);
    const [dataExport, setDataExport] = useState<any>([]);

    useEffect(() => {
        if (data) {
            setDataHistory(data);
            setDataExport(
                data.map((item: any) => {
                    return {
                        'Tên tài liệu': item?.document?.name,
                        'Mã code sử dụng': item?.activation?.activationCode,
                        'Số điểm': item?.document?.cost,
                        'Loại tài liệu': item?.document?.plan === PlanEnum.FREE ? 'Miễn phí' : 'Trả phí',
                        'Ngày sử dụng': moment(item.createdAt).format('YYYY-MM-DD'),
                    };
                }),
            );
        }
    }, [data]);

    useEffect(() => {
        if (isRefresh !== null) {
            setDataHistory(data);
        }
    }, [isRefresh]);
    const tableColumns = [
        {
            title: 'Tên tài liệu',
            key: '_id',
            dataIndex: 'document',
            render: (_: any, record: any) => (
                <a target="_blank" href={`${settings.MENTOR_URL}/documents/${btoa(record.document._id)}`}>
                    {' '}
                    {record?.document?.name}
                </a>
            ),
        },

        {
            title: 'Mã code sử dụng',
            key: '_id',
            dataIndex: 'activation',
            render: (_: any, record: any) => <p>{record?.activation?.activationCode}</p>,
        },
        {
            title: 'Số điểm',
            key: '_id',
            dataIndex: 'cost',
            render: (_: any, record: any) => <p>{record?.document?.cost}</p>,
        },
        {
            title: 'Loại tài liệu',
            key: '_id',
            dataIndex: 'document.plan',
            render: (_: any, record: any) => (
                <Tag color={record?.document?.plan === PlanEnum.FREE ? 'green' : 'blue'}>
                    {record.document.plan === PlanEnum.FREE ? 'Miễn phí' : 'Trả phí'}
                </Tag>
            ),
        },

        {
            title: 'Ngày sử dụng',
            key: '_id',
            dataIndex: 'createdAt',
            render: (value: string) => <p>{moment(value).format('YYYY-MM-DD')}</p>,
        },
    ];

    const handleSearch = (value: string, column: string) => {
        let filterData: any = [];

        if (column === 'name') {
            filterData = data.filter((item: any) => {
                return item?.document?.name?.toLowerCase().includes(value.toLowerCase());
            });
        }

        setDataHistory(filterData);
        setDataExport(
            filterData.map((item: any) => {
                return {
                    'Tên tài liệu': item?.document?.name,
                    'Mã code sử dụng': item?.activation?.activationCode,
                    'Số điểm': item?.document?.cost,
                    'Loại tài liệu': item?.document?.plan === PlanEnum.FREE ? 'Miễn phí' : 'Trả phí',
                    'Ngày sử dụng': moment(item.createdAt).format('YYYY-MM-DD'),
                };
            }),
        );
    };

    const fileN = `Danh sách tài liệu-${dataHistory[0]?.user?.fullName}-${fileName}`;

    const handleExport = () => {
        exportFile(dataExport, fileN);
    };

    return (
        <Card
            title="Danh sách tài liệu"
            extra={
                <>
                    <Button type="primary" onClick={() => handleExport()}>
                        Xuất Excel
                    </Button>
                </>
            }
        >
            <Form layout="vertical">
                <Row gutter={10}>
                    <Col span={24}>
                        <Form.Item name="search" label="Tìm kiếm">
                            <Input onChange={e => handleSearch(e.target.value, 'name')} allowClear></Input>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table bordered dataSource={dataHistory} columns={tableColumns}></Table>
        </Card>
    );
};

export default Document;
