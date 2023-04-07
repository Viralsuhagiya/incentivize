import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import ContentCreate from '@mui/icons-material/Create';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import { LoadingButton } from '@mui/lab';
import {
    AvatarGroup,
    Box,
    Button,
    ButtonGroup,
    Drawer,
    Grid, Hidden, IconButton, Link as MuiLink,
    Popover, Stack, Theme, ToggleButton, ToggleButtonGroup, Tooltip,
    Typography, useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import get from 'lodash/get';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import {
    AutocompleteArrayInput, AutocompleteInput, Confirm as RaConfirm, CRUD_UPDATE, DatagridBody,
    DatagridBodyProps,
    DatagridRow,
    FieldWithLabel,
    FunctionField, ListActions, ListBase, NumberField,
    ReferenceArrayField, ReferenceField,
    ReferenceInput, ResourceContextProvider,
    SelectInput, Show, TextField,
    TextInput, TopToolbar, translate, useDelete, useGetList, useListContext, useMutation, useNotify, useRecordContext, useRedirect, useResourceContext, useShowController, useTranslate
} from 'react-admin';
import { Helmet } from 'react-helmet-async';
import { useQueryClient } from 'react-query';
import { Link, Outlet, Route, Routes, useParams } from 'react-router-dom';
import { MAvatar } from '../../components/@material-extend';
import MIconButton from '../../components/@material-extend/MIconButton';
import { Confirm } from '../../components/Confirm';
import { Datagrid } from '../../components/datagrid';
import { HeadlessDatagrid } from '../../components/datagrid/HeadlessDatagrid';
import { HeadlessReferenceArrayField } from '../../components/datagrid/HeadlessReferenceArrayField';
import RowIndexDatagridBody from '../../components/datagrid/RowIndexDatagridBody';
import { DialogConentForm } from '../../components/DialogForm';
import { DateRangeField, DateTimeField } from '../../components/fields';
import { DateField } from '../../components/fields/DateField';
import { DateFormat } from '../../components/fields/DateFormat';
import { DateRangeInputFilter } from '../../components/fields/DateRangeInputFilter';
import { EmptyColumn, MoneyField, NoHeader, NumberToTimeField, PercentField, StatusLabelField, FormatTimeField } from '../../components/fields/fields';
import { useIdentityContext, usePermissionsOptimized } from '../../components/identity';
import Label from '../../components/Label';
import PageAlerts, { PageAlertContextProvider } from '../../components/page-alerts/PageAlerts';
import { getMaxHours } from '../../dashboard/Calculator';
import { getBaseWage } from '../../dashboard/PropayCalculator';
import { useGetBaseLocationForCurrentRoute } from '../../hooks/useGetBaseLocationForCurrentRoute';
import CardListActions from '../../layout/CardListActions';
import CardListView from '../../layout/CardListView';
import { CreateButton } from '../../layout/CreateButton';
import Empty from '../../layout/Empty';
import { List, ListGroupWithoutCard, ListWithoutCard } from '../../layout/List';
import { ResponsiveFilterGusser } from '../../layout/ResponsiveFilter';
import UserAvtarAndName from '../../layout/UserAvtarAndName';
import StatusField from '../../layout/StatusField';
import { EditableDatagrid } from '../../ra-editable-datagrid';
import { canAccess } from '../../ra-rbac';
import createAvatar from '../../utils/createAvatar';
import { convertNumToTime } from '../../utils/formatter';
import { HasBackendNotConnected } from '../company/company';
import { EmployeeFullNameField } from '../employees/Employee';
import { JobNameField } from '../jobs/job';
import { DialogAddTimeForm, HasPermission, StyledTypography } from '../payrolls/Payrolls';
import { MailMessageChanges, MailMessageChangesView } from '../protivPropayChanges/ProPayChangeForm';
import { ActionButtons } from './ActionButtons';
import ContactsPopover from './ContactsPopover';
import { PropayDialog, StyledDialog } from './Propay';
import WorkerActions from './WorkerActions';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isMobile, truncatePropayName } from '../../utils/Constants/ConstantData';
import PropayActualAndTotalData from './PropayActualAndTotalData';
import WorkerTableResponsive from './WorkerTableResponsive';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import DateTimeTextField, { DateTimeTextLink } from '../../components/fields/DateTimeTextField';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import OtherWorkerDetails from './OtherWorkerDetails';
import ReferenceArrayInput from '../../components/fields/ReferenceArrayInput';
import { InfoLabel } from '../../components/fields/InfoLabel';



export enum VIEW_MODE {
    PROPAY = 'PROPAY',
    EMPLOYEE = 'EMPLOYEE',
}

const StyledSelectInput = styled(SelectInput)({
    minWidth: '150px',
});
const StyledReferenceInput = styled(ReferenceInput)({
    minWidth: '150px',
});
const StyledReferenceArrayInput = styled(ReferenceArrayInput)({
    minWidth: '150px',
});

const PREFIX = 'PropayEdit';

const classes = {
    root: `${PREFIX}-root`,
};

export const formStyle = {
    [`&.${classes.root}`]: { alignItems: 'flex-start' },
    '.MuiFormHelperText-root': { display: 'none' },
    '.MuiFormHelperText-root.Mui-error': { display: 'block' },
    '.MuiCardHeader-root': { 'padding-top': '0px' },
    '.MuiFormControl-root': { marginTop: '16px' },
};

export const StyledEditableDatagrid = styled(EditableDatagrid)({
    '.MuiInput-root.MuiInput-underline.MuiInputBase-root': {
        marginTop: '0px',
    },
    '.MuiFormControl-root.MuiFormControl-marginDense.MuiTextField-root': {
        marginTop: '0px',
        marginBottom: '0px',
    },
    '.MuiTableCell-root:last-of-type': {
        'padding-right': '0px',
        width: '90px',
    },
});


const LabelAvatar = ({ record, name }: any) => {
    const first_name = name? get(name.split(' ',2), 0,''): (record&&record.first_name||'');
    const last_name = name? name.split(' ',2)[1]: (record && record.last_name||'');
    const avatar = createAvatar(first_name, last_name);
    return (
        <MAvatar color={avatar.color} sx={{ width: 30, height: 30 }}>
            <Typography variant='inherit' noWrap sx={{ fontSize: 12 }}>
                {avatar.name}
            </Typography>
        </MAvatar>
    );
};

