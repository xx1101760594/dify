'use client'
import React,{ useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { fetchDatasetApiBaseUrl } from '@/service/datasets'
import Doc from '../datasets/Doc'

export default function ApiDocs() {
  const { t } = useTranslation()
  document.title = `${t('common.userProfile.api')}`

  const { data } = useQuery(
    {
      queryKey: ['datasetApiBaseInfo'],
      queryFn: () => fetchDatasetApiBaseUrl('/datasets/api-base-info'),
    },
  )
  
  return (
    <div className='mx-auto w-full px-6 pt-6'>
      {data && <Doc apiBaseUrl={data.api_base_url || '' }/>}
    </div>
  )
}