import React, {useState} from 'react';
import List from  '../pages/list'
import {Button} from "antd";
import { Card } from 'antd'
import PedagogyList from "../pages/list";
const Pedagogy: React.FC = () => {
    const [resetForm, setResetForm] = useState(true);
    return (
        <>
            <Card
                title="Danh sách nội dung"
                bordered={true}
                hoverable
                extra={
                    <>
                        <Button type="primary" onClick={() => setResetForm(resetForm => !resetForm)} >
                            Xoá bộ lọc
                        </Button>
                    </>
                }
            >
                <PedagogyList isRefresh={resetForm}/>
            </Card>
        </>
    )
}
export default  Pedagogy