export const EmployeeAvatar = (props: any) => {
    const { record, showBonus, is_remove_bonus } = props;
    return (
        <Stack
            direction='row'
            alignItems='center'
            justifyContent='flex-start'
            spacing={1}
        >
            <LabelAvatar {...props} />
                <Stack direction='column' sx={{ overflow: 'hidden' }}>
                    <EmployeeFullNameField record={record} />
                    <Stack direction='row'>
                        <ReferenceField
                            source='position_id'
                            reference='positions'
                            link={false}
                        >
                            <PositionField />
                        </ReferenceField>
                        {showBonus && is_remove_bonus &&<Label
                            variant='ghost'
                            color={'pending'}
                        >
                            No Bonus
                        </Label>}
                    </Stack>
                </Stack>
            </Stack>
    );
};

export const PropayEmployeeAvatar = (props: any) => {
    const { wage_ids } = props;
    const { data } = useListContext();
    if (data.length === 1) {
        return (
            <EmployeeAvatar showBonus is_remove_bonus={_.size(wage_ids) && wage_ids[0].is_remove_bonus} record={data[0]} />
        );
    }

    if (data.length > 1) {
        return (
            <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                sx={{ width: '100%' }}
            >
                <AvatarGroup max={2}>
                    {data.map((employee: any) => {
                        return (
                            <LabelAvatar {...employee}/>
                        );
                    })}
                </AvatarGroup>
            </Stack>
        );
    }
    return <div>No Data</div>;
};

const PositionField = ({ record }: any) => {
    return (
        <Typography
            variant='body2'
            noWrap
            sx={{ opacity: 0.8, color: '#231F20' }}
        >
            {record.name}
        </Typography>
    );
};

export const StatusButtonGroup = ({onClick, loading, reverseLoading, variant, reverseVariant, style, reverseStyle,buttonsTitle}:any) => {
    return (
        <ButtonGroup
            variant='outlined'
            color='inherit'
            style={{ width: '100%' }}
        >

            <LoadingButton
                size='small'
                loading = { reverseLoading }
                variant = {reverseVariant}
                style={{  ...reverseStyle, width: '100%', boxShadow: 'none' }}
                onClick={onClick}
            >
                {buttonsTitle.button1}
            </LoadingButton>
            <LoadingButton
                variant={variant}
                size='small'
                loading = { loading }
                style={{
                    ...style,
                    width: '100%',
                    boxShadow: 'none',
                }}
                onClick={onClick}
            >
                {buttonsTitle.button2}
            </LoadingButton>
        </ButtonGroup>
    )    
}
export const ProPayPaidAlert = ({name}) => {
    return (
        <>
            <Typography variant='body2'>
                No bonus on
                <Typography variant='subtitle1' component='span'>
                    &nbsp;({name})&nbsp;
                </Typography>
                ProPay closed automatically
            </Typography>
        </> 
    )
}

export const PROPAY_STATUS = [
    { id: 'open', name: 'resources.propays.choices.status.open'},
    { id: 'pending', name: 'resources.propays.choices.status.pending' },
    { id: 'approved', name: 'resources.propays.choices.status.approved' },
    { id: 'paid', name: 'resources.propays.choices.status.paid' },
    { id: 'cancelled', name: 'resources.propays.choices.status.cancelled' },
]

const PropayFilters = [
    <TextInput className='filter-search' source='name._ilike' label='resources.propays.search' size='medium' alwaysOn alwaysOnMobile/>,
    <StyledSelectInput
        size='medium'
        source='status._eq'
        label='resources.propays.status'
        choices={PROPAY_STATUS}
        alwaysOn
    />,
    <StyledReferenceInput size='medium'
        className='select-input-arrow'
        source='manager_id._eq'
        reference='employees'
        label='resources.propays.manager'
        filter={{ user_type: {_in:['manager','admin']} }}
        alwaysOn
    >
        <AutocompleteInput source='name'/>
    </StyledReferenceInput>,
    <StyledReferenceArrayInput size='medium'
        className='select-input-arrow'
        source='employee_wage_ids.employee_id._in'
        reference='employees'
        label='resources.propays.worker'               
        filter={{active: {_eq: true}}}        
        alwaysOn
    >
        <AutocompleteArrayInput source='name'/>
    </StyledReferenceArrayInput>,
        <DateRangeInputFilter className='date-input-filter' source='from_date' alwaysOn />


];

const ChildRows = (props: any) => {
    const { permissions } = usePermissionsOptimized();
    return (
        <HeadlessReferenceArrayField
            label='resources.propays.fields.employee_name_and_position'
            reference='propayEmployeeWages'
            source='employee_wage_idsIds'
        >
            <HeadlessDatagrid bulkActionButtons={false} header={<NoHeader/>} size='small'>
                <EmptyColumn label='' />
                <EmptyColumn label='' />
                <FunctionField
                    source='employee_id'
                    sortable
                    label=' '
                    render={(record: any) => {
                        return (<ReferenceField source='employee_id' reference='employees' link={false}>
                            <EmployeeAvatar showBonus is_remove_bonus={record.is_remove_bonus} />
                        </ReferenceField>)
                    }}
                />
                <EmptyColumn label='' />
                <DateRangeField label='Date' />
                <EmptyColumn label='' />
                <FormatTimeField source='hours' />
                <MoneyField source='earning'/>
                {canAccess({
                        permissions,
                        resource: 'propays',
                        action: 'edit',
                    }) && 
                <EmptyColumn label='' />
                }
                <EmptyColumn label='' />
            </HeadlessDatagrid>
        </HeadlessReferenceArrayField>
    );
};

export const PropayShowButton = (props: any) => {
    const {record, basePath} = props
    return (
        <Tooltip title='Details'>
            <IconButton
                onClick={e => {
                    e.stopPropagation();
                }}
                component={Link}
                to={{pathname:`${basePath||''}${record&&record.id}/show`}}
            >
                <Icon icon='akar-icons:arrow-right' fr='' />
            </IconButton>
        </Tooltip>
    );
};

const PropayEditButton = (props: any) => {
    const {record} = props
    return (
        <Tooltip title='Details'>
            <IconButton
                onClick={e => {
                    e.stopPropagation();
                }}
                component={Link}
                to={{pathname:`${record&&record.id}/edit/propay`}}
            >
                <ContentCreate/>
                
            </IconButton>
        </Tooltip>
    );
};

