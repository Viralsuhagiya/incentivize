import { Create,Edit,useEditSuggestionContext, required, SimpleForm,
    TextInput, useCreateSuggestionContext, useNotify
} from 'react-admin';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { JobDialog, JobEditToolbar, JobToolbar } from './job';

const isRequired = [required()];
const CreateJobPositionForm = (props: any) => {
    const { filter,onCreate} = useCreateSuggestionContext();
    const notify = useNotify();
    const onCreateSuccess = (data:any) => {
        notify(`Element Created data`);
        onCreate(data);
    };
    return <Create component="div" title="Add Position" resource="positions">
        <SimpleForm toolbar={<JobToolbar onSuccess={onCreateSuccess}/>} submitOnEnter={false} redirect={false} initialValues={{name:filter }}>
            <TextInput source="name" validate={isRequired} />
        </SimpleForm>
    </Create>
};
const EditJobPositionForm = (props: any) => {
    const { record, onEdit } = useEditSuggestionContext();
    return <Edit actions={false} mutationOptions={{
        onSuccess: data => {
            onEdit(data);
        },
    }} mutationMode="pessimistic" component="div" id={record.id} resource="positions">
        <SimpleForm toolbar={<JobEditToolbar/>} submitOnEnter={false} redirect={false}>
            <TextInput source="name" validate={isRequired} />
        </SimpleForm>
    </Edit>
};
export const CreateJobPosition = () => {
    const {onCancel} = useCreateSuggestionContext();
    return <JobDialog contentProps={{ maxHeight:230, height: window.innerHeight / NUMBER.TWO}} onCancel={onCancel} component={<CreateJobPositionForm/>} title="Add Position"/>
};
export const EditJobPosition = () => {
    const {onCancel} = useEditSuggestionContext();
    return <JobDialog contentProps={{ maxHeight:230, height: window.innerHeight / NUMBER.TWO}} onCancel={onCancel} component={<EditJobPositionForm/>} title="Edit Position"/>
};
