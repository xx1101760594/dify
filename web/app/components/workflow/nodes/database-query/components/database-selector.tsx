import type { FC, ReactNode } from 'react'
import { useState, useMemo } from 'react'
import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import Loading from '@/app/components/base/loading'
import cn from '@/utils/classnames'
import { DatabaseConnection } from '@/types/database'
import DatabasePopup from './database-popup'
import DatabaseTrigger, { type DatabaseTriggerProps } from './database-trigger'
import { fetchDatabaseList } from '@/service/database'
import { useEventEmitterContextContext } from '@/context/event-emitter'

// 数据库列表响应类型
export type DatabaseListResponse = {
  data: DatabaseConnection[]
  has_more: boolean
  limit: number
  page: number
  total: number
}



// 主数据库选择器组件
export type DatabaseSelectorProps = {
  defaultDatabase?: DatabaseConnection
  triggerClassName?: string
  popupClassName?: string
  onSelect?: (database: DatabaseConnection) => void
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  renderTrigger?: (props: DatabaseTriggerProps) => ReactNode
}

const DatabaseSelector: FC<DatabaseSelectorProps> = ({
  defaultDatabase,
  triggerClassName,
  popupClassName,
  onSelect,
  readonly,
  disabled,
  placeholder,
  renderTrigger,
}) => {
  const { t } = useTranslation()
  const { eventEmitter } = useEventEmitterContextContext()
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseConnection | undefined>(defaultDatabase)

  // 获取数据库列表
  const { data: databaseListData, isLoading, mutate } = useSWR(
    open ? { keyword: searchValue, page: 1, limit: 50 } : null,
    fetchDatabaseList
  )

  // 监听数据库更新事件
  eventEmitter?.useSubscription((v: any) => {
    if (v?.type === 'UPDATE_DATABASE_LIST') {
      mutate()
    }
  })

  const databaseList = useMemo(() => {
    return databaseListData?.data || []
  }, [databaseListData])

  const handleSelect = (database: DatabaseConnection) => {
    setSelectedDatabase(database)
    if (onSelect) {
      onSelect(database)
    }
  }

  const handleToggle = () => {
    if (readonly || disabled) {
      return
    }
    setOpen(v => !v)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='bottom-start'
      offset={4}
    >
      <div className='relative'>
        <PortalToFollowElemTrigger
          onClick={handleToggle}
          className='block'
        >
          {renderTrigger ? (
            renderTrigger({
              open,
              disabled,
              selectedDatabase,
              placeholder,
              className: triggerClassName,
            })
          ) : (
            <DatabaseTrigger
              open={open}
              disabled={disabled}
              selectedDatabase={selectedDatabase}
              placeholder={placeholder}
              className={triggerClassName}
            />
          )}
        </PortalToFollowElemTrigger>
        <PortalToFollowElemContent className={cn('z-[1002]', popupClassName)}>
          {isLoading ? (
            <div className='w-[320px] rounded-lg border border-components-border bg-components-panel-bg shadow-lg p-4'>
              <Loading />
            </div>
          ) : (
            <DatabasePopup
              defaultDatabase={selectedDatabase}
              databaseList={databaseList}
              onSelect={handleSelect}
              onHide={() => setOpen(false)}
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
            />
          )}
        </PortalToFollowElemContent>
      </div>
    </PortalToFollowElem>
  )
}

export default DatabaseSelector