export const StyledDatagrid = styled(Datagrid)({
    '.MuiTableCell-head': {
        paddingLeft: 0,
        border: 0,
        borderColor: '#f0f2f7',
        borderStyle: 'solid',
        borderBottomWidth: 2,
    },
    '.RaDatagrid-row': {
        border: 0,
        borderColor: '#f0f2f7',
        borderStyle: 'solid',
        borderBottomWidth: 1,
    },
    '.MuiTableCell-body': {
        paddingLeft: 0,
    },
    '.MuiTableCell-footer': {
        paddingLeft: 4,
    },
    '.MuiTableRow-root':{
        '.MuiTableCell-root:first-of-type': {
            paddingLeft:0
        },
        '.MuiTableCell-root:last-of-type': {
            paddingRight:0
        }
    }
});

export const ListStyle = {
    marginTop:5,
    '.MuiTableCell-head.RaDatagrid-headerCell':{
        backgroundColor:'white',
        padding:0
    },
    
    '.MuiTableCell-body': {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop:5,
        paddingBottom:5
    },
    '.MuiTableCell-footer': {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop:5,
        paddingBottom:5
    },
    '.MuiTableCell-head': {
        paddingLeft: 0,
        border: 0,
        borderColor: '#f0f2f7',
        borderStyle: 'solid',
        borderBottomWidth: 2,
    },
    '.RaDatagrid-row': {
        border: 0,
        borderColor: '#f0f2f7',
        borderStyle: 'solid',
        borderBottomWidth: 1,
    },
    '.MuiTableRow-root':{
        '.MuiTableCell-root:first-of-type': {
            paddingLeft:0
        },
        '.MuiTableCell-root:last-of-type': {
            paddingRight:0
        }
    }
};
const StyledListGroupWithoutCard = styled(ListGroupWithoutCard)(ListStyle);
const StyledListWithoutCard = styled(ListWithoutCard)(ListStyle);
export const StyledActivityListWithoutCard = styled(ListWithoutCard)({
    ...ListStyle,
    '.MuiTableHead-root': {
        display: 'none'
    },
    '.RaDatagrid-row':{
        borderBottomWidth:0
    }
});

export const StyledFieldWithLabel = styled(FieldWithLabel)({
    '.RaFieldWithLabel-label': {
        fontWeight: 'bold',
    },
    '.MuiTypography-body2': {
        border: 1,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: 'rgba(137, 150, 164, 0.32)',
        padding: 10,
    },
});

const StyledMoneyField = styled(MoneyField)({
        fontWeight: 'bold',
        fontSize:'large',
        opacity:0.8
});

export const StyledTextField = styled(TextField)({
    fontWeight: 'bold',
    fontSize:20,
    color:'#231F20',
    paddingRight:5
});

const textStyle = {
    fontSize: 14,
    color: '#231F20',
    fontWeight: 400,
    marginLeft: 1,
    marginRight: 1,
};

const StyledStatusTextField = styled(TextField)({
    ...textStyle
});

const StyledNameTextField = styled(TextField)({
    ...textStyle,
    fontWeight: 'bold',
});

export const StyleDateTimeField = styled(DateTimeField)({
    ...textStyle
});


const HasData = (props:any) => {
    const {list} = props;
    if(list && list.length > 0){
        return props.children;
    }
    return null;
};

export const WeeklyDialogForm = forwardRef((props: any, ref: any) => {
    const [open, setOpen] = useState(props.open);
    const [record, setRecord] = useState(null);
    const {onCloseAlert} = props;

    const onClose = () => {
        if (onCloseAlert) {
            onCloseAlert()
        }
        setOpen(false);
    };

    useImperativeHandle(ref, () => ({
        open(record: any) {
            setRecord(record);
            setOpen(true);
        },
        close() {
            onClose();
        },
    }));
    const xsFullScreenDialog = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );

    return (
        <StyledDialog maxWidth='md' fullScreen={xsFullScreenDialog}  open={open} {...props.dialogProps}>
          <DialogConentForm open={open} record={record} onClose={onClose} {...props}/>
        </StyledDialog>
    );
});
export const EmployeeFullNameBonus = ({ record,is_remove_bonus ,is_propay_assigned_by_themselves}: any) => (
    <span>
        {record.first_name} {record.last_name}
        {is_remove_bonus && 
        <Label
            variant='ghost'
            color={'pending'}
        >
            No Bonus
        </Label>}
        {!record.active && 
        <Label
            variant='ghost'
            color={'pending'}
        >
            Deact.
        </Label>}
       
        {is_propay_assigned_by_themselves && 
            <InfoLabel sx={{color:'red'}} height={15} icon='ri:error-warning-fill'>
                <StyledTypography>Worker assigned themselves to ProPay.</StyledTypography>
            </InfoLabel>
        }
    </span>
);
/**
 * 
 * TODO: This propay drawer needs further fix, This kind of thing happens because of wrong cohesion, drawer for propay and 
 * propay wage has to be totally different drawer, rather than adding conditions in the same drawer
 * 
 */
 const ButtonPopOver = (props:any) => {
    const {label} = props;
    const maxWidth=props.maxWidth || 300
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <>
            <Button
                size='small'
                variant='text'
                onClick={handleClick}
                color={'warning'}
            >
                {label}
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{
                    maxWidth: maxWidth, padding:1 }}>
                    {React.Children.map(props.children, child => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child );
                        }
                    return child;
                    })}
                </Box>
            </Popover>
        </>
    );
};

const SubJobList = (props:any) => {
    return (<ReferenceArrayField label='Sub Jobs' reference='contractItems' source='contractor_item_ids'>
        <StyledDatagrid bulkActionButtons={false}>
            <TextField source='name' />
            <NumberField source='quantity'/>
        </StyledDatagrid>
    </ReferenceArrayField>)

};

