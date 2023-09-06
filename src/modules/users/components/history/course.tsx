import type { iDocumentProps } from '../../dto/login';

import { Button, Card, Col, Form, Input, Row, Table, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { settings } from '@/api/const';
import { exportFile, fileName, useConvertSlug } from '@/common';
import { PlanEnum } from '@/interface';

const Course = (props: iDocumentProps) => {
    const { data, isRefresh } = props;
    const [dataHistory, setDataHistory] = useState<any>([]);

    const [dataExport, setDataExport] = useState<any>([]);

    useEffect(() => {
        if (data) {
            setDataHistory(data);
            setDataExport(
                data.map((item: any) => {
                    return {
                        'Tên khóa học': item?.course?.name,
                        'Mã code sử dụng': item?.activation?.activationCode,
                        'Số điểm': item?.course?.cost,
                        'Loại khóa học': item?.course?.plan === PlanEnum.FREE ? 'Miễn phí' : 'Trả phí',
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
            title: 'Tên khóa học',
            key: '_id',
            dataIndex: 'course',
            render: (_: any, record: any) => (
                <a
                    target="_blank"
                    href={`${settings.MENTOR_URL}/courses/${useConvertSlug(
                        record?.course?.subjectId?.name,
                    )}/${useConvertSlug(record?.course?.name)}`}
                >
                    {' '}
                    {record.course.name}
                </a>
            ),
        },
        {
            title: 'Mã code sử dụng',
            key: '_id',
            dataIndex: 'activation',
            render: (_: any, record: any) => <p>{record?.course?.cost}</p>,
        },
        {
            title: 'Số điểm',
            key: '_id',
            dataIndex: 'cost',
            render: (_: any, record: any) => <p>{record?.activation?.activationCode}</p>,
        },
        {
            title: 'Loại khóa học',
            key: '_id',
            dataIndex: 'document.plan',
            render: (_: any, record: any) => (
                <Tag color={record.course.plan === PlanEnum.FREE ? 'green' : 'blue'}>
                    {record.course.plan === PlanEnum.FREE ? 'Miễn phí' : 'Trả phí'}
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
                return item?.course?.name.toLowerCase().includes(value.toLowerCase());
            });
        }

        setDataHistory(filterData);

        setDataExport(
            filterData.map((item: any) => {
                return {
                    'Tên khóa học': item?.course?.name,
                    'Mã code sử dụng': item?.activation?.activationCode,
                    'Số điểm': item?.course?.cost,
                    'Loại khóa học': item?.course?.plan === PlanEnum.FREE ? 'Miễn phí' : 'Trả phí',
                    'Ngày sử dụng': moment(item.createdAt).format('YYYY-MM-DD'),
                };
            }),
        );
    };

    const fileN = `Danh sách khóa học-${dataHistory[0]?.user?.fullName}-${fileName}`;

    const handleExport = () => {
        exportFile(dataExport, fileN);
    };

    return (
        <Card
            title="Danh sách khóa học"
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

export default Course;
