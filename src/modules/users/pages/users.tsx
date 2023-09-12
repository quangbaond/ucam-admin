import './index.less';

import { Button, Card } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { MenuEnum, PERMISSION_ENUM, TYPE_FORM_ENUM } from '@/interface';

import FormComponent from '../components/form';
import UserList from './list';

const Users: React.FC = () => {
    const [isShowForm, setIsShowForm] = useState<boolean>(false);
    const [id, setId] = useState<string>('');
    const [type, setType] = useState<TYPE_FORM_ENUM>(TYPE_FORM_ENUM.CREATE);
    const [reload, setReload] = useState<boolean>(false);

    const userModule = useSelector(state => state.user.modules);
    const userModuleItem = userModule.find(item => item.name === MenuEnum.USER);

    return (
        <>
            {userModuleItem?.permissions.includes(PERMISSION_ENUM.VIEW) ? (
                <div className="course-page">
                    <Card
                        title={'Danh sách người dùng'}
                        bordered={true}
                        extra={
                            <>
                                <Button type="primary">Xóa bộ lọc</Button>
                                {userModuleItem?.permissions.includes(PERMISSION_ENUM.CREATE) && (
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setIsShowForm(true);
                                            setId('');
                                            setType(TYPE_FORM_ENUM.CREATE);
                                        }}
                                    >
                                        Thêm mới
                                    </Button>
                                )}
                            </>
                        }
                    >
                        <UserList
                            editUser={(id: string) => {
                                setIsShowForm(true);
                                setId(id);
                                setType(TYPE_FORM_ENUM.EDIT);
                            }}
                            reload={reload}
                        />

                        {userModuleItem?.permissions.includes(PERMISSION_ENUM.EDIT) && (
                            <FormComponent
                                type={type}
                                isShowForm={isShowForm}
                                id={id}
                                closeForm={() => {
                                    setIsShowForm(false);
                                    setId('');
                                    setReload(!reload);
                                }}
                            />
                        )}
                    </Card>
                </div>
            ) : (
                'Bạn không được phép truy cập'
            )}
        </>
    );
};

export default Users;
