// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { MyResponse } from '@/api/request';
import type { PageData } from '@/interface';
import type { ColumnsType } from 'antd/es/table/interface';

import { css } from '@emotion/react';
import { forwardRef, useCallback, useEffect } from 'react';

import MyTable from '@/components/core/table';
import { useStates } from '@/utils/use-states';

import MySearch from '../search';

interface SearchApi {
    (params?: any): MyResponse<PageData<any>>;
}

type ParseDataType<S> = S extends (params?: any) => MyResponse<PageData<infer T>> ? T : S;

export type MyPageTableOptions<S> = ColumnsType<S>;
export interface PageProps<S> {
    searchRender?: React.ReactNode;
    pageApi?: S;
    pageParams?: object;
    tableOptions?: MyPageTableOptions<ParseDataType<S>>;
    tableRender?: (data: MyPageTableOptions<ParseDataType<S>>[]) => React.ReactNode;
    asideKey?: string;
    asideValue?: string | number;
    radioCardsValue?: string | number;
    tabsValue?: string | number;
    paramSearch?: object | null;
}

export interface RefPageProps {
    setAsideCheckedKey: (key?: string) => void;
    load: (data?: object) => Promise<void>;
}

const BasePage = <S extends SearchApi>(props: PageProps<S>, _: React.Ref<RefPageProps>) => {
    const { pageApi, pageParams, searchRender, tableOptions, tableRender, paramSearch } = props;
    const [pageData, setPageData] = useStates<PageData<ParseDataType<S>>>({
        limit: 10,
        page: 1,
        totalDocs: 0,
        docs: [],
    });

    const getPageData = useCallback(async () => {
        if (pageApi) {
            const obj = {
                filterQuery: paramSearch || {},
                options: {
                    ...pageParams,
                    limit: pageData.limit,
                    page: pageData.page,
                    totalDocs: pageData.totalDocs,
                },
            };
            const res = await pageApi(obj);

            if (res.status) {
                setPageData({ totalDocs: res.result.totalDocs, docs: res.result.docs });
            }
        }
    }, [pageApi, pageParams, pageData.limit, pageData.page, paramSearch]);

    useEffect(() => {
        getPageData();
    }, [getPageData]);

    const onSearch = () => {
        getPageData();
    };

    const onPageChange = (page: number, limit?: number) => {
        setPageData({ page });

        if (limit) {
            setPageData({ limit });
        }
    };

    return (
        <div css={styles}>
            <div className="aside-main">
                {searchRender && (
                    <MySearch className="search" onSearch={onSearch}>
                        {searchRender}
                    </MySearch>
                )}
                {tableOptions && (
                    <div className="table">
                        <MyTable
                            height="100%"
                            dataSource={pageData.docs}
                            columns={tableOptions}
                            pagination={{
                                current: pageData.page,
                                pageSize: pageData.limit,
                                total: pageData.totalDocs,
                                onChange: onPageChange,
                            }}
                        >
                            {tableRender?.(pageData.docs)}
                        </MyTable>
                    </div>
                )}
            </div>
        </div>
    );
};

const BasePageRef = forwardRef(BasePage) as <S extends SearchApi>(
    props: PageProps<S> & { ref?: React.Ref<RefPageProps> },
) => React.ReactElement;

type BasePageType = typeof BasePageRef;

interface MyPageType extends BasePageType {
    MySearch: typeof MySearch;
    MyTable: typeof MyTable;
}

const MyPage = BasePageRef as MyPageType;

MyPage.MySearch = MySearch;
MyPage.MyTable = MyTable;

export default MyPage;

const styles = css`
    display: flex;
    flex-direction: column;
    .tabs-main {
        flex: 1;
        display: flex;
        overflow: hidden;
    }
    .search {
        margin-bottom: 10px;
    }
    .aside-main {
        display: flex;
        flex: 1;
        overflow: hidden;
        flex-direction: column;
        @media screen and (max-height: 800px) {
            overflow: auto;
        }
    }
    .table {
        flex: 1;
        overflow: hidden;
        @media screen and (max-height: 800px) {
            overflow: auto;
            // min-height: 500px;
        }
    }
`;
