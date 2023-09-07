import type { Category, IListCategoryProps } from '../../dto';
import type { MyPageTableOptions } from '@/components/business/page';

import { Popconfirm, Space, Switch, Tag, Tooltip } from 'antd';
import React from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

import { callbackApi } from '@/common';
import MyPage from '@/components/business/page';
import { EducationTypeEnum, EducationTypeTextEnum, StatusEnum } from '@/interface';

import { deleteCategoryApi, findAllCategoryApi, updateCategoryApi } from '../../api';

const CategoryList = (props: IListCategoryProps) => {
    const { paramSearch, reload, handleSetCategory } = props;

    const updateStatus = async (checked: boolean, id: string) => {
        const response: any = await updateCategoryApi(id, {
            status: checked ? StatusEnum.ACTIVE : StatusEnum.INACTIVE,
        });

        callbackApi(response, 'Cập nhật trạng thái thành công!', () => {});
    };

    const deleteCategory = async (id: string) => {
        const response: any = await deleteCategoryApi(id);

        callbackApi(response, 'Xóa danh mục thành công!', () => {
            reload();
        });
    };

    const tableColumns: MyPageTableOptions<Category> = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: '_id',
        },
        {
            title: 'Danh mục lớn',
            dataIndex: 'child',
            key: '_id',
            render: (_: string, record: Category) => <p>{record?.child?.name}</p>,
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: '_id',
            width: '10%',
            align: 'center' as const,
            render: (_: string, record: Category) => (
                <div>
                    <Space size="middle">
                        <Tooltip placement="top" title="Chỉnh sửa danh mục">
                            <AiOutlineEdit className="icon-button" onClick={() => handleSetCategory(record._id)} />
                        </Tooltip>

                        <Popconfirm
                            placement="right"
                            title={'Xác nhận xoá bản ghi?'}
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() => deleteCategory(record._id)}
                        >
                            <Tooltip placement="top" title="Xóa danh mục">
                                <AiOutlineDelete className="icon-button-delete" />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                </div>
            ),
        },
    ];

    return (
        <>
            <MyPage tableOptions={tableColumns} pageApi={findAllCategoryApi} paramSearch={paramSearch} />
        </>
    );
};

export default CategoryList;
