import { useAuthProvider } from 'react-admin';
import { useQuery } from 'react-query';
interface State {
    identity?: any;
    error?: any;
}

export const useGetIdentityOptimized = () => {
    const authProvider = useAuthProvider()
    const callAuthProvider = async () => {
        console.log("useGetIdentityOptimized calling callAuthProvider")
        try {
            const identity = await authProvider.getIdentity();
            console.log("useGetIdentityOptimized called callAuthProvider Identity =>", identity)
            return identity
        }catch (e) {
            //here we are doing like this becuase if user is not logged in then Query gets cancelled 
            //and then useQuery gets stuck in the isLoading state.
            console.log("useGetIdentityOptimized called callAuthProvider ERROR =>", identity)
            return { error:e };
        }
    };
    const { error:fetchError, data:identity } = useQuery('getIdentity', callAuthProvider)
    return {
        identity:identity && !identity.error?identity:undefined,
        error:fetchError || (identity && identity.error)
    } as State
}