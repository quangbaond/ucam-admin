import '../index.less';

import { Button, Card } from 'antd';
import React, { useMemo, useState } from 'react';

import FormComponent from '../components/form';
import List from './list';

const CourseForm: React.FC = () => {
    const [resetForm, setResetForm] = useState<boolean>(false);
    const [idActive, setIdActive] = useState<string>('');
    const [isShowFormUpdate, setIsShowFormUpdate] = useState<boolean>(false);
    const [isShowFormCreate, setIsShowFormCreate] = useState<boolean>(false);

    const closeForm = (reload: boolean | null) => {
        setIsShowFormCreate(false);
        setIsShowFormUpdate(false);

        if (reload) {
            setResetForm(!resetForm);
        }
    };

    const handelCreate = () => {
        setIsShowFormCreate(true);
        setIdActive('');
    };

    const handelUpdate = (id: string) => {
        setIsShowFormUpdate(true);
        setIdActive(id);
    };

    const renderList = useMemo(() => {
        return <List resetForm={resetForm} handelUpdate={id => handelUpdate(id)} />;
    }, [resetForm]);

    return (
        <div className="course-page">
            <Card
                title="Danh sách trường học"
                bordered={true}
                hoverable
                extra={
                    <>
                        <Button type="primary" onClick={() => setResetForm(!resetForm)}>
                            Xóa bộ lọc
                        </Button>
                        <Button type="primary" onClick={() => handelCreate()}>
                            Thêm mới Trường học
                        </Button>
                    </>
                }
            >
                {renderList}
            </Card>
            {isShowFormCreate && (
                <FormComponent
                    id={idActive}
                    type="create"
                    isShowForm={isShowFormCreate}
                    closeForm={(reload: boolean | null) => closeForm(reload)}
                />
            )}
            {isShowFormUpdate && idActive && (
                <FormComponent
                    id={idActive}
                    type="update"
                    isShowForm={isShowFormUpdate}
                    closeForm={(reload: boolean | null) => closeForm(reload)}
                />
            )}
        </div>
    );
};

export default CourseForm;
