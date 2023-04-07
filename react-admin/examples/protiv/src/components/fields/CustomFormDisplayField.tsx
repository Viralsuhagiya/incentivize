import React, { cloneElement } from 'react';
import {
    useInput
} from 'react-admin';

export const CustomFormDisplayField = (props: any) => {
    const {
        input,
    } = useInput({
        ...props,
    });
    const record = { ...props.record };
    record[`${props.source}`] = input.value;
    return <>
        <div style={props.sx}>
        {cloneElement(props.children, { source: props.source, record: record, reference: props.reference })}
        </div>
    </>;
}