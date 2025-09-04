import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RiArrowDownSLine } from '@remixicon/react'
import cn from '@/utils/classnames'
import DatabaseDisplay from './database-display'
import { DatabaseConnection } from '@/types/database'

// 数据库选择器触发器组件
export type DatabaseTriggerProps = {
  open: boolean
  disabled?: boolean
  selectedDatabase?: DatabaseConnection
  placeholder?: string
  className?: string
}

const DatabaseTrigger: FC<DatabaseTriggerProps> = ({
  open,
  disabled,
  selectedDatabase,
  placeholder,
  className,
}) => {
  const { t } = useTranslation()

  if (disabled) {
    return (
      <div className={cn(
        'flex justify-between items-center px-3 h-8 text-sm rounded-lg border border-components-border bg-components-button-secondary-bg text-components-button-secondary-text',
        className
      )}>
        <span className='truncate'>{placeholder || t('common.database.selectDatabase')}</span>
        <RiArrowDownSLine className='w-4 h-4 shrink-0' />
      </div>
    )
  }

  if (selectedDatabase) {
    return (
      <div className={cn(
        'group flex h-8 items-center gap-0.5 rounded-lg bg-components-input-bg-normal p-1 cursor-pointer hover:bg-components-input-bg-hover',
        open && 'bg-components-input-bg-hover',
        className
      )}>
        <DatabaseDisplay
          database={selectedDatabase}
          size="sm"
          showDetails={false}
          className="flex-1 bg-transparent"
        />
        <RiArrowDownSLine className='h-3.5 w-3.5 shrink-0 text-text-tertiary transition-transform' />
      </div>
    )
  }

  return (
    <div className={cn(
      'group flex h-8 items-center gap-0.5 rounded-lg bg-components-input-bg-normal p-1 cursor-pointer hover:bg-components-input-bg-hover',
      open && 'bg-components-input-bg-hover',
      className
    )}>
      <div className='flex grow items-center gap-1 truncate px-1 py-[3px]'>
        <span className='text-sm truncate grow text-text-tertiary'>{placeholder || t('common.database.selectDatabase')}</span>
        <RiArrowDownSLine className={cn('h-3.5 w-3.5 shrink-0 text-text-tertiary transition-transform', open && 'rotate-180')} />
      </div>
    </div>
  )
}

export default DatabaseTrigger 