import {useCallback} from 'react';
import {
    useNotify, 
    Identifier,
} from 'ra-core';

import { BulkActionProps } from 'react-admin';
import useActionMutation from './useActionMutation';

const noSelection: Identifier[] = [];

const useArchiveEmployee = (props: BulkActionProps&{onSuccess?}) => {
    const { selectedIds = noSelection, onSuccess } = props;
    const notify = useNotify();
    const resource = 'employees';
    const { callAction, loading } = useActionMutation({
      resource,
      ids: selectedIds, 
      action:'archiveEmployee',
      onSuccess: (data: any, variables: any = {}) => {
        notify('resources.employees.notification.archived_success', {
            type: 'info',
            undoable: false,
        });
        if(onSuccess) {
          onSuccess()
        }
      },
      onFailure: (error) => {
        notify('resources.employees.notification.archived_error', {
          type: 'warning',
          messageArgs:{error:error},
        });
      },      
    })
    const archive = useCallback(() => {
        return callAction();
    },[callAction]);

    return {
        archive,
        loading,
    }
};


export default useArchiveEmployee;
