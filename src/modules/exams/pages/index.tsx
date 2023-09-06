import type { Exam } from '../dto';

import { Button, Card } from 'antd';
import React, { useState } from 'react';

import ActivationDrawer from '@/modules/activations/pages/drawer';

import FormExam from '../components/FormExam';
import ListUser from '../components/ListUser';
import ExamListForm from './list';

const ExamForm: React.FC = () => {
    const [openFormCreate, setOpenFormCreate] = useState(false);
    const [exam, setExam] = useState<Exam | null>(null);
    const [openActivationCodeDrawer, setOpenActivationCodeDrawer] = useState(false);
    const [openFormEdit, setOpenFormEdit] = useState<boolean>(false);
    const [openListUser, setOpenListUser] = useState<boolean>(false);
    const [isRefresh, setIsRefresh] = useState<boolean | null>(null);

    const handleSetExam = (type: string, record: Exam) => {
        switch (type) {
            case 'activation':
                setExam(record);
                setOpenActivationCodeDrawer(true);
                break;
            case 'edit':
                setExam(record);
                setOpenFormEdit(true);
                break;
            case 'listUser':
                setExam(record);
                setOpenListUser(true);
            default:
                break;
        }
    };

    return (
        <div className="exam-page">
            <Card
                title="Danh sách"
                bordered={true}
                hoverable
                extra={
                    <>
                        <Button type="primary" onClick={() => setIsRefresh(!isRefresh)}>
                            Xóa bộ lọc
                        </Button>
                        <Button onClick={() => setOpenFormCreate(true)} type="primary">
                            Thêm mới
                        </Button>
                    </>
                }
            >
                <ExamListForm isRefresh={isRefresh} handleSetExam={(type, record) => handleSetExam(type, record)} />
                {openFormCreate && (
                    <FormExam open={openFormCreate} onClose={() => setOpenFormCreate(false)} type="create" />
                )}
                {openFormEdit && exam && (
                    <FormExam open={openFormEdit} onClose={() => setOpenFormEdit(false)} type="edit" id={exam._id} />
                )}
                {exam && openActivationCodeDrawer && (
                    <ActivationDrawer
                        targetId={exam._id}
                        targetModel={exam.type}
                        openActivationCodeDrawer={openActivationCodeDrawer}
                        setOpenActivationCodeDrawer={setOpenActivationCodeDrawer}
                    />
                )}
                {exam && openListUser && (
                    <ListUser
                        open={openListUser}
                        onClose={(isRefresh: boolean) => {
                            if (isRefresh) {
                                setIsRefresh(isRefresh => !isRefresh);
                            }

                            setOpenListUser(false);
                        }}
                        exam={exam}
                    />
                )}
            </Card>
        </div>
    );
};

export default ExamForm;
