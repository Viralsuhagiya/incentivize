import { useEffect } from 'react';
import { useCheckAuth, useSafeSetState } from 'react-admin';

const emptyParams = {};

/**
 * Restrict access to authenticated users.
 *
 * Returns loading state while calling the authProvider,
 * and redirects anonymous users to the login page.
 *
 * Use it in replacement for react-admin's useAuthenticated to force a blanc render while calling the authProvider.
 *
 * @example
 * import { useAuthenticated } from '@react-admin/ra-rbac';
 *
 * const SecretData = () => {
 *     const { loading } = useAuthenticated();
 *     return loading ? null : <span>For your eyes only</span>;
 * }
 */
export const useAuthenticated = () => {
    const [loaded, setLoaded] = useSafeSetState<boolean>(false);
    const checkAuth = useCheckAuth();
    useEffect(() => {
        checkAuth(emptyParams)
            .then(() => {
                setLoaded(true);
            })
            .catch(() => {
                // the redirect to login has already happened - useCheckAuth took care of it
            });
    }, [checkAuth, setLoaded]);
    return { authenticated: loaded, loaded, loading: !loaded };
};
