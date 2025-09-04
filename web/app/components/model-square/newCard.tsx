'use client'
import { useTranslation } from 'react-i18next'
import { FilePlus01 } from '@/app/components/base/icons/src/vender/line/files'
import cn from '@/utils/classnames'
import Button from '@/app/components/base/button'
import { RiAddLine } from '@remixicon/react'

export type CreateCardProps = {
  className?: string
  onOpenModal: () => void
}

const CreateCard = (
  {
    className,
    onOpenModal
  }: CreateCardProps & {
  },
) => {
  const { t } = useTranslation()

  return (
    <>
    <Button type="button" variant="primary" onClick={() => onOpenModal()}><RiAddLine className='mr-2 h-4 w-4' />{t('common.operation.new')}</Button>
    {/* <div
      className={cn('relative col-span-1 inline-flex h-[120px] flex-col justify-center rounded-xl border-[0.5px] border-components-card-border bg-components-card-bg', className)}
    >
      <div className='grow rounded-t-xl p-2'>
        <div className="flex justify-center">
          <button className='flex flex-col w-[150px] max-w-full cursor-pointer items-center rounded-lg px-6 py-[7px] text-[13px] font-medium leading-[18px] text-text-tertiary hover:bg-state-base-hover hover:text-text-secondary' onClick={() => onOpenModal()}>
            <FilePlus01 className='h-12 w-12 shrink-0 mb-3 border p-4 rounded-lg' />
            {t('common.modelProvider.addModel')}
          </button>
        </div>
      </div>
    </div> */}
    </>
  )
}

export default CreateCard
