import type { Category, Detail } from '../dto';
import type { EducationTypeEnum } from '@/interface';
import type { Subject } from '@/modules/subjects/dto';
import type { TransferItem } from 'antd/es/transfer';

import { Button, Drawer, Space, Tabs, Transfer } from 'antd';
import { useEffect, useState } from 'react';

import { updateEducationApi } from '@/api/educations';
import { findSubjectsApi } from '@/modules/subjects/api';

import { findAllCategoryApi } from '../api';

interface DrawerProps {
    educationType: EducationTypeEnum | string;
    educationId: string;
    openDrawer: boolean;
    setOpenDrawer: any;
    refresh: () => void;
}

const CategoryDrawer = (props: DrawerProps) => {
    const { educationId, educationType, setOpenDrawer, openDrawer, refresh } = props;

    const [categoryList, setCategoryList] = useState<any>(['']);
    const [subjectList, setSubjectList] = useState<TransferItem[]>([]);
    const [displayList, setDisplayList] = useState<TransferItem[]>([]);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [isChange, setIsChange] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [activeKey, setActiveKey] = useState<string>('');
    const [data, setData] = useState<Category[]>([]);

    const onChange = (newActiveKey: string) => {
        if (isChange) {
            updateSubject();
        }

        setTargetKeys([]);
        setIsChange(false);
        setUpdated(false);
        setActiveKey(newActiveKey);
    };

    const getCategories = async () => {
        const res = await findAllCategoryApi({
            filterQuery: {},
            options: { pagination: false },
        });

        if (res.status) {
            setCategoryList(
                res.result?.docs.map((category: Category) => ({
                    label: category.name,
                    key: category._id,
                })),
            );

            if (activeKey) {
                setActiveKey(activeKey);
            } else {
                if (categoryList.length > 0) setActiveKey(res.result?.docs[0]._id);
            }

            setData(res.result?.docs);
        }
    };

    const updateSubject = async () => {
        if (activeKey) {
            const res = await updateEducationApi(educationId, {
                subjects: targetKeys,
                categoryId: activeKey,
            });

            if (res.status) {
                setIsChange(false);
                setUpdated(true);
            }
        }
    };

    useEffect(() => {
        if (data && activeKey) {
            console.log('test', activeKey);
            // let selectedKeys: string[] = [];

            // data.forEach((category: Category) => {
            //     const keys = category.details?.map((e: Detail) => e.subjectId);

            //     if (category._id === activeKey) {
            //         setTargetKeys(keys);
            //     } else {
            //         selectedKeys = selectedKeys.concat(keys);
            //     }
            // });

            // setDisplayList(subjectList.filter((e: TransferItem) => !selectedKeys.includes(e.key as string, 0)));
        }
    }, [activeKey, data]);

    const getSubjects = async () => {
        const res = await findSubjectsApi({
            filterQuery: { educationType: educationType },
            options: { pagination: false },
        });

        if (res.status) {
            const list = res.result.docs.map((subject: Subject) => ({
                key: subject._id,
                description: subject.name,
            }));

            setSubjectList(list);
            setDisplayList(list);
        }
    };

    useEffect(() => {
        getCategories();
    }, [educationId, activeKey, updated]);

    useEffect(() => {
        getSubjects();
    }, [educationId]);

    const handleChange = (newTargetKeys: string[]) => {
        setTargetKeys(newTargetKeys);
        setIsChange(true);
    };

    return (
        <>
            <Drawer
                title={'Danh sách môn học theo trường'}
                width={'50%'}
                onClose={() => {
                    setOpenDrawer(false);
                    refresh();
                }}
                open={openDrawer}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button
                            onClick={() => {
                                setOpenDrawer(false);
                                setTargetKeys([]);
                                setUpdated(false);
                                refresh();
                            }}
                        >
                            Đóng
                        </Button>
                        <Button
                            type={'primary'}
                            onClick={() => {
                                if (isChange) {
                                    updateSubject();
                                }

                                refresh();
                                setOpenDrawer(false);
                                setTargetKeys([]);
                                setUpdated(false);
                            }}
                        >
                            Cập nhật
                        </Button>
                    </Space>
                }
            >
                <Tabs
                    hideAdd
                    tabPosition={'top'}
                    items={categoryList}
                    type="card"
                    onChange={onChange}
                    activeKey={activeKey}
                />
                <Transfer
                    dataSource={displayList}
                    showSearch
                    listStyle={{
                        width: '50%',
                        height: 500,
                    }}
                    oneWay
                    targetKeys={targetKeys}
                    onChange={handleChange}
                    render={(item: TransferItem) => item.description as string}
                />
            </Drawer>
        </>
    );
};

export default CategoryDrawer;
