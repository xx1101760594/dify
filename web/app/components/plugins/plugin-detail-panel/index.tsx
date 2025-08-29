'use client'
import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RiBookReadLine } from '@remixicon/react'
import DetailHeader from './detail-header'
import EndpointList from './endpoint-list'
import ActionList from './action-list'
import ModelList from './model-list'
import AgentStrategyList from './agent-strategy-list'
import Drawer from '@/app/components/base/drawer'
import type { PluginDetail } from '@/app/components/plugins/types'
import { useReadmeDrawer } from '@/app/components/plugins/readme-drawer/context'
import cn from '@/utils/classnames'

type Props = {
  detail?: PluginDetail
  onUpdate: () => void
  onHide: () => void
}

const PluginDetailPanel: FC<Props> = ({
  detail,
  onUpdate,
  onHide,
}) => {
  const { t } = useTranslation()
  const { openReadme } = useReadmeDrawer()

  const handleUpdate = (isDelete = false) => {
    if (isDelete)
      onHide()
    onUpdate()
  }

  const handleReadmeClick = () => {
    if (detail)
      openReadme(detail)
  }

  if (!detail)
    return null

  return (
    <Drawer
      isOpen={!!detail}
      clickOutsideNotOpen={false}
      onClose={onHide}
      footer={null}
      mask={false}
      positionCenter={false}
      panelClassName={cn('mb-2 mr-2 mt-[64px] !w-[420px] !max-w-[420px] justify-start rounded-2xl border-[0.5px] border-components-panel-border !bg-components-panel-bg !p-0 shadow-xl')}
    >
      {detail && (
        <>
          <DetailHeader
            detail={detail}
            onHide={onHide}
            onUpdate={handleUpdate}
          />
          <div className='grow overflow-y-auto'>
            {!!detail.declaration.tool && <ActionList detail={detail} />}
            {!!detail.declaration.agent_strategy && <AgentStrategyList detail={detail} />}
            {!!detail.declaration.endpoint && <EndpointList detail={detail} />}
            {!!detail.declaration.model && <ModelList detail={detail} />}
          </div>

          {/* Readme Button - 固定在底部或跟随内容 */}
          <div className="border-t border-divider-regular bg-components-panel-bg">
            <div className="flex flex-col items-start justify-center gap-2 px-4 pb-4 pt-0">
              {/* Divider */}
              <div className="relative h-2 w-8 shrink-0">
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-divider-regular to-transparent"></div>
              </div>

              {/* Button */}
              <button
                onClick={handleReadmeClick}
                className="group flex w-full items-center justify-start gap-1 transition-opacity hover:opacity-80"
              >
                <div className="relative flex h-3 w-3 items-center justify-center overflow-hidden">
                  <RiBookReadLine className="h-3 w-3 text-text-tertiary" />
                </div>
                <span className="text-xs font-normal leading-4 text-text-tertiary">
                  {t('plugin.readmeInfo.needHelpCheckReadme')}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </Drawer>
  )
}

export default PluginDetailPanel
