'use client'
import React, { useCallback, useEffect, useState } from 'react'
import type { Plugin } from '../types'
import Icon from '../card/base/card-icon'
import CornerMark from './base/corner-mark'
import Title from './base/title'
import OrgInfo from './base/org-info'
import Description from './base/description'
import Placeholder from './base/placeholder'
import cn from '@/utils/classnames'
import { useGetLanguage } from '@/context/i18n'
import { getLanguage } from '@/i18n-config/language'
import { useSingleCategories } from '../hooks'
import { renderI18nObject } from '@/i18n-config'
import { useMixedTranslation } from '@/app/components/plugins/marketplace/hooks'
import Partner from '../base/badges/partner'
import Verified from '../base/badges/verified'
import type { HtmlContentProps } from '@/app/components/base/popover'
import CustomPopover from '@/app/components/base/popover'
import { RiMoreFill } from '@remixicon/react'
import Toast from '@/app/components/base/toast'
import Drawer from '@/app/components/base/drawer'
import Divider from '@/app/components/base/divider'
import {
  deleteWorkflowTool,
  fetchBuiltInToolList,
  fetchCustomCollection,
  fetchCustomToolList,
  fetchModelToolList,
  fetchWorkflowToolDetail,
  removeBuiltInToolCredential,
  removeCustomCollection,
  saveWorkflowToolProvider,
  updateBuiltInToolCredential,
  updateCustomCollection,
} from '@/service/tools'
import { useInvalidateAllWorkflowTools } from '@/service/use-tools'
import { basePath } from '@/utils/var'
import Confirm from '@/app/components/base/confirm'
import EditCustomToolModal from '@/app/components/tools/edit-custom-collection-modal'
import WorkflowToolModal from '@/app/components/tools/workflow-tool'

export type Props = {
  className?: string
  payload: Plugin & any
  titleLeft?: React.ReactNode
  installed?: boolean
  installFailed?: boolean
  hideCornerMark?: boolean
  descriptionLineRows?: number
  footer?: React.ReactNode
  isLoading?: boolean
  loadingFileName?: string
  locale?: string
  onRefreshData: () => void
}

