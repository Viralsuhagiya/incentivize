import React, { cloneElement, isValidElement, ReactNode } from 'react';
import {
  Record
} from 'react-admin';

export interface GroupFormInputProps{
  basePath?: string;
  children: ReactNode;
  record?: Record;
  resource?: string;
}
export const GroupFormInput = (props: GroupFormInputProps ) => {
  const { record, basePath, resource, children } = props;
  return (
    <>
      {React.Children.map(children, (field, index) =>
        isValidElement(field) ? (
            <div>
                {cloneElement(field, {
                    record,
                    basePath: field.props.basePath || basePath,
                    resource,
                })}
            </div>
        ) : null
      )}  
    </>
  );
};
