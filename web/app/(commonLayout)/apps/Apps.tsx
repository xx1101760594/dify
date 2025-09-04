'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  useRouter,
} from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { useTranslation } from 'react-i18next'
import { useDebounceFn } from 'ahooks'
import {
  RiApps2Line,
  RiExchange2Line,
  RiFile4Line,
  RiMessage3Line,
  RiRobot3Line,
  RiAddLine,
} from '@remixicon/react'
import AppCard from './AppCard'
import NewAppCard from './NewAppCard'
import useAppsQueryState from './hooks/useAppsQueryState'
import type { AppListResponse } from '@/models/app'
import { fetchAppList } from '@/service/apps'
import { useAppContext } from '@/context/app-context'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { CheckModal } from '@/hooks/use-pay'
import TabSliderNew from '@/app/components/base/tab-slider-new'
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import Input from '@/app/components/base/input'
import { useStore as useTagStore } from '@/app/components/base/tag-management/store'
import TagManagementModal from '@/app/components/base/tag-management'
import TagFilter from '@/app/components/base/tag-management/filter'
import CheckboxWithLabel from '@/app/components/datasets/create/website/base/checkbox-with-label'
import Pagination from '@/app/components/base/pagination'

const getKey = (
  pageIndex: number,
  previousPageData: AppListResponse,
  activeTab: string,
  isCreatedByMe: boolean,
  tags: string[],
  keywords: string,
  limit:number
) => {
  if (!pageIndex || previousPageData.has_more) {
    const params: any = { url: 'apps', params: { page: pageIndex + 1, limit, name: keywords, is_created_by_me: isCreatedByMe } }

    if (activeTab !== 'all')
      params.params.mode = activeTab
    else
      delete params.params.mode

    if (tags.length)
      params.params.tag_ids = tags

    return params
  }
  return null
}

