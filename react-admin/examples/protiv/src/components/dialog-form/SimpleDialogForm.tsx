import { FormWithRedirectProps, SimpleFormView } from 'react-admin'
import { DialogFormWithRedirect } from './DialogFormWithRedirect'


export const SimpleDialogForm = (props:FormWithRedirectProps) => {
    return (
        <DialogFormWithRedirect
            {...props}
            render={formProps => <SimpleFormView {...formProps} toolbar={<></>} />}
        />
    )
}

