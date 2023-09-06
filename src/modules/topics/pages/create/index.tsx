// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { MyPageTableOptions } from '@/components/business/page';
import type { PageData } from '@/interface';
import type { Document } from '@/modules/documents/dto';
import type { Lesson } from '@/modules/lessons/dto';
import type { QuestionsDetail } from '@/modules/questions/dto';
import type { Topic } from '@/modules/topics/dto';
import type { UploadFile, UploadProps } from 'antd';
import type {
    DraggableProvided,
    DraggableStateSnapshot,
    DroppableProvided,
    DroppableStateSnapshot,
    DropResult,
} from 'react-beautiful-dnd';

import './index.less';

import { CaretRightOutlined, PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Drawer, message as $message, Modal, Popconfirm, Radio, Row, Space, theme } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineQuestionCircle } from 'react-icons/ai';

import { settings } from '@/api/const';
import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';
import MyTable from '@/components/core/table';
import { DocumentTypeEnum } from '@/interface';
import { useLocale } from '@/locales';
import { createDocumentApi } from '@/modules/documents/api/document';
import { createLessonApi, deleteLessonApi, updateLessonApi } from '@/modules/lessons/api';
import { deleteQuestionApi, getQuestionsApi, uploadQuestionsApi } from '@/modules/questions/api';
import { createTopicApi, deleteTopicApi, findAllTopicApi, updateTopicApi } from '@/modules/topics/api';
import { useStates } from '@/utils/use-states';

const { Panel } = Collapse;

const grid = 8;

const reorder = (list: Lesson[], startIndex: number, endIndex: number): Lesson[] => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);

    result.splice(endIndex, 0, removed);

    return result;
};

const getItemStyle = (draggableStyle: any, isDragging: boolean) => ({
    userSelect: 'none',
    padding: 2 * grid,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? '#b3d9ff' : '#e0ebeb',
    ...draggableStyle,
});

const getListStyle = () => ({
    padding: grid,
    width: '95%',
    marginLeft: '5%',
    maxHeight: 400,
});

interface CreateTopicProps {
    courseId: string;
    setUpdateLessons: any;
    updateLessons: Lesson[];
}

