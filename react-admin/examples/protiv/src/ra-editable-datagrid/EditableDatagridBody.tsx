import React, { ReactNode, ReactElement, FC,cloneElement,createElement,isValidElement,ComponentType, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TableBody } from '@mui/material';
import { Identifier, Record, useMutation, useNotify, CRUD_UPDATE } from 'react-admin';
import { DatagridClasses } from 'ra-ui-materialui';
import { DatagridBodyProps } from 'react-admin';
import EditableDatagridRow from './EditableDatagridRow';
import EditableDatagridCreateForm from './EditableDatagridCreateForm';
import { EditableDatagridFooter } from '../components/datagrid/EditableDatagridFooter';
import _ from 'lodash';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { NUMBER } from '../utils/Constants/MagicNumber';

const createOrCloneElement = (element, props, children) =>
    isValidElement(element)
        ? cloneElement(element, props, children)
        : createElement(element, props, children);


const EditableDatagridBody: FC<EditableDatagridProps> = React.forwardRef(
    (
      {
        basePath,
        children,
        className,
        data,
        expand,
        hasBulkActions,
        hover,
        onToggleItem,
        resource,
        rowClick,
        rowStyle,
        selectedIds,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        version,
        isRowSelectable,
        editForm,
        createForm,
        undoable,
        hasStandaloneCreateForm = false,
        isStandaloneCreateFormVisible,
        isRowEditable,
        closeStandaloneCreateForm,
        onCreateSuccess,
        onEditSuccess,
        allowResequence,
        footer = EditableDatagridFooter,
        showFooter = false,
        ...rest
      }, ref) => {

    const [localItems, setLocalItems] = useState([]);
    const [mutate] = useMutation();
    const notify = useNotify();
    const [isDragging,setIsDragging]=useState(false)
    const handleDragEnd = (result: DropResult,provided?: ResponderProvided) => {
      setIsDragging(false)
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      setLocalItems((prev: any) => {
        const temp = [...prev];
        const dragItem = temp.splice(result.source.index,1)
        const fromIndex = result.destination.index;
        const finalList = _.concat(temp.slice(0,fromIndex), dragItem, temp.slice(fromIndex))
        const updateArr = finalList?.map((data) => data?.id)
        mutate(
          {
            type: 'updateMany',
            resource: resource,
            payload: { ids: updateArr, action: 'resequence', test: 1 },
          },
          {
            mutationMode: 'pessimistic',
            action: CRUD_UPDATE,
            onSuccess: (data: any, variables: any = {}) => {
              notify('You have successfully Updated');
            },
            onFailure: (error) => {
              console.log('There is error ', error.message);
              notify(`Failure ! ${error.message}`);
            },
          }
        );
        return finalList;
      });
    };

    useEffect(() => {
      setLocalItems(data);
    }, [data]);

    return (
      <>
        {allowResequence ? (
          <DragDropContext onBeforeDragStart={()=> setIsDragging(true)} onDragEnd={handleDragEnd} >
            <Droppable droppableId="droppable" direction="vertical">
              {(droppableProvided: DroppableProvided) => (
                <TableBody
                  className={classnames(
                    'datagrid-body',
                    className,
                    DatagridClasses.tbody
                  )}
                  {...rest}
                  {...droppableProvided.droppableProps}
                  ref={droppableProvided.innerRef}
                >
                  {createForm && (
                    <EditableDatagridCreateForm
                      basePath={basePath}
                      closeStandaloneCreateForm={closeStandaloneCreateForm}
                      createForm={createForm}
                      expand={expand}
                      hasBulkActions={hasBulkActions}
                      hasStandaloneCreateForm={hasStandaloneCreateForm}
                      isStandaloneCreateFormVisible={
                        isStandaloneCreateFormVisible
                      }
                      resource={resource}
                      parent={rest.parent}
                      onSuccess={onCreateSuccess}
                      allowResequence={allowResequence}
                    />
                  )}
                  {localItems.length > 0 &&
                    localItems?.map((record, index) => {
                      return (
                        <Draggable
                          key={record.id}
                          draggableId={record.id.toString()}
                          index={index}
                        >
                          {(
                            draggableProvided: DraggableProvided,
                            snapshot: DraggableStateSnapshot
                          ) => {
                            return (
                              <EditableDatagridRow
                                basePath={basePath}
                                className={classnames(DatagridClasses.row, {
                                  [DatagridClasses.rowEven]: index % NUMBER.TWO === 0,
                                  [DatagridClasses.rowOdd]: index % NUMBER.TWO !== 0,
                                  [DatagridClasses.clickableRow]: rowClick,
                                })}
                                expand={expand}
                                form={editForm as ReactElement}
                                hasBulkActions={hasBulkActions}
                                hover={hover}
                                id={record.id}
                                key={record.id}
                                onToggleItem={onToggleItem}
                                record={record}
                                resource={resource}
                                rowClick={rowClick}
                                selectable={
                                  !isRowSelectable || isRowSelectable(record)
                                }
                                selected={selectedIds?.includes(record.id)}
                                sx={{
                                  // display:snapshot.isDragging && 'flex',
                                  // justifyContent:snapshot.isDragging && 'space-between',
                                  background: snapshot.isDragging
                                    ? 'rgba(245,245,245, 0.75)'
                                    : 'none'
                                }}
                                undoable={undoable}
                                isRowEditable={isRowEditable}
                                isDragging={isDragging}
                                onSuccess={onEditSuccess}
                                draggableProps={draggableProvided.draggableProps}
                                dragHandleProps={draggableProvided.dragHandleProps}
                                innerRef={draggableProvided.innerRef}
                                allowResequence={allowResequence}
                              >
                                {children}
                              </EditableDatagridRow>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                  {showFooter &&
                    createOrCloneElement(
                      footer,
                      {
                        children,
                        data,
                        hasExpand: !!expand,
                        hasBulkActions,
                        resource,
                      },
                      children
                    )}
                  {droppableProvided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <TableBody
            ref={ref}
            className={classnames(
              'datagrid-body',
              className,
              DatagridClasses.tbody
            )}
            {...rest}
          >
            {createForm && (
              <EditableDatagridCreateForm
                basePath={basePath}
                closeStandaloneCreateForm={closeStandaloneCreateForm}
                createForm={createForm}
                expand={expand}
                hasBulkActions={hasBulkActions}
                hasStandaloneCreateForm={hasStandaloneCreateForm}
                isStandaloneCreateFormVisible={isStandaloneCreateFormVisible}
                resource={resource}
                parent={rest.parent}
                onSuccess={onCreateSuccess}
                allowResequence={allowResequence}
            />
        )}
        {localItems.length > 0 &&
          localItems?.map((record, index) => {
            return (
              <EditableDatagridRow
                basePath={basePath}
                className={classnames(DatagridClasses.row, {
                  [DatagridClasses.rowEven]: index % NUMBER.TWO === 0,
                  [DatagridClasses.rowOdd]: index % NUMBER.TWO !== 0,
                  [DatagridClasses.clickableRow]: rowClick,
                })}
                expand={expand}
                form={editForm as ReactElement}
                hasBulkActions={hasBulkActions}
                hover={hover}
                id={record.id}
                key={record.id}
                onToggleItem={onToggleItem}
                record={record}
                resource={resource}
                rowClick={rowClick}
                selectable={!isRowSelectable || isRowSelectable(record)}
                selected={selectedIds?.includes(record.id)}
                sx={rowStyle ? rowStyle(record, index) : null}
                undoable={undoable}
                isRowEditable={isRowEditable}
                onSuccess={onEditSuccess}
                allowResequence={allowResequence}
            >
                {children}
            </EditableDatagridRow>
        );
        })}
        {showFooter&&createOrCloneElement(
            footer,
            {
                children,
                data,
                hasExpand: !!expand,
                hasBulkActions,
                resource,
            },
            children
        )}
    </TableBody>
  )}
</>
);
}
);

export interface EditableDatagridProps extends DatagridBodyProps {
    basePath?: string;
    footer?: ReactElement | ComponentType;
    children?: ReactNode;
    className?: string;
    hasBulkActions?: boolean;
    hover?: boolean;
    showFooter?: boolean;
    ids?: Identifier[];
    onToggleItem?: () => void;
    resource?: string;
    rowClick?: string;
    rowStyle?: (record: Record, index: number) => void;
    selectedIds?: Identifier[];
    version?: number;
    isRowSelectable?: (record: Record) => boolean;
    editForm?: ReactElement;
    createForm?: ReactElement;
    undoable?: boolean;
    hasStandaloneCreateForm?: boolean;
    isStandaloneCreateFormVisible: boolean;
    closeStandaloneCreateForm: () => void;
    parent?: {resource: string; record: Record};
    isRowEditable?: (record: Record) => boolean;
    onCreateSuccess?: () => void;
    onEditSuccess?: () => void;
    allowResequence?: boolean;
}

EditableDatagridBody.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    // data: PropTypes.object.isRequired,
    // expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool.isRequired,
    hover: PropTypes.bool,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    rowClick: PropTypes.string,
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    isRowSelectable: PropTypes.func,
    version: PropTypes.number,
    onCreateSuccess: PropTypes.func,
    onEditSuccess: PropTypes.func,
};

EditableDatagridBody.defaultProps = {
    data: [],
    hasBulkActions: false,
    ids: [],
};

// trick material-ui Table into thinking this is one of the child type it supports
// @ts-ignore
EditableDatagridBody.muiName = 'TableBody';

export default EditableDatagridBody;
