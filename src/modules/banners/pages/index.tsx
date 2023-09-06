import React, {useMemo, useState} from "react";
import {Button, Card} from "antd";
import MentorIntroduceList from "@/modules/banners/pages/list";
import Filter from "@/modules/banners/components/filter";
import Form from "@/modules/banners/components/form";
import {MentorIntroduce} from "@/interface/mentor";

const Banner = () => {

    const [paramSearch, setParamSearch] = useState<any>({});
    const [isRefresh, setIsRefresh] = useState<boolean | null>(null);
    const [openFormCreate, setOpenFormCreate] = useState<boolean>(false);
    const [openFormUpdate, setOpenFormUpdate] = useState<boolean>(false)
    const [idActive, setIdActive] = useState<string>('')
    const onSearch = (value: any) => {
        setParamSearch(value);
    }
    return (
        <Card
            title={"Danh sách mentor"}
            extra={
                <>
                    <Button type={'primary'} onClick={() => {setIsRefresh(isRefresh => !isRefresh)}}>Xóa bộ lọc</Button>
                    <Button type={'primary'} onClick={() => setOpenFormCreate(true)}>Thêm mới</Button>
                </>
            }>
            <MentorIntroduceList
                isRefresh={isRefresh}
                setIdActive={(record: MentorIntroduce) => {
                    setIdActive(record?._id)
                    setOpenFormUpdate(true)
                }}
            />
            {
                openFormCreate && (
                    <Form
                        type={'create'}
                        open={openFormCreate}
                        onClose={isRefresh => {
                            if(isRefresh) {
                                setIsRefresh(isRefresh => !isRefresh)
                            }
                            setOpenFormCreate(false);
                        }}
                        id={""}
                    />
                )
            }
            {
                openFormUpdate && idActive && (
                    <Form
                        type={'update'}
                        open={openFormUpdate}
                        onClose={isRefresh => {
                            if(isRefresh) {
                                setIsRefresh(isRefresh => !isRefresh)
                            }
                            setOpenFormUpdate(false);
                            setIdActive('')
                        }}
                        id={idActive}
                    />
                )
            }

        </Card>
    )
}

export default Banner
