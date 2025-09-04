'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Loading from '@/app/components/base/loading'

interface ExcelPreviewProps {
  binaryData?: ArrayBuffer | null
  previewUrl?: string
  fileName: string
}

interface SheetData {
  name: string
  data: any[][]
}

const ExcelPreview: React.FC<ExcelPreviewProps> = ({
  binaryData,
  previewUrl,
  fileName
}) => {
  const { t } = useTranslation()
  const [sheets, setSheets] = useState<SheetData[]>([])
  const [activeSheet, setActiveSheet] = useState<string>('')
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

        // 动态导入SheetJS库
        const XLSX = await import('xlsx')
        
        // 读取Excel文件
        const workbook = XLSX.read(data, { type: 'array' })
        
        // 提取所有工作表数据
        const sheetData: SheetData[] = []
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          sheetData.push({
            name: sheetName,
            data: jsonData as any[][]
          })
        })
        
        setSheets(sheetData)
        if (sheetData.length > 0) {
          setActiveSheet(sheetData[0].name)
        }
      } catch (err) {
        console.error('Failed to load excel file:', err)
        setError(t('filePreview.excelLoadError'))
      } finally {
        setLoading(false)
      }
    }

    loadExcelContent()
  }, [binaryData, previewUrl, t])

  const getCellValue = (cell: any): string => {
    if (cell === null || cell === undefined) return ''
    if (typeof cell === 'object' && cell.t) {
      // 处理特殊单元格类型
      return cell.v?.toString() || ''
    }
    return cell.toString()
  }

  const renderTable = (sheetData: SheetData) => {
    if (!sheetData.data || sheetData.data.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          {t('filePreview.emptySheet')}
        </div>
      )
    }

    // 找到最大列数
    const maxCols = Math.max(...sheetData.data.map(row => row.length))
    
    return (
      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <tbody>
            {sheetData.data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {Array.from({ length: maxCols }, (_, colIndex) => {
                  const cell = row[colIndex]
                  return (
                    <td 
                      key={colIndex} 
                      className="border border-gray-300 px-3 py-2 text-sm"
                      style={{ 
                        minWidth: '100px',
                        maxWidth: '300px',
                        wordBreak: 'break-word'
                      }}
                    >
                      {getCellValue(cell)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

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

  if (sheets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-tertiary">
        {t('filePreview.noData')}
      </div>
    )
  }

  const currentSheet = sheets.find(sheet => sheet.name === activeSheet)

  return (
    <div className="h-full flex flex-col">
      {/* 工作表标签 */}
      {sheets.length > 1 && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-1 p-2">
            {sheets.map(sheet => (
              <button
                key={sheet.name}
                onClick={() => setActiveSheet(sheet.name)}
                className={`px-3 py-1 text-sm rounded ${
                  activeSheet === sheet.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {sheet.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 表格内容 */}
      <div className="flex-1 overflow-auto p-4">
        {currentSheet && renderTable(currentSheet)}
      </div>
    </div>
  )
}

export default ExcelPreview 