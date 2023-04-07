import React, { useEffect } from 'react';
import {
    useInput,
    useReferenceInputController,
} from 'ra-core';
import {
    ReferenceInputProps, 
    ReferenceInputViewProps,
    ReferenceInput as RaReferenceInput,
    ReferenceInputView as RaReferenceInputView
} from 'react-admin';

import { useField as useFinalFormField } from 'react-final-form';

export const ReferenceInputObj = (props: ReferenceInputProps) => {
    const {
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        validate,
        ...rest
    } = props;
    const inputProps = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        validate,
        ...rest,
    });
    return (
        <ReferenceInputObjView
            {...inputProps}
            {...rest}
            {...useReferenceInputController({ ...rest, ...inputProps })}
        />
    );
};

ReferenceInputObj.propTypes = RaReferenceInput.propTypes;
ReferenceInputObj.defaultProps = {...RaReferenceInput.defaultProps,emptyValue: 0};

export const ReferenceInputObjView = (props: ReferenceInputViewProps) => {
    const { referenceRecord } = props;

    const { input: { onChange: objOnChange}} = useFinalFormField(`${props.source}_obj`);
    useEffect(() => {
        objOnChange(referenceRecord.data);
    }, [objOnChange, referenceRecord.data]);

    return (<RaReferenceInputView {...props}/>)
};
