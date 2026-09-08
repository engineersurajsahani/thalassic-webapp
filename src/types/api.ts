export interface ApiResponse<T = any> {
  statusCode?: number;
  message?: string;
  data?: T;
  success?: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  category: string;
  duration: string;
  fees: string | number;
  description?: string;
  level?: string;
  icon?: string;
  image?: string;
  documentsRequired?: string;
  rating?: string;
  ratingCount?: number;
}
