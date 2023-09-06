import type { UploadProps } from 'antd';

import { InboxOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import React from 'react';

import { settings } from '@/api/const';
import { callbackApi } from '@/common';

import { uploadSubjectApi } from '../api';

const { Dragger } = Upload;

const UploadFile = (props: any): React.ReactElement => {
    const { isModalOpen, setIsModalOpen, refreshTable, testId } = props;
    const [urlAttachment, setUrlAttachment] = React.useState<any[]>([]);
    const uploadFileAttachment: UploadProps = {
        name: 'attachment',
        multiple: true,
        maxCount: 1,
        listType: 'picture',
        accept: 'xlsx, xls',
        action: settings.FILE_URL + '/upload/attachments',
        onChange(info) {
            const { status } = info.file;

            if (status === 'done') {
                message.success(`Tải file ${info.file.name} thành công.`);
                setUrlAttachment(info.file.response);
                console.log(info.file.response);
            } else if (status === 'error') {
                message.error(`Tải file ${info.file.name} thất bại.`);
            }
        },
    };

    const onSubmit = async () => {
        const payload = {
            url: urlAttachment[0].url,
            educationId: testId,
        };
        const response: any = await uploadSubjectApi(payload);

        callbackApi(response, 'Tải lên môn học thành công!', () => {
            setIsModalOpen(false);
            refreshTable();
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setUrlAttachment([]);
    };

    return (
        <Modal
            title="Tải lên môn học"
            open={isModalOpen}
            onOk={onSubmit}
            onCancel={handleCancel}
            okText="Tải lên"
            cancelText="Hủy"
        >
            <Dragger {...uploadFileAttachment}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                <p className="ant-upload-hint">Hỗ trợ tải lên một tệp. Tệp sẽ được tải lên ngay khi bạn chọn chúng.</p>
            </Dragger>
        </Modal>
    );
};

export default UploadFile;
