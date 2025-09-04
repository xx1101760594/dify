'use client'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import {
  RiAddLine,
  RiArrowRightLine,
} from '@remixicon/react'
import Link from 'next/link'

type CreateAppCardProps = {
  ref?: React.Ref<HTMLAnchorElement>
}

const CreateAppCard = ({ ref }: CreateAppCardProps) => {
  const { t } = useTranslation()

  return (
    <div className='bg-background-default-dimm flex h-[170px] flex-col rounded-xl border-[0.5px]
      border-components-panel-border bg-components-card-bg transition-all duration-200 ease-in-out'
    >
      <div className='flex justify-center m-auto'>
        <Link ref={ref} href={'/datasets/create'}>
          <div className='flex flex-col w-[120px] max-w-full cursor-pointer items-center rounded-lg px-2 py-[7px] text-[13px] font-medium leading-[18px] text-text-tertiary hover:bg-state-base-hover hover:text-text-secondary'>
            <RiAddLine className='h-12 w-12 shrink-0 mb-3 border p-4 rounded-lg'/>
            <div>{t('dataset.createDataset')}</div>
          </div>
        </Link>
         {/* <Link ref={ref} href={'datasets/connect'}>
          <div className='flex flex-col w-[120px] max-w-full cursor-pointer items-center rounded-lg px-2 py-[7px] text-[13px] font-medium leading-[18px] text-text-tertiary hover:bg-state-base-hover hover:text-text-secondary'>
            <RiArrowRightLine className='h-12 w-12 shrink-0 mb-3 border p-4 rounded-lg'/>
            <div>{t('dataset.connectDataset')}</div>
          </div>
        </Link> */}
        {/* <div className='system-xs-regular p-4 pt-0 text-text-tertiary'>{t('dataset.createDatasetIntro')}</div> */}
        {/* <Link className='group flex-col w-[150px] max-w-full flex cursor-pointer items-center gap-1 rounded-b-xl border-t-[0.5px] border-divider-subtle p-4' href={'datasets/connect'}>
          <div className='system-xs-medium text-text-tertiary group-hover:text-text-accent'>{t('dataset.connectDataset')}</div>
          <RiArrowRightLine className='h-3.5 w-3.5 text-text-tertiary group-hover:text-text-accent' />
        </Link> */}
      </div>
    </div>
  )
}

CreateAppCard.displayName = 'CreateAppCard'

export default CreateAppCard
