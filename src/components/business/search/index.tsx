import type { MyFormProps } from '@/components/core/form';

import { css } from '@emotion/react';
import { useEffect } from 'react';

import MyForm from '@/components/core/form';

interface SearchProps<T> extends MyFormProps<T> {
    onSearch: (values: T) => void;
}

const BaseSearch = <T extends object>(props: SearchProps<T>) => {
    const { children, onSearch, ...rest } = props;
    const [form] = MyForm.useForm<T>();

    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                onSubmit();
            } else if (event.key === 'Escape') {
                event.preventDefault();
                form.resetFields();
            } else if (event.type === 'click') {
                // event.preventDefault();
                // onSubmit();
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, []);

    const onSubmit = async () => {
        const values = await form.validateFields();

        if (values) {
            onSearch(values);
        }
    };

    return (
        <div css={styles}>
            <MyForm {...rest} form={form} layout="vertical">
                {children}
            </MyForm>
        </div>
    );
};

const MySearch = Object.assign(BaseSearch, {
    Item: MyForm.Item,
});

export default MySearch;

const styles = css`
    padding: 10px;
    .ant-form-item {
        margin-bottom: 10px;
    }
`;
