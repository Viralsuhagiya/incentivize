

import { ListGroup } from '../../layout/List';
import { AutocompleteInput as RaAutocompleteInput, FunctionField, NumberField, ReferenceField, TextField, ReferenceInput } from 'react-admin';

import {Datagrid,  EmptyColumn, HeadlessDatagridEditable, ListGroupItemsField, ListGroupItemPagination, 
    DateRangeField, MoneyField, StatusLabelField} from '../../components/fields';
import { AttendanceFilter } from './Attendance';
import { RowForm } from '../../components/RowForm';
import {assumeUnsetIfUndefined} from '../../components/fields';


const AttendanceRowEditForm = (props: any) => {

    return (
        <RowForm {...props} transform={assumeUnsetIfUndefined(['propay_id'])}>
            <EmptyColumn />
            <ReferenceInput
                source="propay_id"
                reference="propays"
                variant="standard"
                helperText={false}
            >
                <RaAutocompleteInput source="propay_id"/>
            </ReferenceInput>
            <ReferenceField
                source="employee_id"
                reference="employees"
                link={false}
            >
                <TextField source="name"/>
            </ReferenceField>
            <DateRangeField
                    label="Start ~ End"
                    from_field="start"
                    to_field="end"
                    showTime
                />
                <NumberField source="hours" />
                <MoneyField source="pay_rate" />
                <MoneyField source="earning" />
        </RowForm>
    );
};

const AttendanceListGroupExpand = (props: any) => {
    return (
        <ListGroupItemsField {...props}>
            <HeadlessDatagridEditable size="small" editForm={<AttendanceRowEditForm />}>
                <EmptyColumn />
                <ReferenceField reference="propays" source="propay_id" link={false}>
                    <TextField source="name"/>
                </ReferenceField>
                <ReferenceField reference="employees" source="employee_id"  link={false}>
                    <TextField source="name"/>
                </ReferenceField>
                <DateRangeField
                    label="Start ~ End"
                    from_field="start"
                    to_field="end"
                    showTime
                />
                <NumberField source="hours" />
                <MoneyField source="pay_rate" />
                <MoneyField source="earning" />
                <StatusLabelField source="status" colors={{'paid':'success'}}/>
            </HeadlessDatagridEditable>
            <ListGroupItemPagination colSpan={7}/>
        </ListGroupItemsField>
    );
};


export const AttendanceListGroupEditable = (props: any) => {
    return ( 
        <ListGroup {...props} 
            filters={AttendanceFilter}
            resource="attendances" lazy={false}
            groupBy={['propay_id']}
            fields={['propay_id','hours']}
            empty={false}
            titleActionProps={{showCreate:false}}
            >
            <Datagrid size="medium" headlessExpand={<AttendanceListGroupExpand />} bulkActionButtons={false}>
                <FunctionField
                    source="propay_id"
                    render={(record: any) => (
                        record.propay_id&&<ReferenceField record={record} reference="propays" source="propay_id" link={false}>
                            <TextField source="name"/>
                        </ReferenceField>||<b>Attendance w/o Propay</b>
                    )}
                />
                <EmptyColumn source="employee_id"/>
                <EmptyColumn source="date"/>
                <EmptyColumn source="hours"/>
                <EmptyColumn source="pay_rate"/>
                <EmptyColumn source="earning"/>
                <EmptyColumn source="status"/>
                
            </Datagrid>
        </ListGroup>
    );
};

