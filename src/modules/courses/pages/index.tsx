import './index.less';

import { Button, Card } from 'antd';
import React, { useMemo, useState } from 'react';

import { ActionEnum } from '@/const';

import CourseCreateForm from './create';
import CourseListForm from './list';

const CourseForm: React.FC = () => {
    const [state, setState] = useState({
        action: ActionEnum.LIST,
        title: 'Danh sách khoá học',
    });

    const renderByAction = useMemo(() => {
        switch (state.action) {
            case ActionEnum.CREATE:
                return <CourseCreateForm />;
            default:
                return <CourseListForm />;
        }
    }, [state]);

    return (
        <div className="course-page">
            <Card
                title={state.title}
                bordered={true}
                hoverable
                extra={
                    state.action === ActionEnum.LIST ? (
                        <>
                            <Button
                                onClick={() =>
                                    setState({
                                        action: ActionEnum.CREATE,
                                        title: 'Thêm mới khoá học',
                                    })
                                }
                                type="primary"
                            >
                                Thêm mới
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={() =>
                                    setState({
                                        action: ActionEnum.LIST,
                                        title: 'Danh sách khoá học',
                                    })
                                }
                                type="primary"
                            >
                                Danh sách
                            </Button>
                        </>
                    )
                }
            >
                {renderByAction}
            </Card>
        </div>
    );
};

export default CourseForm;
