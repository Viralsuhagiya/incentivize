import {useCallback} from 'react';
import {
    useMutation,
    CRUD_UPDATE
} from 'ra-core';
import { useQueryClient } from 'react-query';

const useActionMutation = (props:{resource, action, id?, ids?, onFailure?, onSuccess?}) => {
    const { id, ids, resource, action, onFailure, onSuccess } = props;
    const [mutate, { loading }] = useMutation();
    const queryClient = useQueryClient();
    const callAction = useCallback(() => {
        return mutate(
          {
            type: id?'update':'updateMany',
            resource: resource,
            payload: { id:id, ids: ids, action: action},
          },
          {
            mutationMode: 'pessimistic',
            action: CRUD_UPDATE,
            onSuccess: (data: any, variables: any = {}) => {
              queryClient.invalidateQueries([resource,'getList']);
              queryClient.invalidateQueries([resource, 'getMany']);
              queryClient.invalidateQueries([resource, 'getOne',String(id)]);
              if(onSuccess){
                onSuccess(data, variables)
              };
            },
            onFailure: (error) => {
              if(onFailure){
                onFailure(error)
              };
            },            
          }
        );
      },[mutate, action, queryClient, onFailure, onSuccess, resource, id, ids]);

    return {
        callAction,
        loading,
    }
};

export default useActionMutation;
