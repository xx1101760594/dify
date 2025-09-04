'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDocsUrl } from '@/service/datasets'
import FilePreview from '@/app/components/base/file-preview'

type DocumentPreviewModalProps = {
  isShow: boolean
  onClose: () => void
  document: {
    id: string
    name: string
    data_source_type: string
    data_source_info?: any
  }
  datasetId: string
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isShow,
  onClose,
  document,
  datasetId,
}) => {
  const { t } = useTranslation()
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [binaryData, setBinaryData] = useState<any>(null);
  const [fileType, setFileType] = useState('');
  const [docUrl, setDocUrl] = useState<string>('')

  useEffect(() => {
    if (isShow && document?.id) {
      fetchFile()
    }
  }, [isShow, document?.id])

    // 从API获取二进制数据
  const fetchFile = async () => {
    setLoading(true);
    try {
      const response = await getDocsUrl({
        dataset_id:datasetId,
        document_id: document.id,
      })
      if (!response.ok) throw new Error('Failed to fetch file');
      // 获取二进制数据
      const data = await response.blob();
      const blobUrl = URL.createObjectURL(data);
      // setBinaryData(data);
      // 尝试从Content-Type获取文件类型
      const contentType = (response.headers.get('Content-Type') || '').split(';')[0].toLowerCase();
      setFileType(contentType)
      setDocUrl(blobUrl)
    } catch (error) {
      console.error('Error fetching file:', error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <FilePreview
      file={{
        name: document.name,
        url: docUrl,
        binaryData: binaryData,
        type: fileType,
        size: document.data_source_info?.upload_file?.size
      }}
      isShow={isShow}
      onClose={onClose}
    />
  )
}

export default DocumentPreviewModal 