const MailMessageList = (props:any) => {
    const {record} = props;
    const diaglogRef: any = React.useRef();
    const [messageRecord, setRecord] = useState(null);
    const translate = useTranslate();
    return (
        <>
        <Typography className='propay-change-modal-heading'> {translate('resources.propays.propay_changes.info')} </Typography>
        <div className='propay-changes-boxes'>
        {record?.map((changes, index)=>{
        return (        
                                 <Stack className='changes-boxes-col' direction='row' spacing={2}> 
                                    <div className='changes-boxes-bg'>
                                    <Typography> {translate('resources.propays.propay_changes.change')} {index+NUMBER.ONE}</Typography> 
                                    <MuiLink 
                                        component='button'
                                        onClick={() => {
                                            diaglogRef.current.open()
                                            setRecord(changes)
                                        }}
                                        underline='always'
                                    >
                                     <DateTimeTextLink record={changes} />
                                    </MuiLink>
                                    </div>
                                    </Stack>
                                    )}
                                    )}
        </div>
        <ResourceContextProvider value='mailMessages'>
            <WeeklyDialogForm title='Add Time'  ref={diaglogRef}>
                <MailMessageChangesView record={messageRecord} onClose={() => { diaglogRef.current && diaglogRef.current.close() }}/>
            </WeeklyDialogForm>
        </ResourceContextProvider>
        </>
    )
};

const PropayChangesShow = (props) => {
    const {record} = props;
    const translate = useTranslate();

    const { data, total } = useGetList(
        'mailMessages',
        { pagination: { page: NUMBER.ONE, perPage: NUMBER.HUNDRED },
        filter: { id: { _in: record.message_idsIds }, tracking_value_ids: { field: { _in: ['name', 'amount', 'job_id', 'task_names'] } } },
        sort:{ field: 'create_date', order: 'ASC' }} 
    );
    const MessageList = total && data.slice(NUMBER.ONE, data.length); 
     if(total <= 1) {
         return <></>;
     }
    return(
        <>
        <div className='propay-detail-accordion propay-change-accordion'>           
        <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='changepanel1d-content' id='changepanel1d-header'>
        <Typography variant='h5' noWrap sx={{ paddingBottom:2}}> {translate('resources.propays.propay_changes.title')} </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid className='activity-propay-boxes propay-change-boxes' container spacing={2}>                        
                <Grid item xs={12} lg={12} sx={{paddingTop:0 }}>
                    <MailMessageList record={MessageList} />
                </Grid>
        </Grid>        
        </AccordionDetails>
        </Accordion>
        </div>
        </>
    )
};

const StatusActivity = (props:any) => {
    const {record} = props;
    const translate = useTranslate();
    return (<><StyledActivityListWithoutCard
        title=' '
        disableSyncWithLocation={true}
        component='div'
        filter={{
            mail_message_id_obj: {
                res_id: { _eq: record?.id },
                model: { _eq: 'protiv.propay' },
            },
            field: { _eq: 'status' },
            old_value_char: { _neq: '' }
        }}
        actions={false}
        resource='mailTrackingValues'
        empty={<></>}
        titleActionProps={{ showCreate: false }}
        perPage={NUMBER.THIRTY}
        showPagination={false}
        sort={{ field: 'create_date', order: 'DESC' }}
    >
        <StyledDatagrid
            bulkActionButtons={false}
            empty={<></>}
        >
            <FunctionField
                source='status'
                sortable
                label=' '
                render={(record: any) => {
                    return (
                        <Stack direction='row' className='activity-typography-cs'>
                            <StyledStatusTextField source='new_value_char' />
                            <Typography
                                variant='body1'
                                sx={textStyle}
                            >
                                &nbsp;By:&nbsp;
                            </Typography>
                            <ReferenceField
                                source='author_id'
                                reference='partners'
                                sortable={false}
                                link={false}
                            >
                                <StyledNameTextField source='name' className='activity-box-name' />
                            </ReferenceField>
                            <Typography
                                variant='caption'
                                sx={textStyle}
                            >
                                (<StyleDateTimeField
                                source='create_date'
                                isLocal={false}
                                label='Date'
                            />
                            )
                            </Typography>

                        </Stack>
                    );
                } } />
        </StyledDatagrid>
    </StyledActivityListWithoutCard><Helmet>
            <title>ProPay Detail</title>
        </Helmet></>
    )
};
const Contacts = (props:any) => (
    <ReferenceArrayField
        reference='employees'
        source='selected_employee_ids'
    >
        <ContactsPopover {...props}/>
    </ReferenceArrayField>

);
const CloseIcon = (props:any) => (
    <MIconButton onClick={props?.onClose} >
        <Icon
            icon={closeFill}
            width={20}
            height={20}
            fr=''
        />
    </MIconButton>
);

