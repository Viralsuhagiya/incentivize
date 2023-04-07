import * as React from 'react';
import {
    cloneElement,
    createElement,
    isValidElement,
    useCallback,
    useRef,
    useEffect,
    FC,
    useMemo,
    memo,
} from 'react';
import {
    useListContext,
    Identifier,
} from 'ra-core';
import classnames from 'classnames';
import union from 'lodash/union';
import difference from 'lodash/difference';

import { DatagridBodyProps, DatagridHeader, DatagridRow, DatagridLoading, DatagridContextProvider, 
    DatagridClasses, BulkActionsToolbar,  BulkDeleteButton, DatagridProps  } from 'react-admin';
import { NUMBER } from '../../utils/Constants/MagicNumber';

const defaultBulkActionButtons = <BulkDeleteButton />;

/**
 * The Datagrid component renders a list of records as a table.
 * It is usually used as a child of the <List> and <ReferenceManyField> components.
 *
 * Props:
 *  - body
 *  - bulkActionButtons
 *  - children
 *  - empty
 *  - expand
 *  - header
 *  - hover
 *  - isRowExpandable
 *  - isRowSelectable
 *  - optimized
 *  - rowStyle
 *  - rowClick
 *  - size
 *  - sx
 *
 * @example // Display all posts as a datagrid
 * const postRowStyle = (record, index) => ({
 *     backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
 * });
 * export const PostList = (props) => (
 *     <List {...props}>
 *         <Datagrid rowStyle={postRowStyle}>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <TextField source="body" />
 *             <EditButton />
 *         </Datagrid>
 *     </List>
 * );
 *
 * @example // Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyField>
 *
 * @example // Usage outside of a <List> or a <ReferenceManyField>.
 *
 * const currentSort = { field: 'published_at', order: 'DESC' };
 *
 * export const MyCustomList = (props) => {
 *     const { data, total, isLoading } = useGetList(
 *         'posts',
 *         { pagination: { page: 1, perPage: 10 }, sort: currentSort }
 *     );
 *
 *     return (
 *         <Datagrid
 *             data={data}
 *             total={total}
 *             isLoading={isLoading}
 *             currentSort={currentSort}
 *             selectedIds={[]}
 *             setSort={() => {
 *                 console.log('set sort');
 *             }}
 *             onSelect={() => {
 *                 console.log('on select');
 *             }}
 *             onToggleItem={() => {
 *                 console.log('on toggle item');
 *             }}
 *         >
 *             <TextField source="id" />
 *             <TextField source="title" />
 *         </Datagrid>
 *     );
 * }
 */
 
export const HeadlessDatagridBody: FC<DatagridBodyProps> = React.forwardRef(
    (
        {
            basePath,
            children,
            className,
            data,
            expand,
            hasBulkActions,
            hover,
            onToggleItem,
            resource,
            row = <DatagridRow headlessExpand={true}/>,
            rowClick,
            rowStyle,
            selectedIds,
            isRowSelectable,
            ...rest
        },
        ref
    ) => (<>
            {data?.map((record, rowIndex) =>
                cloneElement(
                    row,
                    {
                        basePath,
                        className: classnames(DatagridClasses.row, {
                            [DatagridClasses.rowEven]: rowIndex % NUMBER.TWO === 0,
                            [DatagridClasses.rowOdd]: rowIndex % NUMBER.TWO !== 0,
                            [DatagridClasses.clickableRow]: rowClick,
                        }),
                        expand,
                        hasBulkActions: hasBulkActions && !!selectedIds,
                        hover,
                        id: record.id,
                        key: record.id,
                        onToggleItem,
                        record,
                        resource,
                        rowClick,
                        selectable: !isRowSelectable || isRowSelectable(record),
                        selected: selectedIds?.includes(record.id),
                        style: rowStyle ? rowStyle(record, rowIndex) : null,
                    },
                    children
                )
            )}    
    </>    )
);

const PureHeadlessDatagridBody = memo(HeadlessDatagridBody);

