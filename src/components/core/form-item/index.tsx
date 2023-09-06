import type { UploadProps } from 'antd';
import type { FormItemProps } from 'antd/es/form';
import type { FC } from 'react';

import { Editor } from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select, Switch, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useMemo } from 'react';

import MyDebounceSelect from '@/components/basic/debounce-select';
import uploadPlugin from '@/components/ckeditor/upload.plugin';

export type ControlTypes =
    | 'input'
    | 'input-number'
    | 'input-password'
    | 'switch'
    | 'date-picker'
    | 'date'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'editor'
    | 'upload'
    | 'upload-image-crop'
    | 'select-multiple'
    | 'select-debounce'
    | 'text-area';

type GetRCPropsType<T> = T extends (props: infer R) => any ? R : T extends React.ComponentClass<infer R> ? R : any;

type InnerProps = {
    input: GetRCPropsType<typeof Input>;
    'text-area': GetRCPropsType<typeof Input.TextArea>;
    'input-number': GetRCPropsType<typeof InputNumber>;
    'input-password': GetRCPropsType<typeof Input.Password>;
    switch: GetRCPropsType<typeof Switch>;
    'date-picker': GetRCPropsType<typeof DatePicker>;
    date: GetRCPropsType<typeof DatePicker>;
    checkbox: GetRCPropsType<typeof Checkbox>;
    radio: GetRCPropsType<typeof Radio>;
    select: GetRCPropsType<typeof Select>;
    editor: GetRCPropsType<typeof CKEditor>;
    upload: GetRCPropsType<typeof Upload>;
    'upload-image-crop': GetRCPropsType<typeof Upload>;
    'select-multiple': GetRCPropsType<typeof Select>;
    'select-debounce': GetRCPropsType<typeof Select>;
};

export interface SelectOptions {
    label: string;
    value: any;
    disabled?: boolean;
}
export interface MyFormItemProps<T extends ControlTypes = ControlTypes> extends Omit<FormItemProps, 'required'> {
    type?: T;
    /** 支持 options 的控件如 select checkbox radio 等，非必填 **/
    options?: SelectOptions[];
    fetchOptions?: any;
    /** 控件内部属性，非必填 **/
    innerProps?: InnerProps[T];
    required?: string | boolean;
    setData?: any;
    uploadProps?: UploadProps;
    uploadButton?: any;
    cropOptions?: any;
    onChange?: any;
    otherFilter?: any;
    label?: string;
    onPressEnter?: any;
    onBlur?: any;
    onPopupScroll?: any;
    valuePropName?: any;
}

export class ControlMap {
    props: MyFormItemProps;

    constructor(props: MyFormItemProps) {
        this.props = props;
    }

    get innerProps() {
        return this.props.innerProps as object;
    }

    input() {
        return (
            <Input
                {...this.innerProps}
                onChange={this.props.onChange}
                onPressEnter={this.props.onPressEnter}
                onBlur={this.props.onBlur}
            />
        );
    }

    'input-password'() {
        return <Input.Password {...this.innerProps} onChange={this.props.onChange} />;
    }

    'input-number'() {
        return <InputNumber {...this.innerProps} onChange={this.props.onChange} />;
    }

    'text-area'() {
        return <Input.TextArea {...this.innerProps} onChange={this.props.onChange} />;
    }

    switch() {
        return <Switch {...this.innerProps} onChange={this.props.onChange} />;
    }

    'date-picker'(): JSX.Element {
        const { RangePicker }: any = DatePicker;

        return (
            <>
                <RangePicker allowEmpty={[true, true]} {...this.innerProps} onChange={this.props.onChange} />
            </>
        );
    }
    date() {
        return <DatePicker {...this.innerProps} format="DD-MM-YYYY" />;
    }

    checkbox() {
        // highlight-next-line
        return (
            <Checkbox.Group
                children={this.props.children}
                options={this.props.options}
                {...this.innerProps}
                onChange={this.props.onChange}
            />
        );
    }

    radio() {
        // highlight-next-line
        return (
            <Radio.Group
                children={this.props.children}
                options={this.props.options}
                {...this.innerProps}
                onChange={this.props.onChange}
            />
        );
    }
    select() {
        // highlight-next-line
        return (
            <Select
                children={this.props.children}
                options={this.props.options}
                {...this.innerProps}
                onChange={this.props.onChange}
            />
        );
    }

    editor() {
        return (
            <CKEditor
                {...this.innerProps}
                // config={{
                //     extraPlugins: [uploadPlugin],
                // }}
                editor={Editor}
                row="5"
                onChange={(e: Event, editor: any) => {
                    this.props.setData(editor.getData());
                }}
            />
        );
    }
    'upload-image-crop'() {
        return (
            <ImgCrop {...this.props.cropOptions} modalCancel="Hủy" modalOk="Cắt" modalTitle="Chỉnh sửa hình ảnh">
                <Upload {...this.innerProps} {...this.props.uploadProps}>
                    {this.props.uploadButton === null ? null : this.props.uploadButton}
                </Upload>
            </ImgCrop>
        );
    }
    upload() {
        return (
            <Upload {...this.innerProps} {...this.props.uploadProps}>
                {this.props.uploadButton === null ? null : this.props.uploadButton}
            </Upload>
        );
    }
    'select-debounce'() {
        return (
            <MyDebounceSelect
                fetchOptions={this.props.fetchOptions}
                defaultOptions={this.props.options}
                {...this.innerProps}
                otherFilter={this.props.otherFilter}
                showSearch
                onChange={this.props.onChange}
                onPopupScroll={this.props.onPopupScroll}
            />
        );
    }
    'select-multiple'() {
        return (
            <Select children={this.props.children} options={this.props.options} {...this.innerProps} mode="multiple" />
        );
    }
}

const MyFormItem: FC<MyFormItemProps> = props => {
    // 取出我们自定义的参数，其余的全部原封不动的还给 `Form.Item`
    // type: 用于我们判断外面传进来的控件类型我们再渲染好了直接生成出来
    // children: 因为我们需要自定义 `Form.Item` 的子元素了，如果不取出来但父组件又提供的话会发生冲突
    const { type, required, rules: userRules, ...restProps } = props;

    const rules = useMemo(() => {
        // 如果设置了 rules 属性，说明用户需要完全自定义 rules，不仅仅是必填
        if (userRules) return userRules;

        // 如果设置了 required 属性
        if (required) {
            if (typeof required === 'boolean') {
                const coulumn = props.label ? props.label.toLowerCase() : '';

                return [{ required: true, message: `Vui lòng nhập ${coulumn}` }];
            }
            // 自定义 required 文案
            else if (typeof required === 'string') {
                return [{ required: true, message: required }];
            }
        }
    }, [required, userRules, props.label]);

    // highlight-next-line
    const controlMap = new ControlMap(props);

    return (
        <Form.Item {...restProps} rules={rules}>
            {type ? controlMap[type]() : props.children}
        </Form.Item>
    );
};

export default MyFormItem;
