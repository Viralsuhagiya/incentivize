import * as React from 'react';
import { FC, memo } from 'react';
import {
    ListContextProvider,
    useListContext,
    useReferenceArrayFieldController,
    ResourceContextProvider,
    useRecordContext,
} from 'ra-core';

import { ReferenceArrayFieldProps, ReferenceArrayFieldViewProps } from 'react-admin';
import { LinearProgress } from 'react-admin';


/**
 * A container component that fetches records from another resource specified
 * by an array of *ids* in current record.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the products of the current order as datagrid
 * // order = {
 * //   id: 123,
 * //   product_ids: [456, 457, 458],
 * // }
 * <ReferenceArrayField label="Products" reference="products" source="product_ids">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="description" />
 *         <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceArrayField>
 *
 * @example Display all the categories of the current product as a list of chips
 * // product = {
 * //   id: 456,
 * //   category_ids: [11, 22, 33],
 * // }
 * <ReferenceArrayField label="Categories" reference="categories" source="category_ids">
 *     <SingleFieldList>
 *         <ChipField source="name" />
 *     </SingleFieldList>
 * </ReferenceArrayField>
 *
 * By default, restricts the displayed values to 1000. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceArrayField perPage={10} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayField>
 *
 * By default, the field displays the results in the order in which they are referenced
 * (i.e. in the order of the list of ids). You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceArrayField sort={{ field: 'name', order: 'ASC' }} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayField>
 *
 * Also, you can filter the results to display only a subset of values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceArrayField filter={{ is_published: true }} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayField>
 */
export const HeadlessReferenceArrayField: FC<ReferenceArrayFieldProps> = props => {
    const {
        filter,
        page = 1,
        perPage,
        reference,
        resource,
        sort,
        source,
    } = props;
    const record = useRecordContext(props);
    const controllerProps = useReferenceArrayFieldController({
        filter,
        page,
        perPage,
        record,
        reference,
        resource,
        sort,
        source,
    } as any);
    return (
        <ResourceContextProvider value={reference}>
            <ListContextProvider value={controllerProps}>
                <HeadlessPureReferenceArrayFieldView {...props} />
            </ListContextProvider>
        </ResourceContextProvider>
    );
};


export const HeadlessReferenceArrayFieldView: FC<ReferenceArrayFieldViewProps> = props => {
    const { children, pagination } = props;
    const { isLoading, total } = useListContext(props);

    return isLoading ? (
        <LinearProgress sx={{ mt: 2 }} />
    ) : (
        <>
            {children}
            {pagination && total !== undefined ? pagination : null}
        </>
    );
};


export const HeadlessPureReferenceArrayFieldView = memo(HeadlessReferenceArrayFieldView)