import { HTMLAttributes } from 'react';
import { Location as LocationDescriptor } from 'history';


export type GetLabelFunction = (
    context: Record<string, unknown>
) => string | JSX.Element;

export type GetToFunction = (
    context: Record<string, unknown>
) => string | LocationDescriptor;

export type BreadcrumbPath = {
    label: string | GetLabelFunction;
    to?: string | LocationDescriptor | GetToFunction;
};

export type BreadcrumbItemProps = {
    name: string;
    path?: string;
} & BreadcrumbPath &
    HTMLAttributes<HTMLLIElement>;


