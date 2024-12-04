import { cn } from '@/lib/utils'

interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: string
  className?: string
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, className = '' }) => (
  <div className={cn(className, 'flex items-center space-x-3 bg-background p-3 rounded-lg shadow')}>
    <div className='bg-muted p-2 rounded-full flex-shrink-0'>{icon}</div>
    <div className='w-[240px]'>
      <div className='text-sm font-medium text-muted-foreground'>{label}</div>

      <p className='text-foreground font-semibold break-words   sm:w-auto line-clamp-1 '>{value}</p>
    </div>
  </div>
)

export default InfoItem
