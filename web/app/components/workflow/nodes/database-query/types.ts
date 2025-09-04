import type { CommonNodeType, ValueSelector } from '@/app/components/workflow/types'
import { DatabaseConnection } from '@/types/database'

export type DatabaseQuery = {
  query: string
  parameters?: string[]
}

// export type DBConfig = {
//   database_name: string
//   sqlalchemy_uri?: string
//   host?: string
//   engine?: string

// }

export type DatabaseNodeType = CommonNodeType & {
  variable_selector: ValueSelector
  sql?: string
  db_config: DatabaseConnection | null
  structured_output_enabled?: boolean
} 