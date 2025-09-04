'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Loading from '@/app/components/base/loading'

interface ExcelPreviewProps {
  binaryData?: ArrayBuffer | null
  previewUrl?: string
  fileName: string
}

const ExcelPreview: React.FC<ExcelPreviewProps> = ({
  binaryData,
  previewUrl,
  fileName
}) => {
  const { t } = useTranslation()
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadExcelContent = async () => {
      setLoading(true)
      setError('')

      try {
        let data: ArrayBuffer

        if (binaryData) {
          data = binaryData
        } else if (previewUrl) {
          const response = await fetch(previewUrl)
          if (!response.ok) {
            throw new Error('Failed to fetch excel file')
          }
          data = await response.arrayBuffer()
        } else {
          throw new Error('No data provided')
        }

        // 动态导入docx-preview库
        const { renderAsync } = await import('docx-preview')
        
        // 获取渲染后的HTML内容
        const container = document.createElement('div')
        await renderAsync(data, container, undefined, {
          className: 'excel-preview'
        })
        
        setHtmlContent(container.innerHTML)
      } catch (err) {
        console.error('Failed to load excel file:', err)
        setError(t('filePreview.excelLoadError'))
      } finally {
        setLoading(false)
      }
    }

    loadExcelContent()
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
      <div className="flex-1 overflow-auto p-6">
        <div 
          className="excel-preview"
          dangerouslySetInnerHTML={{ 
            __html: htmlContent 
          }}
          style={{
            // 自定义Excel样式
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px'
          }}
        />
      </div>
    </div>
  )
}

export default ExcelPreview 