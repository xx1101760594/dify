'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import Loading from '@/app/components/base/loading'

interface MarkdownPreviewProps {
  binaryData?: ArrayBuffer | null
  previewUrl?: string
  fileName: string
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  binaryData,
  previewUrl,
  fileName
}) => {
  const { t } = useTranslation()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadMarkdownContent = async () => {
      setLoading(true)
      setError('')

      try {
        let markdownContent = ''

        if (binaryData) {
          // 从二进制数据读取Markdown内容
          const decoder = new TextDecoder('utf-8')
          markdownContent = decoder.decode(binaryData)
        } else if (previewUrl) {
          // 从URL获取Markdown内容
          const response = await fetch(previewUrl)
          if (!response.ok) {
            throw new Error('Failed to fetch markdown content')
          }
          markdownContent = await response.text()
        }

        setContent(markdownContent)
      } catch (err) {
        console.error('Failed to load markdown content:', err)
        setError(t('filePreview.markdownLoadError'))
      } finally {
        setLoading(false)
      }
    }

    loadMarkdownContent()
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
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // 自定义代码块样式
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                )
              },
              // 自定义表格样式
              table: ({ children }) => (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 px-4 py-2">
                  {children}
                </td>
              ),
              // 自定义链接样式
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {children}
                </a>
              ),
              // 自定义图片样式
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default MarkdownPreview 