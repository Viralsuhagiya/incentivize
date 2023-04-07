import * as React from 'react';
import {
    FormTabProps,
    FormGroupContextProvider,
    FormInput,
    FormTabHeader,
    useResourceContext,
    useRecordContext,
} from 'react-admin';

import { usePermissions } from '../usePermissions';
import { canAccess } from '../canAccess';

/**
 * Replacement for the default <FormTab> that only renders a tab if the user has the right permissions.
 *
 * Add a name prop to the FormTab to define the sub-resource that the user needs to have the right permissions for.
 *
 * <FormTab> also only renders the child inputs for which the user has the 'write' permissions.
 *
 * @example
 * import { Edit, TabbedForm, TextInput } from 'react-admin';
 * import { FormTab } from '@react-admin/ra-rbac';
 *
 * const authProvider = {
 *     // ...
 *     getPermissions: () =>
 *         promiseFor({
 *             permissions: [
 *                 { action: ['list', 'edit'], resource: 'products' },
 *                 { action: 'write', resource: 'products.reference' },
 *                 { action: 'write', resource: 'products.width' },
 *                 { action: 'write', resource: 'products.height' },
 *                 // 'products.description' is missing
 *                 { action: 'write', resource: 'products.thumbnail' },
 *                 // 'products.image' is missing
 *                 { action: 'write', resource: 'products.tab.description' },
 *                 { action: 'write', resource: 'products.tab.images' },
 *                 // 'products.tab.stock' is missing
 *             ],
 *         }),
 * };
 *
 * const ProductEdit = props => (
 *     <Edit {...props}>
 *         <TabbedForm>
 *             <FormTab label="Description" name="description">
 *                 <TextInput source="reference" />
 *                 <TextInput source="width" />
 *                 <TextInput source="height" />
 *                 // not displayed
 *                 <TextInput source="description" />
 *             </FormTab>
 *             <FormTab label="Images" name="images">
 *                 // not displayed
 *                 <TextInput source="image" />
 *                 <TextInput source="thumbnail" />
 *             </FormTab>
 *             // not displayed
 *             <FormTab label="Stock" name="stock">
 *                 <TextInput source="stock" />
 *             </FormTab>
 *         </TabbedForm>
 *     </Edit>
 * );
 */
export const FormTab = ({
    name,
    basePath,
    className,
    contentClassName,
    children,
    hidden,
    icon,
    intent,
    label,
    margin,
    path,
    record,
    resource,
    variant,
    value,
    ...rest
}: FormTabWithPermissionsProps) => {
    const resourceFromContext = useResourceContext();
    const recordFromContext = useRecordContext();
    const { permissions, loading } = usePermissions();

    const renderHeader = () => {
        return (
        <FormTabHeader
            label={label}
            value={value}
            icon={icon}
            className={className}
            {...rest}
        />
        );
    };

    

    const renderContent = () => (
        <FormGroupContextProvider name={value!.toString()}>
            <span
                style={hidden ? hiddenStyle : null}
                className={contentClassName}
                id={`tabpanel-${value}`}
                aria-labelledby={`tabheader-${value}`}
                // Set undefined instead of false because WAI-ARIA Authoring Practices 1.1
                // notes that aria-hidden="false" currently behaves inconsistently across browsers.
                aria-hidden={hidden || undefined}
            >
                {React.Children.map(
                    children,
                    (input: React.ReactElement) =>
                        input &&
                        canAccess({
                            permissions,
                            action: 'write',
                            resource: `${resource}.${
                                (input.props as any).source
                            }`,
                        }) && (
                            <FormInput
                                basePath={basePath}
                                input={input}
                                record={record}
                                resource={resource}
                                variant={input.props.variant || variant}
                                margin={input.props.margin || margin}
                            />
                        )
                )}
            </span>
        </FormGroupContextProvider>
    );

    if (
        loading ||
        !canAccess({
            permissions,
            action: 'write',
            resource: `${resourceFromContext}.tab.${name}`,
            record: recordFromContext,
        })
    ) {
        return null;
    }

    return intent === 'header' ? renderHeader() : renderContent();
};

const hiddenStyle = { display: 'none' };

FormTab.displayName = 'FormTab';

export interface FormTabWithPermissionsProps extends FormTabProps {
    name: string;
}
