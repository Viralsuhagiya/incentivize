import { AuthProvider, UserIdentity } from 'react-admin';
import _ from 'lodash';
import userflow from 'userflow.js'
import { QueryClient } from 'react-query';
import { NUMBER } from '../utils/Constants/MagicNumber';
import { ZendeskAPI } from '../ZendexConfig';


const log = console.log;
export interface OdooJsonResult {
    status?: string;
    message?: string;
    error?: string;
}
export interface OdooJsonResponse {
    jsonrpc?: string;
    error?: OdooJsonResult;
    status?: string;
    result?: OdooJsonResult;
    message?: string;
    id?: number;
}

function post(url: string, data: any) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                log('first ever ever ever =' + JSON.stringify(response));
                if (response.status !== NUMBER.TWO_HUNDRED) {
                    reject({
                        error: 'Request Failed **',
                        status: 'failed',
                    });
                    return;
                }

                return response.json() as OdooJsonResponse;
            })
            .then(responseJson => {
                if (responseJson && responseJson.result) {
                    resolve(responseJson.result as OdooJsonResult);
                } else if (responseJson && responseJson.error) {
                    if (responseJson.error.message === 'Odoo Session Expired') {
                        localStorage.removeItem('loginUser');
                        reject(responseJson);
                    } else {
                        reject({
                            error: responseJson.error.message,
                            status: 'failed',
                        });
                    }
                } else {
                    resolve([]);
                }
            })
            .catch(error => {
                log('main exception =' + error);
                // When webisite is not reachable
                // May be server down or internet is not connected
                if (error.stack) {
                    reject({
                        error: error.message,
                        status: 'failed',
                    });
                } else if (error.error) {
                    reject({
                        error: error.error.message,
                        status: 'failed',
                    });
                } else {
                    // Odoo Exceptions raised from backend.
                    reject(error);
                }
            });
    });
}   

const userflowInit = (identity) => {
    if(identity.userflow_token){
        console.log(`userflow init with token ${identity.userflow_token}`);
        userflow.init(identity.userflow_token);
        userflow.identify(identity.uid, {
            name: identity.name,
            email: identity.username,
            signed_up_at: identity.signed_up_at,
            user_type: identity.user_type || '',
        })
    } else {
        console.log(`userflow is not enabled`);
    }
}
const userflowReset = () => {
    try {
        userflow.reset();    
    } catch (err) {
        console.log('Error in userflow reset', err);
    }
}
export const getSessionInfo = () => {
    return post('/web/session/get_session_info',{});
}
const getErrorMessage = (error) => {
    let message;
    if(error && typeof error ==='object') {
        if(error.networkError){
            message = getErrorMessage(error.networkError)
        } else if(error.result){
            message = getErrorMessage(error.result)
        } else if(error.body){
            message = getErrorMessage(error.body)
        } else if(error.error){
            message = getErrorMessage(error.error)
        } else if(error.message){
            message = error.message
        }
    }else{
        message = error;
    }
    return message;
}
export const getIdentity = () => {
    const myPromise = new Promise<UserIdentity>((resolve, reject) => {
        getSessionInfo().then((data:any)=>{
            const identityData = {
                ...data,
                id: data.uid,
                fullName: data.name,
            };
            console.log('Called GetIdentity', identityData);
            localStorage.setItem('loginUser', JSON.stringify(identityData));
            userflowInit(identityData);
            resolve(identityData);
        }).catch(e=>{
            console.log('GetIdentity error', e);
            reject(e);
        });
    });
    return myPromise;
}
const getIdentityCached =  (queryClient):Promise<UserIdentity> => {
    console.log('Called Existing Query Data',queryClient.getQueryData('session_info'))
    return queryClient.fetchQuery('session_info', getIdentity, {
        staleTime: NUMBER.TWO*NUMBER.ONE_THOUSAND,
    })
}
export default (queryClient:QueryClient): AuthProvider => ({
    login: async ({ username, password }) => {
        const data = {
            jsonrpc: '2.0',
            params: {
                login: username,
                password: password,
            },
        };
        queryClient.invalidateQueries('session_info')
        const res = (await post(
            '/api/login',
            data
        )) as any;
        if (res && res.error) {
            console.log('ERROR : ', res);
            return Promise.reject(res);
        } else {
            console.log('Login success ', res);
            return Promise.resolve(res);
        }
    },

    checkError: (error) => {
        return new Promise((resolve, reject)=>{
            const message = getErrorMessage(error);
            console.log('Check error:', error);
            console.log('Check error message:', message);
            if(message === 'Odoo Session Expired' || message==='Response not successful: Received status code 405') {
                localStorage.removeItem('loginUser');
                console.log('checkError logout');
                queryClient.clear();
                reject({logoutUser: true});
            }
            resolve();
        });
    },

    checkAuth: async (params: any) => {
        //if there is not loginUser try for existing session
        console.log('Called checkAuth', queryClient)
        const identity = await getIdentityCached(queryClient)
        if (identity){
            console.log('Checking for existing session');
            return Promise.resolve()
        }
        return Promise.reject()
    },

    logout: async () => {
        try {
            ZendeskAPI("messenger", "logoutUser");
            userflowReset();
            queryClient.clear();
            await fetch('/web/session/logout?redirect=/');
            localStorage.removeItem('loginUser');
        } catch (err) {
            console.log(err);
        }
    },

    getIdentity: async () => {
        console.log('Called getIdentity', queryClient);
        const result = await getIdentityCached(queryClient);
        return result;
    },

    getPermissions: async () => {
        console.log('Called getPermissions', queryClient);
        const identity = await getIdentityCached(queryClient);
        if(identity){
            return {
                permissions:identity.permissions||[],
                roles:_.keys(identity.roles||{})
            }
        }
        return identity;
    },
    getRoles: async () => {
        console.log('Called getRoles', queryClient);
        const identity = await getIdentityCached(queryClient);
        if(identity){
            return identity.roles||[]
        };
        return identity;
    }
});
