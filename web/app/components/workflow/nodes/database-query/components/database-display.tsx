import type { FC } from "react";
import cn from "@/utils/classnames";
import { DatabaseConnection, DatabaseEngine } from "@/types/database";

export type DatabaseDisplayProps = {
  database: DatabaseConnection;
  showIcon?: boolean;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const DatabaseDisplay: FC<DatabaseDisplayProps> = ({
  database,
  showIcon = true,
  showDetails = true,
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: {
      icon: "h-4 w-4 text-xs",
      name: "text-xs",
      details: "text-xs",
      container: "space-x-1.5 px-1.5 py-0.5",
    },
    md: {
      icon: "h-5 w-5 text-xs",
      name: "text-sm",
      details: "text-xs",
      container: "space-x-2 px-2 py-1",
    },
    lg: {
      icon: "h-6 w-6 text-sm",
      name: "text-base",
      details: "text-sm",
      container: "space-x-3 px-3 py-1.5",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex items-center rounded-md",
        currentSize.container,
        className
      )}
    >
      {showIcon && (
        <div
          className={cn(
            "flex items-center justify-center rounded text-xs font-medium text-white",
            currentSize.icon,
            {
              "bg-pink-500": database.engine === DatabaseEngine.mysql,
              "bg-green-500": database.engine === DatabaseEngine.postgresql,
              "bg-gray-500": database.engine === DatabaseEngine.sqlite,
              "bg-blue-500": database.engine === DatabaseEngine.oracle,
              "bg-red-500": database.engine === DatabaseEngine.mssql,
              "bg-yellow-500": database.engine === DatabaseEngine.elasticsearch,
              "bg-purple-500": database.engine === DatabaseEngine.clickhouse,
            }
          )}
        >
          {database.engine && database.engine.toUpperCase().slice(0, 2)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "font-medium truncate text-text-primary",
            currentSize.name
          )}
        >
          {database.database_name}
        </div>
        {showDetails && (
          <div
            className={cn("truncate text-text-tertiary", currentSize.details)}
          >
            {database.parameters && database.parameters.host} • {database.engine}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseDisplay;
