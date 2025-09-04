import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import VarReferencePicker from "../_base/components/variable/var-reference-picker";
import Split from "../_base/components/split";
import useConfig from "./use-config";
import type { DatabaseNodeType } from "./types";
import Field from "@/app/components/workflow/nodes/_base/components/field";
import { type NodePanelProps } from "@/app/components/workflow/types";
import OutputVars, { VarItem } from "../_base/components/output-vars";
import DatabaseSelector from "./components/database-selector";

const i18nPrefix = "workflow.nodes.database";

const Panel: FC<NodePanelProps<DatabaseNodeType>> = ({ id, data }) => {
  const { t } = useTranslation();
  const {
    readOnly,
    inputs,
    handleVarChanges,
    handleDatabaseConnectionChange,
    filterVar,
  } = useConfig(id, data);

  return (
    <div className="mt-2">
      <div className="px-4 pb-4 space-y-4">
        <Field title={t(`${i18nPrefix}.inputVar`)} required>
          <>
            <VarReferencePicker
              readonly={readOnly}
              nodeId={id}
              isShowNodeName
              value={inputs.variable_selector || []}
              onChange={handleVarChanges}
              filterVar={filterVar}
              typePlaceHolder="String"
            />
          </>
        </Field>
        <Field title={t(`${i18nPrefix}.databaseConnection`)} required>
          <DatabaseSelector
            defaultDatabase={inputs.db_config || undefined}
            onSelect={handleDatabaseConnectionChange}
            readonly={readOnly}
            placeholder={t(`${i18nPrefix}.selectDatabase`)}
          />
        </Field>
      </div>
      <Split />
      <div>
        <OutputVars>
          <VarItem
            name='rows'
            type='array[object]'
            description={t(`${i18nPrefix}.outputVars.rows`)}
          />
          <VarItem
            name='statement_type'
            type='string'
            description={t(`${i18nPrefix}.outputVars.statementType`)}
          />
          <VarItem
            name='row_count'
            type='number'
            description={t(`${i18nPrefix}.outputVars.rowCount`)}
          />
        </OutputVars>
      </div>
      {/* {isShowSingleRun && (
        <BeforeRunForm
          nodeName={inputs.title}
          nodeType={inputs.type}
          onHide={hideSingleRun}
          forms={[]}
          runningStatus={runningStatus}
          onRun={(submitData) => {
            console.log('=== BeforeRunForm onRun called ===');
            console.log('submitData:', submitData);
            console.log('handleRun function:', handleRun);
            handleRun(submitData);
          }}
          onStop={handleStop}
          result={<ResultPanel {...runResult} showSteps={false} />}
        />
      )} */}
    </div>
  );
};

export default React.memo(Panel);
