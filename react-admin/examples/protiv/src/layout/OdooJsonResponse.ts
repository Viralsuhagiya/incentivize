export interface OdooJsonResult {
    status?: string;
    message?: string;
    error?: string;
    session_info?: string;
}
export interface OdooJsonResponse {
    jsonrpc?: string;
    error?: OdooJsonResult;
    status?: string;
    result?: OdooJsonResult;
    message?: string;
    id?: number;
    session_info?: string;
}
