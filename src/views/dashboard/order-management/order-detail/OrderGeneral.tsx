interface OrderGeneralProps {
  title: string
  icon: React.ReactElement
  content: React.ReactElement
  status?: 'normal' | 'success' | 'warning' | 'danger'
}

const OrderGeneral = ({ title, icon, content, status = 'normal' }: OrderGeneralProps) => {
  let color = ''
  let borderColor = ''
  switch (status) {
    case 'normal': // for default
      color = 'primary'
      borderColor = 'primary/40'
      break
    case 'danger':
      color = 'red-500'
      borderColor = 'red-300'
      break
    case 'success':
      color = 'green-500'
      borderColor = 'green-300'
      break
    case 'warning':
      color = 'yellow-500'
      borderColor = 'yellow-300'
      break
    default:
      color = 'gray-500'
      borderColor = 'gray-300'
      break
  }
  return (
    <div className={`w-full bg-card rounded-md border border-${borderColor} p-4 space-y-2 shadow-sm`}>
      <div className={`flex gap-2 text-${color} items-center`}>
        {icon}
        <span className='text-base md:text-lg font-medium'>{title}</span>
      </div>
      <div className='text-muted-foreground'>{content}</div>
    </div>
  )
}

export default OrderGeneral
