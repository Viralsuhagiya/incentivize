import React, { ReactNode } from 'react';
import {
    Button,
    InputAdornment,
    Stack,
    TableCell,
    TableRow,
    Typography, 
    Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { sentenceCase } from 'change-case';
import { convertNumToTime } from '../../utils/formatter';
import {get} from 'lodash';
import {
    Datagrid as RaDatagrid,
    DatagridProps,
    NumberField as RaNumberField,
    NumberInput,
    useTranslate,
    FunctionField,
    Pagination,
    useLocale,
    DatagridBody,
    DatagridRow,
    DatagridBodyProps,
    ListBase,
    useResourceContext,
    useListSortContext,
    useListPaginationContext,
    useRecordContext,
    ResourceContextProvider,
    NumberInputProps,
    NumberFieldProps as RaNumberFieldProps,
    TextInputProps,
    email,
    TextInput,
    useGetIdentity,
    required,
} from 'react-admin';
import IMask from 'imask';
import Empty from '../../layout/Empty';
import { Field } from 'react-final-form';
import {
    EditableDatagrid,
    EditableDatagridProps,
    EditableDatagridRow
} from '../../ra-editable-datagrid';
import Label from '../Label';
import { HeadlessDatagrid, HeadlessDatagridBody, HeadlessDatagridProps } from '../datagrid/HeadlessDatagrid';
import { EditableRowProps } from '../../ra-editable-datagrid/EditableDatagridRow';
import { canAccess } from '../../ra-rbac';
import { DateField } from './DateField';
import { useIdentityContext } from '../identity';
import { usePermissionsOptimized } from '../identity';
import _ from 'lodash';
import { InfoLabel } from './InfoLabel';
import { useAttendance } from '../../resources/attendances/useAttendance';
import { NUMBER } from '../../utils/Constants/MagicNumber';

export const sanitizeCustomPublicFieldRestProps: (props: any) => any = ({
    groupBy,
    ...props
}) => props;

export interface CustomPublicFieldProps{
    groupBy?: boolean | ReactNode;
}

export interface NumberFieldProps
    extends RaNumberFieldProps, CustomPublicFieldProps {
}

export const NumberField = (props: NumberFieldProps) => (
    <RaNumberField {...sanitizeCustomPublicFieldRestProps(props)}/>
);

export const PercentInput = (props: NumberInputProps) => (
    <NumberInput
        format={v => _.round(v * NUMBER.HUNDRED,NUMBER.TWO)} 
        parse={v => parseFloat(v) / NUMBER.HUNDRED} 
        InputProps={{
            endAdornment: (
                <InputAdornment position='end'>
                    %
                </InputAdornment>
            ),
        }}
        {...props}
    />
)

export const EmailInput = (props: TextInputProps) => {
    const identity = useIdentityContext();
    const validateEmail = email();
    const validate = identity?.company?.allow_zapier_api ? [validateEmail,required()]: [validateEmail]
    return <TextInput fullWidth  validate={validate} {...props} />
}

export const PercentField = (props: NumberFieldProps) => (
    <NumberField
        options={{ maximumFractionDigits: 2,style: 'percent' }}
        {...props}
    />
)

export const MoneyField = (props: NumberFieldProps) => (
    <NumberField
        options={{
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'USD',
        }}
        emptyText='US$0.00'
        {...props}
    />
);
export const convertNumber = (record,identity) => {
    if(identity?.company?.hours_format == 'by_time' ){
        return convertNumToTime(record)
    } else{
        return parseFloat(record|| 0).toFixed(NUMBER.TWO)
    };
};
export const NumberToTimeField = (props: any) => {
    const record = useRecordContext(props);
    const { source, suffix_label } = props;
    return (
        <FunctionField
            textAlign='right'
            align='right'
            {...sanitizeCustomPublicFieldRestProps(props)}
            render={() => (
                <span style={{ textAlign: 'right' }}>
                    {convertNumToTime(record[source])} {suffix_label}
                </span>
            )}
        />
    );
};

export const FormatTimeField = (props: any) => {
    const record = useRecordContext(props);
    const { loaded, identity } = useGetIdentity();
    if (!loaded) {
        return null;
    }
    const { source, suffix_label} = props;
    return  (
        <FunctionField
            textAlign='right'
            align='right'
            {...sanitizeCustomPublicFieldRestProps(props)}
            render={() => {
                return (
                    <span style={{ textAlign: 'right' }}>
                        {convertNumber(record[source], identity)} {suffix_label}
                    </span>
                )
            }}
        />
    );
};
export const FormatTimeFieldResposive = (props: any) => {
    const record = useRecordContext(props);
    const { loaded, identity } = useGetIdentity();
    if (!loaded) {
        return null;
    }
    const { source, suffix_label} = props;
    return  (
        <FunctionField
            className='date-MuiTypography'
            textAlign='right'
            align='right'
            {...sanitizeCustomPublicFieldRestProps(props)}
            render={() => {
                return (
                    <Typography className='manual-responsive'><label>Hours</label>{convertNumber(record[source], identity)} {suffix_label}</Typography>                    
                );
            }}
        />
    );
};


export const NumberToTimeFieldSign = (props: any) => {
    const record = useRecordContext(props);
    const { source, suffix_label } = props;
    return (
        <FunctionField
            textAlign='right'
            align='right'
            {...sanitizeCustomPublicFieldRestProps(props)}
            render={() => {
                const value = record[source]
                return <span style={{ textAlign: 'right' }}>
                { value< 0 && '-'}{convertNumToTime(value)} {suffix_label}
            </span>
            }
            }
        />
    );
};


export const Condition = ({ when, is, children } :any) => (
    <Field name={when} subscription={{ value: true }}>
      {({ input: { value } }) => (value === is ? children : null)}
    </Field>
);

export const DefaultDatagrid = (props: DatagridProps) => {
    return (
        <Datagrid 
            size='medium'
            empty={<Empty />}
            {...props}
        />
    )
}

export const DefaultEditableDatagrid = (props: EditableDatagridProps) => {
    return (
        <EditableDatagrid
            empty={<Empty />}
            {...props}
        />
    )
};

export const StyledEditableDatagrid = styled(DefaultEditableDatagrid)({
    '.MuiInput-root.MuiInput-underline.MuiInputBase-root': {
        'margin-top': '0px',
    },
    '.MuiFormControl-root.MuiFormControl-marginDense.MuiTextField-root': {
        'margin-top': '0px',
        'margin-bottom': '0px',
    },
    '.MuiTableCell-root:last-of-type': {
        'padding-right': '0px',
        width: '90px',
        whiteSpace: 'nowrap'

    },
    '.RaDatagrid-headerCell': {
        'background-color': '#F4F6F8',
    },
});
export const StyledDatagrid = styled(DefaultDatagrid)({
    '.MuiInput-root.MuiInput-underline.MuiInputBase-root': {
        'margin-top': '0px',
    },
    '.MuiFormControl-root.MuiFormControl-marginDense.MuiTextField-root': {
        'margin-top': '0px',
        'margin-bottom': '0px',
    },
    '.MuiTableCell-root:last-of-type': {
        'padding-right': '0px',
        width: '90px',
    },
    '.RaDatagrid-headerCell': {
        'background-color': '#F4F6F8',
    },
});


const hasPermission = (all_permissions: any,  resource: string, access_permissions: []) => {
    for (const action of access_permissions) {
        if(canAccess({
            permissions: all_permissions,
            resource: resource,
            action: action,
        })){
            return true;
        }
    }
    return false;
}

export const EditableDatagridWithPermission = (props:any) => {
    const { permissions } = usePermissionsOptimized();
    const {rowClick, bulkActionButtons, noDelete, noEditButton, isRowEditable, editPermissions = ['edit'],deletePermissions = ['delete'], ...rest}  = props;

    const has_edit_permission = rowClick === 'edit' &&  hasPermission(permissions, props.resource,editPermissions);
    const has_delete_permission = !noDelete  && deletePermissions && hasPermission(permissions, props.resource,deletePermissions);
    
    return <StyledEditableDatagrid rowClick={rowClick} noEditButton={has_edit_permission ? noEditButton : true} 
    bulkActionButtons={has_delete_permission ? bulkActionButtons : false} noDelete={has_delete_permission ? noDelete : true} 
    isRowEditable={has_edit_permission ? isRowEditable : (record:any) =>  {return false}} {...rest} />;
}

export const DateTimeField =  React.memo((props: any) => {
    const identity = useIdentityContext()
    return (<DateField
        showTime        
        locales='en-US'
        timeFormat={identity?.time_format === '12' ? 'LT' : 'HH:mm'}
        {...props}
    />)
});

export const DateRangeField = (props:any) => {
    const locale = useLocale();
    const { record, from_field = 'from_date', to_field = 'to_date' }: any = props;
    const from_date = get(record,from_field);
    let to_date = get(record,to_field);
    to_date = from_date===to_date?null:to_date;
    return (
        (from_date || to_date)
        &&<>
            {from_date&&<DateField {...props} source={from_field} locales={locale}  />}
            {(from_date&&to_date)&&<>~</>}{to_date&&<DateField {...props}  source={to_field} locales={locale} />}
        </>
    );
};



export const StatusLabelField = ({ source, record, colors, resource }: any) => {
    const translate = useTranslate();
    const value = get(record, source);
    const color = get(colors, value);
    return (
        <Label
            variant='ghost'
            color={color || 'warning'}
        >
            {sentenceCase(translate(`resources.${resource}.choices.${source}.${value}`!))}
        </Label>
    );
};

export const AttendanceStatusLabelField = ({ source, record, resource }: any) => {
    const translate = useTranslate();
    const value = get(record, source);
    const {statusInfo} = useAttendance({record});

    return (
        <Tooltip title={statusInfo} arrow>
        <Stack flexDirection={'row'} alignItems='center'>
            <Button variant='contained' className={`${record?.status === 'paid' ? 'yellow-status-btn list-status-btn' : 'list-status-btn'}`}>
            {sentenceCase(translate(`resources.${resource}.choices2.${source}.${value}`!))}        
            </Button>
        </Stack>
        </Tooltip>
    );
};

export const DatagridBodyExpandHeadless = (props: DatagridBodyProps) => {
    return (
        <DatagridBody {...props} row={<DatagridRow headlessExpand />} />
    );
}



export const EmptyColumn = (props : any) => (null);
export const NoHeader = (props: any) => (<></>);


export const ListGroupItemPagination = (props: any) => {
    const {
        isLoading,
        perPage,
        total,
    } = useListPaginationContext(props);
    return !isLoading && total > perPage && (
        <TableRow>
            <TableCell colSpan={props.colSpan}>
                <Pagination />
            </TableCell>        
        </TableRow>
    )
}

export const MaskField = ({mask, ...rest}:any) => {
    const value = get(rest.record, rest.source);
    if(!value){
        return <>{rest.emptyText}</>
    }
    const masked = IMask.createMask({
        mask: mask,
    });
    return (<span>{masked.resolve(value)}</span>)
}

export const PhoneField = (props:any) => {
    return (<MaskField mask='000-000-0000' {...props}/>)
}

export const ListGroupEditableRow = (props: EditableRowProps) => {
    return (
        <EditableDatagridRow {...props} />
    );
}
export const HeadlessBodyForEditable = (props: any) =>{
    return (
        <HeadlessDatagridBody {...props} row={<ListGroupEditableRow form={props.editForm}/>} />
    );
}

export const ListGroupItemsField = ({record, children, ...rest}: any) => {
    const resource = useResourceContext(rest);
    const filter = { domain : record.group_by_domain };
    const { currentSort } = useListSortContext();
    return (
        <ListBase disableSyncWithLocation sort={currentSort} resource={resource} perPage={100} filter={filter}>
            {children}
        </ListBase>
    );
}
export const HeadlessBodyForEditableNode = (props: any) =>{
    return (
        <HeadlessBodyForEditable {...props} />
    );
}

export const HeadlessDatagridEditable = ({children,...rest}: HeadlessDatagridProps&{editForm: ReactNode})=>{
    const resource = useResourceContext(rest);
    return (
        <HeadlessDatagrid bulkActionButtons={false} header={<NoHeader/>} body={HeadlessBodyForEditableNode} rowClick='edit' resource={resource} {...rest}>
            {children}
        </HeadlessDatagrid>
    );
}


export const Datagrid = ({headlessExpand, ...rest}: DatagridProps&{headlessExpand?: ReactNode}) => {
    const extraProps = headlessExpand ? { rowClick: 'expand', body:DatagridBodyExpandHeadless, expand: headlessExpand}: { } as any;
    return (
        <RaDatagrid  {...extraProps} {...rest}/>
    );
}

export const ReferenceListBase = (props:any) => {
    const {filter,reference, source, children, ...rest} = props;
    const record = useRecordContext(props);
    const {
        perPage = NUMBER.ONE_THOUSAND,
    } = props;

    //TODO: needs better fix:: this is hack to not return any records from getList api call.
    const ids = get(record, source) || [0];
    const filterBase = _.merge({id:{_in:ids}},filter);
    return (
        <ResourceContextProvider value={reference}>
            <ListBase perPage={perPage} {...rest} filter={filterBase}>
            {children}
            </ListBase>            
        </ResourceContextProvider>
    );
};

