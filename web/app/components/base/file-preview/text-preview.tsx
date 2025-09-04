'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Loading from '@/app/components/base/loading'

interface TextPreviewProps {
  binaryData?: ArrayBuffer | null
  previewUrl?: string
  fileName: string
}

const TextPreview: React.FC<TextPreviewProps> = ({
  binaryData,
  previewUrl,
  fileName
}) => {
  const { t } = useTranslation()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadTextContent = async () => {
      setLoading(true)
      setError('')

      try {
        let textContent = ''

        if (binaryData) {
          // 从二进制数据读取文本
          const decoder = new TextDecoder('utf-8')
          textContent = decoder.decode(binaryData)
        } else if (previewUrl) {
          // 从URL获取文本内容
          const response = await fetch(previewUrl)
          if (!response.ok) {
            throw new Error('Failed to fetch text content')
          }
          textContent = await response.text()
        }

        setContent(textContent)
      } catch (err) {
        console.error('Failed to load text content:', err)
        setError(t('filePreview.textLoadError'))
      } finally {
        setLoading(false)
      }
    }

    loadTextContent()
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
        <pre className="whitespace-pre-wrap font-mono text-sm text-text-primary leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  )
}

export default TextPreview 