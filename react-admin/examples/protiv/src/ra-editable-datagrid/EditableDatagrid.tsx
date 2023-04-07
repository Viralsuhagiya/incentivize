import React, { useState, ReactElement, FC } from 'react';
import { Datagrid, DatagridProps, Record, useListContext, useResourceContext } from 'react-admin';

import EditableDatagridBody from './EditableDatagridBody';
import EditRowButton from './buttons/EditRowButton';
import DeleteRowButton from './buttons/DeleteRowButton';
import CreateButton from './buttons/CreateButton';
import CreateResourceButton from './buttons/CreateResourceButton';
import { styled } from '@mui/material';
import classnames from 'classnames';
import ReorderRoundedIcon from '@mui/icons-material/ReorderRounded';
import { NUMBER } from '../utils/Constants/MagicNumber';
import Empty from '../layout/Empty';
/**
 * Component to display and edit tabular data.
 *
 * To be used as child of <List> or <ReferenceManyField>.
 * The <EditableDatagrid> expects the same props as <Datagrid>, plus 4 more props:
 *
 * - editForm: a component to display instead of a row when the users edits a record
 * - createForm: a component to display as the first row when the user creates a record
 * - undoable: whether the edit and delete actions are undoable. Defaults to false.
 * - noDelete: disable the inline Delete button
 *
 * The component renders the editForm and createForm elements in a <table>, so they
 * should render a <tr>. We advise you to use <RowForm> for editForm and createForm.
 *
 * Note: No need to include an <EditButton> as child, the <EditableDatagrid>
 * component adds a column with edit/delete/save/cancel buttons itself.
 *
 * Note: To enable the create form in a <List>, you should add the `hasCreate`
 * prop to the <List> component.
 *
 * @example
 *
 *     const ArtistList = props => (
 *         <List {...props} hasCreate>
 *             <EditableDatagrid
 *                 undoable
 *                 createForm={<ArtistForm />}
 *                 editForm={<ArtistForm />}
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
 *     const ArtistForm: FC = props => (
 *         <RowForm {...props}>
 *             <TextField source="id" />
 *             <TextInput source="firstname" validate={required()} />
 *             <TextInput source="name" validate={required()} />
 *             <DateInput source="dob" label="born" validate={required()} />
 *             <SelectInput
 *                 source="prof"
 *                 label="Profession"
 *                 choices={professionChoices}
 *             />
 *         </RowForm>
 *     );
 *
 * @example // inside a <ReferenceManyField> - remember to set the foreign ket in the createForm using initialValues
 *
 *     const OrderEdit = ({ id, ...props }) => (
 *         <Edit {...props} id={id}>
 *             <SimpleForm>
 *                 <ReferenceManyField
 *                     fullWidth
 *                     label="Products"
 *                     reference="products"
 *                     target="order_id"
 *                 >
 *                     <EditableDatagrid
 *                         undoable
 *                         createForm={<ProductForm initialValues={{ order_id: id }} />}
 *                         editForm={<ProductForm />}
 *                     >
 *                         <TextField source="id" />
 *                         <TextField source="name" />
 *                         <NumberField source="price" label="Default Price" />
 *                         <DateField source="available_since" />
 *                     </EditableDatagrid>
 *                 </ReferenceManyField>
 *                 <DateInput source="purchase_date" />
 *             </SimpleForm>
 *         </Edit>
 *     );
 *
 *     const ProductForm = props => (
 *         <RowForm {...props}>
 *             <TextField source="id" disabled />
 *             <TextInput source="name" validate={required()} />
 *             <NumberInput
 *                 source="price"
 *                 label="Default Price"
 *                 validate={required()}
 *             />
 *             <DateInput source="available_since" validate={required()} />
 *         </RowForm>
 *     );
 *
 * @see Datagrid for the other props
 * @see RowForm for the create and edit form
 */
