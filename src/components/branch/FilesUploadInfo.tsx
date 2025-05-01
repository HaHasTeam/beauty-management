interface FileUploadInfoProps {
  icon: React.ReactNode
  label: string
  files?: number
  filesText?: string // Add this new prop
}

const FileUploadInfo: React.FC<FileUploadInfoProps> = ({ icon, label, files, filesText }) => (
  <div className='flex items-center space-x-3 bg-background p-3 rounded-lg shadow'>
    <div className='bg-muted p-2 rounded-full'>{icon}</div>
    <div>
      <span className='text-sm font-medium text-muted-foreground'>{label}</span>
      <p className='text-foreground font-semibold'>
        {files && files > 0 ? filesText || `${files} file(s) uploaded` : 'No files uploaded'}
      </p>
    </div>
  </div>
)

export default FileUploadInfo