export const HeadlessDatagrid: FC<HeadlessDatagridProps&{editForm?:React.ReactNode}> = React.forwardRef((props, ref) => {
    const {
        optimized = false,
        body = optimized ? PureHeadlessDatagridBody : HeadlessDatagridBody,
        header = DatagridHeader,
        children,
        className,
        empty,
        expand,
        bulkActionButtons = defaultBulkActionButtons,
        hover,
        isRowSelectable,
        isRowExpandable,
        resource,
        rowClick,
        rowStyle,
        size = 'small',
        editForm,
    } = props;

    const {
        currentSort,
        data,
        isLoading,
        onSelect,
        onToggleItem,
        selectedIds,
        setSort,
        total,
    } = useListContext(props);

    const hasBulkActions = !!bulkActionButtons !== false;

    const contextValue = useMemo(() => ({ isRowExpandable }), [
        isRowExpandable,
    ]);

    const lastSelected = useRef(null);

    useEffect(() => {
        if (!selectedIds || selectedIds.length === 0) {
            lastSelected.current = null;
        }
    }, [JSON.stringify(selectedIds)]); // eslint-disable-line react-hooks/exhaustive-deps

    // we manage row selection at the datagrid level to allow shift+click to select an array of rows
    const handleToggleItem = useCallback(
        (id, event) => {
            const ids = data.map(record => record.id);
            const lastSelectedIndex = ids.indexOf(lastSelected.current as any);
            lastSelected.current = event.target.checked ? id : null;

            if (event.shiftKey && lastSelectedIndex !== -1) {
                const index = ids.indexOf(id);
                const idsBetweenSelections = ids.slice(
                    Math.min(lastSelectedIndex, index),
                    Math.max(lastSelectedIndex, index) + 1
                );

                const newSelectedIds = event.target.checked
                    ? union(selectedIds, idsBetweenSelections)
                    : difference(selectedIds, idsBetweenSelections);

                onSelect(
                    isRowSelectable
                        ? newSelectedIds.filter((recordId: Identifier) =>
                              isRowSelectable(
                                  data.find(record => record.id === recordId) as any
                              )
                          )
                        : newSelectedIds
                );
            } else {
                onToggleItem(id);
            }
        },
        [data, isRowSelectable, onSelect, onToggleItem, selectedIds]
    );

    if (isLoading === true) {
        return (
            <DatagridLoading
                className={className}
                expand={expand}
                hasBulkActions={hasBulkActions}
                nbChildren={React.Children.count(children)}
                size={size}
            />
        );
    }

    /**
     * Once loaded, the data for the list may be empty. Instead of
     * displaying the table header with zero data rows,
     * the datagrid displays nothing or a custom empty component.
     */
    if (data.length === 0 || total === 0) {
        if (empty) {
            return empty;
        }

        return null;
    }

    /**
     * After the initial load, if the data for the list isn't empty,
     * and even if the data is refreshing (e.g. after a filter change),
     * the datagrid displays the current data.
     */
    return (
        <DatagridContextProvider value={contextValue}>
            <>
                {bulkActionButtons !== false ? (
                    <BulkActionsToolbar selectedIds={selectedIds}>
                        {isValidElement(bulkActionButtons)
                            ? bulkActionButtons
                            : defaultBulkActionButtons}
                    </BulkActionsToolbar>
                ) : null}
                <>
                    {createOrCloneElement(
                        header,
                        {
                            children,
                            currentSort,
                            data,
                            hasExpand: !!expand,
                            hasBulkActions,
                            isRowSelectable,
                            onSelect,
                            resource,
                            selectedIds,
                            setSort,
                        },
                        children
                    )}
                    {createOrCloneElement(
                        body,
                        {
                            expand,
                            rowClick,
                            data,
                            hasBulkActions,
                            hover,
                            onToggleItem: handleToggleItem,
                            resource,
                            rowStyle,
                            selectedIds,
                            isRowSelectable,
                            editForm                        },
                        children
                    )}
                </>
            </>
        </DatagridContextProvider>
    );
});

const createOrCloneElement = (element:any, props:any, children:any) =>
    isValidElement(element)
        ? cloneElement(element, props, children)
        : createElement(element, props, children);

export interface HeadlessDatagridProps extends DatagridProps {
    headless?: boolean;
}

HeadlessDatagrid.displayName = 'Datagrid';
