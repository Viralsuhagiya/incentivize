import { EditableDatagrid, RowForm } from '../../ra-editable-datagrid';
import {
    TextField,
    TextInput,
    ListBase} from 'react-admin';
import { styled } from '@mui/material/styles';
import { formStyle } from '../propays/Propay';
import { PercentField, PercentInput } from '../../components/fields';

const StyledRowForm = styled(RowForm)({
    ...formStyle,
});

export const StyledPercentInput = styled(PercentInput)({
    'label+.MuiInput-root':{
        marginTop:0,        
    }
});

export const JobPositionDataGrid = (props: any) => {
    const {show_job_page} = props
    return (
        <ListBase
            resource="position"
            actions={false}
            component="div"
            disableSyncWithLocation
            {...props}
            perPage={100}
        >
        <EditableDatagrid
            data-testid="store-datagrid"
            rowClick="edit"
            defaultTitle={null}
            editForm={<JobPositionRowForm show_job_page={show_job_page}/>}
            createForm={<JobPositionRowForm show_job_page={show_job_page}/>}
            size="medium"
            hasCreate={true}
            bulkActionButtons={false}
        >
            <TextField source="name" />
            {show_job_page && <PercentField
                source="burden_per"
            />}
        </EditableDatagrid>
    </ListBase>
    );
};
export const JobPositionRowForm = (props: any) => {
    const {show_job_page} = props
    return (
        <StyledRowForm {...props}>
            <TextInput source="name" variant="standard" label={''} />
            {show_job_page && <StyledPercentInput source="burden_per" variant="standard" label={''}/>}
        </StyledRowForm>
    );
};