const EditableDatagrid = (props: EditableDatagridProps&{noEditButton?:boolean,showFooter?:boolean}): JSX.Element => {
    const { children,showFooter,allowResequence, createForm, editForm, noDelete, noEditButton, undoable, isRowEditable,isRowDeletable, onCreateSuccess, onEditSuccess, onDeleteSuccess,...rest } =
        props;

        const {
            isLoading,
            isFetching,
            total,
        } = useListContext(props);
    
    const resource = useResourceContext(props);
    const [isStandaloneCreateFormVisible, setShowStandaloneCreateForm] =
        useState<boolean>(false);

    const openStandaloneCreateForm = (): void => {
        setShowStandaloneCreateForm(true);
        // once the row is replaced by a form, focus the first input
        setTimeout(() => {
            const input = document.querySelectorAll('#new_record input')[0] as
                | HTMLInputElement
                | undefined;
            input && input.focus && input.focus();
        }, NUMBER.HUNDRED); // FIXME not super robust
    };

    const closeStandaloneCreateForm = (): void => {
        setShowStandaloneCreateForm(false);
    };

    // If EditableDatagrid is in a List view, the create form is displayed based on the route
    // If not, the create form is displayed based on an internal state (see EditableDatagridBody)
    // In order to detect if we are in a List view, we check the props that are passed
    // We choose 'defaultTitle' since it's very unlikely to have this prop in a Reference field
    // Also, we don't want to have 'defaultTitle' in the Props type, to not confuse users
    const isInListView = rest.defaultTitle !== null;
    const hasStandaloneCreateForm = !isInListView && Boolean(createForm);

    const datagridBody = (
        <EditableDatagridBody
            showFooter={showFooter}
            className={classnames(EditableDatagridClasses.table, rest.className)}
            closeStandaloneCreateForm={closeStandaloneCreateForm}
            createForm={createForm}
            editForm={editForm}
            expand={rest.expand}
            hasBulkActions={rest.hasBulkActions}
            hasStandaloneCreateForm={hasStandaloneCreateForm}
            isStandaloneCreateFormVisible={isStandaloneCreateFormVisible}
            undoable={undoable}
            basePath={rest.basePath}
            resource={resource}
            parent={rest.parent}
            allowResequence={allowResequence}
            isRowEditable={isRowEditable}
            onCreateSuccess={onCreateSuccess}
            onEditSuccess={onEditSuccess}
        />
    );

    // Since <Datagrid /> returns null when there's no data
    // We need to bypass it and display our datagrid by ourself
    if (!isLoading && !isFetching && (total === NUMBER.ZERO)) {
        return hasStandaloneCreateForm ? (
            <>
                <CreateResourceButton
                    onClick={openStandaloneCreateForm}
                    resource={resource}
                />
                {datagridBody}
            </>
        ) : (
            !total ? <Empty/> : datagridBody
        );
    }

    return (
        <DatagridRoot allowResequence={allowResequence} body={datagridBody} resource={resource} {...rest} className={classnames(EditableDatagridClasses.table, rest.className)}>
            {allowResequence && <ActionsColumn
                headerClassName={EditableDatagridClasses.header}
                cellClassName={EditableDatagridClasses.cell}
                redirect={isInListView ? 'list' : false}
                allowResequence={allowResequence}
                label={<ReorderRoundedIcon />}
            />}
            {children}
            {(!noEditButton || !noDelete) &&
            <ActionsColumn
                headerClassName={EditableDatagridClasses.header}
                cellClassName={EditableDatagridClasses.cell}
                undoable={undoable}
                noDelete={noDelete}
                noEditButton={noEditButton}
                redirect={isInListView ? 'list' : false}
                isRowDeletable={isRowDeletable}
                onDeleteSuccess={onDeleteSuccess}
                label={
                    hasStandaloneCreateForm ? (
                        <CreateButton onClick={openStandaloneCreateForm} />
                    ) : (
                        ''
                    )
                }
            />}
        </DatagridRoot>
    );
};

export interface EditableDatagridProps extends DatagridProps {
    editForm?: ReactElement;
    createForm?: ReactElement;
    undoable?: boolean;
    noDelete?: boolean;
    onCreateSuccess?: () => void;
    onEditSuccess?: () => void;
    onDeleteSuccess?: () => void;
    [key: string]: any;
}

interface ActionsColumnProp {
    headerClassName: string;
    cellClassName: string;
    undoable?: boolean;
    noDelete?: boolean;
    redirect: string | boolean;
    isRowDeletable?: (record: Record) => boolean;
    onDeleteSuccess?: () => void;
    [key: string]: any;
}


const PREFIX = 'RaEditableDatagrid';

export const EditableDatagridClasses = {
    table: `${PREFIX}-table`,
    tbody: `${PREFIX}-tbody`,
    header: `${PREFIX}-header`,
    cell: `${PREFIX}-cell`,

};
export const DatagridRoot = styled(Datagrid, { name: PREFIX, shouldForwardProp: (prop) => prop !== 'allowResequence' })((props:any) => ({
    [`& .RaEditableDatagrid-table .RaDatagrid-table .RaDatagridHeaderCell-root .MuiSvgIcon-root`]: {
        display: 'block',
        color: 'red'
    },
    // '& th:nth-child(1),& td:nth-child(1)': {
    //     width: props?.allowResequence ? '25px' : '25vw'
    // },
    '& th,& td': {
        // width: '100vw'
    }
}));

// const useStyles = makeStyles(
//     {
//         actionsColumn: {
//             width: '5em',
//         },
//     },
//     {
//         name: 'RaEditableDatagrid',
//     }
// );


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ActionsColumn: FC<ActionsColumnProp> = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    headerClassName,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cellClassName,
    undoable,
    noEditButton,
    noDelete,
    label,
    isRowDeletable,
    onDeleteSuccess,
    allowResequence,
    ...props
}) => (
    <>
        {!noEditButton && props.editForm && <EditRowButton />}
        {!allowResequence && !noDelete && (!isRowDeletable || (isRowDeletable && isRowDeletable(props.record))) &&  <DeleteRowButton undoable={undoable} onSuccess={onDeleteSuccess} {...props} />}
        {allowResequence && <ReorderRoundedIcon/>}
    </>
);

export default EditableDatagrid;
