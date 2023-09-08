// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type { SelectOptions } from '@/components/core/form-item';
import type { Course, CourseRequestForm } from '@/modules/courses/dto';
import type { Lesson } from '@/modules/lessons/dto';

import './index.less';

import { Button, Card, Col, Divider, message, Row, Steps } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import MyForm from '@/components/core/form';
import { createCourseApi, getCourseApi, updateCourseApi } from '@/modules/courses/api';

import CreateActivationCode from '../../../activations/pages/create';
import TopicListForm from '../../../topics/pages/create';
import CreateCourseForm from './create.course';
import CreateTestForm from './create.test';

const CourseForm = () => {
    const { id } = useParams();

    const [current, setCurrent] = useState(0);
    const [createCourseForm] = MyForm.useForm<CourseRequestForm>();
    const [messageApi, contextHolder] = message.useMessage();
    const [descriptions, setDescriptions] = useState<string>('');
    const [educations, setEducations] = useState<SelectOptions[]>([]);
    const [courseId, setCourseId] = useState<string>();
    const [subjectId, setSubjectId] = useState<string>();
    const [updateLessons, setUpdateLessons] = useState<Lesson[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [update, setUpdate] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleCreateCourse = async () => {
        const values = await createCourseForm.validateFields();

        const payload: Course = {
            plan: values.plan,
            name: values.name,
            mentorId: values.mentor.value,
            categoryId: values.categoryId.value ? values.categoryId.value : values.categoryId,
            descriptions: descriptions,
            coverMedia: values.coverMedia ? values.coverMedia?.file?.response?.url : imageUrl,
            cost: values.cost,
            startDate: values.startDate,
            schedules: values.schedules,
            startAt: values.startAt,
            endAt: values.endAt,
        };

        // setSubjectId(values.subject.value ? values.subject.value : values.subject);

        if (!courseId) {
            return createCourseApi(payload);
        } else {
            return updateCourseApi(courseId, payload);
        }
    };

    useEffect(() => {
        const fetchCourseDetail = async () => {
            if (id) {
                const res = await getCourseApi(id);

                if (res.status) {
                    const course = res.result;

                    createCourseForm.setFieldValue('categoryId', course.categoryId?._id);
                    createCourseForm.setFieldValue('mentor', {
                        label: course.mentor?.fullName,
                        value: course.mentor?._id,
                    });
                    createCourseForm.setFieldValue('plan', course?.plan);
                    createCourseForm.setFieldValue('name', course?.name);
                    createCourseForm.setFieldValue('descriptions', course?.descriptions);
                    createCourseForm.setFieldValue('cost', course?.cost);
                    const starDate = course.startDate ? moment(course.startDate).format('DD-MM-Y') : '';

                    createCourseForm.setFieldValue('startDate', starDate ? dayjs(starDate, 'DD-MM-YYYY') : '');

                    createCourseForm.setFieldValue('schedules', course.schedules.length > 0 ? course.schedules : null);
                    const startAt = course.startAt ? moment(course.startAt).format('HH:mm') : '';

                    createCourseForm.setFieldValue('startAt', startAt ? dayjs(startAt, 'HH:mm') : '');

                    const endAt = course.endAt ? moment(course.endAt).format('HH:mm') : '';

                    createCourseForm.setFieldValue('endAt', endAt ? dayjs(endAt, 'HH:mm') : '');

                    setImageUrl(course?.coverMedia);
                    setUpdate(true);
                }
            }
        };

        fetchCourseDetail();
    }, [courseId]);

    const next = async () => {
        switch (current) {
            case 0:
                const res = await handleCreateCourse();

                if (res.status) {
                    setCurrent(current + 1);
                    setCourseId(res.result._id);
                } else {
                    messageApi.open({
                        type: 'error',
                        content: `${update ? 'Cập nhật' : 'Tạo'} khoá học thất bại`,
                    });
                    setCurrent(current);
                }

                break;
            case 1:
                setCurrent(current + 1);
                break;
            case 2:
                setCurrent(current + 1);
                break;
            case 3:
                setCurrent(3);
                message.success(`${update ? 'Cập nhật' : 'Tạo'} khoá học thành công`);
                setTimeout(() => {
                    navigate('/courses');
                }, 1000);

                break;
            default:
                break;
        }
    };

    const onChangeStep = (value: number) => {
        if (courseId) {
            setCurrent(value);
        }
    };

    const prev = async () => {
        switch (current) {
            case 0:
                navigate('/courses');
                break;
            case 1:
                setCurrent(current - 1);
                break;
            case 2:
                setCurrent(current - 1);
                break;
            default:
                break;
        }
    };

    const steps = [
        {
            title: 'Thông tin khoá học',
        },
        {
            title: 'Lộ trình học',
        },
        {
            title: 'Bài kiểm tra',
        },
    ];

    const items = steps.map((item: any) => ({ key: item.title, title: item.title }));

    useEffect(() => {
        if (id !== 'create') {
            setCourseId(id);
        } else {
            setCourseId('');
            createCourseForm.resetFields();
            setCurrent(0);
        }
    }, [id]);

    return (
        <div className="course-create-page">
            {contextHolder}
            <Card
                title={`${update ? 'Cập nhật' : 'Tạo'} mới khoá học`}
                bordered={true}
                hoverable
                extra={
                    <>
                        <Button onClick={() => prev()} type="default">
                            Quay lại
                        </Button>
                        <Button onClick={() => next()} type="primary">
                            {current === 3 ? 'Hoàn thành' : 'Tiếp theo'}
                        </Button>
                    </>
                }
            >
                <div className="header-steps">
                    <Row>
                        <Col span={2}> </Col>
                        <Col span={20}>
                            <Steps current={current} items={items} onChange={onChangeStep} />
                        </Col>
                        <Col span={2}> </Col>
                    </Row>
                    <Row>
                        <Divider />
                    </Row>
                    {current === 0 && (
                        <CreateCourseForm
                            form={createCourseForm}
                            setEducations={setEducations}
                            setDescriptions={setDescriptions}
                            imageUrl={imageUrl}
                        />
                    )}
                    {current === 1 && (
                        <TopicListForm
                            courseId={courseId as string}
                            setUpdateLessons={setUpdateLessons}
                            updateLessons={updateLessons}
                        />
                    )}
                    {current === 2 && <CreateTestForm courseId={courseId as string} subjectId={subjectId as string} />}
                    {current === 3 && <CreateActivationCode courseId={courseId} />}
                </div>
            </Card>
        </div>
    );
};

export default CourseForm;
