import { styled, Table, TableBody, TableCell, TableHead, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import classNames from 'classnames';
import _ from 'lodash';
import * as React from 'react';
import {
    Children, isValidElement
} from 'react';
import { DatagridHeaderCell, useGetOne } from 'react-admin';
import { HeadlessSimpleFormIterator } from './HeadlessSimpleFormIterator';
import { SimpleFormIteratorProps } from './SimpleFormIterator';
import { useArrayInput } from './useArrayInput';
import {
    SimpleFormIteratorClasses
} from './useSimpleFormIteratorStyles';


export const Root = styled('div')(({ theme }) => ({

}));


export const SimpleFormGroupIterator = (props: SimpleFormIteratorProps & { removeColumnLabel?: string, groupBy?: string }) => {
    const { groupBy, className,removeButton } = props;
    const { fields } = useArrayInput(props);
    const grouped = fields.map((member, index) => {
        const item = fields.value[index];
        return { ...item, __index: index, __member: member}
     });
    
    const groupData = _.groupBy(grouped, groupBy);

    const header = (<>
        <TableHead>
            {Children.map(props.children, (field, index) =>
                isValidElement(field) ? (
                    <DatagridHeaderCell
                        currentSort={{} as any}
                        field={field}
                        key={(field.props as any).source || index}
                        resource={props.resource || ''}
                        updateSort={(event: any): void => { }}
                    />
                ) : null
            )}
            {removeButton && <TableCell>{''}</TableCell>}
        </TableHead>
    </>);
    const defaultValue = { 'id': null };
    Children.map(props.children, (field, index) =>
        isValidElement(field) ? (
            defaultValue[`${field.props.source}`] = null
        ) : {}
    )
    return (
        <Root
            className={classNames(
                SimpleFormIteratorClasses.root,
                className
            )}
        >

            <Table size="small">
                {header}
                <TableBody>
                {_.map(groupData, (fieldvalue, groupById) => {
                    const updatedDefaultValue = { ...defaultValue}
                    updatedDefaultValue[`${groupBy}`] = parseInt(groupById);
                    return <HeadlessSimpleFormIterator {...props} items={fieldvalue} defaultValue={updatedDefaultValue}>
                            {props.children}
                        </HeadlessSimpleFormIterator>

                })}
            </TableBody>
        </Table>
        </Root>
    );
};


export const SimpleFormGroupIteratorAddtime = (props: SimpleFormIteratorProps & { removeColumnLabel?: string, groupBy?: string }) => {
    const { groupBy, className } = props;
    const { fields } = useArrayInput(props);
    const groupedBy = fields.map((memberVal, ind) => {
        const fieldItem = fields.value[ind];
        return { ...fieldItem, __index: ind, __member: memberVal};
     });
    
    const groupsData = _.groupBy(groupedBy, groupBy);
    const defaultValues = { 'id': null };
    Children.map(props.children, (field) =>
        isValidElement(field) ? (
            defaultValues[`${field.props.source}`] = null
        ) : {}
    );
    return (
        <Root
            className={classNames(
                SimpleFormIteratorClasses.root,
                className
            )}
        >

            <Table size="small">
                <TableBody>
                {_.map(groupsData, (fieldvalue, groupById) => {
                    const updatedDefaultValues = { ...defaultValues}
                    updatedDefaultValues[`${groupBy}`] = parseInt(groupById);
                    return (<>
                        <Accordion className='add-time-accordion' defaultExpanded={true}>
                         <AccordionSummary
                             expandIcon={'+'}
                             aria-controls="add-time-accordion"
                             id="add-time-header"
                         >
                             <PeriodName id={Number(groupById)}/>
                         </AccordionSummary>
                         <AccordionDetails>
                         <HeadlessSimpleFormIterator {...props} items={fieldvalue} defaultValue={updatedDefaultValues}>
                             {props.children}
                         </HeadlessSimpleFormIterator>
                         </AccordionDetails>
                     </Accordion>
                     </>)

                })}
            </TableBody>
        </Table>
        </Root>
    )
};

const PeriodName = (props: { id: any; })=> {
    const { id } = props;
    const { data } = useGetOne(
      'periods',
      { id }
  );

    return(
      <>
      {data?.display_name}
      </>
    );
  };

export const CommonSimpleFormIteratorStyle = {
    '.MuiFormControl-root': {
        marginTop: 0,
        '& .MuiInputLabel-formControl': {
            display: 'none',
        },
        '& .MuiInput-root': {
            marginTop: 0
        }
    },
    overflow:'auto'
};

export const StyledSimpleFormGroupIterator = styled(SimpleFormGroupIterator)({
    CommonSimpleFormIteratorStyle,
    '.MuiTable-root': {
        '& th': {
            padding: 0,
            '& span' : {
                padding: '5px 18px 5px 0px'
            }
        },
        '& th: first-child': {
            paddingLeft: 15
        },
        '& td': {
            padding: '10px 5px'
        },
        '& td: first-child': {
            paddingLeft: '15px'
        },
    },
    '.MuiTableRow-root': {
        '& .RaFormInput-input': {
            width: '100%'
        },
        '& .MuiTableCell-root: last-of-type': {
            '& .RaFormInput-input': {
                width: 100
            }
        }
    },
    ...CommonSimpleFormIteratorStyle

});

export const StyledSimpleFormGroupIteratorAddtime = styled(SimpleFormGroupIteratorAddtime)({
    CommonSimpleFormIteratorStyle,
    '.MuiTable-root': {
        '& th': {
            padding: 0,
            '& span' : {
                padding: '5px 18px 5px 0px'
            }
        },
        '& th: first-child': {
            paddingLeft: 15
        },
        '& td': {
            padding: '10px 5px'
        },
        '& td: first-child': {
            paddingLeft: '15px'
        },
    },
    '.MuiTableRow-root': {
        '& .RaFormInput-input': {
            width: '100%'
        },
        '& .MuiTableCell-root: last-of-type': {
            '& .RaFormInput-input': {
                width: 100
            }
        }
    },
    ...CommonSimpleFormIteratorStyle

});