const PropayShowView = (props: any) => {
    const translate = useTranslate();
    const { refetch } = useShowController();
    const navigate = useNavigate();
    const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const identity = useIdentityContext();
    const record = useRecordContext(props);
    const average = _.meanBy(get(record,'wage_ids'), (p: any) =>  getBaseWage(p));
    const max_hours = getMaxHours(
        get(record,'amount'),
        get(record,'attendance_earning'),
        average,
        get(record,'hours'),
        get(record,'budget_option'),
        get(record,'budget_hours'),
        );
    if (!record) {
        return null;
    };
    const otherWorker = record.selected_employee_ids.filter((empId) => empId !== identity.employee_id);

    return ( 
        <>
        <Box className='propay-detail-page' sx={{ px: 2, overflowY:'auto' }}>            
            <Grid container spacing={2}>
                <Grid className='propay-detail-title-row' item xs={12}>
                    <Stack
                        direction='row'
                        alignItems='center'
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Stack direction='row' alignItems='center' className='status-label-details'>
                                    <span className='back-button-title' onClick={()=> navigate(-NUMBER.ONE)}>Back</span>
                                    <StyledTextField source='name' className='propay-dtl-title' />                                    
                                    {Boolean(record['job_id']) &&                                         
                                        <Typography className='label-dtl-sub-head'>                                            
                                   <ReferenceField
                                     source='job_id'
                                      reference='jobs'
                                      link={false}
                                    >
                                   <JobName/>
                                    </ReferenceField>
                                    </Typography>
                                    }
                                    {identity.user_type !== 'worker' && <CardListActions record={record} onShowPage={true} refresh={refetch}/>}
                                    <FunctionField
                                    className='status-btn-dtl'
                                     source='status'
                                     sortable
                                     render={(record: any) => (
                                     <StatusField record={record} />
                                     )}
                                     />
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>
            </Grid>
            <HasData list={record.contractor_item_ids}>
                <Grid container spacing={0} sx={{ marginBottom: 2 }}>
                    <Grid item xs={12} lg={12}>
                        <Typography variant='h5' noWrap >
                            {translate('resources.propays.fields.contractor_item_ids')}
                        </Typography>
                        <SubJobList record={record} />
                    </Grid>
                </Grid>
            </HasData>

                    <Grid className='worker-detail-box' container spacing={0} sx={{marginBottom:2}}>
                        <Grid item xs={12} lg={12}>
                            <PropayActualAndTotalData record={record} maxHours={max_hours}/>
                        </Grid>
                    </Grid>
            
            {identity?.user_type !== 'worker' && <HasData list={record.employee_wage_ids}>
            <Grid className='worker-detail-box' container spacing={0} sx={{marginBottom:2}}>
                        <Grid item xs={12} lg={12}>
                            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Stack>
                                    <Typography variant='h5'>{translate('resources.propays.worked_details')}</Typography>
                                    <Typography variant='subtitle1' sx={{ mb:'15px' }}>{translate('resources.propays.worked_assigned_propay')}</Typography>
                                </Stack>
                            </Stack>
                        {isSmall ? 
                        <StyledListGroupWithoutCard
                         title=' '
                         disableSyncWithLocation={true}
                         component='div'
                         filter={['pending','cancelled'].includes(record.status) ? {propay_id: {_eq: record.id,}}:{propay_id: {_eq: record.id}, _and: {_or: {bonus: {_gt: 0}, hours: {_is_null: false}}}}}
                         actions={false}
                         resource='propayWageByBaseWage' 
                         lazy={false}
                         groupBy={['employee_id','base_wage']}
                         fields={['propay_id','base_wage','employee_id','hours','bonus','propay_earning','base_pay','pay_rate','is_remove_bonus','lead_pay','propay_ot_amt',
                         'is_propay_assigned_by_themselves','bonus_per','active']}
                         empty={false}
                         titleActionProps={{showCreate:false}}
                         perPage={200}
                         showPagination={false}
                         emptyWhileLoading     
                         className='worker-table-responsive'                        
                       >
                        <WorkerTableResponsive value={record} refetch ={refetch}/> 
                        </StyledListGroupWithoutCard>
                        : 
                        <StyledListGroupWithoutCard
                        title=' '
                        disableSyncWithLocation={true}
                        component='div'
                        filter={['pending','cancelled'].includes(record.status) ? {propay_id: {_eq: record.id,}}:{propay_id: {_eq: record.id}, _and: {_or: {_or: {lead_pay: {_gt: 0}, bonus: {_gt: 0}}}, hours: {_is_null: false}}}}
                        actions={false}
                        resource='propayWageByBaseWage' 
                        lazy={false}
                        groupBy={['employee_id','base_wage']}
                        fields={['propay_id','base_wage','employee_id','hours','bonus','propay_earning','base_pay','pay_rate','is_remove_bonus','lead_pay','propay_ot_amt',
                        'is_propay_assigned_by_themselves','bonus_per']}
                        empty={false}
                        titleActionProps={{showCreate:false}}
                        perPage={200}
                        showPagination={false}
                        >
                             <WorkerTable refetch ={refetch}/> 
                             </StyledListGroupWithoutCard>                            
                            }
                        </Grid>                        
                    </Grid>
            </HasData>}
            {identity?.user_type === 'worker' && <HasData list={record.employee_wage_ids}>
            <Grid className='worker-detail-box' container spacing={0} sx={{marginBottom:2}}>
            <Grid item xs={12} lg={12} className='other-worker-grid-cont'>
                        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Stack>
                                    <Typography variant='h5'>{translate('resources.propays.personal_details')}</Typography>                                    
                                </Stack>
                        </Stack>
                        {!isSmall ? <StyledListGroupWithoutCard
                         title=' '
                         disableSyncWithLocation={true}
                         component='div'
                         filter={['pending','cancelled'].includes(record.status) ? {propay_id: {_eq: record.id,}, employee_id: {_eq: identity.employee_id,}}:
                         {propay_id: {_eq: record.id}, employee_id: {_eq: identity.employee_id,}, _and: {_or: {bonus: {_gt: 0}, hours: {_is_null: false}}}}}
                         actions={false}
                         resource='propayWageByBaseWage' 
                         lazy={false}
                         groupBy={['employee_id','base_wage']}
                         fields={['propay_id','base_wage','employee_id','hours','bonus','propay_earning','base_pay','pay_rate','is_remove_bonus','lead_pay','propay_ot_amt',
                         'is_propay_assigned_by_themselves','bonus_per','active']}
                         empty={false}
                         titleActionProps={{showCreate:false}}
                         perPage={200}
                         showPagination={false}
                         className='bonus-card-details'                        
                       >
                            <WorkerTable refetch ={refetch}/>                             
                        </StyledListGroupWithoutCard>
                        :
                        <StyledListGroupWithoutCard
                         title=' '
                         disableSyncWithLocation={true}
                         component='div'
                         filter={['pending','cancelled'].includes(record.status) ? {propay_id: {_eq: record.id,}, employee_id: {_eq: identity.employee_id,}}:
                         {propay_id: {_eq: record.id}, employee_id: {_eq: identity.employee_id,}, _and: {_or: {bonus: {_gt: 0}, hours: {_is_null: false}}}}}
                         actions={false}
                         resource='propayWageByBaseWage' 
                         lazy={false}
                         groupBy={['employee_id','base_wage']}
                         fields={['propay_id','base_wage','employee_id','hours','bonus','propay_earning','base_pay','pay_rate','is_remove_bonus','lead_pay','propay_ot_amt',
                         'is_propay_assigned_by_themselves','bonus_per','active']}
                         empty={false}
                         titleActionProps={{showCreate:false}}
                         perPage={200}
                         emptyWhileLoading
                         showPagination={false}
                         className='bonus-card-details'                        
                       >
                            <WorkerTableResponsive value={record} refetch ={refetch}/>                             
                        </StyledListGroupWithoutCard>
                        }
            </Grid>
            </Grid>
            </HasData>}

            {identity?.user_type === 'worker' && otherWorker.length > NUMBER.ZERO && <HasData list={record.employee_wage_ids}>
            <Grid className='worker-detail-box' container spacing={0} sx={{marginBottom:2}}>
            <Grid item xs={12} lg={12} className='other-worker-grid-cont'>
                        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Stack>
                                    <Typography variant='h5'>{translate('resources.propays.other_worker_details')}</Typography>                                    
                                </Stack>
                        </Stack>
                        {isSmall ? <OtherWorkerDetails propayId={record.id}/>
                        : 
                        <ListWithoutCard resource='workerDetails' 
                        filter={{propay_id: {_eq: record.id}, employee_id: {_neq: identity.employee_id}}}
                        showPagination={false}
                        perPage={200}
                        actions={false}
                        className='bonus-card-details'                        
                        >
                            <OtherWorkersTable/>
                        </ListWithoutCard>
                        
                        }
            </Grid>
            </Grid>
            </HasData>}

            {/* <PropayPaidHistorySection filter={{propay_id: {_eq: record.id},payroll_id_obj:{status:{_eq: 'paid'}}}}/> */}
            {/* <AttendanceSection filter={{'propay_id': {_eq: record.id}, type:{_in:['regular','manual']}}}/> */}
            <HasData list={record.task_ids}>
                <TaskSection filter={{'propay_id': {_eq: record.id}}}/>
            </HasData>
                <PropayChangesShow record={record} />
        <div className='propay-detail-accordion'>           
        <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1d-content' id='panel1d-header'>
        <Typography variant='h5' noWrap sx={{ paddingBottom:2}}>{translate('resources.propays.fields.activity')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid container spacing={2}>
                <Grid className='create-date-propay-detail' item xs={12} sm={8} md={4} lg={4}>
                    <FunctionField
                                     textAlign='right'
                                     source='create_date'
                                     label=''
                                     render={(record: any) => (
                                     <DateTimeTextField record={record} />
                                  )}
                               />
                </Grid>                                
        </Grid>
        <Grid className='activity-propay-boxes' container spacing={2}>
        <Grid item xs={12} lg={12} sx={{paddingTop:0 }}>
                    <StatusActivity record={record} />
        </Grid>        
        </Grid>
        </AccordionDetails>
      </Accordion>
            </div>
            <Helmet>
                <title>{translate('resources.propays.propay_detail')}</title>
            </Helmet>
        </Box>
        </>
    );
};

const WorkerTable = (props: any) => {
    const record = useRecordContext(props);
    const { refetch } = props;
    return(
        <>
                              <StyledDatagrid  bulkActionButtons={false} empty={<Empty />}>
                                <FunctionField
                                source='employee_id'
                                label='resources.propays.fields.name'
                                sortable
                                render={(record: any) => {
                                    return (<ReferenceField
                                        source='employee_id'
                                        reference='employees'
                                        link={false}
                                    >
                                        <UserAvtarAndName is_remove_bonus={record.is_remove_bonus} is_propay_assigned_by_themselves={record.is_propay_assigned_by_themselves} 
                                        sortable={false} />
                                    </ReferenceField>)
                                    }}
                                    />
                                    <MoneyField source='base_wage' sortable={false}/>
                                    <FormatTimeField
                                                source='hours'
                                                label='resources.propays.hours'
                                                textAlign='right'
                                                sortable={false}
                                                groupBy
                                            />
                                    <MoneyField  textAlign='right' source='base_pay' label='resources.propays.base_pay' sortable={false} groupBy/>                                    
                                    <MoneyField source='bonus' textAlign='right' sortable={false} groupBy/>
                                    <FunctionField
                                        source='lead_pay'
                                        textAlign='right'
                                        groupBy
                                        label={record.is_change_lead_pay ? 'LeadPay' : ''}
                                        render={(data: any) => {
                                            return (record.is_change_lead_pay &&
                                                <MoneyField source='lead_pay' sortable={false} />
                                            )
                                        }}
                                    />
                                    <MoneyField  source='propay_earning' label='resources.propays.total' textAlign='right' sortable={false} groupBy/>
                                    <MoneyField source='pay_rate' label='resources.propays.propay_rate' textAlign='right' sortable={false} groupBy/>
                                    {record.bonus_split_type === 'by_percentage' && <PercentField label='resources.propays.bonus_percentage' source='bonus_per'/>}
                                    <FunctionField label='resources.propays.percentage_increase' source='pay_rate' render={(record) => (<PercentageIncrease record={record}/>)} />
                                    {record?.status !== 'paid' && <FunctionField
                                     textAlign='right'
                                     label='resources.propays.action'
                                     render={(recordData: any) => (
                                     <>
                                     <WorkerActions record={record} recordData={recordData} refetch={refetch} />
                                     </>
                                  )}
                               />}
                               </StyledDatagrid>
                            <Helmet>
                <title>ProPay Detail</title>
            </Helmet>
        </>
    );
};

const OtherWorkersTable = (props: any) => {
    const translate = useTranslate();
    return(
        <>
                              <StyledDatagrid  bulkActionButtons={false} empty={<Empty />}>
                                <FunctionField
                                source='employee_id'
                                label='resources.propays.fields.name'
                                sortable
                                render={(record: any) => {
                                    return (<ReferenceField
                                        source='employee_id'
                                        reference='employees'
                                        link={false}
                                    >
                                        <UserAvtarAndName is_remove_bonus={record.is_remove_bonus} is_propay_assigned_by_themselves={record.is_propay_assigned_by_themselves} 
                                        sortable={false} />
                                    </ReferenceField>)
                                    }}
                                    />
                                    <FormatTimeField
                                                source='hours'
                                                label='resources.propays.hours'
                                                textAlign='right'
                                                sortable={false}
                                                groupBy
                                            />
                                    <MoneyField source='bonus' textAlign='right' sortable={false} groupBy/>
                               </StyledDatagrid>
                            <Helmet>
                <title>{translate('propay_detail')}</title>
            </Helmet>
        </>
    );
};

const PercentageIncrease = ({record}: any) => {
    const amountIncrease = record.pay_rate ? record.pay_rate - record.base_wage : 0;
	const percentageIncrease = (amountIncrease / record.base_wage) * NUMBER.HUNDRED;
    const percentNumber  = Number.isNaN(percentageIncrease) ? NUMBER.ZERO : percentageIncrease;
    return (
        <>
            {`${percentNumber === NUMBER.ZERO ? percentNumber : parseFloat(percentNumber.toString()).toFixed(NUMBER.TWO)}%`}
        </>
    );
};

const JobName = () => {
    return (<FunctionField render={record => `Job: ${record?.full_name}`} />);
};

const PropayDelete = (props:any) => {
    const [OpenConfiromDialog, setOpenConfiromDialog] = useState(false);
    const record = useRecordContext(props);
    const translate = useTranslate();
    const redirect = useRedirect();
    const onSuccess = ()=> {
        redirect('/propay/propay');
    }
    const [deleteOne, { isLoading }] = useDelete('propays',  { id: record.id},{onSuccess});
    const handleDelete = useCallback((): void => {
        deleteOne();
    }, [deleteOne]);

    return (
            <>
                <Button
                    variant='outlined'
                    onClick={() => setOpenConfiromDialog(true)}
                >
                    {translate('resources.propays.delete.buttonTitle')}
                </Button>

                <Confirm
                    isOpen={OpenConfiromDialog}
                    loading={isLoading}
                    title={translate('resources.propays.delete.title',{name:record?.name})}
                    content={translate('resources.propays.delete.content',{name:record?.name})}
                    onConfirm={handleDelete}
                    onClose={() => setOpenConfiromDialog(false)}
                    />
            </>
    )
};

const PropayCancel = (props:any) => {
    const [OpenConfiromDialog, setOpenConfiromDialog] = useState(false);
    const [cancelAlertDialog, setCancelAlertDialog] = useState(false);
    
    const record = useRecordContext(props);
    const translate = useTranslate();
    const redirect = useRedirect();
    const onSuccess = ()=> {
        redirect('/propay/propay');
        queryClient.invalidateQueries([resourceContext, 'getList']); 
    };
    const [mutate, { loading }] = useMutation();
    const queryClient = useQueryClient();
    const resourceContext =  useResourceContext();
    const notify = useNotify();
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
                    console.log('Response is coming ', result, variables);
                    setOpenConfiromDialog(false);
                    setCancelAlertDialog(true);
                    
                },
                onFailure: error => {
                    notify(error.message, { type: 'warning' });
                },
            }
        );
    };

    const handleCancel = () => {
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
                <Button
                className='propay-detail-cancel-btn'
                    variant='outlined'
                    onClick={() => setOpenConfiromDialog(true)}
                >
                    {translate('resources.propays.cancel.buttonTitle')}
                </Button>

                <Confirm
                    isOpen={OpenConfiromDialog}
                    loading={loading}
                    title={translate('resources.propays.cancel.title',{name:record?.name})}
                    content={translate('resources.propays.cancel.content',{name:record?.name})}
                    onConfirm={handleConfirm}
                    onClose={() => setOpenConfiromDialog(false)}
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
    )
};

