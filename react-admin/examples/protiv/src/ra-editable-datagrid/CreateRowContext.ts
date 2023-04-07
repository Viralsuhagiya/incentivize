import { createContext } from 'react';

/**
 * We need this context to communicate the callback to exit the create mode on a
 * row between the <EditableDatagrid> and the <CreateRowButton> and through
 * <DatagridRow> (which does not expect this prop).
 */
export const CreateRowContext = createContext<CreateRowContextValue>({} as CreateRowContextValue);

export type CreateRowContextValue = {
    close: () => void;
};
