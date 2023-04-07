import { NUMBER } from '../utils/Constants/MagicNumber';

export function POST(url: string, data: any) {
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
                if (response.status !== NUMBER.TWO_HUNDRED) {
                    reject({
                        error: 'Request Failed **',
                        status: 'failed',
                    });
                    return;
                }
                return response.json();
            })
            .then(responseJson => {
                if (responseJson && responseJson.result) {
                    resolve(responseJson.result);
                } else {
                    resolve([]);
                }
            })
            .catch(error => {
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
