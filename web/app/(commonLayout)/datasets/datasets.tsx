'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import { debounce } from 'lodash-es'
import NewDatasetCard from './new-dataset-card'
import DatasetCard from './dataset-card'
import type { DataSetListResponse, FetchDatasetsParams } from '@/models/datasets'
import { fetchDatasets } from '@/service/datasets'
import { useAppContext } from '@/context/app-context'
import Pagination from '@/app/components/base/pagination'

const getKey = (
  pageIndex: number,
  previousPageData: DataSetListResponse,
  tags: string[],
  keyword: string,
  includeAll: boolean,
  limit: number,
) => {
  if (!pageIndex || previousPageData.has_more) {
    const params: FetchDatasetsParams = {
      url: 'datasets',
      params: {
        page: pageIndex + 1,
        limit,
        include_all: includeAll,
      },
    }
    if (tags.length)
      params.params.tag_ids = tags
    if (keyword)
      params.params.keyword = keyword
    return params
  }
  return null
}

type Props = {
  containerRef: React.RefObject<HTMLDivElement | null>
  tags: string[]
  keywords: string
  includeAll: boolean
}

const Datasets = ({
  containerRef,
  tags,
  keywords,
  includeAll,
}: Props) => {
  const loadingStateRef = useRef(false)
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const [currPage, setCurrPage] = useState<number>(0)
  const [totalNum, setTotalNum] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)

  const { t } = useTranslation()

  const { isCurrentWorkspaceEditor } = useAppContext()
  const { data, isLoading, setSize, mutate } = useSWRInfinite(
    (currPage: number, previousPageData: DataSetListResponse) => getKey(currPage, previousPageData, tags, keywords, includeAll,limit),
    fetchDatasets,
    { revalidateFirstPage: false, revalidateAll: true },
  )

  useEffect(() => {
    loadingStateRef.current = isLoading
    document.title = `${t('dataset.knowledge')}`
    if(data?.[0]?.total&&data?.[0]?.total!==totalNum) setTotalNum(data?.[0]?.total as number)
  }, [isLoading, t,])

  useEffect(() => {
   setSize(currPage + 1)
  }, [currPage])

  useEffect(() => {
    setCurrPage(0)
    mutate()   
  }, [limit])

  // const onScroll = useCallback(
  //   debounce(() => {
  //     console.log(data?.[0]?.total,'data2');
  //     if (!loadingStateRef.current && containerRef.current && anchorRef.current) {
  //       const { scrollTop, clientHeight } = containerRef.current
  //       const anchorOffset = anchorRef.current.offsetTop
  //       if (anchorOffset - scrollTop - clientHeight < 100)
  //         setSize(size => size + 1)
  //     }
  //   }, 50),
  //   [setSize],
  // )
 
  // useEffect(() => {
  //   const currentContainer = containerRef.current
  //   currentContainer?.addEventListener('scroll', onScroll)
  //   return () => {
  //     currentContainer?.removeEventListener('scroll', onScroll)
  //     onScroll.cancel()
  //   }
  // }, [onScroll])

  return (
   <>
    <nav className='grid grow grid-cols-1 content-start gap-8 px-12 pt-1 pb-5 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6'>
      {/* { isCurrentWorkspaceEditor && <NewDatasetCard ref={anchorRef} /> } */}
      {(data && data[currPage]?.data?.length > 0)&&data[currPage].data.map(dataset => (
        <DatasetCard key={dataset.id} dataset={dataset} onSuccess={mutate} />
      ))}
    </nav>
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
   </>
  )
}

export default Datasets
