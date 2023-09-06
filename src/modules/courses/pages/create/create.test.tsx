import type { MyPageTableOptions } from '@/components/business/page';
import type { PageData } from '@/interface';
import type { Exam } from '@/modules/exams/dto';
import type { Question } from '@/modules/questions/dto';
import type { UploadFile, UploadProps } from 'antd';

import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, message as $message, Modal, Popconfirm, Radio, Row, Space, Tabs, Tooltip } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { settings } from '@/api/const';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import MyTable from '@/components/core/table';
import { ActionEnum } from '@/const';
import { PlanEnum, TestTypeEnum } from '@/interface';
import { createExamApi, deleteExamsApi, findAllExamsApi } from '@/modules/exams/api';
import { deleteQuestionApi, getQuestionsApi, uploadQuestionsApi } from '@/modules/questions/api/';
import QuestionDrawer from '@/modules/questions/pages/drawer';
import { useStates } from '@/utils/use-states';

interface CourseTestListProps {
    courseId: string;
    subjectId: string;
}
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const CourseTestList = (props: CourseTestListProps) => {
    const { courseId, subjectId } = props;
    const [testForm] = MyForm.useForm();
    const [openTestDrawer, setOpenTestDrawer] = useState(false);
    const [uploadQuestionFile, setUploadQuestionFile] = useState<UploadFile[]>();

    const [reloadQuestion, setReloadQuestion] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteExam, setOpenDeleteExam] = useState(false);
    const [openCreateExamModal, setOpenCreateExamModal] = useState(false);
    const [openQuestionDrawer, setOpenQuestionDrawer] = useState(false);
    const [questionDetail, setQuestionDetail] = useState<Question>();
    const [testList, setTestList] = useState<any>([]);
    const [activeKey, setActiveKey] = useState<string>('');
    const [removeKey, setRemoveKey] = useState<TargetKey>();
    const [examData, setExamData] = useStates<PageData<Exam>>({
        limit: 10,
        page: 1,
        totalDocs: 0,
        docs: [],
    });
    const [questionData, setQuestionData] = useStates<PageData<Question>>({
        limit: 10,
        page: 1,
        totalDocs: 0,
        docs: [],
    });

    const createExam = async () => {
        const values = await testForm.validateFields();
        const payload = {
            name: values.name,
            plan: PlanEnum.PREMIUM,
            type: TestTypeEnum.TEST,
            subjectId: subjectId,
            courseId: courseId,
        };
        const res = await createExamApi(payload);

        if (res.status) {
            $message.success('Tạo bài thi thành công');
            setOpenCreateExamModal(false);
            setTestList([...testList, { label: res.result.name, key: res.result._id }]);
            setActiveKey(res.result._id);
        } else {
            $message.error('Tạo bài thi thất bại');
        }
    };

    const deleteQuestion = async (recordId: string) => {
        const res = await deleteQuestionApi(recordId);

        if (res.status) {
            setReloadQuestion(!reloadQuestion);
            $message.success('Xóa câu hỏi thành công');
        } else {
            $message.error('Xóa câu hỏi thất bại');
        }
    };

    const uploadQuestions = async () => {
        if (uploadQuestionFile) {
            const payload = {
                url: uploadQuestionFile[0]?.url as string,
                testId: activeKey,
            };

            const res = await uploadQuestionsApi(payload);

            if (res.status) {
                setReloadQuestion(!reloadQuestion);
                setUploadQuestionFile([]);
            }

            setOpenModal(false);
        }
    };

    const questionTableColumns: MyPageTableOptions<Question> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            align: 'center',
            width: '5%',
            render: (id, record, index) => {
                ++index;

                return index;
            },
            showSorterTooltip: false,
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'type',
            width: '45%',
            render: (_, record) => (
                <p
                    dangerouslySetInnerHTML={{
                        __html: `${record.question}`,
                    }}
                ></p>
            ),
        },
        {
            title: 'Đáp án',
            dataIndex: 'anwLength',
            width: '45%',
            render: (_, record) => {
                let choice = '';
                const inputType = record.type === 'SINGLE CHOICE' ? 'radio' : 'checkbox';

                record.choices?.forEach((c) => {
                    if (c.isCorrect) {
                        choice = choice.concat(`<Col span={4}><Input type='${inputType}' checked disabled> </Col>`);
                    } else {
                        choice = choice.concat(`<Col span={4}><Input type='${inputType}' disabled></Col>`);
                    }

                    choice = choice.concat(' ');
                    choice = choice.concat(`<Col span={20}>${c.answer}</Col>`);
                    choice = choice.concat('</br>');
                });

                return (
                    <p
                        dangerouslySetInnerHTML={{
                            __html: choice,
                        }}
                    ></p>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            width: '5%',
            render: (_: any, record: Question) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa bài test">
                        <EditOutlined
                            className="edit-icon"
                            onClick={() => {
                                setQuestionDetail(record);
                                setOpenQuestionDrawer(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa bài test">
                        <Popconfirm
                            placement="right"
                            title={'Bạn có muốn xóa ?'}
                            onConfirm={() => deleteQuestion(record._id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <DeleteOutlined className="delete-icon" />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const onQuestionPageChange = (page: number, limit?: number) => {
        ({ page });

        if (limit) {
            setQuestionData({ limit });
        }
    };

    const getPageData = useCallback(async () => {
        if (courseId) {
            const res = await findAllExamsApi({
                filterQuery: { courseId: courseId },
                options: { limit: examData.limit, page: examData.page },
            });

            if (res.status) {
                setTestList(
                    res.result.docs.map((exam: Exam) => {
                        return {
                            label: exam.name,
                            key: exam._id,
                        };
                    }),
                );
                setActiveKey(res.result.docs[0]._id);
                setExamData({ totalDocs: res.result.totalDocs, docs: res.result.docs });
            }
        }
    }, [courseId, examData.limit, examData.page]);

    const getQuestionPageData = useCallback(async () => {
        if (activeKey) {
            const res = await getQuestionsApi({
                filterQuery: { testId: activeKey },
                options: { limit: questionData.limit, page: questionData.page },
            });

            if (res.status) {
                setQuestionData({ totalDocs: res.result.totalDocs, docs: res.result.docs });
            }

            if (res.status) {
                setQuestionData({ totalDocs: res.result.totalDocs, docs: res.result.docs });
            }
        }
    }, [activeKey, reloadQuestion, questionData.limit, questionData.page]);

    useEffect(() => {
        getPageData();
    }, [getPageData]);

    useEffect(() => {
        getQuestionPageData();
    }, [getQuestionPageData]);

    const uploadQuestionProps: UploadProps = {
        name: 'attachment',
        multiple: false,
        action: `${settings.FILE_URL}/upload/attachments`,
        onChange(info) {
            const { status } = info.file;

            if (status === 'done') {
                setUploadQuestionFile(info.file.response);
                setOpenModal(true);
            } else if (status === 'error') {
                $message.error(`Tải file ${info.file.name} thất bại.`);
            }
        },
    };

    const remove = async () => {
        let newActiveKey = activeKey;
        let lastIndex = -1;

        const res = await deleteExamsApi(removeKey as string);

        if (res.status) {
            testList.forEach((item: any, i: number) => {
                if (item.key === removeKey) {
                    lastIndex = i - 1;
                }
            });
            const newPanes = testList.filter((item: any) => item.key !== removeKey);

            if (newPanes.length && newActiveKey === removeKey) {
                if (lastIndex >= 0) {
                    newActiveKey = newPanes[lastIndex].key;
                } else {
                    newActiveKey = newPanes[0].key;
                }
            }

            setTestList(newPanes);
            setActiveKey(newActiveKey);
            setOpenDeleteExam(false);
            $message.success('Xóa bài thi thành công');
        } else {
            $message.error('Xóa bài thi thất bại');
        }
    };

    const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
        if (action === 'add') {
            setOpenCreateExamModal(true);
        } else {
            setRemoveKey(targetKey);
            setOpenDeleteExam(true);
        }
    };

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    return (
        <>
            <Row gutter={16}>
                <Col span={20}>
                    <Tabs
                        onEdit={onEdit}
                        tabPosition={'top'}
                        items={testList}
                        type="editable-card"
                        onChange={onChange}
                        activeKey={activeKey}
                    />
                </Col>
                <Col span={4}>
                    <MyFormItem
                        style={{ marginTop: '10px', justifyContent: 'right', display: 'flex' }}
                        name="import"
                        type="upload"
                        innerProps={{ fileList: uploadQuestionFile }}
                        uploadProps={uploadQuestionProps}
                        uploadButton={
                            <Button icon={<UploadOutlined />} type={'link'}>
                                Tải file câu hỏi
                            </Button>
                        }
                    />
                </Col>
            </Row>

            <MyTable
                dataSource={questionData.docs}
                columns={questionTableColumns}
                rowKey="_id"
                pagination={{
                    current: questionData.page,
                    pageSize: questionData.limit,
                    total: questionData.totalDocs,
                    onChange: onQuestionPageChange,
                }}
            />

            <Drawer
                title={'Thêm bài thi thử '}
                width={'70%'}
                onClose={() => setOpenTestDrawer(false)}
                open={openTestDrawer}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={() => setOpenTestDrawer(false)}>Huỷ</Button>
                        <Button onClick={createExam} type="primary">
                            Cập nhật
                        </Button>
                    </Space>
                }
            >
                <MyForm layout="vertical" form={testForm}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <MyFormItem
                                label={'Tên bài thi'}
                                type="input"
                                name="name"
                                innerProps={{ placeholder: 'Nhập tên bài thi', allowClear: true }}
                                required
                            />
                        </Col>
                    </Row>
                </MyForm>
            </Drawer>
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={uploadQuestions}
                title={'Xác nhận import câu hỏi'}
                okText={'Xác nhận'}
                cancelText={'Huỷ'}
            ></Modal>
            <Modal
                open={openDeleteExam}
                onCancel={() => setOpenDeleteExam(false)}
                onOk={remove}
                title={'Bạn có muốn xoá bài kiểm tra?'}
                okText={'Xác nhận'}
                cancelText={'Huỷ'}
            ></Modal>
            <Modal
                open={openCreateExamModal}
                onCancel={() => setOpenCreateExamModal(false)}
                onOk={createExam}
                title={'Tạo bài test mới'}
                okText={'Xác nhận'}
                cancelText={'Huỷ'}
            >
                <MyForm layout="vertical" form={testForm}>
                    <MyFormItem
                        type="input"
                        name="name"
                        innerProps={{ placeholder: 'Nhập tên bài thi', allowClear: true }}
                        required
                    />
                </MyForm>
            </Modal>
            <QuestionDrawer
                type={ActionEnum.EDIT}
                testId={undefined}
                open={openQuestionDrawer}
                setOpenDrawer={setOpenQuestionDrawer}
                refreshPage={getQuestionPageData}
                data={questionDetail}
            ></QuestionDrawer>
        </>
    );
};

export default CourseTestList;
