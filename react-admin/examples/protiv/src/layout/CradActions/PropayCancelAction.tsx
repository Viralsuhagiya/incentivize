import React, { useEffect, useState } from 'react';
import { CRUD_UPDATE, useMutation, useNotify, 
    useRecordContext, useResourceContext, useTranslate } from 'react-admin';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { Confirm } from '../../components/Confirm';
import { ConfirmModal } from '../../components/ConfirmModal';
import { NUMBER } from '../../utils/Constants/MagicNumber';


/* handling propay cancel action in this component */
const PropayCancelAction = (props:any) => {
    const {cancelPropay, cancelClose, route} = props;
    const navigate = useNavigate();
    const [OpenConfiromDialog, setOpenConfiromDialog] = useState(false);
    const [cancelAlertDialog, setCancelAlertDialog] = useState(false);
    
    const record = useRecordContext(props);
    const translate = useTranslate();
    const resourceContext =  useResourceContext();

    const onSuccess = ()=> {
        queryClient.invalidateQueries([resourceContext, 'getList']);
        route && navigate(-NUMBER.ONE)
    };

    const [mutate, { loading }] = useMutation();
    const queryClient = useQueryClient();
    const notify = useNotify();
    
    useEffect(() => {
        if(cancelPropay) {
            setOpenConfiromDialog(true);
        }
    },[cancelPropay]);

    const handleConfirm = () => {
        mutate(
            {
                type: 'update',
                resource: 'propays',
                payload: { id: record.id, action: 'cancel_propay', data: {} },
            },
            {
                mutationMode: 'pessimistic',
                action: CRUD_UPDATE,
                onSuccess: (result: any, variables: any = {}) => {   
                    notify('You have Successfully Cancelled Propay.', { type: 'info' });
                    setCancelAlertDialog(true);
                    setOpenConfiromDialog(false);
                },
                onFailure: error => {
                    notify(error.message, { type: 'warning' });
                },
            }
        );
    };

    const handleClose= () => {
        setOpenConfiromDialog(false);
        cancelClose(false);
    };

    const handleCancel = () => {
        cancelClose(false);
        mutate(
            {
                type: 'update',
                resource: 'propays',
                payload: {id: record.id, action:'actionSendPropayCancelledWorkerSms', data: {} }
            },
            {
              mutationMode: 'pessimistic',
              action: CRUD_UPDATE,
              onSuccess: (data: any, variables: any = {}) => {
                    onSuccess();
              },
              onFailure: (error) => {
                notify(`Failure ! ${error.message}`);
              },
            }
          );
    };
    return (
            <>
                <Confirm  
                    isOpen={OpenConfiromDialog}
                    loading={loading}
                    title={translate('resources.propays.cancel.title',{name:record?.name})}
                    content={translate('resources.propays.cancel.content',{name:record?.name})}
                    onConfirm={handleConfirm}
                    onClose={() => handleClose()}                    
                    />
                <ConfirmModal
                  isOpen={cancelAlertDialog}
                  loading={loading}
                  title='Cancel Propay'
                  content={translate('resources.propays.cancel.notify.title')}                  
                  onClose={() => {
                    onSuccess();
                    setCancelAlertDialog(false);
                  } }
                  onConfirm={handleCancel}
                    />
            </>
    );
};
export default PropayCancelAction;
