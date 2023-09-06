import type { ConfigFormProps } from '../dto';
import type { FormListFieldData } from 'antd';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';

import MyForm from '@/components/core/form';
import MyFormItem from '@/components/core/form-item';

const ConfigContact = (props: ConfigFormProps) => {
    const { form } = props;

    return (
        <div className="config">
            <MyForm layout="vertical" form={form}>
                <Row gutter={8}>
                    <Col span={15}>
                        <h3>Thông tin liên hệ</h3>
                        <MyForm.List name="contacts">
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map((field: FormListFieldData) => (
                                        <MyFormItem required={false} key={field.key}>
                                            <Row gutter={8}>
                                                <Col span={8}>
                                                    <MyFormItem
                                                        {...field}
                                                        required={true}
                                                        key={field.key}
                                                        name={[field.name, 'name']}
                                                        style={{ marginBottom: '-5px' }}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        label="Tên đối tác"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                whitespace: true,
                                                                message: 'Vui lòng nhập tên đối tác.',
                                                            },
                                                        ]}
                                                        innerProps={{ placeholder: 'Tên đối tác' }}
                                                        type="input"
                                                    />
                                                </Col>
                                                <Col span={8}>
                                                    <MyFormItem
                                                        {...field}
                                                        required
                                                        key={field.key}
                                                        name={[field.name, 'email']}
                                                        style={{ marginBottom: '-5px' }}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        label="Email"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                whitespace: true,
                                                                message: 'Vui lòng nhập email đối tác.',
                                                            },
                                                        ]}
                                                        innerProps={{ placeholder: 'Email liên hệ' }}
                                                        type="input"
                                                    />
                                                </Col>
                                                <Col span={7}>
                                                    <MyFormItem
                                                        {...field}
                                                        required
                                                        key={field.key}
                                                        name={[field.name, 'phoneNumber']}
                                                        style={{ marginBottom: '-5px' }}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        label="Số điện thoại"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                whitespace: true,
                                                                message: 'Vui lòng nhập số điện thoại.',
                                                            },
                                                        ]}
                                                        innerProps={{ placeholder: 'Số điện thoại liên hệ' }}
                                                        type="input"
                                                    />
                                                </Col>
                                                <Col span={1}>
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        style={{
                                                            color: 'red',
                                                            paddingTop: '38px',
                                                        }}
                                                        onClick={() => remove(field.name)}
                                                    />
                                                </Col>
                                            </Row>
                                            <MyForm.ErrorList errors={errors} />
                                        </MyFormItem>
                                    ))}
                                    <Row gutter={8}>
                                        <Col span={8}>
                                            <Button
                                                type="dashed"
                                                style={{
                                                    width: '100%',
                                                }}
                                                onClick={() => add()}
                                                icon={<PlusOutlined />}
                                            >
                                                Thêm đối tác mới
                                            </Button>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </MyForm.List>
                    </Col>
                    <Col span={9}>
                        <h3>Mạng xã hội</h3>
                        <MyForm.List name="socials">
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map((field: FormListFieldData) => (
                                        <MyFormItem required={false} key={field.key}>
                                            <Row gutter={8}>
                                                <Col span={8}>
                                                    <MyFormItem
                                                        {...field}
                                                        required
                                                        key={field.key}
                                                        name={[field.name, 'type']}
                                                        style={{ marginBottom: '-5px' }}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        label="Mạng xã hội"
                                                        type="select"
                                                        options={[
                                                            {
                                                                label: 'Facebook',
                                                                value: 'FACEBOOK',
                                                            },
                                                            {
                                                                label: 'Instagram',
                                                                value: 'INSTAGRAM',
                                                            },
                                                            {
                                                                label: 'Twitter',
                                                                value: 'TWITTER',
                                                            },
                                                        ]}
                                                    />
                                                </Col>
                                                <Col span={15}>
                                                    <MyFormItem
                                                        {...field}
                                                        required
                                                        key={field.key}
                                                        name={[field.name, 'url']}
                                                        style={{ marginBottom: '-5px' }}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        label="Đường dẫn"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                whitespace: true,
                                                                message: 'Vui lòng nhập email đối tác.',
                                                            },
                                                        ]}
                                                        innerProps={{ placeholder: 'Email liên hệ' }}
                                                        type="input"
                                                    />
                                                </Col>

                                                <Col span={1}>
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        style={{
                                                            color: 'red',
                                                            paddingTop: '38px',
                                                        }}
                                                        onClick={() => remove(field.name)}
                                                    />
                                                </Col>
                                            </Row>
                                            <MyForm.ErrorList errors={errors} />
                                        </MyFormItem>
                                    ))}
                                    <Row gutter={8}>
                                        <Col span={8}>
                                            <Button
                                                type="dashed"
                                                style={{
                                                    width: '100%',
                                                }}
                                                onClick={() => add()}
                                                icon={<PlusOutlined />}
                                            >
                                                Thêm mới
                                            </Button>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </MyForm.List>
                    </Col>
                </Row>
            </MyForm>
        </div>
    );
};

export default ConfigContact;
