export * from './user';
export * from './track';
export * from './playlist';
export interface ApiResponse<T> {
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
    };
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}
export interface SearchParams extends PaginationParams {
    query?: string;
    filters?: Record<string, any>;
}
//# sourceMappingURL=index.d.ts.map