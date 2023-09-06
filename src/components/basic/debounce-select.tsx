import type { SelectProps } from 'antd/es/select';

import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import React, { useMemo, useRef, useState } from 'react';

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children' | 'defaultOptions'> {
    fetchOptions: (value: string, other?: any) => Promise<ValueType[]>;
    debounceTimeout?: number;
    defaultOptions: ValueType[];
    otherFilter: any;
}

function DebounceSelect<ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any>({
    fetchOptions,
    debounceTimeout = 800,
    defaultOptions,
    otherFilter,
    ...props
}: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;

            setOptions([]);
            setFetching(true);

            fetchOptions(value, otherFilter).then(newOptions => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options.length > 0 ? options : defaultOptions}
        />
    );
}

const MyDebounceSelect = Object.assign(DebounceSelect);

export default MyDebounceSelect;
