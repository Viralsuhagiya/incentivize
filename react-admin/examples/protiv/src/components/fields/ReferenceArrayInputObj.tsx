import * as React from 'react';
import { useMemo } from 'react';
import {
    useReferenceArrayInputController,
    useInput,
    useTranslate,
    ResourceContextProvider,
    ReferenceArrayInputContextProvider,
    ListContextProvider,
} from 'ra-core';

import { ReferenceArrayInputProps, ReferenceArrayInput, ReferenceArrayInputView } from 'react-admin';

import { useField as useFinalFormField } from 'react-final-form';

export const ReferenceArrayInputObj = ({
    children,
    id: idOverride,
    onBlur,
    onChange,
    onFocus,
    validate,
    parse,
    format,
    ...props
}: ReferenceArrayInputProps) => {
    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceArrayInput> only accepts a single child (like <Datagrid>)'
        );
    }

    const { id, input, isRequired, meta } = useInput({
        id: idOverride,
        onBlur,
        onChange,
        onFocus,
        validate,
        parse,
        format,
        ...props,
    });

    const controllerProps = useReferenceArrayInputController({
        ...props,
        input,
    });

    const listContext = useMemo(
        () => ({
            ...controllerProps,
            // ReferenceArrayInput.setSort had a different signature than the one from ListContext.
            // In order to not break backward compatibility, we added this temporary setSortForList in the
            // ReferenceArrayInputContext
            // FIXME in 4.0
            setSort: controllerProps.setSortForList,
        }),
        [controllerProps]
    );

    const translate = useTranslate();



    //This is for setting object as the form field so that
    //we can use it as input.
    const { referenceRecords } = controllerProps;
    const { input: { onChange: objOnChange}} = useFinalFormField(`${props.source}_obj`);

    React.useEffect(() => {
        objOnChange(referenceRecords?referenceRecords.filter(Boolean):[]);
    }, [objOnChange, referenceRecords]);

    return (
        <ResourceContextProvider value={props.reference}>
            <ReferenceArrayInputContextProvider value={controllerProps}>
                <ListContextProvider value={listContext}>
                    <ReferenceArrayInputView
                        id={id}
                        input={input}
                        isRequired={isRequired}
                        meta={meta}
                        translate={translate}
                        children={children}
                        {...props}
                        choices={controllerProps.choices}
                        isFetching={controllerProps.isFetching}
                        isLoading={controllerProps.isLoading}
                        setFilter={controllerProps.setFilter}
                        setPagination={controllerProps.setPagination}
                        setSort={controllerProps.setSort}
                    />
                </ListContextProvider>
            </ReferenceArrayInputContextProvider>
        </ResourceContextProvider>
    );
};

ReferenceArrayInputObj.propTypes = ReferenceArrayInput.propTypes;
ReferenceArrayInputObj.defaultProps = ReferenceArrayInput.defaultProps;
