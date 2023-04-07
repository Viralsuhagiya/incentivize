import React from 'react';


import { ListGroup } from '../../ra-list-grouping';
import { useListSortContext, useListPaginationContext, Datagrid, DateField, FunctionField, Pagination, ListBase, NumberField, ReferenceField, TextField } from 'react-admin';

import {DatagridBodyExpandHeadless, NoHeader, EmptyColumn} from '../../components/fields';
import { HeadlessDatagrid } from '../../components/datagrid/HeadlessDatagrid';
import { TableCell, TableRow } from '@mui/material';
import { AttendanceFilter } from './Attendance';

const ChildPagination = (props: any) => {
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

const ChildRows = (props: any) => {
    const { record } = props;
    const { currentSort } = useListSortContext();
    return (
        <ListBase disableSyncWithLocation sort={currentSort} resource="attendances" perPage={100} filter={{domain:record.group_by_domain}}>
            <HeadlessDatagrid bulkActionButtons={false} header={<NoHeader/>} size="small">
                <EmptyColumn />
                <EmptyColumn />
                <ReferenceField reference="propays" source="propay_id" link={false}>
                    <TextField source="name"/>
                </ReferenceField>
                <ReferenceField reference="employees" source="employee_id"  link={false}>
                    <TextField source="name"/>
                </ReferenceField>
                <DateField source="date" />
                <NumberField source="hours" />
                <EmptyColumn />
            </HeadlessDatagrid>
            <ChildPagination colSpan={7}/>
        </ListBase>
    );
};

export const AttendanceListGroup = () => {
    return ( 
        <ListGroup filters={AttendanceFilter} resource="attendances" lazy={false} groupBy={['propay_id']} fields={['propay_id','hours']}>
            <Datagrid size="medium" 
                rowClick="expand"
                expand={
                    <ChildRows />
                }
                body={DatagridBodyExpandHeadless}
            >
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
                <NumberField source="hours"/>
                <NumberField source="group_by_count" sortable={false} label="Count" sx={{fontWeight:'bold'}}/>
            </Datagrid>
        </ListGroup>
    );
};

