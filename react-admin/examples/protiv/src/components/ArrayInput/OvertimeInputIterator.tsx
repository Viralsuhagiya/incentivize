import { styled, Table, TableBody, TableCell, FormHelperText,TableRow } from '@mui/material';
import classNames from 'classnames';
import _ from 'lodash';
import * as React from 'react';
import {
    Children, isValidElement, cloneElement,
    ReactElement,
    useCallback,
    useMemo,
    useRef
} from 'react';
import { CommonSimpleFormIteratorStyle } from './SimpleFormGroupIterator';
import { SimpleFormIteratorProps } from './SimpleFormIterator';
import { useArrayInput } from './useArrayInput';
import {
    SimpleFormIteratorClasses
} from './useSimpleFormIteratorStyles';
import get from 'lodash/get';
import { ValidationError } from 'ra-core';
import { RemoveItemButton as DefaultRemoveItemButton } from './RemoveItemButton';
import { ReOrderButtons as DefaultReOrderButtons } from './ReOrderButtons';
import { SimpleFormIteratorContext } from './SimpleFormIteratorContext';
import { FormInput } from 'react-admin';
import { SimpleFormIteratorItemProps } from './SimpleFormIteratorItem';
import {
    SimpleFormIteratorItemContext,
    SimpleFormIteratorItemContextValue
} from './SimpleFormIteratorItemContext';
import { useSimpleFormIterator } from './useSimpleFormIterator';

export const Root = styled('div')(({ theme }) => ({

}));

const StyledDefaultRemoveItemButton = styled(DefaultRemoveItemButton)({
    'min-width': 0,
    paddingLeft:0
});


export const OvertimeInputIterator = (props: SimpleFormIteratorProps & { removeColumnLabel?: string, groupBy?: string,showGroupBy?:boolean }) => {
    const { groupBy, className } = props;
    const { fields } = useArrayInput(props);
    const grouped = fields.map((member, index) => {
        const item = fields.value[index];
        return { ...item, __index: index, __member: member}
     });
    
    const groups_data = _.groupBy(grouped, groupBy)

    const defaultValue = { 'id': null }
    Children.map(props.children, (field, index) =>
        isValidElement(field) ? (
            defaultValue[`${field.props.source}`] = null
        ) : {}
    );
    return (
        <Root
            className={classNames(
                SimpleFormIteratorClasses.root,
                className
            )}
        >
            <Table size="small">
                <TableBody>
                {_.map(groups_data, (fieldvalue, groupById) => {
                    const updatedDefaultValue = { ...defaultValue}
                    updatedDefaultValue[`${groupBy}`] = parseInt(groupById);
                    return <HorizontalIterator {...props} items={fieldvalue} defaultValue={updatedDefaultValue}>
                            {props.children}
                        </HorizontalIterator>

                })}
            </TableBody>
        </Table>
        </Root>
    );
};

const HorizontalIterator = (props: SimpleFormIteratorProps & { removeColumnLabel?: string, items?: any,groupBy?:string,showGroupBy?:boolean}) => {
    const {
        removeButton = <StyledDefaultRemoveItemButton />,
        reOrderButtons = <DefaultReOrderButtons />,
        basePath,
        children,
        record,
        resource,
        source,
        disabled,
        disableRemove,
        disableReordering,
        variant,
        margin,
        defaultValue,
        items,
        groupBy,
        showGroupBy,
        getItemLabel = DefaultLabelFn,
    } = props;
    const { fields, meta } = useArrayInput(props);

    const nodeRef = useRef(null);
    const { error, submitFailed } = meta;
   
    const nextId = useRef(
        meta && meta.initial && meta.initial.length
            ? meta.initial.length
            : defaultValue
                ? defaultValue.length
                : 0
    );

    const ids = useRef(
        nextId.current > 0 ? Array.from(Array(nextId.current).keys()) : []
    );

    const removeField = useCallback(
        (index: number) => {
            ids.current.splice(index, 1);
            fields.remove(index);
        },
        [fields]
    );

    const addField = useCallback(
        (item: any = undefined) => {
            const nextIndex = nextId.current++;
            ids.current.push(nextIndex);
            fields.push(item);
        },
        [fields]
    );

    /* add field and call the onClick event of the button passed as addButton prop
    const handleAddButtonClick = (
        originalOnClickHandler: MouseEventHandler
    ) => (event: MouseEvent) => {
        addField({ ...defaultValue});
        if (originalOnClickHandler) {
            originalOnClickHandler(event);
        }
    }; */

    const handleReorder = useCallback(
        (origin: number, destination: number) => {
            const item = ids.current[origin];
            ids.current[origin] = ids.current[destination];
            ids.current[destination] = item;
            fields.move(origin, destination);
        },
        [fields]
    );

    const records = get(record, source || '');

    const context = useMemo(
        () => ({
            total: fields.value.length !== undefined ? fields.length : 0,
            add: addField,
            remove: removeField,
            reOrder: handleReorder,
        }),
        [fields, addField, removeField, handleReorder]
    );

    return fields ? (
        <SimpleFormIteratorContext.Provider value={context}>
            <>
                {submitFailed && typeof error !== 'object' && error && (
                    <FormHelperText error>
                        <ValidationError error={error as string} />
                    </FormHelperText>
                )}
                <TableRow>
                    {_.map(items, (item, index) => {
                        return (<HorizontalIteratorItem
                            basePath={basePath || ''}
                            disabled={disabled}
                            disableRemove={disableRemove}
                            disableReordering={disableReordering}
                            fields={fields}
                            getItemLabel={getItemLabel}
                            itemIndex={parseInt(index)}
                            groupBy={groupBy}
                            showGroupBy={showGroupBy}
                            index={item.__index}
                            key={item.__index}
                            margin={margin}
                            member={item.__member}
                            meta={meta}
                            onRemoveField={removeField}
                            onReorder={handleReorder}
                            record={(records && records[item.__index]) || {}}
                            removeButton={removeButton}
                            reOrderButtons={reOrderButtons}
                            resource={resource || ''}
                            source={source || ''}
                            variant={variant}
                            ref={nodeRef}
                        >
                                {children}
                        </HorizontalIteratorItem>
                        
                        )
                    })};
                </TableRow>
            </>
        </SimpleFormIteratorContext.Provider>
    ) : null;
};
const DefaultLabelFn = (index: any) => index + 1;


