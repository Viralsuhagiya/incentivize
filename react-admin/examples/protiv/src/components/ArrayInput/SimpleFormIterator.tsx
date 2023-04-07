import { FormHelperText, styled, Table, TableBody, TableCell, TableHead } from '@mui/material';
import classNames from 'classnames';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Record, ValidationError } from 'ra-core';
import {
    Children, cloneElement, isValidElement, MouseEvent,
    MouseEventHandler,
    ReactElement,
    ReactNode,
    useCallback,
    useMemo,
    useRef
} from 'react';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { DatagridHeaderCell } from 'react-admin';
import { AddItemButton as DefaultAddItemButton } from './AddItemButton';
import { RemoveItemButton as DefaultRemoveItemButton } from './RemoveItemButton';
import { ReOrderButtons as DefaultReOrderButtons } from './ReOrderButtons';
import { SimpleFormIteratorContext } from './SimpleFormIteratorContext';
import {
    DisableRemoveFunction,
    SimpleFormIteratorItem
} from './SimpleFormIteratorItem';
import { useArrayInput } from './useArrayInput';
import { SimpleFormIteratorClasses } from './useSimpleFormIteratorStyles';

export const SimpleFormIterator = (props: SimpleFormIteratorProps&{removeColumnLabel?:string}) => {
    const {
        addButton = <DefaultAddItemButton />,
        removeButton = <DefaultRemoveItemButton />,
        reOrderButtons = <DefaultReOrderButtons />,
        basePath,
        children,
        className,
        record,
        resource,
        source,
        disabled,
        disableAdd,
        disableRemove,
        disableReordering,
        variant,
        margin,
        removeColumnLabel,
        defaultValue,
        showHeader = true,
        getItemLabel = DefaultLabelFn,
    } = props;
    const { fields, meta } = useArrayInput(props);
    const { error, submitFailed } = meta;
    const nodeRef = useRef(null);

    // We need a unique id for each field for a proper enter/exit animation
    // so we keep an internal map between the field position and an auto-increment id
    const nextId = useRef(
        fields && fields.length
            ? fields.length
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
            ids.current.push(nextId.current++);
            fields.push(item);
        },
        [fields]
    );

    // add field and call the onClick event of the button passed as addButton prop
    const handleAddButtonClick = (
        originalOnClickHandler: MouseEventHandler
    ) => (event: MouseEvent) => {
        addField();
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

    const records = get(record, source||'');

    const context = useMemo(
        () => ({
            total: fields.length!==undefined?fields.length:0,
            add: addField,
            remove: removeField,
            reOrder: handleReorder,
        }),
        [fields, addField, removeField, handleReorder]
    );
    const header = (<>
        <TableHead>
            {!disabled && !disableReordering &&
                <TableCell>Sequence</TableCell>
            }
            {Children.map(children, (field, index) =>
                isValidElement(field) ? (
                <DatagridHeaderCell
                    currentSort={{} as any}
                    field={field}
                    key={(field.props as any).source || index}
                    resource={resource||''}
                    updateSort={(event:any):void=>{}}
                />
                ) : null
                )}
            
            {!disabled && !disableRemove && 
                <TableCell>{removeColumnLabel||'Actions'}</TableCell>
            }
        </TableHead>    
    </>);
    return fields ? (
        <SimpleFormIteratorContext.Provider value={context}>
            <Root
                className={classNames(
                    SimpleFormIteratorClasses.root,
                    className
                )}
            >
                {submitFailed && typeof error !== 'object' && error && (
                    <FormHelperText error>
                        <ValidationError error={error as string} />
                    </FormHelperText>
                )}
                <Table size="small">
                    {showHeader && header}
                    <TableBody>
                            {fields.map((member:any, index:any) => (
                            <SimpleFormIteratorItem
                                basePath={basePath || ''}
                                disabled={disabled}
                                disableRemove={disableRemove}
                                disableReordering={disableReordering}
                                fields={fields}
                                getItemLabel={getItemLabel}
                                index={index}
                                key={index}
                                margin={margin}
                                member={member}
                                meta={meta}
                                onRemoveField={removeField}
                                onReorder={handleReorder}
                                record={(records && records[index]) || {}}
                                removeButton={removeButton}
                                reOrderButtons={reOrderButtons}
                                resource={resource || ''}
                                source={source ||''}
                                variant={variant}
                                ref={nodeRef}
                            >
                                {children}
                            </SimpleFormIteratorItem>
                    ))}
                </TableBody>
            </Table>
                {!disabled && !disableAdd && (
                    <SimpleTableFormFooter>
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
                    </SimpleTableFormFooter>
                )}
            </Root>
        </SimpleFormIteratorContext.Provider>
    ) : null;
};

SimpleFormIterator.defaultProps = {
    disableAdd: false,
    disableRemove: false,
};

SimpleFormIterator.propTypes = {
    defaultValue: PropTypes.any,
    addButton: PropTypes.element,
    removeButton: PropTypes.element,
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    // @ts-ignore
    fields: PropTypes.object,
    meta: PropTypes.object,
    // @ts-ignore
    record: PropTypes.object,
    source: PropTypes.string,
    resource: PropTypes.string,
    translate: PropTypes.func,
    disableAdd: PropTypes.bool,
    disableRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    TransitionProps: PropTypes.shape({}),
};

export interface SimpleFormIteratorProps
    extends Partial<Omit<FieldArrayRenderProps<any, HTMLElement>, 'meta'>> {
    addButton?: ReactElement;
    basePath?: string;
    children?: ReactNode;
    className?: string;
    defaultValue?: any;
    disabled?: boolean;
    disableAdd?: boolean;
    disableRemove?: boolean | DisableRemoveFunction;
    disableReordering?: boolean;
    getItemLabel?: (index: number) => string;
    margin?: 'none' | 'normal' | 'dense';
    meta?: {
        // the type defined in FieldArrayRenderProps says error is boolean, which is wrong.
        error?: any;
        submitFailed?: boolean;
    };
    record?: Record;
    removeButton?: ReactElement;
    reOrderButtons?: ReactElement;
    resource?: string;
    source?: string;
    TransitionProps?: CSSTransitionProps;
    variant?: 'standard' | 'outlined' | 'filled';
    showHeader?: boolean;
}

export const SimpleTableFormFooter = (props:any)=> {
    return (<>
        {props.children}
    </>);
};

export const Root = styled('div')(({ theme }) => ({

}));

const DefaultLabelFn = (index:any) => index + 1;
