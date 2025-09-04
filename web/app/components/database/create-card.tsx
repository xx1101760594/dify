'use client'
import { useTranslation } from 'react-i18next'
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
    <Button type="button" variant="primary" onClick={() => onOpenModal()}><RiAddLine className='mr-2 w-4 h-4' />{t('common.operation.new')}</Button>
    </>
  )
}

export default CreateCard
