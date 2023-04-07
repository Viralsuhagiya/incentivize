import React, { memo, createContext, useContext, useEffect } from 'react';
import { useGetIdentityOptimized } from './useGetIdentityOptimized';

export interface IdentityProps {
    id: number;
    time_format: string;
    fullName:string;
    avatar:string;
    allow_to_add_time: boolean;
    user_companies:{ current_company:[number, string], allowed_companies:[[number, string]]},
    company: any;
    company_id: number;
    user_type: string;
    permissions:any[];
    roles:any[];
    employee_id:number;

}

export const IdentityContextValue = createContext<IdentityProps>(undefined);

const IdentityContextProvider = ({ children }: any) => {
    const { identity } = useGetIdentityOptimized();
    useEffect(()=>{
        console.log("IdentityContextProvider: Identity changed in ", identity);
      },[identity])

    return (
        <IdentityContextValue.Provider value={identity}>
            {children}
        </IdentityContextValue.Provider>
    );
};
export const useIdentityContext = ():IdentityProps => {
    const identity = useContext(IdentityContextValue);
    return identity;
}
export default memo(IdentityContextProvider);