const HorizontalIteratorItem = React.forwardRef(
    (props: SimpleFormIteratorItemProps & { itemIndex: number, groupBy?:string ,showGroupBy?:boolean}, ref: any) => {
        const {
            basePath,
            children,
            disabled,
            index,
            margin,
            member,
            record,
            resource,
            variant,
            itemIndex,
            groupBy,
            showGroupBy
        } = props;

        const { total, reOrder, remove } = useSimpleFormIterator();

        const context = useMemo<SimpleFormIteratorItemContextValue>(
            () => ({
                index,
                total,
                reOrder: newIndex => reOrder(index, newIndex),
                remove: () => remove(index),
            }),
            [index, total, reOrder, remove]
        );

        return (
            <SimpleFormIteratorItemContext.Provider value={context}>
                {showGroupBy &&
                    <TableCell>{Children.map(
                        children,
                        (input: ReactElement, index2) => {
                            if (!isValidElement<any>(input)) {
                                return null;
                            }
                            const { source, ...inputProps } = input.props;
                            return (source === groupBy && itemIndex === 0 &&
                                <TableRow>
                                    <FormInput
                                        basePath={
                                            input.props.basePath || basePath
                                        }
                                        input={cloneElement(input, {
                                            source: source
                                                ? `${member}.${source}`
                                                : member,
                                            index: source ? undefined : index2,
                                            label:
                                                typeof input.props.label ===
                                                    'undefined'
                                                    ? source
                                                        ? `resources.${resource}.fields.${source}`
                                                        : undefined
                                                    : input.props.label,
                                            disabled,
                                            ...inputProps,
                                        })}
                                        record={record}
                                        resource={resource}
                                        variant={variant}
                                        margin={margin}
                                    />
                                </TableRow>
                            );
                        }
                    )}
                    </TableCell>
                }
                <TableCell>
                    {Children.map(
                        children,
                        (input: ReactElement, index2) => {
                            if (!isValidElement<any>(input)) {
                                return null;
                            }
                            const { source, ...inputProps } = input.props;
                            return (source !== groupBy &&
                                <TableRow>
                                    <FormInput
                                        basePath={
                                            input.props.basePath || basePath
                                        }
                                        input={cloneElement(input, {
                                            source: source
                                                ? `${member}.${source}`
                                                : member,
                                            index: source ? undefined : index2,
                                            label:
                                                typeof input.props.label ===
                                                    'undefined'
                                                    ? source
                                                        ? `resources.${resource}.fields.${source}`
                                                        : undefined
                                                    : input.props.label,
                                            disabled,
                                            ...inputProps,
                                        })}
                                        record={record}
                                        resource={resource}
                                        variant={variant}
                                        margin={margin}
                                    />
                                </TableRow>
                            );
                        }
                    )}
                </TableCell>
            </SimpleFormIteratorItemContext.Provider>
        );
    }
);

export const StyledOvertimeInputIterator = styled(OvertimeInputIterator)({
    CommonSimpleFormIteratorStyle,
    '.MuiTable-root': {
        '& th': {
            padding: 0,
            '& span' : {
                padding: '5px 18px 5px 0px'
            }
        },
        '& th: first-child': {
            paddingLeft: 15
        },
        '& td': {
            padding: '10px 5px'
        },
        '& td: first-child': {
            paddingLeft: '15px'
        },
    },
    '.MuiTableRow-root': {
        '& .RaFormInput-input': {
            width: '100%'
        },
        '& .MuiTableCell-root: last-of-type': {
            '& .RaFormInput-input': {
                width: 100
            }
        }
    },
    ...CommonSimpleFormIteratorStyle

});

