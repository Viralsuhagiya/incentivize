import { Auth } from '@aws-amplify/auth';
import { AuthProvider } from 'react-admin';
import dataProviderFactory from './dataProvider';
import { OdooAuthProvider } from './ra-data-odoo';
import { QueryClient } from 'react-query';
const authGroups = [];
const odooAuthProvider = OdooAuthProvider(new QueryClient());
export const authProvider: AuthProvider = {
    login: (params) => odooAuthProvider.login(params),
    logout: (params) => {
        return new Promise((resolve, reject)=>{
            odooAuthProvider.logout(params);
            Auth.signOut().then(()=>resolve()).catch((err)=>reject(err));
        });
    },
    checkError: (error) => odooAuthProvider.checkError(error),
    checkAuth: async (): Promise<void> => {
        console.log('Called aws checkAuth')
        //we dont need to check in odoo for auth because, even without that if the user is not logged in then finally api call gives error and it will logout
        //so doing check in aws is enough to see if user is logged in or not.
        // await odooAuthProvider.checkAuth({})
        const session = await Auth.currentSession();
        if (authGroups.length === 0) {
          return;
        }    
        const userGroups = session.getAccessToken().decodePayload()[
          "cognito:groups"
        ];
        if (!userGroups) {
          throw new Error("Unauthorized");
        }
        for (const group of userGroups) {
          if (authGroups.includes(group)) {
            return;
          }
        }
        throw new Error("Unauthorized");
    },
    getPermissions: (params) => odooAuthProvider.getPermissions(params),
    getRoles: () => odooAuthProvider.getRoles(),
    getIdentity: () => odooAuthProvider.getIdentity(),
};

export const dataProvider = dataProviderFactory();