const PropayActionsComponent = (props:any) => {
    const record = useRecordContext(props);
    return (
        <HasPermission resource='propays' action='cancel_propay'>
                {record && record.hours ? (
                    <PropayCancel/>
                    ):(
                    <PropayDelete/>
                )}
        </HasPermission>
    )
};

export const AttendanceSection = (props:any) => {
    const translate = useTranslate();
    const {filter, ...rest} = props;
    const record = useRecordContext(rest);
    return (
        <HasData list={record.attendance_only_ids}>
            <Grid container spacing={0} sx={{paddingTop:2}}>
                <Grid item xs={12} lg={12}>
                    <Typography variant='h5' noWrap >
                        {translate('resources.propays.fields.attendance_only_ids')}
                    </Typography>
                    <StyledListGroupWithoutCard
                        title=' '
                        disableSyncWithLocation={true}
                        component='div'
                        filter={filter}
                        actions={false}
                        resource='attendances' 
                        lazy={false}
                        groupBy={['employee_id']}
                        fields={['date','hours','gross_pay', 'employee_id']}
                        empty={false}
                        titleActionProps={{showCreate:false}}
                        perPage={200}
                        showPagination={false}
                        >
                        <StyledDatagrid  size='medium'  bulkActionButtons={false} empty={<Empty />} showFooter>
                            <DateField source='date' textAlign='left'  sortable={false}/>
                            <ReferenceField source='employee_id' reference='employees' textAlign='left'  sortable={false} link={false}>
                                <EmployeeFullNameField/>
                            </ReferenceField>
                            <FormatTimeField
                                        source='hours'
                                        suffix_label='Hours'
                                        textAlign='right'
                                        sortable={false}
                                        groupBy
                                    />
                        </StyledDatagrid>
                    </StyledListGroupWithoutCard>
                </Grid>
            </Grid>
        </HasData>
    )
};

