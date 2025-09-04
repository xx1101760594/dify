import { useCallback, useMemo, useEffect } from 'react'
import produce from 'immer'
import { useStoreApi } from 'reactflow'

import type { ValueSelector, Var } from '../../types'
import { VarType } from '../../types'
import type { DatabaseNodeType } from './types'
import useNodeCrud from '@/app/components/workflow/nodes/_base/hooks/use-node-crud'
import useOneStepRun from '@/app/components/workflow/nodes/_base/hooks/use-one-step-run'
import {
  useIsChatMode,
  useNodesReadOnly,
  useWorkflow,
  useWorkflowVariables,
} from '@/app/components/workflow/hooks'
import { DatabaseConnection } from '@/types/database'

const useConfig = (id: string, payload: DatabaseNodeType) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const { inputs, setInputs } = useNodeCrud<DatabaseNodeType>(id, payload)

  const filterVar = useCallback((varPayload: Var) => {
    return varPayload.type === VarType.string
  }, [])

  const isChatMode = useIsChatMode()

  const store = useStoreApi()
  const { getBeforeNodesInSameBranch } = useWorkflow()
  const {
    getNodes,
  } = store.getState()
  const currentNode = getNodes().find(n => n.id === id)
  const isInIteration = payload.isInIteration
  const iterationNode = isInIteration ? getNodes().find(n => n.id === currentNode!.parentId) : null
  const isInLoop = payload.isInLoop
  const loopNode = isInLoop ? getNodes().find(n => n.id === currentNode!.parentId) : null
  const availableNodes = useMemo(() => {
    return getBeforeNodesInSameBranch(id)
  }, [getBeforeNodesInSameBranch, id])

  const { getCurrentVariableType } = useWorkflowVariables()
  const getType = useCallback((variable?: ValueSelector) => {
    const varType = getCurrentVariableType({
      parentNode: isInIteration ? iterationNode : loopNode,
      valueSelector: variable || [],
      availableNodes,
      isChatMode,
      isConstant: false,
    })
    return varType
  }, [getCurrentVariableType, isInIteration, availableNodes, isChatMode, iterationNode, loopNode])

  const handleVarChanges = useCallback((variable: ValueSelector | string) => {
    console.log('handleVarChanges called with:', variable);
    const newInputs = produce(inputs, (draft) => {
      draft.variable_selector = variable as ValueSelector
      draft.sql = `{{#${variable[0]}.${variable[1]}#}}`
    })
    setInputs(newInputs)
  }, [getType, inputs, setInputs])

  const handleDatabaseConnectionChange = useCallback((databaseConnection: DatabaseConnection | null) => {
    console.log('handleDatabaseConnectionChange called with:', databaseConnection);
    const newInputs = produce(inputs, (draft) => {
      draft.db_config = databaseConnection
    })

    setInputs(newInputs)
  }, [inputs, setInputs])

  // single run
  const {
    isShowSingleRun,
    hideSingleRun,
    runningStatus,
    isCompleted,
    handleRun,
    handleStop,
    runResult,
  } = useOneStepRun<DatabaseNodeType>({
    id,
    data: inputs,
    defaultRunInputData: {
      db_config: inputs.db_config,
    },
  })

  return {
    readOnly,
    inputs,
    filterVar,
    handleVarChanges,
    handleDatabaseConnectionChange,
    // single run
    isShowSingleRun,
    hideSingleRun,
    runningStatus,
    isCompleted,
    handleRun,
    handleStop,
    runResult,
  }
}

export default useConfig
