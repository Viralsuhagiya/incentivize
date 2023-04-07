import { Record } from 'ra-core';
import * as React from 'react';
import {
    ChangeEvent,
    createContext,
    isValidElement,
    ReactElement,
    useContext,
    useState
} from 'react';

export const useSupportEditSuggestion = (
    options: SupportEditSuggestionOptions
): UseSupportEditValue => {
    const {
        edit,
        handleChange,
    } = options;
    const [renderOnEdit, setRenderOnEdit] = useState(false);
    const [record, setRecord] = useState({id:null});
    const context = {
        record: record,
        onCancel: () => setRenderOnEdit(false),
        onEdit : item => {
            setRenderOnEdit(false);
            handleChange(item);
        },
    };
    return {
        handleChange: async eventOrValue => {
            const value = eventOrValue?.target?.value || eventOrValue;
            const finalValue = Array.isArray(value) ? [...value].pop() : value;
            setRecord(finalValue)
            if (eventOrValue?.preventDefault) {
                eventOrValue.preventDefault();
                eventOrValue.stopPropagation();
            }
            if (record && record.id && record.id !== null && isValidElement(edit)) {
                setRenderOnEdit(true);
                return;
            }
            handleChange(eventOrValue);
        },
        editElement:
            renderOnEdit && isValidElement(edit) ? (
                <EditSuggestionContext.Provider value={context}>
                    {edit}
                </EditSuggestionContext.Provider>
            ) : null,
    };
};

export interface SupportEditSuggestionOptions {
    edit?:ReactElement;
    record?: Record;
    handleChange: (value: any) => void;
    onEdit?: OnEditHandler;
}

export interface UseSupportEditValue {
    handleChange: (eventOrValue: ChangeEvent | any) => Promise<void>;
    editElement: ReactElement | null;
}

const EditSuggestionContext = createContext<EditSuggestionContextValue>(
    undefined
);

interface EditSuggestionContextValue {
    record?: Record;
    onEdit: (choice: any) => void;
    onCancel: () => void;
}
export const useEditSuggestionContext = () =>
    useContext(EditSuggestionContext);

export type OnEditHandler = (record?: Record) => any | Promise<any>;
