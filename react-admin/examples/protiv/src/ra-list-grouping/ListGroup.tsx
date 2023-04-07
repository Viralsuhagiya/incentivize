import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Record } from 'ra-core';

import { TitlePropType } from 'react-admin';

import { ListView, ListViewProps } from 'react-admin';
import { ListGroupControllerProps } from './useListGroupController'
import {ListGroupBase} from './ListGroupBase';

/**
 * List page component
 *
 * The <List> component renders the list layout (title, buttons, filters, pagination),
 * and fetches the list of records from the REST API.
 *
 * It then delegates the rendering of the list of records to its child component.
 * Usually, it's a <Datagrid>, responsible for displaying a table with one row for each post.
 *
 * The <List> component accepts the following props:
 *
 * - actions
 * - aside: Side Component
 * - children: List Layout
 * - component
 * - disableAuthentication
 * - disableSyncWithLocation
 * - empty: Empty Page Component
 * - emptyWhileLoading
 * - exporter
 * - filters: Filter Inputs
 * - filter: Permanent Filter
 * - filterDefaultValues
 * - pagination: Pagination Component
 * - perPage: Pagination Size
 * - queryOptions
 * - sort: Default Sort Field & Order
 * - title
 * - sx: CSS API
 *
 * @example
 * const postFilters = [
 *     <TextInput label="Search" source="q" alwaysOn />,
 *     <TextInput label="Title" source="title" />
 * ];
 * export const PostList = (props) => (
 *     <List {...props}
 *         title="List of posts"
 *         sort={{ field: 'published_at' }}
 *         filter={{ is_published: true }}
 *         filters={postFilters}
 *     >
 *         <Datagrid>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <EditButton />
 *         </Datagrid>
 *     </List>
 * );
 * 
 * 
 *  <ListGroup resource="attendances" lazy={false} groupBy={["date:day","employee_id"]} fields={["employee_id","date","hours"]}>
                <Datagrid size="medium">
                    <NumberField source="date"/>
                    <TextField source="employee_id"/>
                    <NumberField source="hours" />
                </Datagrid>
    </ListGroup>
 * 
 */
export const ListGroup = <RecordType extends Record = Record>({
    debounce,
    disableAuthentication,
    disableSyncWithLocation,
    exporter,
    filter,
    filterDefaultValues,
    perPage,
    queryOptions,
    resource,
    sort,
    groupBy,
    fields,
    lazy,
    ...rest
}: ListGroupProps<RecordType>): ReactElement => {
    return(
    <ListGroupBase<RecordType>
        debounce={debounce}
        disableAuthentication={disableAuthentication}
        disableSyncWithLocation={disableSyncWithLocation}
        exporter={exporter}
        filter={filter}
        filterDefaultValues={filterDefaultValues}
        perPage={perPage}
        queryOptions={queryOptions}
        resource={resource}
        sort={sort}
        lazy={lazy}
        groupBy={groupBy}
        fields={fields}
    >
        <ListView<RecordType> {...rest} />
    </ListGroupBase>
)
};

export interface ListGroupProps<RecordType extends Record = Record>
    extends ListGroupControllerProps<RecordType>,
        ListViewProps {}

ListGroup.propTypes = {
    // the props you can change
    // @ts-ignore-line
    actions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    aside: PropTypes.element,
    children: PropTypes.element.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    emptyWhileLoading: PropTypes.bool,
    filter: PropTypes.object,
    filterDefaultValues: PropTypes.object,
    filters: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
    ]),
    // @ts-ignore-line
    pagination: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    perPage: PropTypes.number.isRequired,
    //@ts-ignore-line
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    sx: PropTypes.any,
    title: TitlePropType,
    // the props managed by react-admin
    disableSyncWithLocation: PropTypes.bool,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    resource: PropTypes.string,
    lazy: PropTypes.bool,
    fields: PropTypes.arrayOf(PropTypes.string),
    groupBy: PropTypes.arrayOf(PropTypes.string)
};

ListGroup.defaultProps = {
    filter: {},
    perPage: 10,
    fields:[],
    groupBy:[],
};