const Card = ({
  className,
  payload,
  titleLeft,
  installed,
  installFailed,
  hideCornerMark,
  descriptionLineRows = 2,
  footer,
  isLoading = false,
  loadingFileName,
  locale: localeFromProps,
  onRefreshData
}: Props) => {
  const defaultLocale = useGetLanguage()
  const locale = localeFromProps ? getLanguage(localeFromProps) : defaultLocale
  const { t } = useMixedTranslation(localeFromProps)
  const { categoriesMap } = useSingleCategories(t)
  const { id, category, type, name, labels, org, label, brief, icon, verified, badges = [] } = payload
  const isBundle = !['plugin', 'model', 'tool', 'extension', 'agent-strategy'].includes(type)
  const cornerMark = isBundle ? categoriesMap.bundle?.label : categoriesMap[category]?.label
  const getLocalizedText = (obj: Record<string, string> | undefined) =>
    obj ? renderI18nObject(obj, locale) : ''
  const isPartner = badges.includes('partner')

  const wrapClassName = cn('hover-bg-components-panel-on-panel-item-bg relative rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-on-panel-item-bg p-4 pb-[6px] shadow-xs', className)
  if (isLoading) {
    return (
      <Placeholder
        wrapClassName={wrapClassName}
        loadingFileName={loadingFileName!}
      />
    )
  }
  // custom provider
  const invalidateAllWorkflowTools = useInvalidateAllWorkflowTools()
  const [customCollection, setCustomCollection] = useState<any>(null)
  const [isShowEditCollectionToolModal, setIsShowEditCustomCollectionModal] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deleteAction, setDeleteAction] = useState('')
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const doUpdateCustomToolCollection = async (data: any) => {
    await updateCustomCollection(data)
    onRefreshData()
    Toast.notify({
      type: 'success',
      message: t('common.api.actionSuccess'),
    })
    setIsShowEditCustomCollectionModal(false)
  }
  const doRemoveCustomToolCollection = async () => {
    await removeCustomCollection(name as string)
    onRefreshData()
    Toast.notify({
      type: 'success',
      message: t('common.api.actionSuccess'),
    })
    setIsShowEditCustomCollectionModal(false)
  }

  const getCustomProvider = useCallback(async () => {
    setIsDetailLoading(true)
    const res = await fetchCustomCollection(name)
    if (res.credentials.auth_type === 'api_key' && !res.credentials.api_key_header_prefix) {
      if (res.credentials.api_key_value)
        res.credentials.api_key_header_prefix = 'custom' as any
    }
    setCustomCollection({
      ...res,
      labels: labels,
      provider: name,
    })
    setIsDetailLoading(false)
  }, [labels, name])

  const [isShowEditWorkflowToolModal, setIsShowEditWorkflowToolModal] = useState(false)
  const updateWorkflowToolProvider = async (data: any & Partial<{
    workflow_app_id: string
    workflow_tool_id: string
  }>) => {
    await saveWorkflowToolProvider(data)
    invalidateAllWorkflowTools()
    onRefreshData()
    getWorkflowToolProvider()
    Toast.notify({
      type: 'success',
      message: t('common.api.actionSuccess'),
    })
    setIsShowEditWorkflowToolModal(false)
  }

  const getWorkflowToolProvider = useCallback(async () => {
    setIsDetailLoading(true)
    const res = await fetchWorkflowToolDetail(id)
    const payload = {
      ...res,
      parameters: res.tool?.parameters.map((item) => {
        return {
          name: item.name,
          description: item.llm_description,
          form: item.form,
          required: item.required,
          type: item.type,
        }
      }) || [],
      labels: res.tool?.labels || [],
    }
    setCustomCollection(payload)
    setIsDetailLoading(false)
  }, [id])

  const removeWorkflowToolProvider = async () => {
    await deleteWorkflowTool(id)
    onRefreshData()
    Toast.notify({
      type: 'success',
      message: t('common.api.actionSuccess'),
    })
    setIsShowEditWorkflowToolModal(false)
  }

  const onClickCustomToolDelete = () => {
    setDeleteAction('customTool')
    setShowConfirmDelete(true)
  }
  const onClickWorkflowToolDelete = () => {
    setDeleteAction('workflowTool')
    setShowConfirmDelete(true)
  }
  const handleConfirmDelete = () => {
    if (deleteAction === 'customTool')
      doRemoveCustomToolCollection()

    else if (deleteAction === 'workflowTool')
      removeWorkflowToolProvider()

    setShowConfirmDelete(false)
  }

  useEffect(() => {
    if (type === 'api')
      getCustomProvider()
    if (type === 'workflow')
      getWorkflowToolProvider()

  }, [name, type, getCustomProvider, getWorkflowToolProvider])

  const Operations = (props: HtmlContentProps) => {
    const onMouseLeave = async () => {
      props.onClose?.()
    }
    const onClickRename = async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      props.onClick?.()
      e.preventDefault()
      if (type === 'workflow') {
        setIsShowEditWorkflowToolModal(true)
      } else {
        setIsShowEditCustomCollectionModal(true)
      }
    }
    const onClickOpen = async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      props.onClick?.()
      e.preventDefault()
      window.open(`${basePath}/app/${(customCollection).workflow_app_id}/workflow`)
    }
    return (
      <div className="relative w-full py-1" onMouseLeave={onMouseLeave}>
        <div className='mx-1 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 py-[6px] hover:bg-state-base-hover' onClick={onClickRename}>
          <span className='text-sm text-text-secondary'>{t('tools.createTool.editAction')}</span>
        </div>
        {type as string === 'workflow' && (
          <>
            <Divider className="!my-1" />
            <div
              className='group mx-1 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 py-[6px] hover:bg-state-destructive-hover'
              onClick={onClickOpen}
            >
              <span className={cn('text-sm text-text-secondary', 'group-hover:text-text-destructive')}>
                {t('tools.openInStudio')}
              </span>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={wrapClassName}>
      <div className={cn('p-4 pb-3', limitedInstall && 'pb-1')}>
        {!hideCornerMark && <CornerMark text={cornerMark} />}
        {/* Header */}
        <div className="flex">
          <Icon src={icon} installed={installed} installFailed={installFailed} />
          <div className="ml-3 w-0 grow">
            <div className="flex h-5 items-center">
              <Title title={getLocalizedText(label)} />
              {isPartner && <Partner className='ml-0.5 h-4 w-4' text={t('plugin.marketplace.partnerTip')} />}
              {verified && <Verified className='ml-0.5 h-4 w-4' text={t('plugin.marketplace.verifiedTip')} />}
              {titleLeft} {/* This can be version badge */}
            </div>
            <OrgInfo
              className="mt-0.5"
              orgName={org}
              packageName={name}
            />
          </div>
        </div>
        <Description
          className="mt-3"
          text={getLocalizedText(brief)}
          descriptionLineRows={descriptionLineRows}
        />
        {footer && <div>{footer}</div>}
      </div>
      <Description
        className="mt-3"
        text={getLocalizedText(brief)}
        descriptionLineRows={descriptionLineRows}
      />
      <div className={cn(
        'h-[40px] shrink-0 items-center flex justify-between -mr-[10px]',
      )}>
        {footer && <div>{footer}</div>}
        { ['api', 'workflow'].includes(type) && 
          <div className='shrink-0 flex'>
            <CustomPopover
              htmlContent={<Operations />}
              position="br"
              trigger="click"
              btnElement={
                <div
                  className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-md'
                >
                  <RiMoreFill className='h-4 w-4 text-text-secondary' />
                </div>
              }
              btnClassName={open =>
                cn(
                  open ? '!bg-black/5 !shadow-none' : '!bg-transparent',
                  'h-8 w-8 rounded-md border-none !p-2 hover:!bg-black/5',
                )
              }
              className={'!z-20 h-fit !w-[128px]'}
            />
          </div>
        }
      </div>

      {isShowEditCollectionToolModal && (
        <EditCustomToolModal
          payload={customCollection}
          onHide={() => setIsShowEditCustomCollectionModal(false)}
          onEdit={doUpdateCustomToolCollection}
          onRemove={onClickCustomToolDelete}
        />
      )}
      {isShowEditWorkflowToolModal && (
        <WorkflowToolModal
          payload={customCollection}
          onHide={() => setIsShowEditWorkflowToolModal(false)}
          onRemove={onClickWorkflowToolDelete}
          onSave={updateWorkflowToolProvider}
        />
      )}
      {showConfirmDelete && (
        <Confirm
          title={t('tools.createTool.deleteToolConfirmTitle')}
          content={t('tools.createTool.deleteToolConfirmContent')}
          isShow={showConfirmDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </div>
  )
}

export default React.memo(Card)
