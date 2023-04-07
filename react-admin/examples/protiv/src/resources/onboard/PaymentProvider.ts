import { NUMBER } from '../../utils/Constants/MagicNumber';

const log = console.log;
export interface OdooJsonResult {
    status?: string;
    message?: string;
    error?: string;
};
export interface OdooJsonResponse {
    jsonrpc?: string;
    error?: OdooJsonResult;
    status?: string;
    result?: OdooJsonResult;
    message?: string;
    id?: number;
};

export function post(url: string, data: any) {
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
                    reject({
                        error: responseJson.error.message,
                        status: 'failed',
                    });
                } else {
                    reject(responseJson);
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
};   

export const getPlans = async () => {
    const data = {
        jsonrpc: '2.0',
        params: {
        },
    };
    const res = (await post(
        '/api/payment/get-plans',
        data
    )) as any;
    if (res && res.error) {
        console.log('ERROR : ', res);
        return Promise.reject(res);
    } else {
        return Promise.resolve(res);
    }    
};
export const createUpdateCustomer = async (params) => {
    const data = {
        jsonrpc: '2.0',
        params: params,
    };
    const res = (await post(
        '/api/payment/create-customer',
        data
    )) as any;
    if (res && res.error) {
        console.log('ERROR : ', res);
        return Promise.reject(res);
    } else {
        return Promise.resolve(res);
    }
    
};
const setupIntent = async (customer_id) => {
    const data = {
        jsonrpc: '2.0',
        params: {customer_id:customer_id},
    };
    const res = (await post(
        '/api/payment/setup-intent',
        data
    )) as any;
    if (res && res.error) {
        console.log('ERROR : ', res);
        return Promise.reject(res);
    } else {
        return Promise.resolve(res);
    }
};
const createSubscription = async (payment_method_id) => {
    const data = {
        jsonrpc: '2.0',
        params: {
            payment_method_id: payment_method_id
        },
    };
    const res = (await post(
        '/api/cart/create-subscription',
        data
    )) as any;
    if (res && res.error) {
        console.log('ERROR : ', res);
        return Promise.resolve({error:{message:res.error}});
    } else {
        return Promise.resolve(res);
    }
};
const retryInvoice = async (payment_method_id) => {
    const data = {
        jsonrpc: '2.0',
        params: {
            payment_method_id: payment_method_id,
        },
    };
    const res = (await post(
        '/api/cart/retry-invoice',
        data
    )) as any;
    if (res && res.error) {
        console.log('ERROR : ', res);
        return Promise.resolve({error:{message:res.error}});
    } else {
        return Promise.resolve(res);
    }
};

const onboardingInfo = async () => {
    const data = {
    };
    const res = (await post(
        '/api/onboarding-info',
        data
    )) as any;
    if (res && res.error) {
        console.log('ERROR : ', res);
        return Promise.reject(res);
    } else {
        return Promise.resolve(res);
    }
};

const enablePropayAssignedUsers = async () => {
    const data = {
    };
    const res = (await post(
        '/api/enable-propay-assigned-users',
        data
    )) as any;
    if (res && res.error) {
        console.log('ERROR : ', res);
        return Promise.reject(res);
    } else {
        return Promise.resolve(res);
    }
};

const cart = async () => {
    const data = {
        jsonrpc: '2.0',
        params: {
        }
    };
    const res = (await post(
        '/api/cart',
        data
    )) as any;
    if (res && res.error) {
        console.log('ERROR : ', res);
        return Promise.reject(res);
    } else {
        return Promise.resolve(res);
    }
};

const cartUpdate = async (params) => {
    const data = {
        jsonrpc: '2.0',
        params: params
    };
    const res = (await post(
        '/api/cart/update',
        data
    )) as any;
    if (res && res.error) {
        console.log('ERROR : ', res);
        return Promise.reject(res);
    } else {
        return Promise.resolve(res);
    }
};

const cartDone = async () => {
    const data = {
        jsonrpc: '2.0',
        params: {
        }
    };
    const res = (await post(
        '/api/cart/done',
        data
    )) as any;
    if (res && res.error) {
        console.log('ERROR : ', res);
        return Promise.reject(res);
    } else {
        return Promise.resolve(res);
    }
};

export default {
    onboardingInfo: onboardingInfo,    
    enablePropayAssignedUsers:enablePropayAssignedUsers,
    getPlans: getPlans,
    createUpdateCustomer: createUpdateCustomer,
    createSubscription: createSubscription,
    retryInvoice:retryInvoice,
    setupIntent:setupIntent,
    cart:cart,
    cartUpdate:cartUpdate,
    cartDone:cartDone,
};
