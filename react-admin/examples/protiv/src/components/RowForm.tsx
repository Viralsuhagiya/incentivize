import * as React from 'react';
import { FC } from 'react';
import { FormProps } from 'react-final-form';
import {
    RowFormProps,
    RowForm as RaRowForm,
} from '../ra-editable-datagrid';
export const styles = {
    price: { width: '7em' },
    width: { width: '7em' },
    height: { width: '7em' },
    stock: { width: '7em' },
    widthFormGroup: { display: 'inline-block' },
    heightFormGroup: { display: 'inline-block', marginLeft: 32 },
};

export const RowForm: FC<
    RowFormProps & { initialValues: any } & Omit<FormProps, 'onSubmit'>
> = props => {
    const record = props.record;
    let initialValues = {};
    if (props.initialValues) {
        if (typeof props.initialValues === 'object') {
            initialValues = props.initialValues;
        } else if (typeof props.initialValues === 'function') {
            initialValues = props.initialValues(record);
        }
    }
    return <RaRowForm {...props} initialValues={initialValues} />;
};
