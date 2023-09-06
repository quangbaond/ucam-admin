import type { InfoProps, MentorSubject } from '../dto';
import type { ColumnsType } from 'antd/es/table';

import { Button, Card, Modal, Table } from 'antd';

import { settings } from '@/api/const';

const Info = (props: InfoProps) => {
    const { open, onCancel, data } = props;
    const tableColumns: ColumnsType<MentorSubject> = [
        {
            title: 'Môn học',
            dataIndex: '_id',
            width: '30%',
        },
        {
            title: 'Chứng chỉ',
            dataIndex: 'files',
            render: (files: { url: string }[]) => {
                return (
                    files &&
                    files.map((file: any) => {
                        return (
                            <p>
                                <a href={settings.FILE_URL + '/' + file?.url} target="_blank" rel="noreferrer">
                                    {settings.FILE_URL + '/' + file?.url}
                                </a>
                            </p>
                        );
                    })
                );
            },
            width: '30%',
        },
        {
            title: 'Trình độ',
            dataIndex: 'universityDegree',
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            width={'70%'}
            footer={
                <>
                    <Button type="primary" onClick={onCancel}>
                        Thoát
                    </Button>
                </>
            }
        >
            <Card title="Thông tin cá nhân" bordered>
                <Table bordered dataSource={data} columns={tableColumns} />
            </Card>
        </Modal>
    );
};

export default Info;
