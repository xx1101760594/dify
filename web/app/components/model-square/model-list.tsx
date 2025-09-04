'use client'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffect, useState,useRef } from 'react'
import {
  RiArrowRightSLine,
  RiInformation2Fill,
  RiLoader2Line,
} from '@remixicon/react'
import type {
  CustomConfigurationModelFixedFields,
  ModelItem,
  ModelProvider,
} from '@/app/components/header/account-setting/model-provider-page/declarations'
import { ConfigurationMethodEnum } from '@/app/components/header/account-setting/model-provider-page/declarations'

import {
  useDefaultModel,
  useModelModalHandler,
} from '@/app/components/header/account-setting/model-provider-page/hooks'
import { fetchModelProviderModelList } from '@/service/common'
import { useModalContextSelector } from '@/context/modal-context'
import { provider } from './provider'
import NewCard from './newCard'
import ModelCard from './card'
import { useEventEmitterContextContext } from '@/context/event-emitter'
import Input from '@/app/components/base/input'
import { useDebounceFn } from 'ahooks'


const ModelListPage = () => {
  const { t } = useTranslation()

  const { eventEmitter } = useEventEmitterContextContext()
  const handleOpenModal = useModelModalHandler()
  const [loading, setLoading] = useState(false)
  const [keywords, setKeywords] = useState('')
  const [modelList, setModelList] = useState<any>([])

  const getModelList = async () => {
    if (loading)
      return
    try {
      setLoading(true)
      // const modelsData = await fetchModelProviderModelList(`/workspaces/current/model-providers/langgenius/openai_api_compatible/openai_api_compatible/models`)
      const modelsData = await fetchModelProviderModelList({url: `/workspaces/current/openai-compatible-models`, params: {model: keywords} })
      setModelList(modelsData.data)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getModelList()
  }, [])

  eventEmitter?.useSubscription((v: any) => {
    if (v?.type === 'UPDATE_MODEL_PROVIDER_CUSTOM_MODEL_LIST')
      getModelList()
  })
  
  const setShowModelLoadBalancingModal = useModalContextSelector(state => state.setShowModelLoadBalancingModal)
  const onModifyLoadBalancing = useCallback((model: ModelItem) => {
    setShowModelLoadBalancingModal({
      provider,
      model: model!,
      open: !!model,
      onClose: () => setShowModelLoadBalancingModal(null),
      onSave: getModelList,
    })
  }, [getModelList, provider, setShowModelLoadBalancingModal])

  const onConfig = (field: any) => {
    handleOpenModal(provider, ConfigurationMethodEnum.customizableModel,field)
  }

  const onSuccess = () => {
    getModelList()
  }
  const { run: handleSearch } = useDebounceFn(() => {
    getModelList()
  }, { wait: 500 })
  const handleKeywordsChange = (val: string) => {
    setKeywords(val)
    handleSearch()
  }

  
  
  return (
    <>
    <div className='sticky top-0 z-10 flex flex-wrap items-center justify-between gap-y-2 bg-background-body px-12 py-6'>
      <NewCard onOpenModal={() => handleOpenModal(provider, ConfigurationMethodEnum.customizableModel)}></NewCard>
      {/* <div className='flex items-center gap-2'>
        <Input
          showLeftIcon
          showClearIcon
          wrapperClassName='w-[200px]'
          value={keywords}
          onChange={e => handleKeywordsChange(e.target.value)}
          onClear={() => handleKeywordsChange('')}
        />
      </div> */}
    </div>
      <div className='relative grid grow grid-cols-1 content-start gap-8 px-12 pb-5 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6'>
      {
        modelList.map((model:any) => (
          <ModelCard
            key={model.model}
            {...{
              model,
              provider,
              onModifyLoadBalancing,
              onConfig,
              onSuccess
            }}
          />
        ))
      }
      </div>
    </>
    
  )
}

export default ModelListPage
