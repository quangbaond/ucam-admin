// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import './index.less';

import { Button, Card, message } from 'antd';
import React, { useState } from 'react';

import { path } from '@/api/path';
import { exportExcel, exportFile, fileName } from '@/common';

import UserListForm from './list';

const Users: React.FC = () => {
    const [params, setParams] = useState({});
    const fileExportName = `Danh sách người dùng - ${fileName}`; // file name export to csv
    const [resetForm, setResetForm] = useState(0);

    const handelExportExcel = async () => {
        const response = await exportExcel(path.edu.findUsers, params);

        if (response.length) {
            const data = response.map(item => {
                return {
                    'Họ và tên': item?.fullName,
                    Email: item?.email,
                    'Số điện thoại': item?.phoneNumber,
                    'Trường học': item?.education?.name,
                    'Trạng thái': item?.status ? 'Đã kích hoạt' : 'Chưa kích hoạt',
                    'Quyền hạn': item?.role === 'admin' ? 'Quản trị viên' : 'Người dùng',
                };
            });

            exportFile(data, fileExportName);
        } else {
            message.error('Không có dữ liệu để xuất file');
        }
    };

    return (
        <div className="course-page">
            <Card
                title={'Danh sách người dùng'}
                bordered={true}
                hoverable
                extra={
                    <>
                        <Button type="primary" onClick={() => setResetForm(resetForm + 1)}>
                            Xóa bộ lọc
                        </Button>
                        <Button type="primary" onClick={() => handelExportExcel()}>
                            Xuất Excel
                        </Button>
                    </>
                }
            >
                <UserListForm
                    resetForm={resetForm}
                    setParamExport={value => {
                        console.log('value', value);
                        setParams(value);
                    }}
                />
            </Card>
        </div>
    );
};

export default Users;
