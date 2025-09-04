'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Loading from '@/app/components/base/loading'

interface ImagePreviewProps {
  binaryData?: ArrayBuffer | null
  previewUrl?: string
  fileName: string
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  binaryData,
  previewUrl,
  fileName
}) => {
  const { t } = useTranslation()
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadImage = async () => {
      setLoading(true)
      setError('')

      try {
        if (binaryData) {
          // 从二进制数据创建Blob URL
          const blob = new Blob([binaryData])
          const url = URL.createObjectURL(blob)
          setImageUrl(url)
        } else if (previewUrl) {
          setImageUrl(previewUrl)
        } else {
          throw new Error('No image data provided')
        }
      } catch (err) {
        console.error('Failed to load image:', err)
        setError(t('filePreview.imageLoadError'))
      } finally {
        setLoading(false)
      }
    }

    loadImage()

    // 清理函数
    return () => {
      if (binaryData && imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [binaryData, previewUrl, t])

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

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center justify-center h-full">
          <img
            src={imageUrl}
            alt={fileName}
            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            onError={() => {
              setError(t('filePreview.imageLoadError'))
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ImagePreview 