import * as React from 'react';
import { FunctionComponent, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import {
    registerResource,
    unregisterResource,
    ResourceProps,
    ReduxState,
    ResourceContextProvider,
} from 'react-admin';

import { usePermissions } from './usePermissions';
import { canAccess } from './canAccess';
import { useAuthenticated } from './useAuthenticated';

const defaultOptions = {};

const ResourceRegister: FunctionComponent<ResourceProps> = ({
    name,
    list,
    create,
    edit,
    show,
    icon,
    options = defaultOptions,
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            registerResource({
                name,
                options,
                hasList: !!list,
                hasEdit: !!edit,
                hasShow: !!show,
                hasCreate: !!create,
                icon,
            })
        );
        return () => {
            dispatch(unregisterResource(name));
        };
    }, [dispatch, name, create, edit, icon, list, show, options]);
    return null;
};

const ResourceRoutes: FunctionComponent<ResourceProps> = ({
    name,
    list: List,
    create: Create,
    edit: Edit,
    show: Show,
    options = defaultOptions,
}) => {
    const isRegistered = useSelector(
        (state: ReduxState) => !!state.admin.resources[name]
    );
    const { loaded: authChecked } = useAuthenticated();
    const { loaded: permissionsLoaded, permissions } = usePermissions();


    // match tends to change even on the same route ; using memo to avoid an extra render
    return useMemo(() => {
        // if the registration hasn't finished, no need to render
        if (!isRegistered) {
            return null;
        }
        // if the authProvider hasn't returned, no need to render
        if (!authChecked || !permissionsLoaded) {
            return null;
        }

        return (
            <ResourceContextProvider value={name}>
                <Routes>
                    {Create &&
                        canAccess({
                            permissions,
                            action: 'create',
                            resource: name,
                        }) && (
                            <Route path="create/*" element={<Create />} />
                        )}
                    {Show &&
                        canAccess({
                            permissions,
                            action: 'show',
                            resource: name,
                        }) && (
                            <Route path="show/*" element={<Show />} />
                        )}
                    {Edit &&
                        canAccess({
                            permissions,
                            action: 'edit',
                            resource: name,
                        }) && (
                            <Route path="edit/*" element={<Edit />} />
                        )}
                    {List &&
                        canAccess({
                            permissions,
                            action: 'list',
                            resource: name,
                        }) && (
                            <Route path="list/*" element={<List />} />
                        )}
                </Routes>
            </ResourceContextProvider>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        name,
        Create,
        Edit,
        List,
        Show,
        options,
        isRegistered,
        authChecked,
        permissionsLoaded,
    ]);
};

export const Resource: FunctionComponent<ResourceProps> = ({
    intent = 'route',
    ...props
}) =>
    intent === 'registration' ? (
        <ResourceRegister {...props} />
    ) : (
        <ResourceRoutes {...props} />
    );
