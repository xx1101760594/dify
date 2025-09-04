import type { Fetcher } from 'swr'
import { get, post, put, del } from './base'
import type { DatabaseListResponse } from '@/app/components/workflow/nodes/database-query/components/database-selector'
import { DatabaseConnection } from '@/types/database';

// 获取数据库列表
export const fetchDatabaseList: Fetcher<DatabaseListResponse, { keyword?: string; page?: number; limit?: number }> = (params) => {
  return get<DatabaseListResponse>('/databases', { params })
}

// 获取单个数据库详情
export const fetchDatabaseDetail: Fetcher<DatabaseConnection, string> = (databaseId) => {
  return get<DatabaseConnection>(`/databases/${databaseId}`)
}

// 创建数据库连接
export const createDatabase = (body: Omit<DatabaseConnection, 'id'>) => {
  return post<DatabaseConnection>('/databases', { body })
}

// 更新数据库连接
export const updateDatabase = (databaseId: string, body: Omit<DatabaseConnection, 'id'>) => {
  return put<DatabaseConnection>(`/databases/${databaseId}`, { body })
}

// 删除数据库连接
export const deleteDatabase = (databaseId: string) => {
  return del(`/databases/${databaseId}`)
}

// 测试数据库连接
export const testDatabaseConnection = (body: Omit<DatabaseConnection, 'id'>) => {
  return post<{ data: { success: boolean; message?: string } }>('/datasource/test-connection', { body })
}

// 获取数据库表列表
export const fetchDatabaseTables: Fetcher<{ tables: string[] }, string> = (databaseId) => {
  return get<{ tables: string[] }>(`/databases/${databaseId}/tables`)
}

// 获取数据库表结构
export const fetchTableSchema: Fetcher<{ columns: Array<{ name: string; type: string; nullable: boolean }> }, { databaseId: string; tableName: string }> = ({ databaseId, tableName }) => {
  return get<{ columns: Array<{ name: string; type: string; nullable: boolean }> }>(`/databases/${databaseId}/tables/${tableName}/schema`)
}

// 执行SQL查询
export const executeQuery = (databaseId: string, body: { query: string; parameters?: any[] }) => {
  return post<{ data: any[]; columns: string[]; rowCount: number }>(`/databases/${databaseId}/query`, { body })
} 