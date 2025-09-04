import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RiSearchLine } from '@remixicon/react'
import cn from '@/utils/classnames'
import DatabaseDisplay from './database-display'
import { DatabaseConnection } from '@/types/database'

// 数据库选择器弹窗组件
export type DatabasePopupProps = {
  defaultDatabase?: DatabaseConnection
  databaseList: DatabaseConnection[]
  onSelect: (database: DatabaseConnection) => void
  onHide: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

const DatabasePopup: FC<DatabasePopupProps> = ({
  defaultDatabase,
  databaseList,
  onSelect,
  onHide,
  searchValue,
  onSearchChange,
}) => {
  const { t } = useTranslation()

  const handleSelect = (database: DatabaseConnection) => {
    onSelect(database)
    onHide()
  }

  return (
    <div className='max-h-[480px] w-[320px] overflow-y-auto rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-lg'>
      <div className='sticky top-0 z-10 pt-3 pr-2 pb-1 pl-3 bg-components-panel-bg'>
        <div className={`
          flex h-8 items-center rounded-lg border pl-[9px] pr-[10px]
          ${searchValue ? 'border-components-input-border-active bg-components-input-bg-active shadow-xs' : 'border-transparent bg-components-input-bg-normal'}
        `}>
          <RiSearchLine
            className={`
              mr-[7px] h-[14px] w-[14px] shrink-0
              ${searchValue ? 'text-text-tertiary' : 'text-text-quaternary'}
            `}
          />
          <input
            className='block h-[18px] grow appearance-none bg-transparent text-[13px] text-text-primary outline-none'
            placeholder={t('workflow.nodes.database.searchPlaceholder') || '搜索数据库...'}
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className='p-1'>
        {databaseList.length === 0 ? (
          <div className='break-all px-3 py-1.5 text-center text-xs leading-[18px] text-text-tertiary'>
            {searchValue ? t('common.database.noSearchResult') || `未找到匹配"${searchValue}"的数据库` : t('common.database.noDatabase') || '暂无数据库'}
          </div>
        ) : (
          databaseList.map(database => (
            <div
              key={database.id}
              className={cn(
                'flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-components-button-secondary-bg-hover',
                defaultDatabase?.id === database.id && 'bg-components-button-secondary-bg'
              )}
              onClick={() => handleSelect(database)}
            >
              <DatabaseDisplay
                database={database}
                size="md"
                className="flex-1 bg-transparent"
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DatabasePopup 