import * as React from 'react';
import { ReactElement } from 'react';
import {
    ListProps,
    List as RaList,
    CreateButton,
    Pagination
} from 'react-admin';
import {Title} from './Title';
import {Card,CardContent} from '@mui/material';
import { styled } from '@mui/material/styles';
import {ListGroupProps, ListGroup as RaListGroup} from '../ra-list-grouping';
import { NUMBER } from '../utils/Constants/MagicNumber';
const ListDivComponent = styled(CardContent)({
});
const TitleActions = (props: any): ReactElement => {
    const { label, showCreate, createButtonProps, ...rest} = props
    return (
        <>
            {(showCreate) && <CreateButton variant="contained" label={label} size="medium" {...createButtonProps} resource={rest.resource}/>}
        </>
    );
};

/* commenting code
const CommonActions = (props: any) => <ListActions {...props}/> 
*/

export const List = ({perPage=NUMBER.FIFTEEN,titleAction, showPagination = true, titleActionProps,title, ...rest}: ListProps&{showPagination? : boolean, titleAction?:React.ReactNode,titleActionProps?: {resource?: string, showCreate?: boolean, createButtonProps?: any}}): ReactElement => (
    <StyledCard>
        <StyledList perPage={perPage} pagination={showPagination ? <Pagination limit={<></>} rowsPerPageOptions={[NUMBER.FIFTEEN, NUMBER.TWENTY_FIVE, NUMBER.FIFTY, NUMBER.HUNDRED]} /> : false} title={<Title title={title} titleActionProps={titleActionProps} action={titleAction||TitleActions}/>} component={ListDivComponent} {...rest} />
    </StyledCard>
);

export const ListWithoutCard = ({titleAction, showPagination = true, titleActionProps, ...rest}: ListProps&{showPagination? : boolean, titleAction?:React.ReactNode,titleActionProps?: {resource?: string, showCreate?: boolean, createButtonProps?: any}}): ReactElement => (
    <StyledList perPage={NUMBER.FIFTEEN} pagination={showPagination ? <Pagination limit={<></>} rowsPerPageOptions={[NUMBER.FIFTEEN, NUMBER.TWENTY_FIVE, NUMBER.FIFTY, NUMBER.HUNDRED]} /> : false} title={<Title titleActionProps={titleActionProps} action={titleAction||TitleActions}/>} component={ListDivComponent} {...rest} />
);

export const ListGroup = ({showPagination = true, titleActionProps, ...rest}: ListGroupProps&{showPagination? : boolean, titleActionProps?: {showCreate?: boolean, createButtonProps?: any}}): ReactElement => (
    <StyledCard>
        <StyledListGroup perPage={NUMBER.FIFTEEN} pagination={showPagination ? <Pagination limit={<></>} rowsPerPageOptions={[NUMBER.FIFTEEN, NUMBER.TWENTY_FIVE, NUMBER.FIFTY, NUMBER.HUNDRED]} /> : false} title={<Title titleActionProps={titleActionProps} action={TitleActions}/>} component={ListDivComponent} {...rest} />
    </StyledCard>
);

export const ListGroupWithoutCard = ({showPagination = true, titleActionProps, ...rest}: ListGroupProps&{showPagination? : boolean, titleActionProps?: {showCreate?: boolean, createButtonProps?: any}}): ReactElement => (
        <StyledListGroup perPage={NUMBER.FIFTEEN} pagination={showPagination ? <Pagination limit={<></>} rowsPerPageOptions={[NUMBER.FIFTEEN, NUMBER.TWENTY_FIVE, NUMBER.FIFTY, NUMBER.HUNDRED]} /> : false} title={<Title titleActionProps={titleActionProps} action={TitleActions}/>} component={ListDivComponent} {...rest} />
);

