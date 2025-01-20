interface OrderGeneralProps {
  title: string
  icon: React.ReactElement
  content: React.ReactElement
}

const OrderGeneral = ({ title, icon, content }: OrderGeneralProps) => {
  return (
    <div className='w-full bg-card rounded-md border border-primary/40 p-4 space-y-2'>
      <div className='flex gap-2 text-primary items-center'>
        {icon}
        <span className='text-base md:text-lg font-medium'>{title}</span>
      </div>
      <div className='text-muted-foreground'>{content}</div>
    </div>
  )
}

export default OrderGeneral
