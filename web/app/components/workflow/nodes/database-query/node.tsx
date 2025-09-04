import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import type { DatabaseNodeType } from "./types";
import { type NodeProps } from "@/app/components/workflow/types";
import DatabaseDisplay from "./components/database-display";

const i18nPrefix = "workflow.nodes.database";

const NodeComponent: FC<NodeProps<DatabaseNodeType>> = ({ data }) => {
  const { t } = useTranslation();
  const { db_config: databaseConnection } = data;

  if (!databaseConnection) return null;

  return (
    <div className="relative px-3">
      <div className="mb-1 system-2xs-medium-uppercase text-text-tertiary">
        {t(`${i18nPrefix}.databaseConnection`)}
      </div>
      <div className="rounded-md bg-workflow-block-parma-bg">
        <DatabaseDisplay
          database={databaseConnection}
          size="md"
          className="bg-transparent"
        />
      </div>
    </div>
  );
};

export default React.memo(NodeComponent);
