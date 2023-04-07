import { AlertColor } from '@mui/material';
import _ from 'lodash';
import {createContext, useState, useContext, useCallback} from 'react';

export const PageAlertsContext = createContext<PageAlertsContextValue>(undefined);
type PageAlertsContextValue = {
    data: any,
    showAlert: any,
    hide: any,
};
export const usePageAlertsContext = (): PageAlertsContextValue => {
    const context = useContext(PageAlertsContext);
    return context
};
export type PageAlertType = {
    body?: string,
    title?: string,
    severity?: AlertColor,
    key?: string,
    data?: any,
    render?: any,
    keep?: boolean,

};
export type PageAlertsType = {
    showAlert
    data: PageAlertType[]
    hide
}; 
export const usePageAlerts = (): PageAlertsType => {
    const [data, setData] = useState<PageAlertType[]>([]);
    const showAlert = useCallback((record:PageAlertType)=>{
        // console.log("PageAlert: Show Alert  ", record.key, record)
        setData((previous)=>{
            // console.log("PageAlert: Show Alert Previous ", previous)
            const newlist = _.remove(previous, (a)=>!(a.key===record.key));
            return [...newlist, record]
        });
    },[setData]);
    const hide = useCallback((key:string)=>{
        // console.log("PageAlert: Hide Alert  ", key)
        setData((previous)=>{
            // console.log("PageAlert: Hide Alert Previous ", previous)
            const newlist = _.remove(previous, (a)=>!(a.key===key));
            return [...newlist]
        })
    },[setData]);
    return {data, showAlert,hide};
};

