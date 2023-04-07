import {useCallback} from 'react';

import {
    useNotify, 
    Identifier,
} from 'ra-core';

import { BulkActionProps } from 'react-admin';
import useActionMutation from './useActionMutation';

const noSelection: Identifier[] = [];

const useUnarchiveEmployee = (props: BulkActionProps&{onSuccess?}) => {
    const { selectedIds = noSelection, onSuccess } = props;
    const notify = useNotify();
    const resource = 'employees';
    const { callAction, loading } = useActionMutation({
      resource,
      ids: selectedIds, 
      action:'activateEmployee',
      onSuccess: (data: any, variables: any = {}) => {
        notify('resources.employees.notification.activated_success', {
            type: 'info',
            undoable: false,
        });
        if(onSuccess) {
          onSuccess()
        }
      },
      onFailure: (error) => {
        notify('resources.employees.notification.activated_error', {
          type: 'warning',
          messageArgs:{error:error},
        });
      },      
    })
    const activate = useCallback(() => {
        return callAction();
    },[callAction]);

    return {
        activate,
        loading,
    }
};


export default useUnarchiveEmployee;