const StyledCard = styled(Card)(({ theme }) => ({
    '& .MuiCardContent-root':{
        'padding':'0px'
    }
}))
const StyledList = styled(RaList)(({ theme }) => ({
    '.RaList-main':{
        width:'100%',
        overflow:'auto'
    },
    '.RaList-content':{
        overflow:'auto'
    },
    [`& .MuiToolbar-root.RaListToolbar-toolbar`]:{
        alignItems: 'flex-start',
        padding: theme.spacing(NUMBER.TWO),
        [theme.breakpoints.down('sm')]: {
            paddingRight:theme.spacing(NUMBER.ZERO_POINT_FIVE),
        },
        [theme.breakpoints.up('xs')]: {
            paddingLeft: theme.spacing(NUMBER.TWO),
        },
    },
    [`& .MuiToolbar-root .RaTopToolbar-root`]:{
        [theme.breakpoints.down('sm')]: {
            backgroundColor: 'unset',
        },
    },
    [`& .MuiTableCell-head.RaDatagrid-headerCell`]:{
        'background-color':'#F4F6F8'
    },
    [`& .RaFilterForm-form`]:{
        'padding-top':'8px',
        'min-height':'unset',
        '& .MuiFormHelperText-root':{
            'margin-top':'0px',
        },
        '& .MuiTextField-root':{
            'margin-top':'0px',
            'margin-bottom':'0px',
        }

    },
    [`& .RaDatagridHeaderCell-root`]:{
        'color':theme.palette.grey[NUMBER.THREE_HUNDRED]
    },
    [`& .MuiTableRow.RaDatagrid-row`]:{
    },
    [`& .MuiToolbar-root.RaBulkActionsToolbar-toolbar`]:{
        minHeight: theme.spacing(NUMBER.TWELVE),
        height: theme.spacing(NUMBER.TWELVE),
        transform: `translateY(-${theme.spacing(NUMBER.TWELVE)})`,
        transition: `${theme.transitions.create(
            'height'
        )}, ${theme.transitions.create(
            'min-height'
        )}, ${theme.transitions.create('transform')}`,
    },
    [`& .MuiToolbar-root.RaBulkActionsToolbar-collapsed`]: {
        minHeight: 0,
        height: 0,
        transform: `translateY(0)`,
        overflowY: 'hidden',
    },
    '.RaFilterForm-form':{
        paddingRight:theme.spacing(1),
        width:'100%',
        [theme.breakpoints.down('sm')]: {
            flexDirection:'column',
            alignItems:'flex-start'
        },
        [theme.breakpoints.up('sm')]: {
            flexDirection:'row',
            alignItems:'flex-end'
        }
    },
    '& .filter-field':{
        margin:theme.spacing(NUMBER.ZERO_POINT_FIVE),
    },
    '.filter-field, .filter-field > .MuiFormControl-root, .filter-field > .MuiAutocomplete-root':{
        [theme.breakpoints.down('sm')]: {
            width:'100%'
        },
        [theme.breakpoints.up('sm')]: {
            width:'initial'
        }
    },
    '& .filter-field:first-of-type, .filter-field:first-of-type > .MuiFormControl-root, .filter-field:first-of-type > .MuiAutocomplete-root':{
        [theme.breakpoints.down('sm')]: {
            width:'100%'
        },
        [theme.breakpoints.up('sm')]: {
            width:'initial'
        }
    },
  }));


  const StyledListGroup = styled(RaListGroup)(({ theme }) => ({
    '.RaList-main':{
        width:'100%',
        overflow:'auto'
    },
    '.RaList-content':{
        overflow:'unset'
    },
    [`& .MuiToolbar-root.RaListToolbar-toolbar`]:{
        alignItems: "flex-start",
        padding: theme.spacing(NUMBER.TWO),
        [theme.breakpoints.down('sm')]: {
            paddingRight:theme.spacing(NUMBER.ZERO_POINT_FIVE),
        },
        [theme.breakpoints.up('xs')]: {
            paddingLeft: theme.spacing(NUMBER.TWO),
        },

    },
    [`& .MuiTableCell-head.RaDatagrid-headerCell`]:{
        'background-color':'#F4F6F8'
    },
    [`& .RaFilterForm-form`]:{
        'padding-top':'8px',
        'min-height':'unset',
        '& .MuiFormHelperText-root':{
            'margin-top':'0px',
        },
        '& .MuiTextField-root':{
            'margin-top':'0px',
            'margin-bottom':'0px',
        }

    },
    [`& .RaDatagridHeaderCell-root`]:{
        'color':theme.palette.grey[NUMBER.THREE_HUNDRED]
    },
    [`& .MuiTableRow.RaDatagrid-row`]:{
    },
    [`& .MuiToolbar-root.RaBulkActionsToolbar-toolbar`]:{
        minHeight: theme.spacing(NUMBER.TWELVE),
        height: theme.spacing(NUMBER.TWELVE),
        transform: `translateY(-${theme.spacing(NUMBER.TWELVE)})`,
        transition: `${theme.transitions.create(
            'height'
        )}, ${theme.transitions.create(
            'min-height'
        )}, ${theme.transitions.create('transform')}`,
    },
    [`& .MuiToolbar-root.RaBulkActionsToolbar-collapsed`]: {
        minHeight: 0,
        height: 0,
        transform: `translateY(0)`,
        overflowY: 'hidden',
    },
    '.RaFilterForm-form':{
        paddingRight:theme.spacing(1),
        width:'100%',
        [theme.breakpoints.down('sm')]: {
            flexDirection:'column',
            alignItems:'flex-start'
        },
        [theme.breakpoints.up('sm')]: {
            flexDirection:'row',
            alignItems:'flex-end'
        }
    },
    '& .filter-field':{
        margin:theme.spacing(NUMBER.ZERO_POINT_FIVE),
    },
    '.filter-field, .filter-field > .MuiFormControl-root':{
        [theme.breakpoints.down('sm')]: {
            width:'100%'
        },
        [theme.breakpoints.up('sm')]: {
            width:'initial'
        }
    },
    '& .filter-field:first-of-type, .filter-field:first-of-type > .MuiFormControl-root':{
        [theme.breakpoints.down('sm')]: {
            width:'100%'
        },
        [theme.breakpoints.up('sm')]: {
            width:'initial'
        }
    },
  }));
