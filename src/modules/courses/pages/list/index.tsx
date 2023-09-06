import type { MyPageTableOptions } from '@/components/business/page';
import type { Course } from '@/modules/courses/dto';

import './index.less';

import { PlusCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Card, message, Popconfirm, Space, Switch, Tag, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import MyPage from '@/components/business/page';
import { ModelEnum, PlanEnum, StatusEnum } from '@/interface';
import ActivationDrawer from '@/modules/activations/pages/drawer';
import { deleteCourseApi, findAllCoursesApi, updateCourseApi } from '@/modules/courses/api';
import EnrollDrawer from '@/modules/enrolls/pages/drawer';

import FilterCourse from './filterCourse';

const CourseListForm: React.FC = () => {
    const [courseId, setCourseId] = useState<string>('');
    const [openActivationCodeDrawer, setOpenActivationCodeDrawer] = useState(false);
    const [openEnrollDrawer, setOpenEnrollDrawer] = useState(false);

    const tableColumns: MyPageTableOptions<Course> = [
        {
            title: 'Khoá học',
            key: '_id',
            width: '25%',
            dataIndex: 'name',
        },

        { title: 'Môn học', width: '25%', dataIndex: ['subjectId', 'name'], key: '_id' },
        { title: 'Mentor', width: '20%', dataIndex: ['mentor', 'fullName'], key: '_id' },
        {
            title: 'Loại',
            dataIndex: 'plan',
            align: 'center' as const,
            width: '8%',
            key: '_id',
            render: (plan: PlanEnum) => {
                if (plan === PlanEnum.PREMIUM) {
                    const color = '#faad14';

                    return (
                        <Tag color={color} key={plan}>
                            {'Mất phí'.toUpperCase()}
                        </Tag>
                    );
                } else {
                    const color = 'green';

                    return (
                        <Tag color={color} key={plan}>
                            {'Miễn phí'.toUpperCase()}
                        </Tag>
                    );
                }
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '8%',
            align: 'center' as const,
            key: '_id',
            render: (status: string, record: Course) => (
                <>
                    {status === StatusEnum.ACTIVE ? (
                        <Switch
                            defaultChecked
                            onClick={(checked: boolean, _) => {
                                updateCourseStatus(checked, record._id as string);
                            }}
                        />
                    ) : (
                        <Switch
                            onClick={(checked: boolean, _) => {
                                updateCourseStatus(checked, record._id as string);
                            }}
                        />
                    )}
                </>
            ),
        },
        {
            title: 'Hành động',
            align: 'center' as const,
            key: '_id',
            render: (_, record) => (
                <div className="display-center">
                    <Space size="middle">
                        <Tooltip title="Thêm mới mã code">
                            <PlusCircleOutlined
                                onClick={() => {
                                    setOpenActivationCodeDrawer(true);
                                    setCourseId(record._id as string);
                                }}
                                className="icon-button"
                            />
                        </Tooltip>
                        <Tooltip title="Thêm mới học viên">
                            <UserAddOutlined
                                onClick={() => {
                                    setOpenEnrollDrawer(true);
                                    setCourseId(record._id as string);
                                }}
                                className="icon-button"
                                style={{ color: '#000' }}
                            />
                        </Tooltip>
                        <Tooltip title="Sửa khoá học">
                            <AiOutlineEdit className="icon-button" onClick={() => editCourse(record)} />
                        </Tooltip>
                        <Popconfirm
                            placement="right"
                            title={'Bạn có muốn xoá khoá học?'}
                            okText="Có"
                            cancelText="Không"
                            onConfirm={_ => deleteCourse(record)}
                        >
                            <Tooltip title="Xoá khoá học">
                                <AiOutlineDelete className="icon-button-delete icon-button" />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                </div>
            ),
        },
    ];

    const updateCourseStatus = async (checked: boolean, id: string) => {
        const status = checked ? StatusEnum.ACTIVE : StatusEnum.INACTIVE;
        const res = await updateCourseApi(id, { status: status });

        if (res) {
            message.success('Cập nhật trạng thái khoá học thành công');
        }
    };

    const [paramSearch, setParamSearch] = useState<object | null>(null);
    const [resetForm, setResetForm] = useState(true);
    const navigate = useNavigate();

    const editCourse = (record: Course) => {
        navigate(`/courses/${record._id}`);
    };

    const deleteCourse = async (value: Course) => {
        const res = await deleteCourseApi(value._id);

        if (res.status) {
            setParamSearch({
                ...paramSearch,
            });
            message.success('Xóa khóa học thành công!');
        }
    };

    const handelSearchCourse = (value: object) => {
        setParamSearch(value);
    };

    const tableData = useMemo(() => {
        if (!paramSearch) return null;

        return <MyPage pageApi={findAllCoursesApi} tableOptions={tableColumns} paramSearch={paramSearch} />;
    }, [paramSearch]);

    const filterUser = useMemo(() => {
        return <FilterCourse onSearch={handelSearchCourse} resetForm={resetForm} />;
    }, [resetForm]);

    return (
        <div className="course-list-page">
            <Card
                title="Danh sách khoá học"
                bordered={true}
                hoverable
                extra={
                    <>
                        <Button onClick={() => setResetForm(!resetForm)} type="primary">
                            Xoá bộ lọc
                        </Button>
                    </>
                }
            >
                {filterUser} {tableData}
            </Card>
            <ActivationDrawer
                targetId={courseId}
                targetModel={ModelEnum.COURSE}
                openActivationCodeDrawer={openActivationCodeDrawer}
                setOpenActivationCodeDrawer={setOpenActivationCodeDrawer}
            />
            <EnrollDrawer
                targetId={courseId}
                targetModel={ModelEnum.COURSE}
                openDrawer={openEnrollDrawer}
                setOpenDrawer={setOpenEnrollDrawer}
            />
        </div>
    );
};

export default CourseListForm;