const TopicCreateForm = (props: CreateTopicProps) => {
    const { formatMessage } = useLocale();
    const { courseId } = props;
    const [activeKey, setActiveKey] = useState(0);

    const { token } = theme.useToken();
    const [openTopicDrawer, setOpenTopicDrawer] = useState(false);
    const [openLessonDrawer, setOpenLessonDrawer] = useState(false);
    const [topicDescriptions, setTopicDescriptions] = useState<string>('');
    const [lessonDescriptions, setLessonDescriptions] = useState<string>('');
    const [topicForm] = MyForm.useForm<Topic>();
    const [lessonForm] = MyForm.useForm<Lesson>();
    const [topicId, setTopicId] = useState('');
    const [topics, setTopics] = useState<Topic[]>([]);
    const [documentList, setDocumentList] = useState<UploadFile[]>([]);
    const [uploadQuestionFile, setUploadQuestionFile] = useState<UploadFile>();
    const [openModal, setOpenModal] = useState(false);
    const [openModalQuestion, setOpenModalQuestion] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');
    const isButtonClicked = useRef(false);
    const [reloadQuestion, setReloadQuestion] = useState(false);
    const [pageData, setPageData] = useStates<PageData<QuestionsDetail>>({
        limit: 10,
        page: 1,
        totalDocs: 0,
        docs: [],
    });

    const callback = (key: any) => {
        // Check if use click on the button don not update activekey
        if (isButtonClicked && isButtonClicked.current && isButtonClicked.current === true) {
            isButtonClicked.current = false;

            return;
        }

        setActiveKey(key);
    };

    const showTopicDrawer = () => {
        setOpenTopicDrawer(true);
    };

    const closeTopicDrawer = () => {
        setIsEdit(false);
        topicForm.resetFields();
        setOpenTopicDrawer(false);
    };

    const showLessonDrawer = (id: string) => {
        setOpenLessonDrawer(true);
        setTopicId(id);
    };

    const closeLessonDrawer = () => {
        setIsEdit(false);
        lessonForm.resetFields();
        setOpenLessonDrawer(false);
    };

    const createTopic = async () => {
        const values = await topicForm.validateFields();
        const payload: Topic = {
            name: values.name,
            descriptions: topicDescriptions,
            parentId: courseId,
        };

        let res: any;

        if (isEdit) {
            if (topicDescriptions === '') {
                delete payload.descriptions;
            }

            res = await updateTopicApi(editId, payload);
        } else {
            res = await createTopicApi(payload);
        }

        if (res.status) {
            $message.success(`${isEdit ? 'Cập nhật' : 'Thêm'} chuyên đề thành công`);

            if (isEdit) {
                const removeIdx = topics.findIndex((e: Topic) => e._id === res.result._id);
                const lessons = topics.find((e: Topic) => e._id === res.result._id)?.lessons;

                topics.splice(removeIdx, 1, { ...res.result, lessons: lessons });
            } else {
                setTopics([...topics, res.result]);
            }

            topicForm.resetFields();
            setTopicDescriptions('');
            setOpenTopicDrawer(false);
        } else {
            $message.error(`${isEdit ? 'Cập nhật' : 'Thêm'} chuyên đề thất bại`);
        }

        setIsEdit(false);
    };

    const deleteTopic = async (id: string) => {
        const res = await deleteTopicApi(id);

        if (res.status) {
            const removeIdx = topics.findIndex((e: Topic) => e._id === res.result._id);

            topics.splice(removeIdx, 1);
            $message.success('Xóa chuyên đề thành công');
        } else {
            $message.error('Xóa chuyên đề thất bại');
        }

        setTopics([...topics]);
    };

    const createLesson = async () => {
        const values = await lessonForm.validateFields();

        const payload: Lesson = {
            name: values.name,
            descriptions: lessonDescriptions,
            parentId: topicId,
            media: values.media,
            length: Number(values.length),
        };
        let res: any;

        if (isEdit) {
            if (lessonDescriptions === '') {
                delete payload.descriptions;
            }

            res = await updateLessonApi(editId, payload);
        } else {
            res = await createLessonApi(payload);
        }

        if (res.status) {
            setOpenLessonDrawer(false);

            if (values.documents) {
                const payload: Document = {
                    name: `Tài liệu ${res.result.name}`,
                    type: DocumentTypeEnum.CURRICULUM,
                    lessonId: res.result._id,
                    courseId: courseId,
                    description: `Giáo trình học tập ${res.result.name}`,
                    isDownloadable: true,
                    files: [],
                };

                values.documents.fileList.map((file: UploadFile) => {
                    payload.files?.push({
                        url: file.response[0].url,
                        type: file.response[0].type,
                        name: file.response[0].name,
                    });
                });

                await createDocumentApi(payload);
            }

            const topic = topics.find((e: Topic) => e._id === res.result.parentId);

            if (topic) {
                if (!topic.lessons) {
                    topic.lessons = [];
                }

                if (!isEdit) {
                    topic.lessons.push(res.result);
                } else {
                    const removeIdx = topic.lessons?.findIndex((e: Topic) => e._id === res.result._id);

                    topic.lessons.splice(removeIdx, 1, res.result);
                }
            }

            setTopics([...topics]);

            lessonForm.resetFields();
            setLessonDescriptions('');
            $message.success('Thêm mới bài học thành công');
        } else {
            $message.error('Thêm mới bài học thất bại');
        }

        setIsEdit(false);
    };

    const deleteLesson = async (id: string) => {
        const res = await deleteLessonApi(id);

        if (res.status) {
            const topic = topics.find((e: Topic) => e._id === res.result.parentId);

            if (topic?.lessons) {
                const removeIdx = topic.lessons?.findIndex((e: Topic) => e._id === res.result._id);

                topic.lessons.splice(removeIdx, 1);
            }
        }

        setTopics([...topics]);
    };

    const uploadQuestions = async () => {
        const payload = {
            url: uploadQuestionFile?.url as string,
            lessonId: editId,
        };

        const res = await uploadQuestionsApi(payload);

        if (res.status) {
            setReloadQuestion(!reloadQuestion);
        }

        setOpenModal(false);
    };

    const deleteQuestion = async (recordId: string) => {
        const res = await deleteQuestionApi(recordId);

        if (res.status) {
            setReloadQuestion(!reloadQuestion);
        }
    };

    useEffect(() => {
        const fetchTopic = async () => {
            const res = await findAllTopicApi({ filterQuery: { parentId: courseId }, options: {} });

            if (res.status) {
                setTopics(res.result.docs);
            }
        };

        if (courseId) {
            fetchTopic();
        }
    }, [courseId]);

    const onDragEnd = (result: DropResult, lessons: Lesson[], topic: Topic) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        const items = reorder(lessons, source.index, destination.index);

        topic.lessons = items;
    };

    const uploadDocumentProps: UploadProps = {
        name: 'attachment',
        multiple: false,
        action: `${settings.FILE_URL}/upload/attachments`,
        onChange(info) {
            const { status } = info.file;

            if (status === 'done') {
                $message.success(`Tải file ${info.file.name} thành công.`);
            } else if (status === 'error') {
                $message.error(`Tải file ${info.file.name} thất bại.`);
            }
        },
        onRemove(info) {
            const { status } = info;

            if (status === 'removed') {
                setDocumentList(documentList.filter((e: UploadFile) => e.name !== info.name));
                $message.success(`Xóa file ${info.name} thành công.`);
            }
        },
    };
    const uploadQuestionProps: UploadProps = {
        name: 'attachment',
        multiple: false,
        action: `${settings.FILE_URL}/upload/attachments`,
        onChange(info) {
            const { status } = info.file;

            if (status === 'done') {
                setUploadQuestionFile(info.file.response[0]);
                setOpenModal(true);
                $message.success(`Tải file ${info.file.name} thành công.`);
            } else if (status === 'error') {
                $message.error(`Tải file ${info.file.name} thất bại.`);
            }
        },
    };
    const tableColumns: MyPageTableOptions<QuestionsDetail> = [
        {
            title: 'Nội dung',
            key: 'question',
            dataIndex: ['question', 'content'],
            width: '35%',
            render: question => (
                <div
                    dangerouslySetInnerHTML={{
                        __html: `${question}`,
                    }}
                />
            ),
        },
        {
            title: 'Giải thích',
            key: 'explanation',
            dataIndex: ['explanation', 'content'],
            width: '25%',
            render: explanation => (
                <div
                    dangerouslySetInnerHTML={{
                        __html: `${explanation}`,
                    }}
                />
            ),
        },
        {
            title: 'Gợi ý',
            key: 'hint',
            dataIndex: ['hint', 'content'],
            width: '25%',
            render: hint => (
                <div
                    dangerouslySetInnerHTML={{
                        __html: `${hint}`,
                    }}
                />
            ),
        },
        {
            title: 'Điểm số',
            key: 'point',
            dataIndex: ['point'],
            width: '8%',
        },
        {
            title: 'Xoá',
            key: '_id',
            width: '5%',
            render: (_, record) => (
                <div className="display-center">
                    <Space size="middle">
                        <Popconfirm
                            placement="right"
                            title={'Xác nhận xoá câu hỏi?'}
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() => deleteQuestion(record._id)}
                        >
                            <AiOutlineDelete className="icon-button-delete" />
                        </Popconfirm>
                    </Space>
                </div>
            ),
        },
    ];

    const onPageChange = (page: number, limit?: number) => {
        setPageData({ page });

        if (limit) {
            setPageData({ limit });
        }
    };

    const getPageData = useCallback(async () => {
        if (editId) {
            const res = await getQuestionsApi({
                filterQuery: { lessonId: editId },
                options: { limit: pageData.limit, page: pageData.page },
            });

            if (res.status) {
                setPageData({ totalDocs: res.result.totalDocs, docs: res.result.docs });
            }

            if (res.status) {
                setPageData({ totalDocs: res.result.totalDocs, docs: res.result.docs });
            }
        }
    }, [editId, reloadQuestion, pageData.limit, pageData.page]);

    useEffect(() => {
        getPageData();
    }, [getPageData]);

    return (
        <>
            {topics.length > 0 ? (
                <>
                    <Collapse
                        activeKey={activeKey}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        style={{ background: token.colorBgContainer }}
                        onChange={callback}
                    >
                        {topics.map((topic, index) => (
                            <Panel
                                header={topic.name}
                                extra={
                                    <>
                                        <AiOutlineEdit
                                            className="icon-button"
                                            onClick={() => {
                                                isButtonClicked.current = true;
                                                setIsEdit(true);
                                                setEditId(topic._id as string);
                                                topicForm.setFieldValue('name', topic.name);
                                                topicForm.setFieldValue('descriptions', topic.descriptions);
                                                showTopicDrawer();
                                            }}
                                        />
                                        <Popconfirm
                                            placement="right"
                                            title={`Bạn có muốn xoá ${topic.name}`}
                                            okText="Có"
                                            onCancel={() => {
                                                isButtonClicked.current = true;
                                            }}
                                            onConfirm={() => {
                                                isButtonClicked.current = true;
                                                deleteTopic(topic._id as string);
                                            }}
                                            cancelText="Không"
                                        >
                                            <AiOutlineDelete
                                                className="icon-button-delete"
                                                onClick={() => {
                                                    isButtonClicked.current = true;
                                                }}
                                            />
                                        </Popconfirm>
                                    </>
                                }
                                key={index}
                            >
                                {topic.lessons && (
                                    // ts-ignore
                                    <DragDropContext
                                        onDragEnd={(result: DropResult) =>
                                            onDragEnd(result, topic.lessons as Lesson[], topic)
                                        }
                                    >
                                        <Droppable droppableId="droppable">
                                            {(provided: DroppableProvided, _: DroppableStateSnapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    style={getListStyle()}
                                                >
                                                    {topic.lessons?.map((lesson: Lesson, index: number) => (
                                                        <>
                                                            <Draggable
                                                                key={lesson._id}
                                                                draggableId={lesson._id as string}
                                                                index={index}
                                                            >
                                                                {(
                                                                    providedDraggable: DraggableProvided,
                                                                    snapshotDraggable: DraggableStateSnapshot,
                                                                ) => (
                                                                    <div>
                                                                        <div
                                                                            ref={providedDraggable.innerRef}
                                                                            {...providedDraggable.draggableProps}
                                                                            {...providedDraggable.dragHandleProps}
                                                                            style={getItemStyle(
                                                                                providedDraggable.draggableProps.style,
                                                                                snapshotDraggable.isDragging,
                                                                            )}
                                                                        >
                                                                            <Row gutter={10}>
                                                                                <Col span={21}>{lesson.name}</Col>
                                                                                <Col span={3}>
                                                                                    <AiOutlineEdit
                                                                                        className="icon-button"
                                                                                        onClick={() => {
                                                                                            isButtonClicked.current =
                                                                                                true;
                                                                                            setIsEdit(true);
                                                                                            setEditId(
                                                                                                lesson._id as string,
                                                                                            );
                                                                                            setDocumentList(
                                                                                                lesson.documents,
                                                                                            );
                                                                                            lessonForm.setFieldValue(
                                                                                                'name',
                                                                                                lesson.name,
                                                                                            );
                                                                                            lessonForm.setFieldValue(
                                                                                                'descriptions',
                                                                                                lesson.descriptions,
                                                                                            );
                                                                                            lessonForm.setFieldValue(
                                                                                                'media',
                                                                                                lesson.media,
                                                                                            );
                                                                                            lessonForm.setFieldValue(
                                                                                                'length',
                                                                                                lesson.length?.toString(),
                                                                                            );
                                                                                            showLessonDrawer(
                                                                                                topic._id as string,
                                                                                            );
                                                                                        }}
                                                                                    />

                                                                                    <Popconfirm
                                                                                        placement="right"
                                                                                        title={`Bạn có muốn xoá ${lesson.name}`}
                                                                                        okText="Có"
                                                                                        cancelText="Không"
                                                                                        onConfirm={() =>
                                                                                            deleteLesson(
                                                                                                lesson._id as string,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <AiOutlineDelete className=" icon-button icon-button-delete" />
                                                                                    </Popconfirm>
                                                                                    {/* // add question */}
                                                                                    <AiOutlineQuestionCircle
                                                                                        className="icon-button"
                                                                                        onClick={() => {
                                                                                            isButtonClicked.current =
                                                                                                true;
                                                                                            setEditId(
                                                                                                lesson._id as string,
                                                                                            );
                                                                                            setOpenModalQuestion(true);
                                                                                        }}
                                                                                    />
                                                                                </Col>
                                                                            </Row>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        </>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                )}

                                <Button
                                    type="default"
                                    icon={<PlusCircleOutlined style={{ color: 'green' }} />}
                                    onClick={() => showLessonDrawer(topic._id as string)}
                                >
                                    Bài học mới
                                </Button>
                            </Panel>
                        ))}
                    </Collapse>
                    <Button
                        style={{ marginTop: 20 }}
                        icon={<PlusCircleOutlined style={{ color: 'green' }} />}
                        onClick={showTopicDrawer}
                    >
                        Chuyên đề mới
                    </Button>
                </>
            ) : (
                <Button
                    style={{ marginTop: 20 }}
                    icon={<PlusCircleOutlined style={{ color: 'green' }} />}
                    onClick={showTopicDrawer}
                >
                    Chuyên đề mới
                </Button>
            )}
            <Drawer
                title={isEdit ? 'Chỉnh sửa chuyên đề' : 'Thêm chuyên đề mới'}
                width={'50%'}
                onClose={closeTopicDrawer}
                open={openTopicDrawer}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={closeTopicDrawer}>Huỷ</Button>
                        <Button onClick={createTopic} type="primary">
                            {isEdit ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Space>
                }
            >
                <MyForm layout="vertical" form={topicForm}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <MyFormItem
                                label={'Tiêu đề chương'}
                                type="input"
                                name="name"
                                innerProps={{ placeholder: 'Nhập chuyên đề', allowClear: true }}
                                required
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <MyFormItem
                                label={formatMessage({ id: 'component.search.description' })}
                                type="editor"
                                name="topic-editor"
                                setData={setTopicDescriptions}
                                innerProps={{ data: topicForm.getFieldValue('descriptions') }}
                            />
                        </Col>
                    </Row>
                </MyForm>
            </Drawer>
            <Drawer
                title={isEdit ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}
                width={'90%'}
                onClose={closeLessonDrawer}
                open={openLessonDrawer}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={closeLessonDrawer}>Huỷ</Button>
                        <Button onClick={createLesson} type="primary">
                            {isEdit ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Space>
                }
            >
                <MyForm layout="vertical" form={lessonForm}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <MyFormItem
                                label={'Tiêu đề bài học'}
                                type="input"
                                name="name"
                                innerProps={{ placeholder: 'Nhập tiêu đề bài học', allowClear: true }}
                                required
                            />
                        </Col>
                        <Col span={8}>
                            <MyFormItem
                                label={'Link video'}
                                type="input"
                                name="media"
                                innerProps={{ placeholder: 'Nhập tiêu link video', allowClear: true }}
                                required
                            />
                        </Col>
                        <Col span={4}>
                            <MyFormItem
                                label={'Thời lượng'}
                                type="input"
                                name="length"
                                innerProps={{ placeholder: 'Nhập thời lượng', allowClear: true }}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={20}>
                            <MyFormItem
                                label={formatMessage({ id: 'component.search.description' })}
                                type="editor"
                                name="lesson-editor"
                                innerProps={{ data: lessonForm.getFieldValue('descriptions') }}
                                setData={setLessonDescriptions}
                            />
                        </Col>
                        <Col span={4}>
                            <MyFormItem
                                label="Tài liệu"
                                name="documents"
                                type="upload"
                                uploadProps={{ ...uploadDocumentProps, fileList: documentList }}
                                uploadButton={<Button icon={<UploadOutlined />}>Tải tài liệu bài học</Button>}
                                onChange={info => {
                                    setDocumentList(info.fileList);
                                }}
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
                open={openModalQuestion}
                onCancel={() => setOpenModalQuestion(false)}
                onOk={() => setOpenModalQuestion(false)}
                title={'Quản lý câu hỏi'}
                cancelText={'Huỷ'}
                width={'90%'}
                footer={
                    <Button
                        type="primary"
                        onClick={() => {
                            setOpenModalQuestion(false);
                        }}
                    >
                        {' '}
                        Đóng
                    </Button>
                }
            >
                <Row gutter={16}>
                    <Col span={20}>
                        <MyTable
                            dataSource={pageData.docs}
                            columns={tableColumns}
                            expandable={{
                                expandedRowRender: record =>
                                    record.choices.map((e: any, index: number) => {
                                        if (record.choices.length % 2 === 1 && index === record.choices.length - 1) {
                                            return (
                                                <Row>
                                                    <Col span={12} key={index}>
                                                        <Row>
                                                            <Col span={1}>
                                                                <Radio
                                                                    disabled
                                                                    checked={record.choices[index].isCorrect}
                                                                ></Radio>
                                                            </Col>
                                                            <Col span={20}>{record.choices[index].answer}</Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            );
                                        }

                                        if (index % 2 === 0) {
                                            return (
                                                <Row>
                                                    <Col span={12} key={index}>
                                                        <Row>
                                                            <Col span={1}>
                                                                <Radio
                                                                    disabled
                                                                    checked={record.choices[index].isCorrect}
                                                                ></Radio>
                                                            </Col>
                                                            <Col span={20}>{record.choices[index].answer}</Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Row>
                                                            <Col span={1}>
                                                                <Radio
                                                                    disabled
                                                                    checked={record.choices[index + 1].isCorrect}
                                                                ></Radio>
                                                            </Col>
                                                            <Col span={20}>{record.choices[index + 1].answer}</Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            );
                                        }
                                    }),
                            }}
                            rowKey="_id"
                            pagination={{
                                current: pageData.page,
                                pageSize: pageData.limit,
                                total: pageData.totalDocs,
                                onChange: onPageChange,
                            }}
                        />
                    </Col>
                    <Col span={4}>
                        <MyFormItem
                            label="Thêm câu hỏi"
                            name="import"
                            type="upload"
                            uploadProps={uploadQuestionProps}
                            uploadButton={<Button icon={<UploadOutlined />}>Tải file câu hỏi</Button>}
                        />
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default TopicCreateForm;
