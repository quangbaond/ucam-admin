// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import './index.less';

import { Button, Card } from 'antd';
import React, { useState } from 'react';

import UserListForm from './list';

const WithDraw: React.FC = () => {
    const [resetForm, setResetForm] = useState(0);

    return (
        <div className="course-page">
            <Card
                title={'Danh sách rút điểm'}
                bordered={true}
                hoverable
                extra={
                    <>
                        <Button type="primary" onClick={() => setResetForm(resetForm + 1)}>
                            Xóa bộ lọc
                        </Button>
                    </>
                }
            >
                <UserListForm resetForm={resetForm} />
            </Card>
        </div>
    );
};

export default WithDraw;
