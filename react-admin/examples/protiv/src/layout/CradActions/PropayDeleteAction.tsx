import React, { useCallback, useEffect, useState } from 'react';
import { useDelete, useNotify, useRecordContext, useTranslate } from 'react-admin';
import { Confirm } from '../../components/Confirm';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { NUMBER } from '../../utils/Constants/MagicNumber';


/* handling propay delete action in this component */
const PropayDeleteAction = (props:any) => {
    const {deletePropay, DeleteClose, route} = props;
    const navigate = useNavigate();
    const [OpenConfiromDialog, setOpenConfiromDialog] = useState(false);
    const record = useRecordContext(props);
    const translate = useTranslate();
    const notify = useNotify();
    const queryClient = useQueryClient();

    useEffect(() => {
        if(deletePropay) {
            setOpenConfiromDialog(true);
        }
    },[deletePropay]);

    const onSuccess = ()=> {
        DeleteClose(false);
        queryClient.invalidateQueries(['propays', 'getList']);
        notify('You have Successfully Deleted Propay.', { type: 'info' });
        route && navigate(-NUMBER.ONE)
    };
    const [deleteOne, { isLoading }] = useDelete('propays',  { id: record.id},{onSuccess});
    const handleDelete = useCallback((): void => {
        deleteOne();
    }, [deleteOne]);
    const handleClose= () => {
        setOpenConfiromDialog(false);
        DeleteClose(false);
    };

    return (
            <>
                <Confirm
                    isOpen={OpenConfiromDialog}
                    loading={isLoading}
                    title={translate('resources.propays.delete.title',{name:record?.name})}
                    content={translate('resources.propays.delete.content',{name:record?.name})}
                    onConfirm={handleDelete}
                    onClose={() => handleClose()}
                    />
            </>
    );
};

export default PropayDeleteAction;