const TaskSection = (props:any) => {
    const {filter} = props;
    return (
        <Grid className='task-detail-sec' container spacing={0}>
            <Grid item xs={12} lg={12}>
                <Typography variant='h5' noWrap >
                    Tasks
                </Typography>
                <StyledListWithoutCard
                    title=' '
                    disableSyncWithLocation={true}
                    component='div'
                    filter={filter}
                    actions={false}
                    resource='taskLists' 
                    empty={false}
                    titleActionProps={{showCreate:false}}
                    perPage={200}
                    showPagination={false}
                    >
                    <StyledDatagrid
                        bulkActionButtons={false}
                        empty={<Empty />}
                    >
                        <TextField source='name' textAlign='left' sortable={false}/>
                    </StyledDatagrid>
                </StyledListWithoutCard>
            </Grid>
        </Grid>
    )
};
const PropayPaidHistorySection = (props:any) => {
    const {filter, ...rest} = props;
    const record = useRecordContext(rest);
    return (
        <HasData list={record.attendance_ids}>
            <Grid className='worker-detail-box' container spacing={0}>
                <Grid item xs={12} lg={12}>
                    <Typography variant='h5' noWrap >
                    Payroll Periods
                    </Typography>
                    <StyledListGroupWithoutCard
                        title=' '
                        disableSyncWithLocation={true}
                        component='div'
                        filter={filter}
                        actions={false}
                        resource='attendances' 
                        lazy={false}
                        groupBy={['period_id', 'employee_id']}
                        fields={['period_id','employee_id','hours','group_propay_earning']}
                        empty={false}
                        titleActionProps={{showCreate:false}}
                        perPage={200}
                        showPagination={false}
                        >
                        <StyledDatagrid  size='medium'  bulkActionButtons={false} empty={<Empty />} showFooter>
                            <ReferenceField source='period_id' reference='periods' textAlign='left'  sortable={false} link={false}>
                                <TextField source='name'/>
                            </ReferenceField>
                            {!filter.wage_id&&<ReferenceField source='employee_id' reference='employees' textAlign='left'  sortable={false} link={false}>
                                <TextField source='name'/>
                            </ReferenceField>
                            }
                            <FormatTimeField
                                source='hours'
                                suffix_label='Hours'
                                textAlign='right'
                                sortable={false}
                                groupBy
                            />
                            <MoneyField source='group_propay_earning' textAlign='right' sortable={false} groupBy/>
                        </StyledDatagrid>
                    </StyledListGroupWithoutCard>
                </Grid>
            </Grid>
        </HasData>
    )
};

