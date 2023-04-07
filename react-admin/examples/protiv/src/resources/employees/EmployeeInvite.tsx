import React, {
    useEffect,
    useState,
    useCallback,
} from 'react';
import {
    Button,
    Stack,
    Typography,
    Switch,
    FormControlLabel,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import {
    ReferenceField,
    useNotify,
    TextField,
    TextInput,
    Toolbar,
    SaveButton,
    SelectField,
    useTranslate,
    RecordContextProvider,
    useRedirect
} from 'react-admin';
import { Edit } from '../../layout/Edit';
import Label from '../../components/Label';
import {
    DateTimeField,
    Condition,
    EmailInput
} from '../../components/fields';
import { PhoneInput } from '../../components/fields/PhoneInput';
import useActionMutation from './useActionMutation';
import { omit } from 'lodash';
import { DialogFormWithRedirect } from '../../components/dialog-form';

export async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
}
export const EmployeeStatus = ({ record }: any) => {
    const translate = useTranslate();    
    return (<>
        {record.status==='active'
            &&<><Label variant="ghost" color="success">
                {translate(`resources.employees.choices.status.${record.status}`)}
            </Label></>
        }
        {record.status==='draft'
            &&<><Label variant="ghost" color="error">
                {translate(`resources.employees.choices.status.${record.status}`)}
            </Label></>
        }
        {record.status==='invited'
            &&<><Label variant="ghost" color="warning">
                {translate(`resources.employees.choices.status.${record.status}`)}
            </Label></>
        }
        {record.status==='new'
            &&<Label variant="ghost" color="warning">
                {translate(`resources.employees.choices.status.${record.status}`)}
            </Label>
        }       
    </>)
};
const EmployeeInviteReferenceField = ({record}:{record?}) => {
    const redirect = useRedirect()
    const { loading:cancelInviteLoading, callAction: cancelInvite } = useActionMutation({
        resource:'employees',
        action:'cancel_invite', 
        id: record.employee_id,
        onSuccess:()=>{
            redirect('/employees');            
        }
    });
    return (<>
        <Typography variant="body2">
            Sent on <DateTimeField source="create_date" isLocal={false}/>
        </Typography>
        <Typography variant="body2" >
            Email: <TextField source="email"/>
        </Typography>
        <Typography variant="body2" >
            Mobile: <TextField source="mobile"/>
        </Typography>
        <Stack direction="row">
            <Button onClick={()=>{
                copyTextToClipboard(record.signup_url)
            }}>Copy Link</Button>
            <LoadingButton onClick={cancelInvite} loading={cancelInviteLoading}>
                Cancel Invite
            </LoadingButton>
        </Stack>
    </>)
};
export const EmployeeInviteDialog = (props: any) => {
    const {onSuccess} = props;
    const {record} = props
    return (
        <Edit 
            {...props} 
            component="div"
            actions={false}
            resource="employees"
            id={props.id}
            mutationMode={'pessimistic'}
            transform={(data: any) => omit(data, 'resendInvite')}
            hasShow={false}>
                <EmployeeInviteDialogForm record={record} onSuccess={onSuccess} {...props}/>

        </Edit>
    );
};
const EmployeeInviteDialogForm = (props) => {
    const {record} = props
    const validate = values => {
        const errors:{invite_email?,invite_mobile_number?} = {};
        if (!values.invite_email && !values.invite_mobile_number) {
            errors.invite_email = ' ';
            errors.invite_mobile_number = 'Email or mobile number is required';
        }    
        return errors;
      };
    const status_action = {'invited':'resend_invite', 'draft':'invite','new':'resend_invite','active':'resend_invite'}
    
    const optionRenderer = choice => `${choice.name}`;
    const newRecord = {...record, invite_mobile_number: record.mobile_number, invite_email:record.email};
    const [resendInvite, setResendInvite] = useState(false)
    const [hideResend, setHideResend] = useState(false)
    const onEditSuccess = useCallback(()=>{
        setHideResend(true);
        setResendInvite(false);
    },[])
    useEffect(()=>{
        if(record.status==='draft'){
            setResendInvite(true);
        }
        if(record.status==='active'){
            setResendInvite(true);
            setHideResend(true)
        }
    },[record,setResendInvite])
    const onChangeSwitch = useCallback((event)=>{
        setResendInvite(event.target.checked)
    },[setResendInvite])
    
    return (
    <RecordContextProvider value={newRecord}>
        <DialogFormWithRedirect
            {...props}
            record={newRecord}
            validate={validate}
            toolbar={resendInvite&&<CustomToolbar onEditSuccess={onEditSuccess} noNotify label={`resources.employees.action.${status_action[record.status]}`} icon={<></>}/>}
            render={()=>(
                <Stack>
                    <SelectField variant="h5" choices={[
                        {'id':'draft','name':'resources.employees.choices.status.draft'},
                        {'id':'invited','name':'resources.employees.choices.status.invited'},
                        {'id':'new','name':'resources.employees.choices.status.new'},
                        {'id':'active','name':'resources.employees.choices.status.active'},
                    ]} source="status" translateChoice optionText={optionRenderer} sx={{mb:2}}/>
                    
                    <Condition when="status" is="invited">
                        <ReferenceField label="" link={false} source="invite_id" reference="employeeInvite">
                            <EmployeeInviteReferenceField />
                        </ReferenceField>
                    </Condition>
                    {!hideResend && record.status!=='draft' && 
                        <FormControlLabel control={<Switch id="resendInvite" color="primary" value={resendInvite} onChange={onChangeSwitch} />} label="Resend Invite" />
                    }
                    {resendInvite&&<EmailInput source="invite_email" fullWidth/>}
                    {resendInvite&&<PhoneInput source="invite_mobile_number" fullWidth/>}
                    {resendInvite&&record.status==='active'&&<Typography variant="subtitle2">Warning: User will not be able to access system untill 
                    new invite is accepted.</Typography>}    
                </Stack>
            )}
        />
     </RecordContextProvider>
    )
}
const CustomToolbar = (props: any) => {
    const notify = useNotify();
    const onSuccess = ({ data }: any) => {
        !props.noNotify&&notify('Element Updated');
        props.onEditSuccess&&props.onEditSuccess();
    };
    return (
        <Toolbar {...props} sx={{'width':'100%'}}>
            <SaveButton {...props} onSuccess={onSuccess} />
        </Toolbar>
    );
};