const Apps = () => {
  const { t } = useTranslation()
  document.title = `${t('common.menus.workSpace')}`
  const router = useRouter()
  const { isCurrentWorkspaceEditor, isCurrentWorkspaceDatasetOperator } = useAppContext()
  const showTagManagementModal = useTagStore(s => s.showTagManagementModal)
  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: 'all',
  })
  const { query: { tagIDs = [], keywords = '', isCreatedByMe: queryIsCreatedByMe = false }, setQuery } = useAppsQueryState()
  const [isCreatedByMe, setIsCreatedByMe] = useState(queryIsCreatedByMe)
  const [tagFilterValue, setTagFilterValue] = useState<string[]>(tagIDs)
  const [searchKeywords, setSearchKeywords] = useState(keywords)
  const newAppCardRef = useRef<HTMLDivElement>(null)
  const [currPage, setCurrPage] = useState<number>(0)
  const [totalNum, setTotalNum] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const setKeywords = useCallback((keywords: string) => {
    setQuery(prev => ({ ...prev, keywords }))
  }, [setQuery])
  const setTagIDs = useCallback((tagIDs: string[]) => {
    setQuery(prev => ({ ...prev, tagIDs }))
  }, [setQuery])

  const { data, isLoading, error, setSize, mutate } = useSWRInfinite(
    (currPage: number, previousPageData: AppListResponse) => getKey(currPage, previousPageData, activeTab, isCreatedByMe, tagIDs, searchKeywords,limit),
    fetchAppList,
    {
      revalidateFirstPage: true,
      shouldRetryOnError: false,
      dedupingInterval: 500,
      errorRetryCount: 3,
    },
  )

  const anchorRef = useRef<HTMLDivElement>(null)
  const options = [
    { value: 'all', text: t('app.types.all'), icon: <RiApps2Line className='mr-1 h-[14px] w-[14px]' /> },
    { value: 'chat', text: t('app.types.chatbot'), icon: <RiMessage3Line className='mr-1 h-[14px] w-[14px]' /> },
    { value: 'agent-chat', text: t('app.types.agent'), icon: <RiRobot3Line className='mr-1 h-[14px] w-[14px]' /> },
    { value: 'completion', text: t('app.types.completion'), icon: <RiFile4Line className='mr-1 h-[14px] w-[14px]' /> },
    { value: 'advanced-chat', text: t('app.types.advanced'), icon: <RiMessage3Line className='mr-1 h-[14px] w-[14px]' /> },
    { value: 'workflow', text: t('app.types.workflow'), icon: <RiExchange2Line className='mr-1 h-[14px] w-[14px]' /> },
  ]

  useEffect(() => {
    // document.title = `${t('common.menus.workSpace')}`
    if (localStorage.getItem(NEED_REFRESH_APP_LIST_KEY) === '1') {
      localStorage.removeItem(NEED_REFRESH_APP_LIST_KEY)
      mutate()
    }
  }, [mutate, t])

  useEffect(() => {
    if (isCurrentWorkspaceDatasetOperator)
      return router.replace('/datasets')
  }, [router, isCurrentWorkspaceDatasetOperator])

  useEffect(() => {
    const hasMore = data?.at(-1)?.has_more ?? true
    let observer: IntersectionObserver | undefined

    if (error) {
      if (observer)
        observer.disconnect()
      return
    }
    if(data?.[0]?.total&&data?.[0]?.total!==totalNum) setTotalNum(data?.[0]?.total as number)

    if (anchorRef.current) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && !error && hasMore)
          setSize((size: number) => size + 1)
      }, { rootMargin: '100px' })
      observer.observe(anchorRef.current)
    }
    return () => observer?.disconnect()
  }, [isLoading, setSize, anchorRef, mutate, data, error])

  const { run: handleSearch } = useDebounceFn(() => {
    setSearchKeywords(keywords)
  }, { wait: 500 })
  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    handleSearch()
  }

  const { run: handleTagsUpdate } = useDebounceFn(() => {
    setTagIDs(tagFilterValue)
  }, { wait: 500 })
  const handleTagsChange = (value: string[]) => {
    setTagFilterValue(value)
    handleTagsUpdate()
  }

  const handleCreatedByMeChange = useCallback(() => {
    const newValue = !isCreatedByMe
    setIsCreatedByMe(newValue)
    setQuery(prev => ({ ...prev, isCreatedByMe: newValue }))
  }, [isCreatedByMe, setQuery])

  return (
    <>
      <div className='sticky top-0 z-10 flex flex-wrap items-center justify-between gap-y-2 bg-background-body px-12 py-6'>
        {/* <TabSliderNew
          value={activeTab}
          onChange={setActiveTab}
          options={options}
        /> */}
        <NewAppCard ref={newAppCardRef} className='z-10' onSuccess={mutate} />
        <div className='flex items-center gap-2'>
          <CheckboxWithLabel
            className='mr-2'
            label={t('app.showMyCreatedAppsOnly')}
            isChecked={isCreatedByMe}
            onChange={handleCreatedByMeChange}
          />
          {/* <TagFilter type='app' value={tagFilterValue} onChange={handleTagsChange} /> */}
          <Input
            showLeftIcon
            showClearIcon
            wrapperClassName='w-[200px]'
            value={keywords}
            onChange={e => handleKeywordsChange(e.target.value)}
            onClear={() => handleKeywordsChange('')}
          />
        </div>
      </div>
      {(data && data[currPage]?.data?.length > 0)
        ? <div className='relative grid grow grid-cols-1 content-start gap-8 px-12 pt-1 pb-5 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6'>
          {/* {isCurrentWorkspaceEditor
            && <NewAppCard ref={newAppCardRef} onSuccess={mutate} />} */}
          {data[currPage].data.map(app => (
            <AppCard key={app.id} app={app} onRefresh={mutate} />
          ))}
        </div>
        : <div className='relative grid grow grid-cols-1 content-start gap-8 overflow-hidden px-12 pt-1 pb-5 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6'>
          {/* {isCurrentWorkspaceEditor
            && <NewAppCard ref={newAppCardRef} className='z-10' onSuccess={mutate} />} */}
          <NoAppsFound />
        </div>}
        <div className='flex justify-center px-12 pb-5'>
        <Pagination
           total={totalNum}
           current={currPage}
           limit={limit}
           onChange={setCurrPage}
           onLimitChange={setLimit}
           className='w-full shrink-0 px-0 pb-0'
         />
        </div>
      <CheckModal />
      <div ref={anchorRef} className='h-0'> </div>
      {showTagManagementModal && (
        <TagManagementModal type='app' show={showTagManagementModal} />
      )}   
    </>
  )
}

export default Apps

function NoAppsFound() {
  const { t } = useTranslation()
  function renderDefaultCard() {
    const defaultCards = Array.from({ length: 36 }, (_, index) => (
      <div key={index} className='inline-flex h-[160px] rounded-xl bg-background-default-lighter'></div>
    ))
    return defaultCards
  }
  return (
    <>
      {renderDefaultCard()}
      <div className='absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-gradient-to-t from-background-body to-transparent'>
        <span className='system-md-medium text-text-tertiary'>{t('app.newApp.noAppsFound')}</span>
      </div>
    </>
  )
}