export const PropayDrawer = (props: any) => {
    const redirect = useRedirect();
    const { redirectTo } = props;
    const onClose = ()=>{
        redirect(redirectTo||'/propay/propay', '', null,null, { _scrollToTop: false });
    };
    return (
        <Drawer
            variant='temporary'
            open
            anchor='right'
            onClose={onClose}
            PaperProps={{
                sx: {
                    minWidth: 400,
                    width: {
                        xs:'100%',
                        sm:'70%',
                        lg:'45%'
                    },
                    border: 'none',
                    overflow: 'hidden',
                    padding: 1,
                },
            }}
        >
            {React.Children.map(props.children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {...props,onClose} );
                }
                return child;
            })}
        </Drawer>
    );
};

export const PropayShow = (props: any) => {
    return (
        <PageAlertContextProvider>
         <Show className='propay-detail-show' title={<></>}>
            <PageAlerts/>       
            <PropayShowView />
         </Show>
        </PageAlertContextProvider>
    );
};

const DatagridBodyExpandHeadless = (props: DatagridBodyProps) => {
    return (
        <DatagridBody {...props} row={<DatagridRow headlessExpand />} />
    );
};

const TitleActions = (props: any): React.ReactElement => {
    const { label, showCreate } = props;
    return (
        <>
            {(showCreate) && <CreateButton variant='contained' label={label} path='/propay/propay/create'/>}
        </>
    );
};

const PropayList = () => {

    const navigate = useNavigate();
    const showPropay = (PropayId: any) => navigate(`/show/${PropayId}/propay`);

    return (
        <ResourceContextProvider value='propays'>
            <>
                <PageAlerts/>
                <List
                    filterDefaultValues={{status:{_eq:'open'}}}
                    filters={<ResponsiveFilterGusser filters={PropayFilters}/>}
                    actions={<ListActions exporter={false}/>}
                    sort={{ field: 'create_date', order: 'DESC' }}
                >
                    <Datagrid
                        size='small'
                        rowClick='expand'
                        bulkActionButtons={false}
                        empty={<Empty />}
                        showFooter
                        body={DatagridBodyExpandHeadless}
                    >                        
                        <FunctionField
                         source='name'
                          render={record => {
                            return(
                            <>
                                  {record?.name?.length > NUMBER.TWENTY_ONE ? <Tooltip title={record?.name} placement='bottom' arrow>
                                    <span onClick={() => showPropay(record.id)}>{truncatePropayName(record?.name.toString())}</span>
                                     </Tooltip>
                                      :
                                     <span onClick={() => showPropay(record.id)}>{truncatePropayName(record?.name.toString())}</span>
                                    }
                            </>
                                   );
}
                          }
                        />                
                        <ReferenceField
                            source='manager_id'
                            reference='employees'
                            link={false}
                        >
                            <EmployeeFullNameField />
                        </ReferenceField>
                        <FunctionField
                            source='from_date'
                            sortable
                            render={(record: any) => (
                                <DateFormat date= {record.from_date} />
                            )}
                        />
                        <FunctionField
                            source='to_date'
                            sortable
                            render={(record: any) => (
                                <DateFormat date= {record.to_date} />
                            )}
                        />
                        <NumberToTimeField source='hours' groupBy/>
                        <FunctionField
                         source='Budget'
                          render={record => {
                            return(
                            <>
                                { record?.budget_option=='amount'?
                                    <MoneyField source='budget'/>:<>
                                    <NumberToTimeField source='budget_hours'/><span>(Hrs)</span>
                                    </>
                                }
                            </>
                                   );
                            }
                          }
                        />   
                        <FunctionField
                            source='status'
                            sortable
                            render={(record: any) => (
                                <ActionButtons {...record} />
                            )}
                        />
                         
                        <FunctionField
                            textAlign='right'
                            label='resources.propays.actions.name'
                            render={(record: any) => (
                                <>
                                    <CardListActions record={record} onList={true} />
                                </>
                            )}
                        />
                    </Datagrid>
                </List>
            </>
        </ResourceContextProvider>
    );
};

/*Handling grid and list Type check */
const PropayListType = (props: any) => {
    const { listingType } = props;
    const isMobileDevice = isMobile();
    return(
        <>
          {(listingType === 'List' && !isMobileDevice)? 
              <PropayList />
                :
                <div className='propay-page-card'>
                <ResourceContextProvider value='propays'>
                    <>
                   <PageAlerts/>
                    <List
                    filterDefaultValues={{status:{_eq:'open'}}}
                    filters={<ResponsiveFilterGusser filters={PropayFilters}/>}
                    actions={<ListActions exporter={false}/>}
                    sort={{ field: 'create_date', order: 'DESC' }}
                    emptyWhileLoading
                >                
                <CardListView onDashboard={false} />                
            </List>
            </>
            </ResourceContextProvider>
             </div>
              }
        </>
    );
};

export const PropayActions = (props: any) => {
    const currentRouteBasePath = useGetBaseLocationForCurrentRoute();
    const params = useParams();
    const value = params['*'];
    return (
        <TopToolbar>
            <ToggleButtonGroup
                exclusive
                value={value}
                size='small'
                color='primary'
            >
                <ToggleButton value='' component={Link} to={{pathname:currentRouteBasePath}}>
                    <ViewListRoundedIcon />
                </ToggleButton>
                <ToggleButton value='employee' component={Link} to={{pathname:`${currentRouteBasePath}/employee`}}>
                    <PeopleAltRoundedIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </TopToolbar>
    )
};


export const PropayTabDialog = ({component}:{component:React.ReactElement}) =>{
    return (
        <ResourceContextProvider value='propays'>
            <PropayDialog redirectTo='/propay/propay' open component={component}/>
        </ResourceContextProvider>
    )    
};
export const PropayTab = (props:any) => {
    return (
        <Routes>
            <Route path='/*' element={<Outlet/>}>
                <Route path='' element={<><PropayListType listingType={props.type} /><Outlet/></>}/>                    
                    <Route path=':id/show/changes/:id/show' element={
                        <ResourceContextProvider value='MailMessage'>
                            <MailMessageChanges />
                        </ResourceContextProvider>
                    } />
            </Route>
        </Routes>
    );
};


