import { useContext } from 'react';
import { CreateRowContext } from './CreateRowContext';

/**
 * A hook which returns a function to hide the create row from the sideEffect of a custom form inside the <EditableDatagrid>.
 *
 * @example
 *     const ArtistList = props => (
 *         <List {...props} hasCreate>
 *             <EditableDatagrid
 *                 undoable
 *                 createForm={<ArtistForm />}
 *             >
 *                 <TextField source="id" />
 *                 <TextField source="firstname" />
 *                 <TextField source="name" />
 *                 <DateField source="dob" label="born" />
 *                 <SelectField
 *                     source="prof"
 *                     label="Profession"
 *                     choices={professionChoices}
 *                 />
 *             </EditableDatagrid>
 *         </List>
 *     );
 *
 *     const ArtistForm: FC = props => {
 *         const { close } = useCreateRowContext();
 *
 *         return (
 *             <RowForm onSuccess={() => close()} {...props}>
 *                 <TextField source="id" />
 *                 <TextInput source="firstname" validate={required()} />
 *                 <TextInput source="name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput
 *                     source="prof"
 *                     label="Profession"
 *                     choices={professionChoices}
 *                 />
 *             </RowForm>
 *         );
 *     };
 */
export const useCreateRowContext = () => {
    const context = useContext(CreateRowContext);

    if (!context && process.env.NODE_ENV === 'development') {
        console.error(
            'useCreateRowContext cannot be called outside of the RowForm passed as the `createForm` of the <EditableDatagrid> row.'
        );
    }

    return context;
};
