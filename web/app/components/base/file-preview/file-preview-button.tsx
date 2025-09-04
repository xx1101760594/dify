'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiEyeLine } from '@remixicon/react'
import FilePreview from './index'
import { isPreviewable } from './utils'
import cn from '@/utils/classnames'

interface FilePreviewButtonProps {
  file: {
    name: string
    url?: string
    binaryData?: ArrayBuffer
    type?: string
    size?: number
  }
  highlightsData?: any[]
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'button' | 'icon' | 'text'
  children?: React.ReactNode
}

const FilePreviewButton: React.FC<FilePreviewButtonProps> = ({
  file,
  highlightsData = [],
  className,
  size = 'md',
  variant = 'button',
  children
}) => {
  const { t } = useTranslation()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const canPreview = isPreviewable(file.name, file.type)

  if (!canPreview) {
    return null
  }

  const handlePreview = () => {
    setIsPreviewOpen(true)
  }

  const handleClose = () => {
    setIsPreviewOpen(false)
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const renderButton = () => {
    switch (variant) {
      case 'icon':
        return (
          <button
            onClick={handlePreview}
            className={cn(
              'flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors',
              sizeClasses[size],
              className
            )}
            title={t('filePreview.preview')}
          >
            <RiEyeLine className="w-4 h-4 text-gray-500" />
          </button>
        )
      
      case 'text':
        return (
          <button
            onClick={handlePreview}
            className={cn(
              'text-blue-600 hover:text-blue-800 underline text-sm',
              className
            )}
          >
            {children || t('filePreview.preview')}
          </button>
        )
      
      default:
        return (
          <button
            onClick={handlePreview}
            className={cn(
              'flex items-center justify-center px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm',
              className
            )}
          >
            <RiEyeLine className="w-4 h-4 mr-2" />
            {children || t('filePreview.preview')}
          </button>
        )
    }
  }

  return (
    <>
      {renderButton()}
      
      <FilePreview
        file={file}
        isShow={isPreviewOpen}
        onClose={handleClose}
        highlightsData={highlightsData}
      />
    </>
  )
}

export default FilePreviewButton 