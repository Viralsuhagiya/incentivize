import { FormHelperText, styled, TableCell } from '@mui/material';
import classNames from 'classnames';
import _ from 'lodash';
import get from 'lodash/get';
import { ValidationError } from 'ra-core';
import {
    cloneElement,
    MouseEvent,
    MouseEventHandler, useCallback,
    useMemo,
    useRef
} from 'react';
import { AddItemButton as DefaultAddItemButton } from './AddItemButton';
import { RemoveItemButton as DefaultRemoveItemButton } from './RemoveItemButton';
import { ReOrderButtons as DefaultReOrderButtons } from './ReOrderButtons';
import { SimpleFormGroupIteratorItem } from './SimpleFormGroupIteratorItem';
import { SimpleFormIteratorProps, SimpleTableFormFooter } from './SimpleFormIterator';
import { SimpleFormIteratorContext } from './SimpleFormIteratorContext';
import { useArrayInput } from './useArrayInput';
import {
    SimpleFormIteratorClasses
} from './useSimpleFormIteratorStyles';


const StyledDefaultRemoveItemButton = styled(DefaultRemoveItemButton)({
    'min-width': 0,
    paddingLeft:0
});

export const HeadlessSimpleFormIterator = (props: SimpleFormIteratorProps & { removeColumnLabel?: string, items?: any,groupBy?:string}) => {
    const {
        addButton = <DefaultAddItemButton />,
        removeButton = <StyledDefaultRemoveItemButton />,
        reOrderButtons = <DefaultReOrderButtons />,
        basePath,
        children,
        record,
        resource,
        source,
        disabled,
        disableAdd,
        disableRemove,
        disableReordering,
        variant,
        margin,
        defaultValue,
        items,
        groupBy,
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

    // We check whether we have a defaultValue (which must be an array) before checking
    // the fields prop which will always be empty for a new record.
    // Without it, our ids wouldn't match the default value and we would get key warnings
    // on the CssTransition element inside our render method
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

    // add field and call the onClick event of the button passed as addButton prop
    const handleAddButtonClick = (
        originalOnClickHandler: MouseEventHandler
    ) => (event: MouseEvent) => {
        addField({ ...defaultValue});
        if (originalOnClickHandler) {
            originalOnClickHandler(event);
        }
    };

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
                    {_.map(items, (item, index) => {
                        return (<SimpleFormGroupIteratorItem
                            basePath={basePath || ''}
                            disabled={disabled}
                            disableRemove={disableRemove}
                            disableReordering={disableReordering}
                            fields={fields}
                            getItemLabel={getItemLabel}
                            itemIndex={parseInt(index)}
                            groupBy={groupBy}
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
                        </SimpleFormGroupIteratorItem>
                        
                        )
                    })}
                {!disabled && !disableAdd && (
                    <SimpleTableFormFooter>
                        <TableCell></TableCell>
                        <TableCell>
                        <span className={SimpleFormIteratorClasses.action}>
                            {cloneElement(addButton, {
                                onClick: handleAddButtonClick(
                                    addButton.props.onClick
                                ),
                                className: classNames(
                                    'button-add',
                                    `button-add-${source}`
                                ),
                            })}
                        </span>
                        </TableCell>
                    </SimpleTableFormFooter>
                )}
            </>
        </SimpleFormIteratorContext.Provider>
    ) : null;
};
const DefaultLabelFn = (index: any) => index + 1;
