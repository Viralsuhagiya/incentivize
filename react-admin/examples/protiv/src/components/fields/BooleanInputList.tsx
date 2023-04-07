import React, {useCallback, useEffect, useState} from 'react';
import {
    useRecordContext,
    useMutation,
    useResourceContext,
    CRUD_UPDATE,
} from 'react-admin';
import ErrorIcon from '@mui/icons-material/Error';

import { useQueryClient } from 'react-query';
import { styled } from '@mui/material/styles';
import { CircularProgress, Stack, Switch } from '@mui/material';
import {get, set} from 'lodash';
import { updateCache } from '../../hooks/updateCache';
const StyledDiv = styled('div')(({ theme }) => ({
    'width':'20px'
}));

export const BooleanListInput = (props) => {
    const { source, disabled } = props;
    const record = useRecordContext(props);
    const initialValue = get(record, source,false);
    const [checked, setChecked] = useState(initialValue);
    const value = get(record, source)
    useEffect(()=>{
        setChecked(value)
    },[value])

    const [mutate] = useMutation();
    const resource =  useResourceContext();
    const queryClient = useQueryClient();
    const [error, setError] = useState<any>(false);
    const [loading, setLoading] = React.useState(false);

    const handleChange = useCallback((event)=>{
        event.stopPropagation();
        setChecked(event.target.checked);
        const newData = set({id:record.id}, source, event.target.checked);
        setLoading(true);
        return mutate(
            {
                type: 'update',
                resource: resource,
                payload: {id: record.id, data: newData, previousData:{ id:record.id } }
            },
            {
                mutationMode: 'pessimistic',
                action: CRUD_UPDATE,
                onSuccess: (
                    data: any,
                    variables: any = {}
                ) => {
                    setLoading(false);
                    setError(false);
                    data = data.data;
                    updateCache({queryClient, resource, id:data.id, data:data});
                },
                onFailure: errors => {
                    setLoading(false);
                    setError(errors);
                    setChecked(!event.target.checked);
                }
            }
        );
    },[setChecked,mutate,record,queryClient,source, resource]);
    return (
        <>
        <Stack direction={'row'}  sx={{alignItems:'center'}}>
            <Switch 
                checked={checked}
                onChange={handleChange}
                disabled={disabled||loading}
            />
            {loading && (
                <CircularProgress size={14} color="secondary" thickness={4} sx={{ml:0}}/>
            )}
            {
                !loading && <StyledDiv/>
            }
                
            {error&&error.message&&<>
                <ErrorIcon
                    key={record.id}
                    aria-errormessage={error.message ? error.message : error}                    
                    color="error"
                    fontSize="small"
                />
            </>}
        </Stack>
        </>
    );
};
