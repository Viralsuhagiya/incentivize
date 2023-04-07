import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, useMediaQuery,Theme } from '@mui/material';
import { useListContext, FilterContext, FilterButton, FilterForm, FilterFormBase, mergeInitialValuesWithDefaultValues } from 'react-admin';
import { styled } from '@mui/material/styles';
import {
    useState,
    useCallback,
    useContext,
    cloneElement,
    useMemo,
} from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import lodashIsEmpty from 'lodash/isEmpty';
import FilterAlt from '@mui/icons-material/FilterAlt';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import CloseIcon from '@mui/icons-material/Close';

export const DefaultFormFilter = ({filters, ...rest}) =>{
    const filterElements = useMemo(()=>{
        return filters&&filters.map(
            (element)=>cloneElement(element,{...sanitizeResponsiveFilterProps(element.props)}
        ))
    },[filters])
    return (
        <FilterContext.Provider value={filterElements}>
            {rest.context==='button'&& <FilterButton />}
            {rest.context!=='button'&& <FilterForm />}
        </FilterContext.Provider>
    );
};
export const ResponsiveFilterGusser = ({filters, ...rest}) => {
    const isXSmall2 = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    if(isXSmall2){
        return <ResponsiveFilter filters={filters} {...rest} />
    };
    return (
        <DefaultFormFilter filters={filters} {...rest}/>
    );
};

export const sanitizeResponsiveFilterProps = ({
    alwaysOnMobile,
    ...rest
}: any) => rest;

export const sanitizeDefaultFilterProps = ({
    alwaysOn,
    alwaysOnMobile,
    ...rest
}: any) => rest;

export const ResponsiveFilter = ({filters, context, filterActions}:{filters?, context?, filterActions?}) => {
    const alwaysOnFilters = useMemo(()=>{
        return filters&&filters.filter((element)=>element.props.alwaysOnMobile).map(
            (element)=>cloneElement(element,{...sanitizeDefaultFilterProps(element.props)}
        ))
    },[filters])

    const notAlwaysOnFilters = useMemo(()=>{
        return filters&&filters.filter((element)=>!element.props.alwaysOnMobile).map(
            (element)=>cloneElement(element,{...sanitizeDefaultFilterProps(element.props),alwaysOn:true}
        ))
    },[filters])

    if(context==='button') {
        return null;
    };
    return (
        <Stack flexDirection="row" alignItems={'center'} sx={{
            width:'100%'
        }}>
            <FilterContext.Provider value={alwaysOnFilters}>
                <FilterForm sx={{
                    '.RaFilterFormInput-spacer':{
                        display:'none'
                    },
                }}/>
            </FilterContext.Provider>
            <FilterContext.Provider value={notAlwaysOnFilters}>
                <FilterFormDialog sx={{
                    ' .filter-field':{
                        width:'100%'
                    }
                }}/>
            </FilterContext.Provider>
            {filterActions && cloneElement(filterActions,filterActions.props)}
        </Stack>
    )    
};


export const FilterFormDialog = props => {
    const {
        classes: classesOverride,
        filters: filtersProps,
        initialValues,
        ...rest
    } = props;

    const [open, setOpen] = useState(false);
    const handleClick = useCallback((event)=>{
        setOpen(true)
    },[setOpen])
    const handleClose = useCallback((event)=>{
        setOpen(false)
    },[setOpen])

    const { setFilters, displayedFilters, filterValues } = useListContext(
        props
    );

    const filters = useContext(FilterContext) || filtersProps;

    const mergedInitialValuesWithDefaultValues = mergeInitialValuesWithDefaultValues(
        initialValues || filterValues,
        filters
    );

    const handleFinalFormSubmit = useCallback((values)=>{
        setFilters(values, displayedFilters);
        setOpen(false)
    },[setFilters, setOpen, displayedFilters])

    
    return (
        <>
            <IconButton
                className='filter-mobile-btn'
                size="small"
                onClick={handleClick}
            >
                {!lodashIsEmpty(filterValues)&&<FilterAlt color="primary" />}
                {lodashIsEmpty(filterValues)&&<FilterAltOutlined color="primary" />}
                {/* <ContentFilter color="primary"/> */}
            </IconButton>

            <Form
                onSubmit={handleFinalFormSubmit}
                initialValues={mergedInitialValuesWithDefaultValues}
                mutators={{ ...arrayMutators }}
                render={formProps => (
                    <Dialog
                    className='filter-modal-mobile'
                        fullWidth
                        open={open}>
                        <DialogTitle sx={{p:2,}}>
                            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                            Filters
                                <IconButton
                                    color="primary"
                                    onClick={handleClose}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Stack>
                        </DialogTitle>
                        <DialogContent>
                            <StyledFilterFormBase
                                {...formProps}
                                {...rest}
                                filters={filters}
                                sx={{
                                    pt:1
                                }}
                            />
                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={formProps.handleSubmit}
                                >
                                Save
                            </Button>
                        </DialogContent>                        
                    </Dialog>       
                )}
            />
        </>
    );
};

// Options to instruct the FormSpy that it should only listen to the values and pristine changes
const PREFIX = 'RaFilterDialogForm';

const StyledFilterFormBase = styled(FilterFormBase, { name: PREFIX })(({ theme }) => ({
    [`&.RaFilterForm-form`]: {
        direction:'column',
        flexDirection:'column',
        alignItems:'flex-start',
    },
    '.filter-field, .filter-field > *, .filter-field > * > .MuiFormControl-root, .filter-field .MuiAutocomplete-root':{
        width:'100%',
    },
    '.filter-field .RaFilterFormInput-spacer':{
        display:'none'
    },
    ' .RaFilterFormInput-hideButton':{
        display:'none'
    }
}));
