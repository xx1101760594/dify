'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import RetrievalParamConfig from '../retrieval-param-config'
import { OptionCard } from '../../create/step-two/option-card'
import Effect from '../../create/assets/option-card-effect-purple.svg'
import { retrievalIcon } from '../../create/icons'
import type { RetrievalConfig } from '@/types/app'
import { RETRIEVE_METHOD } from '@/types/app'
import { useProviderContext } from '@/context/provider-context'
import { useModelListAndDefaultModelAndCurrentProviderAndModel } from '@/app/components/header/account-setting/model-provider-page/hooks'
import { ModelTypeEnum } from '@/app/components/header/account-setting/model-provider-page/declarations'
import {
  DEFAULT_WEIGHTED_SCORE,
  RerankingModeEnum,
  WeightedScoreEnum,
} from '@/models/datasets'
import Badge from '@/app/components/base/badge'

type Props = {
  disabled?: boolean
  value: RetrievalConfig
  onChange: (value: RetrievalConfig) => void
}

const RetrievalMethodConfig: FC<Props> = ({
  disabled = false,
  value,
  onChange,
}) => {
  const { t } = useTranslation()
  const { supportRetrievalMethods } = useProviderContext()
  const {
    defaultModel: rerankDefaultModel,
    currentModel: isRerankDefaultModelValid,
  } = useModelListAndDefaultModelAndCurrentProviderAndModel(ModelTypeEnum.rerank)

  // 获取当前选中的检索方法列表
  const getSelectedMethods = useCallback(() => {
    const methods: string[] = []
    if (value.search_method === RETRIEVE_METHOD.semantic) {
      methods.push(RETRIEVE_METHOD.semantic)
    }
    if (value.search_method === RETRIEVE_METHOD.fullText) {
      methods.push(RETRIEVE_METHOD.fullText)
    }
    if (value.search_method === RETRIEVE_METHOD.pprSearch) {
      methods.push(RETRIEVE_METHOD.pprSearch)
    }
    if (value.search_method === RETRIEVE_METHOD.semanticAndFullText) {
      methods.push(RETRIEVE_METHOD.semantic)
      methods.push(RETRIEVE_METHOD.fullText)
    }
    if (value.search_method === RETRIEVE_METHOD.semanticAndPprSearch) {
      methods.push(RETRIEVE_METHOD.semantic)
      methods.push(RETRIEVE_METHOD.pprSearch)
    }
    if (value.search_method === RETRIEVE_METHOD.fullTextAndPprSearch) {
      methods.push(RETRIEVE_METHOD.fullText)
      methods.push(RETRIEVE_METHOD.pprSearch)
    }
    if (value.search_method === RETRIEVE_METHOD.allHybrid) {
      methods.push(RETRIEVE_METHOD.semantic)
      methods.push(RETRIEVE_METHOD.fullText)
      methods.push(RETRIEVE_METHOD.pprSearch)
    }
    return methods
  }, [value.search_method, value.selected_methods])

  const selectedMethods = getSelectedMethods()

  const onToggleMethod = useCallback((retrieveMethod: RETRIEVE_METHOD) => {
    const currentMethods = getSelectedMethods()
    let newMethods: string[] = []
    
    if (currentMethods.includes(retrieveMethod)) {
      newMethods = currentMethods.filter(method => method !== retrieveMethod)
    } else {
      newMethods = [...currentMethods, retrieveMethod]
    }

    // 如果没有选中任何方法，默认选择第一个支持的方法
    if (newMethods.length === 0) {
      if (supportRetrievalMethods.includes(RETRIEVE_METHOD.semantic)) {
        newMethods = [RETRIEVE_METHOD.semantic]
      } else if (supportRetrievalMethods.includes(RETRIEVE_METHOD.fullText)) {
        newMethods = [RETRIEVE_METHOD.fullText]
      } else if (supportRetrievalMethods.includes(RETRIEVE_METHOD.pprSearch)) {
        newMethods = [RETRIEVE_METHOD.pprSearch]
      }
    }

    // 根据选中的方法更新配置
    const primaryMethod = newMethods[0] // 使用第一个方法作为主要方法
    const isMultiSelect = newMethods.length > 1

    let searchMethod: string = ''
    if(newMethods.length > 1) { //多选
      if(newMethods.includes(RETRIEVE_METHOD.semantic) && newMethods.includes(RETRIEVE_METHOD.fullText) && newMethods.includes(RETRIEVE_METHOD.pprSearch)) {
        searchMethod = RETRIEVE_METHOD.allHybrid
      } else if(newMethods.includes(RETRIEVE_METHOD.semantic) && newMethods.includes(RETRIEVE_METHOD.fullText)){
        searchMethod = RETRIEVE_METHOD.semanticAndFullText
      } else if(newMethods.includes(RETRIEVE_METHOD.semantic) && newMethods.includes(RETRIEVE_METHOD.pprSearch)){
        searchMethod = RETRIEVE_METHOD.semanticAndPprSearch
      } else if(newMethods.includes(RETRIEVE_METHOD.fullText) && newMethods.includes(RETRIEVE_METHOD.pprSearch)){
        searchMethod = RETRIEVE_METHOD.fullTextAndPprSearch
      }
    } else {
      searchMethod = primaryMethod
    }

    if ([RETRIEVE_METHOD.semantic, RETRIEVE_METHOD.fullText, RETRIEVE_METHOD.pprSearch].includes(primaryMethod as RETRIEVE_METHOD)) {
      onChange({
        ...value,
        // hybrid_search_with_graph: false,
        search_method: searchMethod as RETRIEVE_METHOD,
        selected_methods: isMultiSelect ? newMethods : undefined,
        ...(!value.reranking_model.reranking_model_name
          ? {
            reranking_model: {
              reranking_provider_name: isRerankDefaultModelValid ? rerankDefaultModel?.provider?.provider ?? '' : '',
              reranking_model_name: isRerankDefaultModelValid ? rerankDefaultModel?.model ?? '' : '',
            },
            reranking_enable: !!isRerankDefaultModelValid,
          }
          : {
            reranking_enable: true,
          }),
      })
    }
  }, [value, rerankDefaultModel, isRerankDefaultModelValid, onChange, supportRetrievalMethods, getSelectedMethods])


  return (
    <div className='space-y-2'>
      {supportRetrievalMethods.includes(RETRIEVE_METHOD.semantic) && (
        <OptionCard 
          disabled={disabled} 
          icon={<Image className='h-4 w-4' src={retrievalIcon.vector} alt='' />}
          title={t('dataset.retrieval.semantic_search.title')}
          description={t('dataset.retrieval.semantic_search.description')}
          isActive={selectedMethods.includes(RETRIEVE_METHOD.semantic)}
          onSwitched={() => onToggleMethod(RETRIEVE_METHOD.semantic)}
          effectImg={Effect.src}
          activeHeaderClassName='bg-dataset-option-card-purple-gradient'
          showCheckbox={true}
          isCheckboxChecked={selectedMethods.includes(RETRIEVE_METHOD.semantic)}
        >
          {/* <RetrievalParamConfig
            type={RETRIEVE_METHOD.semantic}
            value={value}
            onChange={onChange}
          /> */}
        </OptionCard>
      )}
      {supportRetrievalMethods.includes(RETRIEVE_METHOD.fullText) && (
        <OptionCard 
          disabled={disabled} 
          icon={<Image className='h-4 w-4' src={retrievalIcon.fullText} alt='' />}
          title={t('dataset.retrieval.full_text_search.title')}
          description={t('dataset.retrieval.full_text_search.description')}
          isActive={selectedMethods.includes(RETRIEVE_METHOD.fullText)}
          onSwitched={() => onToggleMethod(RETRIEVE_METHOD.fullText)}
          effectImg={Effect.src}
          activeHeaderClassName='bg-dataset-option-card-purple-gradient'
          showCheckbox={true}
          isCheckboxChecked={selectedMethods.includes(RETRIEVE_METHOD.fullText)}
        >
          {/* <RetrievalParamConfig
            type={RETRIEVE_METHOD.fullText}
            value={value}
            onChange={onChange}
          /> */}
        </OptionCard>
      )}
      {supportRetrievalMethods.includes(RETRIEVE_METHOD.pprSearch) && (
        <OptionCard 
          disabled={disabled} 
          icon={<Image className='h-4 w-4' src={retrievalIcon.pprSearch} alt='' />}
          title={t('dataset.retrieval.ppr_search.title')}
          description={t('dataset.retrieval.ppr_search.description')}
          isActive={selectedMethods.includes(RETRIEVE_METHOD.pprSearch)}
          onSwitched={() => onToggleMethod(RETRIEVE_METHOD.pprSearch)}
          effectImg={Effect.src}
          activeHeaderClassName='bg-dataset-option-card-purple-gradient'
          showCheckbox={true}
          isCheckboxChecked={selectedMethods.includes(RETRIEVE_METHOD.pprSearch)}
        >
          {/* <RetrievalParamConfig
            type={RETRIEVE_METHOD.pprSearch}
            value={value}
            onChange={onChange}
          /> */}
        </OptionCard>
      )}
      <RetrievalParamConfig
        type={RETRIEVE_METHOD.pprSearch}
        value={value}
        onChange={onChange}
      />
      {/* {(supportRetrievalMethods.includes(RETRIEVE_METHOD.hybrid) || supportRetrievalMethods.includes(RETRIEVE_METHOD.hybridAndGraph)) && (
        <OptionCard 
          disabled={disabled} 
          icon={<Image className='h-4 w-4' src={retrievalIcon.hybrid} alt='' />}
          title={
            <div className='flex items-center space-x-1'>
              <div>{t('dataset.retrieval.hybrid_search.title')}</div>
              <Badge text={t('dataset.retrieval.hybrid_search.recommend')!} className='ml-1 h-[18px] border-text-accent-secondary text-text-accent-secondary' uppercase />
            </div>
          }
          description={t('dataset.retrieval.hybrid_search.description')} 
          isActive={selectedMethods.includes(RETRIEVE_METHOD.hybrid)}
          onSwitched={() => onToggleMethod(RETRIEVE_METHOD.hybrid)}
          effectImg={Effect.src}
          activeHeaderClassName='bg-dataset-option-card-purple-gradient'
          showCheckbox={true}
          isCheckboxChecked={selectedMethods.includes(RETRIEVE_METHOD.hybrid)}
        >
          <RetrievalParamConfig
            type={value.search_method}
            value={value}
            onChange={onChange}
          />
        </OptionCard>
      )} */}
    </div>
  )
}
export default React.memo(RetrievalMethodConfig)
