import { CRUD_UPDATE, useMutation, useNotify, useRedirect } from 'react-admin';

const useSwitchCompany = () => {
    const notify = useNotify();
    const redirectTo = useRedirect();
    const [mutate, { loading }] = useMutation();

    const switchCompany = async (record: any) => {
        return mutate(
            {
                type: 'update',
                resource: 'company',
                payload: {
                    id: record.id,
                    action: 'switchCompany',
                    data: {},
                },
            },
            {
                mutationMode: 'pessimistic',
                action: CRUD_UPDATE,
                onSuccess: (data: any, variables: any = {}) => {
                    notify('You have successfully switched company');
                    redirectTo('/');
                    window.location.reload();
                },
                onFailure: error => {
                    console.log('There is error ', error.message);
                    notify(`Failure ! ${error.message}`);
                },
            }
        );
    };
    return {loading, switchCompany}
};
export default useSwitchCompany;
