import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import React, { useState } from 'react'
import { RiArrowDownSLine } from '@remixicon/react'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import { Check } from '@/app/components/base/icons/src/vender/line/general'
import { WorkspaceListRes } from '@/models/common'

export type WorkSpaceProps = {
  workList: WorkspaceListRes[]
  currWork: WorkspaceListRes
  onChange: (val: string) => void
}

const WorkSpace = ({ workList, currWork, onChange }: WorkSpaceProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)


  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='bottom-start'
      offset={4}
    >
      <div className='relative'>
        <PortalToFollowElemTrigger
          onClick={() => setOpen(v => !v)}
          className='block'
        >
          <div className={cn('flex cursor-pointer items-center rounded-lg bg-components-input-bg-normal px-3 py-2 hover:bg-state-base-hover', open && 'bg-state-base-hover')}>
            <div className='mr-2 grow text-sm leading-5 text-text-primary min-w-[180px]'>{currWork.name || '-'}</div>
            <RiArrowDownSLine className='h-4 w-4 shrink-0 text-text-secondary' />
          </div>
        </PortalToFollowElemTrigger>
        <PortalToFollowElemContent className='z-[1002]'>
          <div className='relative w-[300px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-lg'>
            <div className='border-b text-[13px] font-bold text-text-primary p-3'>{t('common.userProfile.workspace')}</div>
            <div className='p-1'>
              {
              workList.map((work:any) => (
                <div key={work.id} className='cursor-pointer rounded-lg p-3 hover:bg-state-base-hover' onClick={() => {
                  onChange(work.id)
                  setOpen(false)
                }}>
                  <div className='relative pl-5'>
                    <div className='text-sm leading-5 text-text-secondary'>{work.name}</div>
                    {currWork.id === work.id && <Check className='absolute left-0 top-0.5 h-4 w-4 text-text-accent'/>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PortalToFollowElemContent>
      </div>
    </PortalToFollowElem>
  )
}

export default WorkSpace
