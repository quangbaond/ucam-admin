import { Button, Card } from 'antd';
import React, { useState } from 'react';

import MentorList from '@/modules/mentor/page/list';

const MentorFrom: React.FC = () => {
    const [resetForm, setResetForm] = useState(true);

    return (
        <>
            <Card
                title="Danh sách mentor"
                bordered={true}
                hoverable
                extra={
                    <>
                        <Button type="primary" onClick={() => setResetForm(resetForm => !resetForm)}>
                            Xoá bộ lọc
                        </Button>
                    </>
                }
            >
                <MentorList isRefresh={resetForm} />
            </Card>
        </>
    );
};

export default MentorFrom;
