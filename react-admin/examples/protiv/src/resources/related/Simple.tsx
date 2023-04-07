import {
  Create,
  required,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput} from 'react-admin';
import { List } from '../../layout/List';
import { Edit } from '../../layout/Edit';

import { RowForm } from '../../ra-editable-datagrid';
import { styled } from '@mui/material/styles';
import {formStyle} from '../propays/Propay';
import { Title } from '../../layout/Title';
import {StyledEditableDatagrid} from '../../components/fields';


const DefaultFilter=[
  <TextInput source="name._ilike" label="Search" size="medium" alwaysOn />,
]

const StyledRowForm = styled(RowForm)({
  ...formStyle,
});

export const DefaultNameRowForm = (props: any) => {
  return (
    <StyledRowForm {...props}>
      <TextInput source="name" variant="standard"         label={false} />
    </StyledRowForm>
  );
};

export const DefaultNameList = (props: any) => {
  return (
    <List {...props} filters={DefaultFilter} hasCreate={true}>
      <StyledEditableDatagrid
            noDelete
            data-testid="store-datagrid"
            rowClick="edit"
            editForm={<DefaultNameRowForm />}
            createForm={<DefaultNameRowForm />}
            size="medium"
        >
          <TextField source="name" />
      </StyledEditableDatagrid>
    </List>
  );
};

export const DefaultNameShow = (props: any) => (
  <Show {...props} title={<Title/>}>
    <SimpleShowLayout>
      <TextField source="name" />
    </SimpleShowLayout>
  </Show>
);



export const DefaultNameEdit = (props: any) => (
  <Edit {...props} mutationMode={"pessimistic"}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]}/>
    </SimpleForm>
  </Edit>
);

export const DefaultNameCreate = (props: any) => (
  <Create {...props} title={<Title/>}>
    <SimpleForm>
      <TextInput source="name" validate={[required()]}/>
    </SimpleForm>
  </Create>
);
