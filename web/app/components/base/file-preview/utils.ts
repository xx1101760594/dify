import { FileAppearanceTypeEnum } from '@/app/components/base/file-uploader/types'

export const getFileType = (fileName: string, mimeType?: string): keyof typeof FileAppearanceTypeEnum => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  // 根据文件扩展名判断类型
  switch (extension) {
    case 'pdf':
      return FileAppearanceTypeEnum.pdf
    
    case 'md':
    case 'markdown':
    case 'mdx':
      return FileAppearanceTypeEnum.markdown
    
    case 'doc':
    case 'docx':
      return FileAppearanceTypeEnum.word
    
    case 'xls':
    case 'xlsx':
    case 'csv':
      return FileAppearanceTypeEnum.excel
    
    case 'ppt':
    case 'pptx':
      return FileAppearanceTypeEnum.ppt
    
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'svg':
      return FileAppearanceTypeEnum.image
    
    case 'mp4':
    case 'mov':
    case 'mpeg':
    case 'webm':
    case 'avi':
      return FileAppearanceTypeEnum.video
    
    case 'mp3':
    case 'm4a':
    case 'wav':
    case 'amr':
    case 'mpga':
      return FileAppearanceTypeEnum.audio
    
    case 'txt':
    case 'rtf':
    case 'html':
    case 'htm':
    case 'xml':
    case 'json':
    case 'yaml':
    case 'yml':
      return FileAppearanceTypeEnum.document
    
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'vue':
    case 'py':
    case 'java':
    case 'cpp':
    case 'c':
    case 'cs':
    case 'php':
    case 'rb':
    case 'go':
    case 'rs':
    case 'swift':
    case 'kt':
    case 'scala':
    case 'sh':
    case 'bash':
    case 'sql':
    case 'css':
    case 'scss':
    case 'less':
    case 'sass':
      return FileAppearanceTypeEnum.code
    
    default:
      // 根据MIME类型判断
      if (mimeType) {
        if (mimeType.startsWith('image/')) {
          return FileAppearanceTypeEnum.image
        }
        if (mimeType.startsWith('video/')) {
          return FileAppearanceTypeEnum.video
        }
        if (mimeType.startsWith('audio/')) {
          return FileAppearanceTypeEnum.audio
        }
        if (mimeType.includes('pdf')) {
          return FileAppearanceTypeEnum.pdf
        }
        if (mimeType.includes('word') || mimeType.includes('document')) {
          return FileAppearanceTypeEnum.word
        }
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
          return FileAppearanceTypeEnum.excel
        }
        if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
          return FileAppearanceTypeEnum.ppt
        }
        if (mimeType.startsWith('text/')) {
          return FileAppearanceTypeEnum.document
        }
      }
      
      return FileAppearanceTypeEnum.document
  }
}

export const isPreviewable = (fileName: string, mimeType?: string): boolean => {
  const fileType = getFileType(fileName, mimeType)
  const previewableTypes = [
    FileAppearanceTypeEnum.pdf,
    FileAppearanceTypeEnum.markdown,
    FileAppearanceTypeEnum.word,
    FileAppearanceTypeEnum.excel,
    FileAppearanceTypeEnum.image,
    FileAppearanceTypeEnum.document,
    FileAppearanceTypeEnum.code
  ]
  
  return previewableTypes.includes(fileType as any)
} 