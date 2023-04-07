import {
    ReferenceArrayInputProps,
    ReferenceArrayInput as RaReferenceArrayInput
} from 'react-admin';

const ReferenceArrayInput =  (props: ReferenceArrayInputProps) => {
    return (
        <RaReferenceArrayInput 
            {...props}
        />
    )
}

ReferenceArrayInput.defaultProps = {
    allowEmpty: false,
};

export default ReferenceArrayInput
