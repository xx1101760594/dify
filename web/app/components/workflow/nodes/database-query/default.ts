import { BlockEnum } from '../../types'
import type { NodeDefault } from '../../types'
import type { DatabaseNodeType } from './types'
import { ALL_CHAT_AVAILABLE_BLOCKS, ALL_COMPLETION_AVAILABLE_BLOCKS } from '@/app/components/workflow/blocks'
const i18nPrefix = 'workflow.errorMsg'

const nodeDefault: NodeDefault<DatabaseNodeType> = {
  defaultValue: {
    variable_selector: [],
    db_config: null,
    retry_config: {
      retry_enabled: false,
      max_retries: 1,
      retry_interval: 100,
    },
  },
  getAvailablePrevNodes(isChatMode: boolean) {
    const nodes = isChatMode
      ? ALL_CHAT_AVAILABLE_BLOCKS
      : ALL_COMPLETION_AVAILABLE_BLOCKS.filter(type => type !== BlockEnum.End)
    return nodes
  },
  getAvailableNextNodes(isChatMode: boolean) {
    const nodes = isChatMode ? ALL_CHAT_AVAILABLE_BLOCKS : ALL_COMPLETION_AVAILABLE_BLOCKS
    return nodes
  },
  checkValid(payload: DatabaseNodeType, t: any) {
    let errorMessages = ''
    const { variable_selector: variable } = payload

    if (!errorMessages && !variable?.length)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: t('workflow.nodes.assigner.assignedVariable') })

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault
