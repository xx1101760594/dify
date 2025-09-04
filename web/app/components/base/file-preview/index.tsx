'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { createPortal } from 'react-dom'
import Loading from '@/app/components/base/loading'
import FileTypeIcon from '@/app/components/base/file-uploader/file-type-icon'
import { FileAppearanceTypeEnum } from '@/app/components/base/file-uploader/types'
import PdfPreview from '@/app/components/base/file-uploader/dynamic-pdf-preview'
import TextPreview from './text-preview'
import MarkdownPreview from './markdown-preview'
import WordPreview from './word-preview'
import ExcelPreview from './excel-preview'
import ImagePreview from './image-preview'
import { getFileType } from './utils'

export type FilePreviewProps = {
  file: {
    name: string
    url?: string
    binaryData?: ArrayBuffer
    type?: string
    size?: number
  }
  isShow: boolean
  onClose: () => void
  highlightsData?: any[]
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  isShow,
  onClose,
  highlightsData = []
}) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [binaryData, setBinaryData] = useState<ArrayBuffer | null>(null)

  const fileType = getFileType(file.name, file.type)

  // 获取文件数据
  const fetchFileData = useCallback(async () => {
    if (!file.url && !file.binaryData) return

    setLoading(true)
    setError('')

    try {
      if (file.binaryData) {
        setBinaryData(file.binaryData)
        setPreviewUrl('')
      } else if (file.url) {
        const response = await fetch(file.url)
        if (!response.ok) {
          throw new Error('Failed to fetch file')
        }
        
        const data = await response.arrayBuffer()
        setBinaryData(data)
        setPreviewUrl(file.url)
      }
    } catch (err) {
      console.error('Failed to fetch file:', err)
      setError(t('datasetDocuments.list.preview.fetchError'))
    } finally {
      setLoading(false)
    }
  }, [file.url, file.binaryData, t])

  useEffect(() => {
    if (isShow) {
      fetchFileData()
    }
  }, [isShow, fetchFileData])

  // 渲染预览内容
  const renderPreviewContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loading type="area" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64 text-text-tertiary">
          {error}
        </div>
      )
    }

    if (!binaryData && !previewUrl) {
      return (
        <div className="flex items-center justify-center h-64 text-text-tertiary">
          {t('datasetDocuments.list.preview.noPreview')}
        </div>
      )
    }

    // 根据文件类型渲染不同的预览组件
    switch (fileType) {
      case FileAppearanceTypeEnum.pdf:
        return (
          // <PdfPreview
          //   url={previewUrl}
          //   onCancel={onClose}
          //   highlightsData={highlightsData}
          // />
          <iframe 
            src={previewUrl}
            style={{width: '100%',height: '100%'}}
          ></iframe>
        )
      
      case FileAppearanceTypeEnum.markdown:
        return (
          <MarkdownPreview
            binaryData={binaryData}
            previewUrl={previewUrl}
            fileName={file.name}
          />
        )
      
      case FileAppearanceTypeEnum.word:
        return (
          <WordPreview
            binaryData={binaryData}
            previewUrl={previewUrl}
            fileName={file.name}
          />
        )
      
      case FileAppearanceTypeEnum.excel:
        return (
          <ExcelPreview
            binaryData={binaryData}
            previewUrl={previewUrl}
            fileName={file.name}
          />
        )
      
      case FileAppearanceTypeEnum.image:
        return (
          <ImagePreview
            binaryData={binaryData}
            previewUrl={previewUrl}
            fileName={file.name}
          />
        )
      
      case FileAppearanceTypeEnum.document:
        return (
          <TextPreview
            binaryData={binaryData}
            previewUrl={previewUrl}
            fileName={file.name}
          />
        )
      
      default:
        return (
          <div className="flex items-center justify-center h-64 text-text-tertiary">
            {t('datasetDocuments.list.preview.unsupportedFileType')}
          </div>
        )
    }
  }

  if (!isShow) return null

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-8">
      <div className="relative flex flex-col w-full h-full max-w-[100vw] max-h-[90vh] bg-white rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-divider-subtle bg-white">
          <div className="flex items-center flex-1 min-w-0">
            <FileTypeIcon
              type={fileType}
              size="md"
              className="mr-3"
            />
            <span className="truncate text-sm font-medium text-text-primary">
              {file.name}
            </span>
            {file.size && (
              <span className="ml-2 text-xs text-text-tertiary">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto min-h-[0px]">
          {renderPreviewContent()}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default FilePreview 