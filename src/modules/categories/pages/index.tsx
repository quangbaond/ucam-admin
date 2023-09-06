import type { FindCategoriesParams } from '../dto';

import { Button, Card } from 'antd';
import { useMemo, useState } from 'react';

import Filter from '../components/filter';
import FormCategory from '../components/form';
import CategoryList from './list';

const Categories = () => {
    const [paramSearch, setParamSearch] = useState<FindCategoriesParams | null>(null);
    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const [idActive, setIdActive] = useState<string>('');
    const [isOpenFormUpdate, setIsOpenFormUpdate] = useState<boolean>(false);

    const [isOpenFormCreate, setIsOpenFormCreate] = useState<boolean>(false);

    const renderTable = useMemo(() => {
        if (!paramSearch) return null;

        return (
            <CategoryList
                paramSearch={paramSearch}
                reload={() => {
                    setIsRefresh(isRefresh => !isRefresh);
                }}
                handleSetCategory={(id: string) => {
                    setIsOpenFormUpdate(true);
                    setIdActive(id);
                }}
            />
        );
    }, [paramSearch]);

    const renderFilter = useMemo(() => {
        return (
            <Filter
                isRefresh={isRefresh}
                onSearch={(values: FindCategoriesParams) => {
                    setParamSearch(values);
                }}
            />
        );
    }, [isRefresh]);

    return (
        <>
            <Card
                title="Danh sách danh mục"
                extra={
                    <>
                        <Button
                            type="primary"
                            onClick={() => {
                                setIsRefresh(!isRefresh);
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                        <Button type="primary" onClick={() => setIsOpenFormCreate(true)}>
                            Thêm mới
                        </Button>
                    </>
                }
            >
                {renderFilter}
                {renderTable}
            </Card>
            {isOpenFormCreate && (
                <FormCategory
                    type="create"
                    id=""
                    open={isOpenFormCreate}
                    onClose={isRefresh => {
                        setIsOpenFormCreate(false);

                        if (isRefresh) {
                            setIsRefresh(isRefresh => !isRefresh);
                        }
                    }}
                />
            )}
            {isOpenFormUpdate && (
                <FormCategory
                    type="update"
                    id={idActive}
                    open={isOpenFormUpdate}
                    onClose={isRefresh => {
                        setIsOpenFormUpdate(false);
                        setIdActive('');

                        if (isRefresh) {
                            setIsRefresh(isRefresh => !isRefresh);
                        }
                    }}
                />
            )}
        </>
    );
};

export default Categories;
