import { TableCell, TableRow, Typography } from '@mui/material';
import classNames from 'classnames';
import { Record } from 'ra-core';
import * as React from 'react';
import {
    Children,
    cloneElement, isValidElement, MouseEvent,
    MouseEventHandler, ReactElement, useMemo
} from 'react';

import { FormInput } from 'react-admin';
import { SimpleFormIteratorItemProps } from './SimpleFormIteratorItem';
import {
    SimpleFormIteratorItemContext,
    SimpleFormIteratorItemContextValue
} from './SimpleFormIteratorItemContext';
import { useSimpleFormIterator } from './useSimpleFormIterator';
import { SimpleFormIteratorClasses } from './useSimpleFormIteratorStyles';

export const SimpleFormGroupIteratorItem = React.forwardRef(
    (props: SimpleFormIteratorItemProps & { itemIndex: number, groupBy?:string }, ref: any) => {
        const {
            basePath,
            children,
            disabled,
            disableReordering,
            disableRemove,
            getItemLabel = DefaultLabelFn,
            index,
            margin,
            member,
            record,
            removeButton,
            reOrderButtons,
            resource,
            source,
            variant,
            itemIndex,
            groupBy
        } = props;

        const { total, reOrder, remove } = useSimpleFormIterator();
        // Returns a boolean to indicate whether to disable the remove button for certain fields.
        // If disableRemove is a function, then call the function with the current record to
        // determining if the button should be disabled. Otherwise, use a boolean property that
        // enables or disables the button for all of the fields.
        const disableRemoveField = (records: Record) => {
            if (typeof disableRemove == 'boolean') {
                return disableRemove;
            }
            return disableRemove && disableRemove(records);
        };

        // remove field and call the onClick event of the button passed as removeButton prop
        const handleRemoveButtonClick = (
            originalOnClickHandler: MouseEventHandler,
            ind: number
        ) => (event: MouseEvent) => {
            remove(ind);
            if (originalOnClickHandler) {
                originalOnClickHandler(event);
            }
        };

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
                <TableRow>
                    {!disabled &&
                        !disableReordering &&
                        <TableCell>
                            <Typography
                                variant="body1"
                                className={SimpleFormIteratorClasses.index}
                            >
                                {getItemLabel(index)}
                            </Typography>
                            {!disabled &&
                                !disableReordering &&
                                cloneElement(reOrderButtons, {
                                    index,
                                    max: total,
                                    reOrder,
                                    className: classNames(
                                        'button-reorder',
                                        `button-reorder-${source}-${index}`
                                    ),
                                })}
                        </TableCell>
                    }
                    {Children.map(
                        children,
                        (input: ReactElement, index2) => {
                            if (!isValidElement<any>(input)) {
                                return null;
                            };
                            const { source, ...inputProps } = input.props;
                            return source === groupBy && itemIndex !== 0 ? <TableCell></TableCell> : (
                                <TableCell>
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
                                </TableCell>
                            );
                        }
                    )}

                    {!disabled && !disableRemoveField(record) && (
                        <TableCell style={{paddingRight:0,paddingLeft:0}}>
                            <span className={SimpleFormIteratorClasses.action}>
                                {cloneElement(removeButton, {
                                    onClick: handleRemoveButtonClick(
                                        removeButton.props.onClick,
                                        index
                                    ),
                                    className: classNames(
                                        'button-remove',
                                        `button-remove-${source}-${index}`
                                    ),
                                })}
                            </span>
                        </TableCell>
                    )}
                </TableRow>
            </SimpleFormIteratorItemContext.Provider>
        );
    }
);


const DefaultLabelFn = (index: any) => index + 1;