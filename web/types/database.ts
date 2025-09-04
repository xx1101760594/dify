
export type DatabaseConnection = {
  id?: string;
  database_name: string;
  engine: string;
  parameters: Record<string, any>;
  sqlalchemy_uri?: string;
}

export enum DatabaseEngine {
  mysql = 'mysql',
  postgresql = 'postgresql',
  sqlite = 'sqlite',
  oracle = 'oracle',
  mssql = 'mssql',
  elasticsearch = 'elasticsearch',
  clickhouse = 'clickhousedb'
}

export type DatabaseFormData = {
  database_name: string;
  engine: DatabaseEngine;
  database: string;
  ip: string;
  port: string;
  username: string;
  password: string;
  description?: string;
};
