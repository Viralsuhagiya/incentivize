
import { OdooJsonResponse } from '../layout/OdooJsonResponse';
import { POST } from '../services/HttpService';

const acceptInvite = (db, token): Promise<OdooJsonResponse> => {
    return new Promise((resolve, reject)=>{
        const data = {
            jsonrpc: '2.0',
            params: {
                db: db,
                token: token,
            },
        };
        const api = `/api/accept-invite`;
        POST(
            api,
            data
        ).then((response)=>{
            const res = response as OdooJsonResponse
            if (res && res.status === 'failed' && res.error) {
                reject(res);
            }else{
                resolve(res)
            }
        }).catch((err)=>{
            reject(err);
        })
    });
};
const signupSubmit = (db, token, signup_type, additional_data): Promise<OdooJsonResponse> => {
    return new Promise((resolve, reject)=>{
        const data = {
            jsonrpc: '2.0',
            params: {
                db: db,
                token: token,
                signup_type:signup_type,
                ...additional_data
            },
        };
        const api = `/api/signup-validate`;
        POST(
            api,
            data
        ).then((response)=>{
            const res = response as OdooJsonResponse
            if (res && res.status === 'failed' && res.error) {
                reject(res);
            }else{
                resolve(res)
            }
        }).catch((err)=>{
            reject(err);
        })
    });
};

const verifyToken = (db, token, attribute): Promise<OdooJsonResponse> => {
    return new Promise((resolve, reject)=>{
        const data = {
            jsonrpc: '2.0',
            params: {
                db: db,
                token: token,
                attribute: attribute,
            },
        };
        const api = `/api/signup-verify-token`;
        POST(
            api,
            data
        ).then((response)=>{
            const res = response as OdooJsonResponse
            if (res && res.status === 'failed' && res.error) {
                reject(res);
            }else{
                resolve(res)
            }
        }).catch((err)=>{
            reject(err);
        })
    });
};

export default {
    acceptInvite:acceptInvite,
    signupSubmit:signupSubmit,
    verifyToken:verifyToken

};
