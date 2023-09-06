import type { Question } from '../dto';

import { Button, Card } from 'antd';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ActionEnum } from '@/const';

import UploadFile from '../components/UploadFile';
import QuestionDrawer from './drawer';
import ListQuestion from './list';

const ExamForm: React.FC = () => {
    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const [openQuestionDrawer, setOpenQuestionDrawer] = useState<boolean>(false);
    const [data, setData] = useState<Question>();
    const [isCreate, setIsCreate] = useState<boolean>(false);

    const handleSetQuestion = (question: Question) => {
        setIsCreate(false);
        setOpenQuestionDrawer(true);
        setData(question);
    };

    const refreshPage = () => {
        setIsRefresh(!isRefresh);
    };

    const params = useParams();
    const [isOpenUpload, setIsOpenUpload] = useState<boolean>(false);

    const tableQuestion = useMemo(() => {
        return <ListQuestion isRefresh={isRefresh} handleSetQuestion={handleSetQuestion} />;
    }, [isRefresh]);

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

                        {params.id && (
                            <Button
                                type="primary"
                                onClick={() => {
                                    setOpenQuestionDrawer(true);
                                    setIsCreate(true);
                                }}
                            >
                                Thêm mới
                            </Button>
                        )}

                        {params.id && (
                            <Button type="primary" onClick={() => setIsOpenUpload(true)}>
                                Tải lên câu hỏi
                            </Button>
                        )}
                    </>
                }
            >
                {tableQuestion}
                {params.id && (
                    <UploadFile
                        isModalOpen={isOpenUpload}
                        setIsModalOpen={() => setIsOpenUpload(false)}
                        refreshTable={() => {
                            setIsRefresh(!isRefresh);
                        }}
                        testId={params.id}
                    />
                )}
                {QuestionDrawer && isCreate && (
                    <QuestionDrawer
                        type={ActionEnum.CREATE}
                        open={openQuestionDrawer}
                        setOpenDrawer={setOpenQuestionDrawer}
                        refreshPage={refreshPage}
                        testId={params.id}
                        data={undefined}
                    ></QuestionDrawer>
                )}
                {QuestionDrawer && data && !isCreate && (
                    <QuestionDrawer
                        type={ActionEnum.EDIT}
                        testId={params.id}
                        open={openQuestionDrawer}
                        setOpenDrawer={setOpenQuestionDrawer}
                        refreshPage={refreshPage}
                        data={data}
                    ></QuestionDrawer>
                )}
            </Card>
        </div>
    );
};

export default ExamForm;
