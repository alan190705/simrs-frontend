export interface PageMeta { page: number; limit: number; total: number }
export interface ApiResponse<T> { success: true; message: string; data: T; meta?: PageMeta }
export interface ApiError { success: false; message: string; errors: unknown[] }
