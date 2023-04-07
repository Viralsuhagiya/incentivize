import { useCallback } from 'react';
import {
    useMutation,
    CRUD_UPDATE
} from 'ra-core';

const usePayrollReport = (props: { action, id, onFailure?, onSuccess?}) => {
    const { id, action, onFailure, onSuccess } = props;
    const [mutate, { loading }] = useMutation();
    const callAction = useCallback(() => {
        return mutate(
            {
                type: 'update',
                resource: 'periods',
                payload: { id: id, action: action },
            },
            {
                mutationMode: 'pessimistic',
                action: CRUD_UPDATE,
                onSuccess: (data: any, variables: any = {}) => {
                    console.log('Response is coming ', data, variables);
                    if (data.data?.period_report_url) {
                        window.open(data.data.period_report_url);
                    }
                    if (onSuccess) {
                        onSuccess(data, variables)
                    }
                },
                onFailure: error => {
                    if (onFailure) {
                        onFailure(error)
                    } else {
                        console.log('There is error ', error.message);
                    }
                },
            }            
    );
}, [mutate, action, onFailure, onSuccess, id]);

return {
    callAction,
    loading,
}
};


export default usePayrollReport;
