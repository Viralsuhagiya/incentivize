import * as React from 'react';
import PropTypes from 'prop-types';
import { Children, isValidElement, ReactElement } from 'react';
import {
    Toolbar as MuiToolbar,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import classnames from 'classnames';
import { ToolbarProps, DeleteButton, SaveButton } from 'react-admin';

import { usePermissions } from '../usePermissions';
import { canAccess } from '../canAccess';
import { Record } from 'ra-core';
import { NUMBER } from '../../utils/Constants/MagicNumber';


/**
 * Replacement for react-admin's Toolbar that adds RBAC control to actions
 *
 * Users must have the 'delete' permission on the resource and record to see the DeleteButton.
 */
export const Toolbar = <RecordType extends Partial<Record> = Partial<Record>>(
    props: ToolbarProps<RecordType>
) => {
    const {
        alwaysEnableSaveButton,
        basePath,
        children,
        className,
        handleSubmit,
        handleSubmitWithRedirect,
        invalid,
        pristine,
        record,
        redirect,
        resource,
        saving,
        submitOnEnter = true,
        mutationMode,
        validating,
        ...rest
    } = props;

    const isXs = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    const { loading, permissions } = usePermissions();
    if (loading) {
        return null;
    }

    // Use form pristine and validating to enable or disable the save button
    // if alwaysEnableSaveButton is undefined
    const disabled = !valueOrDefault(
        alwaysEnableSaveButton,
        !pristine && !validating
    );

    return (
        <StyledToolbar
            className={classnames(
                ToolbarClasses.toolbar,
                {
                    [ToolbarClasses.mobileToolbar]: isXs,
                    [ToolbarClasses.desktopToolbar]: !isXs,
                },
                className
            )}
            role="toolbar"
            {...rest}
        >
            {Children.count(children) === 0 ? (
                <div className={ToolbarClasses.defaultToolbar}>
                    <SaveButton
                        handleSubmitWithRedirect={
                            handleSubmitWithRedirect || handleSubmit
                        }
                        disabled={disabled}
                        invalid={invalid}
                        redirect={redirect}
                        saving={saving || validating}
                        submitOnEnter={submitOnEnter}
                    />
                    {record && typeof record.id !== 'undefined' && 
                    canAccess({
                        permissions,
                        action: 'delete',
                        resource,
                        record,
                    }) && (
                        <DeleteButton
                            basePath={basePath}
                            // @ts-ignore
                            record={record}
                            resource={resource}
                            mutationMode={mutationMode}
                        />
                    )}
                </div>
            ) : (
                Children.map(children, (button: ReactElement) =>
                    button && isValidElement<any>(button)
                        ? React.cloneElement(button, {
                              basePath: valueOrDefault(
                                  button.props.basePath,
                                  basePath
                              ),
                              handleSubmit: valueOrDefault(
                                  button.props.handleSubmit,
                                  handleSubmit
                              ),
                              handleSubmitWithRedirect: valueOrDefault(
                                  button.props.handleSubmitWithRedirect,
                                  handleSubmitWithRedirect
                              ),
                              onSave: button.props.onSave,
                              invalid,
                              pristine,
                              record: valueOrDefault(
                                  button.props.record,
                                  record
                              ),
                              resource: valueOrDefault(
                                  button.props.resource,
                                  resource
                              ),
                              saving:button.props.saving || saving,
                              submitOnEnter: valueOrDefault(
                                  button.props.submitOnEnter,
                                  submitOnEnter
                              ),
                              mutationMode: valueOrDefault(
                                  button.props.mutationMode,
                                  mutationMode
                              ),
                          })
                        : null
                )
            )}
        </StyledToolbar>
    );
};

Toolbar.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    handleSubmit: PropTypes.func,
    handleSubmitWithRedirect: PropTypes.func,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    validating: PropTypes.bool,
};

const PREFIX = 'RaToolbar';

export const ToolbarClasses = {
    toolbar: `${PREFIX}-toolbar`,
    desktopToolbar: `${PREFIX}-desktopToolbar`,
    mobileToolbar: `${PREFIX}-mobileToolbar`,
    defaultToolbar: `${PREFIX}-defaultToolbar`,
    spacer: `${PREFIX}-spacer`,
};

const StyledToolbar = styled(MuiToolbar, { name: PREFIX })(({ theme }) => ({
    [`&.${ToolbarClasses.toolbar}`]: {
        backgroundColor:
            theme.palette.mode === 'light'
                ? theme.palette.grey[NUMBER.HUNDRED]
                : theme.palette.grey[NUMBER.NINE_HUNDRED],
    },

    [`&.${ToolbarClasses.desktopToolbar}`]: {
        marginTop: theme.spacing(NUMBER.TWO),
    },

    [`&.${ToolbarClasses.mobileToolbar}`]: {
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box',
        flexShrink: 0,
        zIndex: 2,
    },

    [`& .${ToolbarClasses.defaultToolbar}`]: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
    },
}));

const valueOrDefault = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;
