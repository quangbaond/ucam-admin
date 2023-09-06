import type { iDocumentProps } from '../../dto/login';

import { Button, Card, Col, Form, Input, Row, Table, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';

import { settings } from '@/api/const';
import { exportExcel, exportFile, fileName } from '@/common';
import { PlanEnum } from '@/interface';

const Result = (props: iDocumentProps) => {
    const { data, isRefresh } = props;

    const [dataHistory, setDataHistory] = useState<any>([]);

    const [dataExport, setDataExport] = useState<any>([]);

    const exportRef = React.useRef<any>(null);

    useEffect(() => {
        if (data) {
            setDataHistory(data);
            setDataExport(
                data.map((item: any) => {
                    return {
                        'Tên tài liệu': item?.testId?.name,
                        Điểm: item?.point,
                        'Loại bài thi': item?.testId?.plan === PlanEnum.FREE ? 'Miễn phí' : 'Trả phí',
                        'Trạng thái': item?.status,
                        'Số câu đúng': item?.totalCorrectAnswer,
                        'Ngày làm bài': moment(item?.submitDate).format('YYYY-MM-DD'),
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
            title: 'Tên bài thi',
            key: '_id',
            dataIndex: 'testId',
            render: (_: any, record: any) => (
                <a target="_blank" href={`${settings.MENTOR_URL}/tests/${record?.testId?._id})}`}>
                    {' '}
                    {record?.testId?.name}
                </a>
            ),
        },

        {
            title: 'Điểm',
            key: '_id',
            dataIndex: 'point',
            render: (_: any, record: any) => <p>{record.point}</p>,
        },
        {
            title: 'Loại bài thi',
            key: '_id',
            dataIndex: 'testId.plan',
            render: (_: any, record: any) => (
                <Tag color={record?.testId?.plan === PlanEnum.FREE ? 'green' : 'blue'}>
                    {record?.testId?.plan === PlanEnum.FREE ? 'Miễn phí' : 'Trả phí'}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            key: '_id',
            dataIndex: 'testId.status',
            render: (_: any, record: any) => (
                <Tag color={record?.status === 'PASS' ? 'green' : 'blue'}>{record?.status}</Tag>
            ),
        },

        {
            title: 'Số câu đúng',
            key: '_id',
            dataIndex: 'totalCorrectAnswer',
        },

        {
            title: 'Ngày làm bài',
            key: '_id',
            dataIndex: 'submitDate',
            render: (value: string) => <p>{moment(value).format('YYYY-MM-DD')}</p>,
        },
    ];

    const handleSearch = (value: string, column: string) => {
        let filterData: any = [];

        if (column === 'name') {
            filterData = data.filter((item: any) => {
                return item?.testId?.name.toLowerCase().includes(value.toLowerCase());
            });
        }

        setDataHistory(filterData);

        setDataExport(
            filterData.map((item: any) => {
                return {
                    'Tên tài liệu': item?.testId?.name,
                    Điểm: item?.point,
                    'Loại bài thi': item?.testId?.plan === PlanEnum.FREE ? 'Miễn phí' : 'Trả phí',
                    'Trạng thái': item?.status,
                    'Số câu đúng': item?.totalCorrectAnswer,
                    'Ngày làm bài': moment(item?.submitDate).format('YYYY-MM-DD'),
                };
            }),
        );
    };

    const fileN = `Danh sách bài thi-${dataHistory[0]?.userId?.fullName}-${fileName}`;

    const handleExport = () => {
        exportFile(dataExport, fileN);
    };

    return (
        <Card
            title="Danh sách bài thi"
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
            <CSVLink ref={exportRef} data={dataExport} filename={fileN}></CSVLink>
        </Card>
    );
};

export default Result;
